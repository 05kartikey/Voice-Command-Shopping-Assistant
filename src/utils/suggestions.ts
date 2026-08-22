import type { ShoppingItem, Suggestion } from '../types';
import { categorize } from './categories';

// Seasonal items by month (0=Jan)
const SEASONAL: Record<number, string[]> = {
  0: ['oranges', 'grapefruit', 'kale', 'sweet potatoes'],
  1: ['lemons', 'broccoli', 'cauliflower'],
  2: ['strawberries', 'asparagus', 'peas'],
  3: ['strawberries', 'spinach', 'radishes'],
  4: ['cherries', 'zucchini', 'tomatoes'],
  5: ['blueberries', 'peaches', 'corn', 'watermelon'],
  6: ['watermelon', 'peaches', 'tomatoes', 'basil'],
  7: ['tomatoes', 'corn', 'eggplant', 'peppers'],
  8: ['apples', 'grapes', 'pumpkin', 'squash'],
  9: ['apples', 'pears', 'sweet potatoes', 'cranberries'],
  10: ['cranberries', 'sweet potatoes', 'brussels sprouts'],
  11: ['oranges', 'pomegranate', 'clementines', 'pears'],
};

// Common pairings
const PAIRINGS: Record<string, string[]> = {
  pasta: ['tomato sauce', 'parmesan cheese', 'olive oil'],
  bread: ['butter', 'jam', 'peanut butter'],
  coffee: ['milk', 'sugar', 'cream'],
  tea: ['honey', 'lemon', 'milk'],
  cereal: ['milk', 'bananas'],
  eggs: ['butter', 'cheese', 'bacon'],
  chicken: ['garlic', 'olive oil', 'lemon'],
  rice: ['soy sauce', 'vegetables', 'chicken'],
  salad: ['olive oil', 'vinegar', 'tomatoes', 'cucumber'],
  pancakes: ['maple syrup', 'butter', 'eggs'],
  pizza: ['mozzarella', 'tomato sauce', 'basil'],
  tacos: ['salsa', 'cheese', 'sour cream', 'avocado'],
};

// Substitutes
const SUBSTITUTES: Record<string, string[]> = {
  milk: ['almond milk', 'oat milk', 'soy milk', 'coconut milk'],
  butter: ['olive oil', 'coconut oil', 'margarine'],
  sugar: ['honey', 'maple syrup', 'stevia'],
  flour: ['almond flour', 'oat flour', 'coconut flour'],
  eggs: ['flax eggs', 'chia eggs', 'applesauce'],
  beef: ['turkey', 'chicken', 'lentils', 'mushrooms'],
  cream: ['coconut cream', 'cashew cream', 'greek yogurt'],
};

export function getSubstitutes(itemName: string): string[] {
  const lower = itemName.toLowerCase();
  for (const [key, subs] of Object.entries(SUBSTITUTES)) {
    if (lower.includes(key)) return subs;
  }
  return [];
}

export function generateSuggestions(items: ShoppingItem[], history: ShoppingItem[]): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const currentNames = new Set(items.map(i => i.name.toLowerCase()));
  const month = new Date().getMonth();

  // History-based: items bought frequently but not in current list
  const freq: Record<string, number> = {};
  history.forEach(item => {
    const key = item.name.toLowerCase();
    freq[key] = (freq[key] || 0) + 1;
  });

  Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([name]) => {
      if (!currentNames.has(name) && freq[name] >= 2) {
        suggestions.push({
          name,
          reason: `You've bought this ${freq[name]} times before`,
          category: categorize(name),
        });
      }
    });

  // Pairing-based suggestions
  items.forEach(item => {
    const lower = item.name.toLowerCase();
    for (const [key, pairs] of Object.entries(PAIRINGS)) {
      if (lower.includes(key)) {
        pairs.forEach(pair => {
          if (!currentNames.has(pair) && !suggestions.find(s => s.name === pair)) {
            suggestions.push({ name: pair, reason: `Goes well with ${item.name}`, category: categorize(pair) });
          }
        });
      }
    }
  });

  // Seasonal suggestions
  const seasonal = SEASONAL[month] || [];
  seasonal.forEach(item => {
    if (!currentNames.has(item) && !suggestions.find(s => s.name === item)) {
      suggestions.push({ name: item, reason: 'In season right now', category: categorize(item) });
    }
  });

  return suggestions.slice(0, 6);
}
