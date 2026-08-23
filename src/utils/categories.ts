export const CATEGORIES: Record<string, string[]> = {
  dairy: ['milk', 'cheese', 'butter', 'yogurt', 'curd', 'cream', 'paneer', 'ghee', 'almond milk', 'oat milk', 'soy milk', 'mozzarella', 'cheddar', 'parmesan', 'cottage cheese', 'creamer'],
  produce: [
    'apple', 'apples', 'banana', 'bananas', 'orange', 'oranges', 'tomato', 'tomatoes', 'potato', 'potatoes',
    'onion', 'onions', 'garlic', 'ginger', 'lemon', 'lemons', 'lime', 'limes', 'spinach', 'lettuce',
    'carrot', 'carrots', 'broccoli', 'cucumber', 'cucumbers', 'pepper', 'peppers', 'bell pepper', 'capsicum',
    'mango', 'mangoes', 'grapes', 'strawberry', 'strawberries', 'blueberry', 'blueberries', 'raspberry',
    'watermelon', 'pineapple', 'beetroot', 'beetroots', 'beet', 'beets', 'avocado', 'avocados',
    'cauliflower', 'cabbage', 'kale', 'celery', 'zucchini', 'eggplant', 'brinjal', 'aubergine',
    'mushroom', 'mushrooms', 'radish', 'peas', 'corn', 'coriander', 'cilantro', 'mint', 'pudina',
    'aaloo', 'pyaaz', 'bhindi', 'okra', 'palak', 'gobhi', 'matar', 'gajar', 'fruit', 'vegetable', 'greens'
  ],
  bakery: ['bread', 'bun', 'buns', 'bagel', 'bagels', 'muffin', 'muffins', 'croissant', 'cake', 'cakes', 'pastry', 'pastries', 'cookies', 'cookie', 'pita', 'tortilla', 'tortillas', 'donut', 'donuts', 'brownie', 'toast', 'biscuit', 'biscuits'],
  meat: ['chicken', 'beef', 'pork', 'lamb', 'turkey', 'fish', 'salmon', 'tuna', 'shrimp', 'prawns', 'bacon', 'sausage', 'sausages', 'ham', 'steak', 'meat', 'egg', 'eggs', 'mutton'],
  pantry: ['rice', 'pasta', 'noodles', 'flour', 'sugar', 'salt', 'pepper', 'oil', 'olive oil', 'vinegar', 'sauce', 'ketchup', 'mustard', 'mayonnaise', 'soy sauce', 'honey', 'jam', 'peanut butter', 'cereal', 'oats', 'beans', 'lentils', 'dal', 'chickpeas', 'canned tomatoes', 'soup', 'spice', 'spices', 'masala', 'atta'],
  beverages: ['water', 'juice', 'coffee', 'tea', 'chai', 'soda', 'coke', 'pepsi', 'beer', 'wine', 'energy drink', 'smoothie', 'lemonade', 'sparkling water', 'drink', 'beverage', 'sprite'],
  snacks: ['chips', 'crackers', 'popcorn', 'nuts', 'almonds', 'cashews', 'peanuts', 'walnuts', 'chocolate', 'candy', 'granola bar', 'protein bar', 'pretzels', 'nachos', 'snack', 'namkeen', 'biscotti'],
  frozen: ['ice cream', 'frozen pizza', 'frozen vegetables', 'frozen fruit', 'ice', 'frozen meals', 'popsicle', 'frozen peas'],
  household: ['soap', 'shampoo', 'conditioner', 'toothpaste', 'toothbrush', 'toilet paper', 'paper towels', 'detergent', 'dish soap', 'sponge', 'trash bags', 'aluminum foil', 'plastic wrap', 'batteries', 'cleaner', 'tissues'],
  personal: ['deodorant', 'razor', 'lotion', 'sunscreen', 'vitamins', 'medicine', 'bandages', 'moisturizer', 'cream', 'face wash'],
};

export const VALID_CATEGORIES = [
  'produce', 'dairy', 'bakery', 'meat', 'pantry',
  'beverages', 'snacks', 'frozen', 'household', 'personal', 'other'
] as const;

export const CATEGORY_ICONS: Record<string, string> = {
  dairy: '🥛', produce: '🥦', bakery: '🍞', meat: '🥩', pantry: '🥫',
  beverages: '🥤', snacks: '🍿', frozen: '🧊', household: '🧹', personal: '💊', other: '🛒',
};

export const ITEM_EMOJIS: Record<string, string> = {
  // Produce / Fruits & Veggies
  tomato: '🍅', tomatoes: '🍅',
  corn: '🌽', sweetcorn: '🌽',
  eggplant: '🍆', brinjal: '🍆', aubergine: '🍆',
  pepper: '🫑', peppers: '🫑', 'bell pepper': '🫑', capsicum: '🫑',
  apple: '🍎', apples: '🍎',
  banana: '🍌', bananas: '🍌',
  orange: '🍊', oranges: '🍊',
  lemon: '🍋', lemons: '🍋',
  lime: '🍋‍🟩', limes: '🍋‍🟩',
  grape: '🍇', grapes: '🍇',
  strawberry: '🍓', strawberries: '🍓',
  blueberry: '🫐', blueberries: '🫐',
  raspberry: '🫐', raspberries: '🫐',
  watermelon: '🍉',
  pineapple: '🍍',
  avocado: '🥑', avocados: '🥑',
  carrot: '🥕', carrots: '🥕', gajar: '🥕',
  potato: '🥔', potatoes: '🥔', aaloo: '🥔',
  onion: '🧅', onions: '🧅', pyaaz: '🧅',
  garlic: '🧄',
  ginger: '🫚',
  cucumber: '🥒', cucumbers: '🥒',
  broccoli: '🥦',
  cauliflower: '🥦', gobhi: '🥦',
  cabbage: '🥬',
  spinach: '🥬', palak: '🥬', kale: '🥬', lettuce: '🥬',
  mushroom: '🍄', mushrooms: '🍄',
  beetroot: '🟣', beet: '🟣', beetroots: '🟣',
  peas: '🫛', matar: '🫛',
  okra: '🥬', bhindi: '🥬',
  mango: '🥭', mangoes: '🥭',
  peach: '🍑', peaches: '🍑',
  cherry: '🍒', cherries: '🍒',
  celery: '🥬', zucchini: '🥒', radish: '🫚',
  coriander: '🌿', cilantro: '🌿', mint: '🌿', pudina: '🌿',

  // Bakery
  bread: '🍞', 'sourdough bread': '🍞', sourdough: '🍞', toast: '🍞',
  bagel: '🥯', bagels: '🥯', bun: '🍞', buns: '🍞',
  croissant: '🥐',
  cake: '🍰', cakes: '🍰', brownie: '🍰', pastry: '🍰', pastries: '🍰',
  cookie: '🍪', cookies: '🍪', biscuit: '🍪', biscuits: '🍪',
  donut: '🍩', donuts: '🍩',
  muffin: '🧁', muffins: '🧁',
  tortilla: '🫓', tortillas: '🫓', pita: '🫓',

  // Dairy & Plant-based
  milk: '🥛', 'oat milk': '🥛', 'almond milk': '🥛', 'soy milk': '🥛',
  cheese: '🧀', cheddar: '🧀', mozzarella: '🧀', parmesan: '🧀', paneer: '🧀',
  butter: '🧈', ghee: '🧈',
  yogurt: '🍨', curd: '🍨', cream: '🍨',

  // Meat & Seafood
  egg: '🥚', eggs: '🥚',
  chicken: '🍗', turkey: '🍗',
  steak: '🥩', beef: '🥩', meat: '🥩', pork: '🥩', lamb: '🥩', mutton: '🥩',
  fish: '🐟', salmon: '🐟', tuna: '🐟',
  shrimp: '🦐', prawns: '🦐',
  bacon: '🥓',
  sausage: '🌭', sausages: '🌭', ham: '🍖',

  // Pantry
  oil: '🫒', 'olive oil': '🫒', vinegar: '🍾',
  rice: '🍚',
  pasta: '🍝', noodles: '🍜',
  flour: '🌾', atta: '🌾', oats: '🥣', cereal: '🥣',
  honey: '🍯', jam: '🍓',
  peanut: '🥜', 'peanut butter': '🥜',
  beans: '🫘', lentils: '🫘', dal: '🫘', chickpeas: '🫘',
  soup: '🍲', sauce: '🥫', ketchup: '🥫', mustard: '🥫',
  salt: '🧂', sugar: '🍬', spice: '🌶️', spices: '🌶️', masala: '🌶️',

  // Beverages
  water: '💧', 'bottled water': '💧',
  juice: '🧃', 'orange juice': '🧃',
  coffee: '☕',
  tea: '🍵', chai: '🍵',
  soda: '🥤', coke: '🥤', pepsi: '🥤', sprite: '🥤',
  beer: '🍺', wine: '🍷', lemonade: '🍋',

  // Snacks & Frozen
  chips: '🥔', popcorn: '🍿',
  nuts: '🥜', almonds: '🥜', cashews: '🥜',
  chocolate: '🍫', candy: '🍬',
  'ice cream': '🍦', ice: '🧊', pizza: '🍕', 'frozen pizza': '🍕',
};

export function getItemEmoji(itemName: string, category?: string): string {
  if (!itemName) return CATEGORY_ICONS[category || 'other'] || '🛒';
  const lower = itemName.toLowerCase().trim();
  
  // Exact match
  if (ITEM_EMOJIS[lower]) return ITEM_EMOJIS[lower];
  
  // Search for multi-word or contained keyword
  for (const [key, emoji] of Object.entries(ITEM_EMOJIS)) {
    if (lower.includes(key) || (key.length > 3 && key.includes(lower))) {
      return emoji;
    }
  }
  
  // Fallback to Department Category Icon
  const cat = category || categorize(itemName);
  return CATEGORY_ICONS[cat] || '🛒';
}

export function categorize(itemName: string): string {
  const lower = itemName.toLowerCase().trim();
  for (const [cat, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some(k => lower === k || lower.includes(k) || k.includes(lower))) return cat;
  }
  return 'other';
}
