import type { ShoppingItem, Suggestion } from '../types';
import { categorize } from './categories';

// Basic plural normalization for suggestions
function normalize(name: string): string {
  let lower = name.toLowerCase().trim();
  // Simple English stemming (apples -> apple, potatoes -> potato, berries -> berry)
  if (lower.endsWith('ies') && lower.length > 4) {
    return lower.slice(0, -3) + 'y';
  } else if (lower.endsWith('oes') && lower.length > 4) {
    return lower.slice(0, -2);
  } else if (lower.endsWith('s') && !lower.endsWith('ss') && lower.length > 3) {
    return lower.slice(0, -1);
  }
  return lower;
}

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
  const norm = normalize(itemName);
  for (const [key, subs] of Object.entries(SUBSTITUTES)) {
    if (norm.includes(normalize(key))) return subs;
  }
  return [];
}

export function generateSuggestions(items: ShoppingItem[], history: ShoppingItem[]): Suggestion[] {
  const suggestions: Suggestion[] = [];
  
  // Track normalized names to avoid duplicate suggestions of plurals
  const currentNorms = new Set(items.map(i => normalize(i.name)));
  const month = new Date().getMonth();

  // History-based: items bought frequently but not in current list
  const freq: Record<string, { name: string, count: number }> = {};
  history.forEach(item => {
    const norm = normalize(item.name);
    if (!freq[norm]) {
      freq[norm] = { name: item.name, count: 0 };
    }
    freq[norm].count += 1;
  });

  Object.values(freq)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .forEach(({ name, count }) => {
      const norm = normalize(name);
      if (!currentNorms.has(norm) && count >= 2) {
        suggestions.push({
          name,
          reason: `You've bought this ${count} times before`,
          category: categorize(name),
        });
      }
    });

  // Pairing-based suggestions
  items.forEach(item => {
    const normItem = normalize(item.name);
    for (const [key, pairs] of Object.entries(PAIRINGS)) {
      if (normItem.includes(normalize(key))) {
        pairs.forEach(pair => {
          const normPair = normalize(pair);
          if (!currentNorms.has(normPair) && !suggestions.find(s => normalize(s.name) === normPair)) {
            suggestions.push({ name: pair, reason: `Goes well with ${item.name}`, category: categorize(pair) });
          }
        });
      }
    }
  });

  // Seasonal suggestions
  const seasonal = SEASONAL[month] || [];
  seasonal.forEach(item => {
    const normItem = normalize(item);
    if (!currentNorms.has(normItem) && !suggestions.find(s => normalize(s.name) === normItem)) {
      suggestions.push({ name: item, reason: 'In season right now', category: categorize(item) });
    }
  });

  return suggestions.slice(0, 6);
}
