export interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  description: string;
}

export const STORE_CATALOG: CatalogProduct[] = [
  // ── Produce ──
  { id: 'cat-1', name: 'Organic Apples', category: 'produce', unit: 'item', price: 1.49, description: 'Crisp, sweet Honeycrisp apples' },
  { id: 'cat-2', name: 'Bananas', category: 'produce', unit: 'bunch', price: 1.99, description: 'Fresh ripe Cavendish bananas' },
  { id: 'cat-3', name: 'Tomatoes', category: 'produce', unit: 'item', price: 2.29, description: 'Vine-ripened red tomatoes' },
  { id: 'cat-4', name: 'Avocados', category: 'produce', unit: 'item', price: 2.49, description: 'Hass avocados, ripe & ready' },
  { id: 'cat-5', name: 'Broccoli Crown', category: 'produce', unit: 'head', price: 1.89, description: 'Fresh organic green broccoli' },
  { id: 'cat-6', name: 'Baby Spinach', category: 'produce', unit: 'pack', price: 2.99, description: 'Tender pre-washed baby spinach' },
  { id: 'cat-7', name: 'Carrots', category: 'produce', unit: 'kg', price: 1.79, description: 'Sweet crunchy whole carrots' },
  { id: 'cat-8', name: 'Sweet Corn', category: 'produce', unit: 'ear', price: 0.99, description: 'Farm fresh yellow sweet corn' },
  { id: 'cat-9', name: 'Eggplant', category: 'produce', unit: 'item', price: 2.19, description: 'Deep purple fresh Italian eggplant' },
  { id: 'cat-10', name: 'Bell Peppers', category: 'produce', unit: 'pack', price: 3.49, description: 'Tricolor sweet bell peppers' },
  { id: 'cat-11', name: 'Fresh Strawberries', category: 'produce', unit: 'box', price: 3.99, description: 'Sweet juicy summer strawberries' },
  { id: 'cat-12', name: 'Blueberries', category: 'produce', unit: 'box', price: 4.49, description: 'Antioxidant-rich fresh blueberries' },
  { id: 'cat-13', name: 'Yellow Onions', category: 'produce', unit: 'bag', price: 2.49, description: 'Versatile cooking yellow onions' },
  { id: 'cat-14', name: 'Garlic Bulbs', category: 'produce', unit: 'item', price: 0.89, description: 'Aromatic fresh white garlic' },
  { id: 'cat-15', name: 'Potatoes (Russet)', category: 'produce', unit: 'bag', price: 3.99, description: '5 lb bag of premium baking potatoes' },
  { id: 'cat-16', name: 'Beetroot', category: 'produce', unit: 'item', price: 1.29, description: 'Fresh organic garden beetroots' },

  // ── Dairy & Plant-based ──
  { id: 'cat-17', name: 'Whole Milk', category: 'dairy', unit: 'gallon', price: 3.79, description: 'Grade A pasteurized whole milk' },
  { id: 'cat-18', name: 'Oat Milk (Barista)', category: 'dairy', unit: 'carton', price: 4.29, description: 'Creamy plant-based oat beverage' },
  { id: 'cat-19', name: 'Almond Milk (Unsweetened)', category: 'dairy', unit: 'carton', price: 3.49, description: 'Smooth non-dairy almond milk' },
  { id: 'cat-20', name: 'Greek Yogurt', category: 'dairy', unit: 'tub', price: 4.99, description: 'Plain non-fat high protein yogurt' },
  { id: 'cat-21', name: 'Sharp Cheddar Cheese', category: 'dairy', unit: 'block', price: 3.89, description: 'Aged rich natural cheddar' },
  { id: 'cat-22', name: 'Fresh Mozzarella', category: 'dairy', unit: 'ball', price: 4.49, description: 'Traditional soft Italian mozzarella' },
  { id: 'cat-23', name: 'Salted Butter', category: 'dairy', unit: 'pack', price: 3.99, description: 'Grade AA sweet cream butter' },
  { id: 'cat-24', name: 'Organic Paneer', category: 'dairy', unit: 'pack', price: 4.79, description: 'Fresh whole milk cottage cheese block' },

  // ── Bakery ──
  { id: 'cat-25', name: 'Artisan Sourdough Bread', category: 'bakery', unit: 'loaf', price: 4.99, description: 'Naturally fermented crusty loaf' },
  { id: 'cat-26', name: 'Whole Wheat Bread', category: 'bakery', unit: 'loaf', price: 2.99, description: '100% whole grain sandwich bread' },
  { id: 'cat-27', name: 'Butter Croissants', category: 'bakery', unit: 'pack', price: 4.49, description: '4-pack flaky golden French croissants' },
  { id: 'cat-28', name: 'New York Bagels', category: 'bakery', unit: 'pack', price: 3.79, description: '6-pack plain boiled & baked bagels' },
  { id: 'cat-29', name: 'Chocolate Chip Cookies', category: 'bakery', unit: 'box', price: 4.29, description: 'Soft-baked gourmet bakery cookies' },
  { id: 'cat-30', name: 'Birthday Cake', category: 'bakery', unit: 'item', price: 14.99, description: 'Decadent frosted celebration cake' },

  // ── Meat & Seafood ──
  { id: 'cat-31', name: 'Farm Fresh Eggs (12-pack)', category: 'meat', unit: 'box', price: 3.49, description: 'Grade A Large brown cage-free eggs' },
  { id: 'cat-32', name: 'Boneless Chicken Breasts', category: 'meat', unit: 'pack', price: 7.99, description: 'Tender skinless organic chicken breasts' },
  { id: 'cat-33', name: 'Atlantic Salmon Fillets', category: 'meat', unit: 'pack', price: 11.99, description: 'Fresh wild-caught salmon portions' },
  { id: 'cat-34', name: 'Grass-Fed Ground Beef', category: 'meat', unit: 'lb', price: 6.49, description: '85/15 lean ground beef' },
  { id: 'cat-35', name: 'Smoked Bacon', category: 'meat', unit: 'pack', price: 5.99, description: 'Thick-cut applewood smoked bacon' },

  // ── Pantry ──
  { id: 'cat-36', name: 'Extra Virgin Olive Oil', category: 'pantry', unit: 'bottle', price: 8.99, description: 'Cold-pressed Mediterranean olive oil' },
  { id: 'cat-37', name: 'Basmati Rice', category: 'pantry', unit: 'bag', price: 6.99, description: 'Long grain aromatic aged basmati' },
  { id: 'cat-38', name: 'Italian Pasta (Penne)', category: 'pantry', unit: 'box', price: 1.89, description: '100% durum semolina pasta' },
  { id: 'cat-39', name: 'Marinara Tomato Sauce', category: 'pantry', unit: 'jar', price: 2.79, description: 'Slow-simmered garlic herb pasta sauce' },
  { id: 'cat-40', name: 'Organic Honey', category: 'pantry', unit: 'jar', price: 6.49, description: '100% pure raw wildflower honey' },
  { id: 'cat-41', name: 'Peanut Butter (Creamy)', category: 'pantry', unit: 'jar', price: 3.29, description: 'All-natural roasted peanut spread' },
  { id: 'cat-42', name: 'Rolled Oats', category: 'pantry', unit: 'tub', price: 3.99, description: '100% whole grain breakfast oats' },
  { id: 'cat-43', name: 'Organic Black Beans', category: 'pantry', unit: 'can', price: 1.29, description: 'Prepared canned tender black beans' },

  // ── Beverages ──
  { id: 'cat-44', name: 'Spring Water (24-pack)', category: 'beverages', unit: 'pack', price: 4.99, description: 'Natural mineral spring water bottles' },
  { id: 'cat-45', name: 'Fresh Orange Juice', category: 'beverages', unit: 'bottle', price: 3.89, description: '100% pure squeezed pulp-free juice' },
  { id: 'cat-46', name: 'Ground Dark Roast Coffee', category: 'beverages', unit: 'bag', price: 7.49, description: 'Rich aromatic Arabica coffee' },
  { id: 'cat-47', name: 'Green Tea Bags (20-pack)', category: 'beverages', unit: 'box', price: 3.19, description: 'Organic antioxidant Japanese green tea' },
  { id: 'cat-48', name: 'Sparkling Water (Lime)', category: 'beverages', unit: 'pack', price: 4.29, description: 'Zero calorie crisp sparkling water' },

  // ── Snacks ──
  { id: 'cat-49', name: 'Sea Salt Potato Chips', category: 'snacks', unit: 'bag', price: 3.49, description: 'Kettle-cooked crunchy potato chips' },
  { id: 'cat-50', name: 'Roasted Almonds', category: 'snacks', unit: 'bag', price: 5.99, description: 'Lightly salted whole California almonds' },
  { id: 'cat-51', name: 'Dark Chocolate Bar (70%)', category: 'snacks', unit: 'bar', price: 2.99, description: 'Fair trade rich bittersweet chocolate' },
  { id: 'cat-52', name: 'Butter Microwave Popcorn', category: 'snacks', unit: 'box', price: 3.79, description: 'Movie theater style buttery popcorn' },

  // ── Frozen ──
  { id: 'cat-53', name: 'Vanilla Bean Ice Cream', category: 'frozen', unit: 'tub', price: 4.99, description: 'Rich churned double vanilla ice cream' },
  { id: 'cat-54', name: 'Frozen Pepperoni Pizza', category: 'frozen', unit: 'box', price: 6.99, description: 'Stone-fired thin crust pizza' },
  { id: 'cat-55', name: 'Frozen Sweet Peas', category: 'frozen', unit: 'bag', price: 1.69, description: 'Flash-frozen tender sweet green peas' },

  // ── Household & Personal ──
  { id: 'cat-56', name: 'Dish Soap (Citrus)', category: 'household', unit: 'bottle', price: 2.89, description: 'Grease-fighting plant-based dish liquid' },
  { id: 'cat-57', name: 'Paper Towels (6-roll)', category: 'household', unit: 'pack', price: 7.99, description: 'Ultra-absorbent double ply rolls' },
  { id: 'cat-58', name: 'Laundry Detergent Pods', category: 'household', unit: 'tub', price: 11.49, description: 'Concentrated stain-lifting laundry pods' },
  { id: 'cat-59', name: 'Fluoride Toothpaste', category: 'personal', unit: 'tube', price: 3.29, description: 'Whitening mint enamel protection paste' },
  { id: 'cat-60', name: 'Moisturizing Body Wash', category: 'personal', unit: 'bottle', price: 5.49, description: 'Gentle nourishing botanical cleanser' },
];

/**
 * Searches the catalog with fuzzy keywords, department filtering, and budget max-price
 */
export function searchStoreCatalog(
  query: string,
  categoryFilter?: string,
  maxPrice?: number | null
): CatalogProduct[] {
  const q = (query || '').toLowerCase().trim();
  const cat = (categoryFilter || '').toLowerCase().trim();

  return STORE_CATALOG.filter(product => {
    // 1. Department Category Filter
    if (cat && cat !== 'all') {
      if (product.category.toLowerCase() !== cat) return false;
    }

    // 2. Max Price Filter
    if (maxPrice !== null && maxPrice !== undefined && maxPrice > 0) {
      if (product.price > maxPrice) return false;
    }

    // 3. Query matching
    if (!q) return true;
    const searchTerms = q.split(/\s+/);
    const targetString = `${product.name} ${product.category} ${product.description}`.toLowerCase();
    return searchTerms.every(term => targetString.includes(term));
  });
}
