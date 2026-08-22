interface ParsedCommand {
  action: 'add' | 'remove' | 'check' | 'clear' | 'search' | 'unknown';
  item: string;
  quantity: number;
  unit: string;
  searchQuery?: string;
}

const UNITS_LIST = [
  'kilograms','kilogram','kg','grams','gram','g','pounds','pound','lb','lbs',
  'ounces','ounce','oz','litres','liters','litre','liter','l','milliliters',
  'millilitres','ml','bottles','bottle','cans','can','packs','pack','packets',
  'packet','bags','bag','boxes','box','dozens','dozen','pieces','piece',
  'slices','slice','cups','cup','bunches','bunch','loaves','loaf','bars','bar',
  'jars','jar','tubes','tube','rolls','roll','sheets','sheet',
];

const WORD_NUMS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, dozen: 12, half: 0.5,
};

// Stopwords to strip from item names
const STOPWORDS = new Set(['the', 'some', 'any', 'my', 'our', 'me', 'us', 'please', 'just', 'also']);

function cleanItem(raw: string): string {
  return raw
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(w => !STOPWORDS.has(w.toLowerCase()))
    .join(' ')
    .trim();
}

function extractQtyUnit(text: string): { quantity: number; unit: string; item: string } {
  const t = text.trim();

  // Pattern: "2 bottles of water", "3kg rice", "two dozen eggs", "half a litre of milk"
  const unitsPattern = UNITS_LIST.join('|');
  const wordNumsPattern = Object.keys(WORD_NUMS).join('|');

  // Numeric + optional unit + optional "of" + item
  const numericMatch = t.match(
    new RegExp(`^(\\d+(?:[.,]\\d+)?)\\s*(${unitsPattern})?\\s*(?:of\\s+)?(.+)$`, 'i')
  );
  if (numericMatch) {
    return {
      quantity: parseFloat(numericMatch[1].replace(',', '.')),
      unit: numericMatch[2] ? numericMatch[2].toLowerCase() : 'item',
      item: cleanItem(numericMatch[3]),
    };
  }

  // Word number + optional unit + optional "of" + item  (must be at START, standalone word)
  const wordMatch = t.match(
    new RegExp(`^(${wordNumsPattern})\\s+(${unitsPattern})?\\s*(?:of\\s+)?(.+)$`, 'i')
  );
  if (wordMatch) {
    return {
      quantity: WORD_NUMS[wordMatch[1].toLowerCase()],
      unit: wordMatch[2] ? wordMatch[2].toLowerCase() : 'item',
      item: cleanItem(wordMatch[3]),
    };
  }

  // "a/an" + unit + item  e.g. "a bottle of water"
  const aMatch = t.match(new RegExp(`^(?:a|an)\\s+(${unitsPattern})\\s+(?:of\\s+)?(.+)$`, 'i'));
  if (aMatch) {
    return { quantity: 1, unit: aMatch[1].toLowerCase(), item: cleanItem(aMatch[2]) };
  }

  return { quantity: 1, unit: 'item', item: cleanItem(t) };
}

// Intent keyword groups
const ADD_TRIGGERS = [
  'add', 'put', 'include', 'buy', 'get', 'grab', 'pick up', 'pickup',
  'need', 'want', 'require', 'order', 'purchase', 'fetch', 'bring',
  'remind me to buy', "don't forget", 'please get', 'please add',
  'we need', 'i need', 'i want', 'i would like', 'id like',
  'can you add', 'could you add', 'also get', 'also add', 'also need',
  'put on list', 'add to list', 'add to cart',
];

const REMOVE_TRIGGERS = [
  'remove', 'delete', 'take off', 'cross off', 'scratch off', 'drop',
  'cancel', 'eliminate', 'erase', 'clear item', 'take out',
  "don't need", 'no longer need', 'remove from list', 'take off list',
  'delete from list',
];

const CHECK_TRIGGERS = [
  'check off', 'check', 'mark', 'mark as done', 'mark as bought',
  'done with', 'got', 'bought', 'purchased', 'already have',
  'tick off', 'tick', 'complete',
];

const SEARCH_TRIGGERS = [
  'find', 'search', 'look for', 'show me', 'where is', 'do you have',
  'search for', 'filter', 'filter by', 'show', 'display',
];

const CLEAR_TRIGGERS = [
  'clear the list', 'clear list', 'clear all', 'clear everything',
  'empty the list', 'empty list', 'empty everything', 'reset list',
  'reset the list', 'wipe the list', 'wipe list', 'start over',
  'delete everything', 'delete all', 'remove everything', 'remove all',
];

function matchesTrigger(text: string, triggers: string[]): string | null {
  // Sort by length desc so longer phrases match first
  const sorted = [...triggers].sort((a, b) => b.length - a.length);
  for (const trigger of sorted) {
    const escaped = trigger.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`^(?:(?:hey|ok|okay|please|can you|could you)\\s+)?${escaped}\\s+(.+)$`, 'i');
    const m = text.match(re);
    if (m) return m[1].trim();

    // Also match "trigger" at start without capture (for clear-style commands)
    if (text === trigger.toLowerCase()) return '';
  }
  return null;
}

// Strip trailing noise like "from my list", "from the list", "off my list"
function stripListSuffix(text: string): string {
  return text
    .replace(/\s+(?:from|off|out of)\s+(?:my|the|our)?\s*(?:list|cart|basket|shopping list)$/i, '')
    .trim();
}

export function parseCommand(transcript: string): ParsedCommand {
  const text = transcript.trim().toLowerCase().replace(/[.,!?]+$/, '');

  // 1. Clear
  if (CLEAR_TRIGGERS.some(t => text === t || text.startsWith(t))) {
    return { action: 'clear', item: '', quantity: 1, unit: 'item' };
  }

  // 2. Check off
  const checkRaw = matchesTrigger(text, CHECK_TRIGGERS);
  if (checkRaw !== null) {
    const cleaned = stripListSuffix(checkRaw);
    const { item } = extractQtyUnit(cleaned);
    return { action: 'check', item, quantity: 1, unit: 'item' };
  }

  // 3. Remove
  const removeRaw = matchesTrigger(text, REMOVE_TRIGGERS);
  if (removeRaw !== null) {
    const cleaned = stripListSuffix(removeRaw);
    const { item } = extractQtyUnit(cleaned);
    return { action: 'remove', item, quantity: 1, unit: 'item' };
  }

  // 4. Search
  const searchRaw = matchesTrigger(text, SEARCH_TRIGGERS);
  if (searchRaw !== null) {
    return { action: 'search', item: '', quantity: 1, unit: 'item', searchQuery: stripListSuffix(searchRaw) };
  }

  // 5. Add — explicit trigger
  const addRaw = matchesTrigger(text, ADD_TRIGGERS);
  if (addRaw !== null) {
    const cleaned = stripListSuffix(addRaw);
    const { quantity, unit, item } = extractQtyUnit(cleaned);
    if (item) return { action: 'add', item, quantity, unit };
  }

  // 6. "X to my list" / "X to the cart" pattern
  const toListMatch = text.match(/^(.+?)\s+(?:to|on|onto)\s+(?:my|the|our)?\s*(?:list|cart|basket|shopping list)$/i);
  if (toListMatch) {
    const { quantity, unit, item } = extractQtyUnit(toListMatch[1].trim());
    if (item) return { action: 'add', item, quantity, unit };
  }

  // 7. Fallback — treat whole thing as an add (handles bare "milk", "2 eggs", etc.)
  const { quantity, unit, item } = extractQtyUnit(text);
  if (item && item.length >= 2) {
    return { action: 'add', item, quantity, unit };
  }

  return { action: 'unknown', item: '', quantity: 1, unit: 'item' };
}

export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
