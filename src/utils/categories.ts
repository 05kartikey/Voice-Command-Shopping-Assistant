export const CATEGORIES: Record<string, string[]> = {
  dairy: ['milk', 'cheese', 'butter', 'yogurt', 'cream', 'curd', 'paneer', 'ghee', 'almond milk', 'oat milk', 'soy milk'],
  produce: ['apple', 'apples', 'banana', 'bananas', 'orange', 'oranges', 'tomato', 'tomatoes', 'potato', 'potatoes', 'onion', 'onions', 'garlic', 'ginger', 'lemon', 'lemons', 'lime', 'spinach', 'lettuce', 'carrot', 'carrots', 'broccoli', 'cucumber', 'pepper', 'peppers', 'mango', 'mangoes', 'grapes', 'strawberry', 'strawberries', 'watermelon', 'pineapple'],
  bakery: ['bread', 'bun', 'buns', 'bagel', 'bagels', 'muffin', 'muffins', 'croissant', 'cake', 'cookies', 'cookie', 'pita', 'tortilla', 'tortillas'],
  meat: ['chicken', 'beef', 'pork', 'lamb', 'turkey', 'fish', 'salmon', 'tuna', 'shrimp', 'bacon', 'sausage', 'ham', 'steak'],
  pantry: ['rice', 'pasta', 'noodles', 'flour', 'sugar', 'salt', 'pepper', 'oil', 'olive oil', 'vinegar', 'sauce', 'ketchup', 'mustard', 'mayonnaise', 'soy sauce', 'honey', 'jam', 'peanut butter', 'cereal', 'oats', 'beans', 'lentils', 'chickpeas', 'canned tomatoes', 'soup'],
  beverages: ['water', 'juice', 'coffee', 'tea', 'soda', 'beer', 'wine', 'energy drink', 'smoothie', 'lemonade', 'sparkling water'],
  snacks: ['chips', 'crackers', 'popcorn', 'nuts', 'almonds', 'cashews', 'chocolate', 'candy', 'granola bar', 'protein bar', 'pretzels'],
  frozen: ['ice cream', 'frozen pizza', 'frozen vegetables', 'frozen fruit', 'ice', 'frozen meals'],
  household: ['soap', 'shampoo', 'conditioner', 'toothpaste', 'toothbrush', 'toilet paper', 'paper towels', 'detergent', 'dish soap', 'sponge', 'trash bags', 'aluminum foil', 'plastic wrap', 'batteries'],
  personal: ['deodorant', 'razor', 'lotion', 'sunscreen', 'vitamins', 'medicine', 'bandages'],
};

export const CATEGORY_ICONS: Record<string, string> = {
  dairy: '🥛', produce: '🥦', bakery: '🍞', meat: '🥩', pantry: '🥫',
  beverages: '🥤', snacks: '🍿', frozen: '🧊', household: '🧹', personal: '💊', other: '🛒',
};

export function categorize(itemName: string): string {
  const lower = itemName.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some(k => lower.includes(k) || k.includes(lower))) return cat;
  }
  return 'other';
}
