import type { ParsedCommand, ShoppingItem } from '../types';
import { parseCommands as localParseCommands } from './nlp';

export const GEMINI_STORAGE_KEY = 'gemini_api_key';

export function getGeminiApiKey(): string {
  const savedKey = typeof window !== 'undefined' ? localStorage.getItem(GEMINI_STORAGE_KEY) : null;
  if (savedKey && savedKey.trim()) {
    return savedKey.trim();
  }
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim()) {
    return envKey.trim();
  }
  return '';
}

export function setGeminiApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem(GEMINI_STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(GEMINI_STORAGE_KEY);
    }
  }
}

const SYSTEM_PROMPT = `You are the world's most advanced, context-aware AI Voice Shopping Assistant.
You parse human spoken transcripts into an array of actionable, structured grocery shopping list commands.
You have real-time access to the user's current shopping list (cart state).

### CORE CAPABILITIES & INTELLIGENCE:

1. CONTEXTUAL CART UNDERSTANDING:
   - Always analyze the "Current Shopping List (Cart Items)".
   - Target Set vs Increment:
     * "Eat only 1 cake", "Keep just 1 apple", "Change carrots to 4", "Doctor said 1 cake", "Limit milk to 2", "Just 1 cake" -> action: 'set_quantity', quantity: [exact target].
     * "Add 2 more apples", "Increase milk by 1" -> action: 'increase', quantity: 2.
     * "Double the [item]" -> action: 'set_quantity', quantity: (current_quantity * 2).
     * "Halve the [item]" -> action: 'set_quantity', quantity: Math.max(1, Math.round(current_quantity / 2)).
     * "Add [item]" -> action: 'add', quantity: [qty].
   - Categorical & Bulk Operations:
     * "Remove all fruits", "Delete dairy items", "Check off all produce" -> match corresponding items from current cart and generate 'remove' or 'check' actions for each item.
     * "Replace regular milk with oat milk" -> action: 'remove', item: 'regular milk' + action: 'add', item: 'oat milk'.

2. SELF-CORRECTION & MID-SENTENCE INTERRUPTS:
   - Handle human speech hesitation, self-corrections, and mind changes:
     * "Add 5 apples, no wait make it 3" -> action: 'add', item: 'apple', quantity: 3 (NOT 5 then 3).
     * "I want chips, actually scratch that, get pretzels" -> action: 'add', item: 'pretzels' (ignore chips).
     * "Add bread, wait no, sourdough bread" -> action: 'add', item: 'sourdough bread'.

3. QUANTITY & NATURAL PACKAGING NORMALIZATION:
   - Natural numbers: "a couple of" -> 2, "a few" -> 3, "half dozen" -> 6, "a dozen" -> 12, "single" / "an" / "a" -> 1.
   - Fractions: "half kilo" -> 0.5 kg, "quarter pound" -> 0.25 lbs.
   - Clean Packaging Units: Extract container/unit into 'unit' and clean food name into 'item':
     * "2 bottles of olive oil" -> item: "olive oil", quantity: 2, unit: "bottle"
     * "3 bags of spinach" -> item: "spinach", quantity: 3, unit: "bag"
     * "1 loaf of sourdough" -> item: "sourdough bread", quantity: 1, unit: "loaf"
     * "2 heads of lettuce" -> item: "lettuce", quantity: 2, unit: "head"
     * "6 cans of soda" -> item: "soda", quantity: 6, unit: "can"
     * "1 carton of almond milk" -> item: "almond milk", quantity: 1, unit: "carton"

4. CONVERSATIONAL NOISE & STORY-TELLING FILTER:
   - Completely strip all background chatter, filler, storytelling, excuses, laughter, banter:
     * "My doctor told me to eat only 1 cake, and he also told me to have more beetroot about 20" -> set_quantity cake: 1, add beetroot: 20
     * "Hey buddy add 2 apples haha bhai kya kar raha hai" -> add apple: 2
     * "Umm like you know what maybe add some bananas" -> add banana: 1

5. STT HOMOPHONE & PHONETIC ERROR CORRECTION:
   - "too / to / two" -> detect if number 2 ("too apples" -> 2 apples) or preposition ("go to history" -> navigate).
   - "for / four" -> "for bananas" -> 4 bananas.
   - "won / one" -> "won bottle" -> 1 bottle.
   - "flour / flower" -> "baking flower" -> baking flour.

6. UNIVERSAL MULTILINGUAL & CODE-SWITCHING MASTERY:
   - You natively understand and parse transcripts in ANY language or dialect worldwide (e.g. English, Spanish, French, German, Italian, Portuguese, Japanese, Korean, Arabic, Russian, Chinese, Hindi, Hinglish, Bengali, Tamil, Telugu, Marathi, Dutch, Turkish, etc.).
   - Examples:
     * Spanish: "Añade dos manzanas y tres botellas de agua" -> add 2 apples (produce), add 3 bottles water (beverages)
     * French: "Ajoute deux baguettes et un litre de lait" -> add 2 baguettes (bakery), add 1 liter milk (dairy)
     * German: "Zwei Kilo Kartoffeln und eine Packung Butter hinzufügen" -> add 2kg potatoes (produce), add 1 pack butter (dairy)
     * Japanese: "りんごを2個と牛乳を1本追加して" -> add 2 apples (produce), add 1 bottle milk (dairy)
     * Hindi/Hinglish: "Bhai do kilo aaloo aur teen packet bread daal do" -> add 2kg aaloo (produce), add 3 pack bread (bakery)
     * Arabic: "أضف تفاحتين وثلاث زجاجات ماء" -> add 2 apples (produce), add 3 bottles water (beverages)

7. PRECISE 10-CATEGORY TAXONOMY:
   Classify every grocery item into one of:
   - 'produce': fresh fruits, vegetables, fresh herbs, mushrooms, roots, salads, garlic, onions, potatoes, avocados
   - 'dairy': cow/goat/plant milks, cheeses, yogurts, butters, creams, paneer, curd, tofu
   - 'bakery': breads, buns, cakes, cookies, pastries, bagels, muffins, tortillas, croissants
   - 'meat': chicken, poultry, red meat, seafood, fish, eggs, sausages, bacon, deli
   - 'pantry': grains, rice, pasta, flours, sugars, spices, oils, sauces, condiments, canned goods, lentils, dal, beans
   - 'beverages': water, sodas, juices, coffee, tea, kombucha, energy drinks, beer, wine
   - 'snacks': chips, pretzels, crackers, popcorn, nuts, chocolates, candies, energy bars, namkeen
   - 'frozen': frozen veggies/fruits, ice cream, frozen meals, frozen pizzas, ice
   - 'household': laundry detergent, dish soap, trash bags, paper towels, toilet paper, cleaning supplies, batteries
   - 'personal': shampoo, body wash, toothpaste, deodorant, skincare, vitamins, medicine
   - 'other': general non-grocery items

8. SUPPORTED ACTIONS:
   - 'set_quantity': set exact target quantity for existing or new item
   - 'add': add new item or increment
   - 'remove': remove item from list
   - 'check': mark item as done/purchased
   - 'uncheck': unmark item
   - 'increase': increase item quantity by delta
   - 'decrease': decrease item quantity by delta
   - 'clear': clear entire list
   - 'clear_checked': remove all checked items
   - 'search': search or filter catalog by keyword, brand, or price (include 'searchQuery', optional 'maxPrice', e.g., "Find organic apples" -> searchQuery: "organic apples"; "Find toothpaste under $5" -> searchQuery: "toothpaste", maxPrice: 5)
   - 'navigate': switch tab (destination: 'list', 'history', 'suggest', 'settings', 'search')
   - 'total': calculate total cost

### OUTPUT FORMAT (Strict JSON):
You MUST output ONLY valid JSON matching this schema:
{
  "commands": [
    {
      "action": "set_quantity",
      "item": "cake",
      "quantity": 1,
      "unit": "item",
      "category": "bakery"
    },
    {
      "action": "add",
      "item": "beetroot",
      "quantity": 20,
      "unit": "item",
      "category": "produce"
    },
    {
      "action": "search",
      "searchQuery": "toothpaste",
      "maxPrice": 5
    }
  ]
}
If no shopping action is present (e.g. purely unrelated talk), return { "commands": [] }.`;

export async function parseVoiceWithGemini(
  transcript: string,
  options?: { currentItems?: ShoppingItem[]; customApiKey?: string }
): Promise<{ commands: ParsedCommand[]; source: 'gemini' | 'local' }> {
  const customApiKey = options?.customApiKey;
  const currentItems = options?.currentItems || [];
  const clientKey = customApiKey || getGeminiApiKey();

  // 1. First, try the Server Backend (/api/parse-voice)
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (clientKey) {
      headers['x-gemini-key'] = clientKey;
    }
    const serverRes = await fetch('/api/parse-voice', {
      method: 'POST',
      headers,
      body: JSON.stringify({ transcript, currentItems, clientApiKey: clientKey }),
    });

      if (serverRes.ok) {
        const data = await serverRes.json();
        if (Array.isArray(data?.commands) && data.commands.length > 0) {
          const validated: ParsedCommand[] = data.commands.map((c: Partial<ParsedCommand>) => ({
            action: c.action || 'add',
            item: typeof c.item === 'string' ? c.item.trim() : '',
            quantity: typeof c.quantity === 'number' && !isNaN(c.quantity) ? c.quantity : 1,
            unit: typeof c.unit === 'string' ? c.unit.toLowerCase() : 'item',
            category: typeof c.category === 'string' ? c.category.toLowerCase() : undefined,
            searchQuery: c.searchQuery,
            maxPrice: c.maxPrice,
            destination: c.destination,
          }));
          return { commands: validated, source: 'gemini' };
        }
      }
    } catch (err) {
      console.warn('Server API endpoint not reachable, trying client fallback:', err);
    }

  // 2. Direct client-side API call (if customApiKey or client key is provided)
  const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.7-flash';
  if (clientKey) {
    try {
      const cartContext = currentItems.length > 0
        ? `Current Shopping List (Cart Items):\n${currentItems.map(i => `- ${i.name} (Quantity: ${i.quantity}, Unit: ${i.unit || 'item'}, Category: ${i.category || 'produce'}, Checked: ${i.checked ? 'Yes' : 'No'})`).join('\n')}`
        : `Current Shopping List (Cart Items): (empty cart)`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${clientKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: `${SYSTEM_PROMPT}\n\n${cartContext}\n\nUser Spoken Transcript:\n"${transcript}"` }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1,
          }
        }),
      });

      if (response.ok) {
        const data: any = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          if (Array.isArray(parsed?.commands) && parsed.commands.length > 0) {
            const validated: ParsedCommand[] = parsed.commands.map((c: Partial<ParsedCommand>) => ({
              action: c.action || 'add',
              item: typeof c.item === 'string' ? c.item.trim() : '',
              quantity: typeof c.quantity === 'number' && !isNaN(c.quantity) ? c.quantity : 1,
              unit: typeof c.unit === 'string' ? c.unit.toLowerCase() : 'item',
              category: typeof c.category === 'string' ? c.category.toLowerCase() : undefined,
              searchQuery: c.searchQuery,
              maxPrice: c.maxPrice,
              destination: c.destination,
            }));
            return { commands: validated, source: 'gemini' };
          }
        }
      }
    } catch (err) {
      console.error('Direct client Gemini API error:', err);
    }
  }

  // 3. Fallback to Enhanced Local Multi-Item NLP Parser
  return {
    commands: localParseCommands(transcript),
    source: 'local',
  };
}
