/**
 * Generates a deterministic mock price based on the item name.
 * This ensures that "milk" always costs the same amount every time you add it.
 */
export function generateMockPrice(itemName: string): number {
  const norm = itemName.toLowerCase().trim();
  
  // Simple string hash
  let hash = 0;
  for (let i = 0; i < norm.length; i++) {
    hash = ((hash << 5) - hash) + norm.charCodeAt(i);
    hash |= 0; 
  }
  
  // Convert hash to a price between $1.00 and $25.00
  const normalizedHash = Math.abs(hash) % 2400; // 0 to 2399
  const priceInCents = 100 + normalizedHash; // 100 to 2499 cents ($1.00 to $24.99)
  
  return priceInCents / 100;
}
