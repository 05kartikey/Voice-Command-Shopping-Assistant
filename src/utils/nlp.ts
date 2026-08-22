interface ParsedCommand {
  action: 'add' | 'remove' | 'check' | 'clear' | 'search' | 'unknown' | 'uncheck' | 'increase' | 'decrease' | 'navigate' | 'clear_checked' | 'total';
  item: string;
  quantity: number;
  unit: string;
  searchQuery?: string;
  maxPrice?: number;
  destination?: string;
}

const UNITS_LIST = [
  // English
  'kilograms','kilogram','kg','grams','gram','g','pounds','pound','lb','lbs',
  'ounces','ounce','oz','litres','liters','litre','liter','l','milliliters',
  'millilitres','ml','bottles','bottle','cans','can','packs','pack','packets',
  'packet','bags','bag','boxes','box','dozens','dozen','pieces','piece',
  'slices','slice','cups','cup','bunches','bunch','loaves','loaf','bars','bar',
  'jars','jar','tubes','tube','rolls','roll','sheets','sheet','cartons','carton',
  // Spanish
  'kilos','kilo','gramos','gramo','litros','litro','botellas','botella',
  'latas','lata','paquetes','paquete','bolsas','bolsa','cajas','caja',
  'docenas','docena','piezas','pieza','rebanadas','rebanada','tazas','taza',
  // French
  'kilos','kilo','grammes','gramme','litres','litre','bouteilles','bouteille',
  'boîtes','boîte','paquets','paquet','sacs','sac','douzaines','douzaine',
  'morceaux','morceau','tranches','tranche','verres','verre',
  // German
  'kilo','kilogramm','gramm','liter','flaschen','flasche','dosen','dose',
  'packungen','packung','tüten','tüte','schachteln','schachtel','dutzend',
  'stücke','stück','scheiben','scheibe','tassen','tasse',
  // Chinese (Mandarin classifiers/units)
  '公斤','克','升','毫升','瓶','罐','包','袋','盒','打','件','片','杯','把','条',
  // Hindi (Transliterated & Script)
  'kilo','kilogram','gram','liter','botle','botel','botal','packet','packet',
  'dibba','dabba','kilo','किलो','ग्राम','लीटर','बोतल','पैकेट','डिब्बा'
];

const WORD_NUMS: Record<string, number> = {
  // English
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, dozen: 12, half: 0.5, 'a': 1, 'an': 1,
  // Spanish
  uno: 1, una: 1, un: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10,
  doce: 12, docena: 12, medio: 0.5, media: 0.5,
  // French (duplicates removed)
  une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, sept: 7, huit: 8, neuf: 9, dix: 10,
  douze: 12, douzaine: 12, demi: 0.5, demie: 0.5,
  // German
  ein: 1, eine: 1, eins: 1, zwei: 2, zwo: 2, drei: 3, vier: 4, fünf: 5, sechs: 6, sieben: 7, acht: 8, neun: 9, zehn: 10,
  zwölf: 12, dutzend: 12, halb: 0.5, halbes: 0.5,
  // Chinese
  '一': 1, '两': 2, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
  '半': 0.5,
  // Hindi
  'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पांच': 5, 'छह': 6, 'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10,
  'आधा': 0.5, 'ek': 1, 'do': 2, 'teen': 3, 'char': 4, 'paanch': 5, 'chah': 6, 'saat': 7, 'aath': 8, 'nau': 9, 'das': 10
};

// Global stopwords across languages
const STOPWORDS = new Set([
  // English
  'the', 'some', 'any', 'my', 'our', 'me', 'us', 'please', 'just', 'also', 'of',
  // Spanish
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'mi', 'mis', 'por', 'favor', 'de',
  // French
  'le', 'la', 'les', 'un', 'une', 'des', 'mon', 'ma', 'mes', 's\'il', 'vous', 'plaît', 'de', 'du',
  // German
  'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einer', 'einen', 'einem', 'eines', 'bitte', 'von',
  // Chinese
  '请', '的', '个', '一些'
]);

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

  // Build regex patterns
  const unitsPattern = UNITS_LIST.join('|');
  const wordNumsPattern = Object.keys(WORD_NUMS).join('|');

  // Match: Number + Optional Unit + Optional Stopwords ("of", "de", "von") + Item
  // E.g., "2 bottles of water", "2 botellas de agua", "3kg rice"
  const numericMatch = t.match(
    new RegExp(`^(\\d+(?:[.,]\\d+)?)\\s*(${unitsPattern})?\\s*(?:of\\s+|de\\s+|von\\s+)?(.+)$`, 'i')
  );
  if (numericMatch) {
    return {
      quantity: parseFloat(numericMatch[1].replace(',', '.')),
      unit: numericMatch[2] ? numericMatch[2].toLowerCase() : 'item',
      item: cleanItem(numericMatch[3]),
    };
  }

  // Match: Word Number + Optional Unit + Optional Stopwords + Item
  // E.g., "two dozen eggs", "dos botellas de leche", "两 瓶 牛奶"
  const wordMatch = t.match(
    new RegExp(`^(${wordNumsPattern})\\s*(${unitsPattern})?\\s*(?:of\\s+|de\\s+|von\\s+)?(.+)$`, 'i')
  );
  if (wordMatch) {
    return {
      quantity: WORD_NUMS[wordMatch[1].toLowerCase()],
      unit: wordMatch[2] ? wordMatch[2].toLowerCase() : 'item',
      item: cleanItem(wordMatch[3]),
    };
  }

  return { quantity: 1, unit: 'item', item: cleanItem(t) };
}

// Multilingual Intent Keyword Groups
const ADD_TRIGGERS = [
  // English
  'add', 'put', 'include', 'buy', 'get', 'grab', 'pick up', 'pickup',
  'need', 'want', 'require', 'order', 'purchase', 'fetch', 'bring',
  'remind me to buy', "don't forget", 'please get', 'please add',
  'we need', 'i need', 'i want', 'i would like', 'id like',
  'can you add', 'could you add', 'also get', 'also add', 'also need',
  'put on list', 'add to list', 'add to cart',
  // Spanish
  'añadir', 'agregar', 'pon', 'poner', 'comprar', 'necesito', 'quiero',
  'por favor añade', 'por favor agrega', 'añade', 'agrega',
  // French
  'ajouter', 'ajoute', 'mettre', 'mets', 'acheter', 'achetez', "j'ai besoin",
  'je veux', 'il me faut', 's\'il te plaît ajoute', 'ajoutez',
  // German
  'hinzufügen', 'füge', 'kaufe', 'kaufen', 'brauche', 'ich brauche',
  'ich möchte', 'bitte füge', 'packe', 'auf die liste',
  // Chinese
  '添加', '加', '买', '我要买', '需要', '我需要', '把', '加入', '请加',
  // Hindi
  'जोड़ें', 'जोड़ो', 'खरीदें', 'लाना', 'चाहिए', 'मुझे चाहिए', 'add karo',
  'jodo', 'le aana', 'khareedna'
];

const REMOVE_TRIGGERS = [
  // English
  'remove', 'delete', 'take off', 'cross off', 'scratch off', 'drop',
  'cancel', 'eliminate', 'erase', 'clear item', 'take out',
  "don't need", 'no longer need', 'remove from list', 'take off list',
  'delete from list',
  // Spanish
  'eliminar', 'elimina', 'quitar', 'quita', 'borrar', 'borra',
  'no necesito', 'ya no necesito', 'saca', 'sacar',
  // French
  'supprimer', 'supprime', 'enlever', 'enlève', 'effacer', 'efface',
  'retirer', 'retire', 'je n\'ai plus besoin',
  // German
  'entfernen', 'entferne', 'löschen', 'lösche', 'streichen', 'streiche',
  'brauche ich nicht', 'wegnehmen',
  // Chinese
  '删除', '去掉', '取消', '不要', '删掉',
  // Hindi
  'हटाएं', 'हटाओ', 'निकालें', 'निकालो', 'मिटाओ', 'remove karo', 'hatao', 'nikalo'
];

const CHECK_TRIGGERS = [
  // English
  'check off', 'check', 'mark', 'mark as done', 'mark as bought',
  'done with', 'got', 'bought', 'purchased', 'already have',
  'tick off', 'tick', 'complete',
  // Spanish
  'marcar', 'marca', 'comprado', 'ya lo tengo', 'listo', 'completado',
  // French
  'cocher', 'coche', 'marquer', 'acheté', 'j\'ai déjà', 'terminé',
  // German
  'abhaken', 'hake', 'gekauft', 'erledigt', 'habe ich schon',
  // Chinese
  '划掉', '标记', '已买', '买好了', '勾选',
  // Hindi
  'टिक करें', 'चेक करें', 'खरीद लिया', 'हो गया', 'tick karo', 'check karo', 'le liya'
];

const SEARCH_TRIGGERS = [
  // English
  'find', 'search', 'look for', 'show me', 'where is', 'do you have',
  'search for', 'filter', 'filter by', 'show', 'display',
  // Spanish
  'buscar', 'busca', 'encuentra', 'dónde está', 'mostrar', 'muestra',
  // French
  'chercher', 'cherche', 'trouver', 'trouve', 'montrer', 'montre',
  // German
  'suchen', 'suche', 'finden', 'finde', 'zeigen', 'zeige', 'wo ist',
  // Chinese
  '找', '搜索', '查找', '显示', '哪里有',
  // Hindi
  'खोजें', 'ढूंढें', 'दिखाओ', 'kahan hai', 'search karo', 'khojo', 'dhundho'
];

const CLEAR_TRIGGERS = [
  // English
  'clear the list', 'clear list', 'clear all', 'clear everything',
  'empty the list', 'empty list', 'empty everything', 'reset list',
  'reset the list', 'wipe the list', 'wipe list', 'start over',
  'delete everything', 'delete all', 'remove everything', 'remove all',
  // Spanish
  'limpiar lista', 'limpiar la lista', 'vaciar lista', 'vaciar la lista',
  'borrar todo', 'eliminar todo',
  // French
  'vider la liste', 'effacer la liste', 'supprimer tout', 'tout effacer',
  // German
  'liste leeren', 'alles löschen', 'alles entfernen', 'liste zurücksetzen',
  // Chinese
  '清空列表', '全部删除', '清空所有', '重置列表',
  // Hindi
  'सूची साफ़ करें', 'सब कुछ हटाएं', 'पूरी लिस्ट डिलीट करें', 'list clear karo', 'sab hatao'
];

const UNCHECK_TRIGGERS = [
  'uncheck', 'unmark', 'undo', 'mark as not done', 'mark as unbought',
  'desmarcar', 'desmarca', 'deshacer',
  'décocher', 'décoche', 'annuler',
  'rückgängig', 'nicht abgehakt',
  '取消划掉', '取消标记',
  'अनचेक', 'uncheck karo'
];

const CLEAR_CHECKED_TRIGGERS = [
  'clear checked', 'clear checked items', 'remove finished items', 'remove purchased items', 'delete done items',
  'borrar completados', 'eliminar comprados',
  'supprimer les éléments cochés', 'effacer les terminés',
  'erledigte löschen', 'gekaute entfernen',
  '清除已买', '删除已完成',
  'खरीदे हुए हटाएं', 'checked hatao'
];

const INCREASE_TRIGGERS = [
  'add another', 'add more', 'one more', 'increase', 'add an extra',
  'añadir otro', 'más', 'aumentar',
  'ajouter un autre', 'plus de', 'augmenter',
  'noch ein', 'mehr', 'erhöhen',
  '再加', '多加', '增加',
  'एक और', 'बढ़ाएं', 'aur add karo'
];

const DECREASE_TRIGGERS = [
  'decrease', 'reduce', 'one less', 'remove one',
  'reducir', 'disminuir', 'uno menos',
  'diminuer', 'réduire', 'un de moins',
  'verringern', 'weniger',
  '减少', '减去',
  'कम करें', 'ghatao', 'ek kam karo'
];

const NAVIGATE_TRIGGERS = [
  'go to', 'show', 'open', 'take me to',
  'ir a', 'mostrar', 'abrir',
  'aller à', 'montrer', 'ouvrir',
  'gehe zu', 'zeige', 'öffne',
  '去', '打开', '显示',
  'जाओ', 'खोलें', 'दिखाओ'
];

const TOTAL_TRIGGERS = [
  'what is the total', 'how much', 'total cost', 'total price', 'budget',
  'cuál es el total', 'cuánto es', 'precio total',
  'quel est le total', 'combien', 'prix total',
  'was ist die summe', 'wie viel', 'gesamtpreis',
  '总共', '多少钱', '总价',
  'कुल कितना', 'total kitna', 'kitne paise'
];

function matchesTrigger(text: string, triggers: string[]): string | null {
  const sorted = [...triggers].sort((a, b) => b.length - a.length);
  for (const trigger of sorted) {
    const escaped = trigger.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Allow prefixes like please, can you, hey, ok in EN/ES/FR/DE
    const prefixes = '(?:(?:hey|ok|okay|please|can you|could you|por favor|s\\\'il te plaît|s\\\'il vous plaît|bitte)\\s+)?';
    const re = new RegExp(`^${prefixes}${escaped}\\s+(.+)$`, 'i');
    const m = text.match(re);
    if (m) return m[1].trim();

    if (text === trigger.toLowerCase()) return '';
  }
  return null;
}

function stripListSuffix(text: string): string {
  // Enhanced to strip multi-language suffixes ("from the list", "de la lista", "de la liste", "von der liste")
  return text
    .replace(/\s+(?:from|off|out of|de|von|se)\s+(?:my|the|our|la|ma|der|meine)?\s*(?:list|cart|basket|lista|liste|liste)$/i, '')
    .trim();
}

function extractMaxPrice(text: string): { textWithoutPrice: string, maxPrice?: number } {
  const priceRegex = /\s*(?:under|less than|below|por debajo de|menos de|moins de|unter)\s*(?:\$|€|£)?\s*(\d+(?:[.,]\d+)?)\s*(?:dollars|bucks|euros|pounds|dólares|pesos)?/i;
  const match = text.match(priceRegex);
  if (match) {
    const maxPrice = parseFloat(match[1].replace(',', '.'));
    const textWithoutPrice = text.replace(match[0], '').trim();
    return { textWithoutPrice, maxPrice };
  }
  return { textWithoutPrice: text };
}

export function parseCommand(transcript: string): ParsedCommand {
  const text = transcript.trim().toLowerCase().replace(/[.,!?]+$/, '');

  // 1. Clear All
  if (CLEAR_TRIGGERS.some(t => text === t || text.startsWith(t))) {
    return { action: 'clear', item: '', quantity: 1, unit: 'item' };
  }

  // 1b. Clear Checked
  if (CLEAR_CHECKED_TRIGGERS.some(t => text === t || text.startsWith(t))) {
    return { action: 'clear_checked', item: '', quantity: 1, unit: 'item' };
  }

  // 1c. Total
  if (TOTAL_TRIGGERS.some(t => text === t || text.startsWith(t))) {
    return { action: 'total', item: '', quantity: 1, unit: 'item' };
  }

  // 2. Check off
  const checkRaw = matchesTrigger(text, CHECK_TRIGGERS);
  if (checkRaw !== null) {
    const cleaned = stripListSuffix(checkRaw);
    const { item } = extractQtyUnit(cleaned);
    return { action: 'check', item, quantity: 1, unit: 'item' };
  }

  // 2b. Uncheck
  const uncheckRaw = matchesTrigger(text, UNCHECK_TRIGGERS);
  if (uncheckRaw !== null) {
    const cleaned = stripListSuffix(uncheckRaw);
    const { item } = extractQtyUnit(cleaned);
    return { action: 'uncheck', item, quantity: 1, unit: 'item' };
  }

  // 3. Remove
  const removeRaw = matchesTrigger(text, REMOVE_TRIGGERS);
  if (removeRaw !== null) {
    const cleaned = stripListSuffix(removeRaw);
    const { item } = extractQtyUnit(cleaned);
    return { action: 'remove', item, quantity: 1, unit: 'item' };
  }

  // 3b. Increase
  const increaseRaw = matchesTrigger(text, INCREASE_TRIGGERS);
  if (increaseRaw !== null) {
    const cleaned = stripListSuffix(increaseRaw);
    const { item, quantity } = extractQtyUnit(cleaned);
    return { action: 'increase', item, quantity, unit: 'item' };
  }

  // 3c. Decrease
  const decreaseRaw = matchesTrigger(text, DECREASE_TRIGGERS);
  if (decreaseRaw !== null) {
    const cleaned = stripListSuffix(decreaseRaw);
    const { item, quantity } = extractQtyUnit(cleaned);
    return { action: 'decrease', item, quantity, unit: 'item' };
  }

  // 3d. Navigate
  const navigateRaw = matchesTrigger(text, NAVIGATE_TRIGGERS);
  if (navigateRaw !== null) {
    return { action: 'navigate', item: '', quantity: 1, unit: 'item', destination: navigateRaw.trim() };
  }


  // 4. Search
  const searchRaw = matchesTrigger(text, SEARCH_TRIGGERS);
  if (searchRaw !== null) {
    const rawQuery = stripListSuffix(searchRaw);
    const { textWithoutPrice, maxPrice } = extractMaxPrice(rawQuery);
    return { action: 'search', item: '', quantity: 1, unit: 'item', searchQuery: textWithoutPrice, maxPrice };
  }

  // 5. Add — explicit trigger
  const addRaw = matchesTrigger(text, ADD_TRIGGERS);
  if (addRaw !== null) {
    const cleaned = stripListSuffix(addRaw);
    const { quantity, unit, item } = extractQtyUnit(cleaned);
    if (item) return { action: 'add', item, quantity, unit };
  }

  // 6. "X to my list" / "X to the cart" / "X a la lista" pattern
  const toListMatch = text.match(/^(.+?)\s+(?:to|on|onto|a|dans|auf)\s+(?:my|the|our|la|ma|meine|der)?\s*(?:list|cart|basket|lista|liste)$/i);
  if (toListMatch) {
    const { quantity, unit, item } = extractQtyUnit(toListMatch[1].trim());
    if (item) return { action: 'add', item, quantity, unit };
  }

  // 7. Fallback — treat whole thing as an add
  const { quantity, unit, item } = extractQtyUnit(text);
  if (item && item.length >= 1) {
    return { action: 'add', item, quantity, unit };
  }

  return { action: 'unknown', item: '', quantity: 1, unit: 'item' };
}

export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
