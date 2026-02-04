// Map category names to Jumia URL slugs
export const jumiaCategoryMap: Record<string, string> = {
  // Phones & Tablets
  "Phones": "phones-tablets",
  "Mobile Accessories": "mobile-accessories",
  "Phone Accessories": "mobile-accessories",

  // Computing
  "Computing": "computing",
  "Computing Accessories": "computing-accessories",
  "Laptops": "laptops",

  // Electronics
  "TV": "televisions",
  "Headphones": "headphones",
  "Headphone": "headphones",
  "Headset": "headphones",
  "Earbuds": "earbuds",
  "Earbud": "earbuds",
  "Earphone": "earphones",
  "Bluetooth Speaker": "bluetooth-speakers",
  "Smartwatches": "smart-watches",
  "Smart Watch": "smart-watches",
  "Smartwatch": "smart-watches",
  "Fitness Tracker": "fitness-trackers",
  "Powerbank": "power-banks",
  "Tech Gadgets": "electronics",
  "Gadgets": "electronics",
  "Starlink": "networking-products",
  "Generators": "generators",
  "Solar Stations": "solar-inverter",
  "ACs": "air-conditioners",

  // Fashion
  "Fashion": "fashion",
  "Men's Fashion": "mens-clothing",
  "High Fashion": "fashion",
  "Fashion Accessories": "fashion-accessories",
  "Shoes": "shoes",
  "Sneakers": "sneakers",
  "Training Shoes": "training-shoes",
  "Bags": "bags",
  "Bag": "bags",
  "Laptop Bag": "laptop-bags",
  "Gym Bag": "gym-bags",
  "Backpack": "backpacks",
  "Wallets": "wallets",
  "Belt": "belts",
  "Sunglasses": "sunglasses",
  "Hats": "hats",
  "Cap": "caps",
  "Active Wear": "activewear",
  "Gym Leggings": "leggings",

  // Beauty & Health
  "Beauty": "health-beauty",
  "Spa Kits": "query:spa kit",
  "Skincare": "skin-care",
  "Men Skincare": "mens-skin-care",
  "Lipcare": "lip-care",
  "Perfumes": "fragrances",
  "Perfume": "fragrances",
  "Grooming Kit": "mens-grooming",

  // Jewellery & Accessories
  "Jewellery": "jewellery",
  "Wristwatch": "watches",
  "Necklace": "necklaces",
  "Bracelet": "bracelets",

  // Home & Kitchen
  "Home Decor": "home-decor",
  "Home Esthetics": "home-decor",
  "Kitchen Appliances": "small-appliances",
  "Small Appliances": "small-appliances",
  "Large Appliances": "home-improvement-appliances",
  "Appliances": "appliances",
  "Fridge/Freezers": "refrigerators",
  "Utensils": "kitchen-utensils",
  "Scented Candles": "candles-home-fragrance",
  "Scented Candle": "candles-home-fragrance",
  "Water Bottle": "water-bottles",
  "Tumbler": "tumblers",
  "Mug": "mugs",
  "Air Fryer": "air-fryers",
  "Smoothie Blender": "blenders",

  // Fitness
  "Fitness": "sporting-goods",
  "Fitness Products": "sporting-goods",
  "Dumbbells": "dumbbells",
  "Resistance Bands": "resistance-bands",
  "Kettlebells": "kettlebells",
  "Yoga Mat": "yoga-mats",
  "Skipping Rope": "jump-ropes",
  "Treadmill": "treadmills",

  // Gifts & Special Items
  "Flowers": "query:flowers",
  "Teddy Bears": "query:teddy bear",
  "Teddy Bear": "query:teddy bear",
  "Artwork": "wall-art",

  // Food & Drinks
  "Grocery": "groceries",
  "Beverage": "beverages",
  "Wine": "wine",
  "Whiskey": "whiskey",
  "Tequila": "tequila",
  "Vodka": "vodka",

  // Kids
  "Toys": "toys",

  // Default fallback
  "All Categories": "deals",
};

// Category-specific minimum prices (in Naira)
export const categoryMinimumPrices: Record<string, number> = {
  // Premium Electronics
  "TV": 30000,
  "Starlink": 200000,
  "Large Appliances": 20000,
  "Appliances": 10000,
  "Generators": 50000,
  "Solar Stations": 100000,
  "ACs": 100000,
  "Fridge/Freezers": 80000,

  // High-end Fashion & Accessories
  "High Fashion": 15000,
  "Wristwatch": 5000,

  // Computing
  "Laptops": 80000,
  "Computing": 50000,

  // Kitchen Appliances
  "Kitchen Appliances": 8000,
  "Small Appliances": 5000,
  "Air Fryer": 15000,
  "Treadmill": 80000,

  // Default for all other categories
  "default": 100,
};

// Get budget price range string for Jumia URL with category-specific minimum
export function getBudgetPriceRange(budgetLabel: string, category?: string): string {
  // Get category-specific minimum or use default
  const categoryMin = category ? (categoryMinimumPrices[category] || categoryMinimumPrices["default"]) : categoryMinimumPrices["default"];

  const budgetMap: Record<string, { min: number; max: number }> = {
    "Under ₦5,000": { min: categoryMin, max: 4999 },
    "₦5,000 - ₦15,000": { min: Math.max(categoryMin, 5000), max: 14999 },
    "₦15,000 - ₦50,000": { min: Math.max(categoryMin, 15000), max: 49999 },
    "₦50,000 - ₦100,000": { min: Math.max(categoryMin, 50000), max: 99999 },
    "₦100,000 - ₦500,000": { min: Math.max(categoryMin, 100000), max: 499999 },
    "Over ₦500,000": { min: Math.max(categoryMin, 500000), max: 10000000 },
  };

  const range = budgetMap[budgetLabel];
  if (!range) return "100-10000000";

  // If category minimum is higher than the range maximum, use category min to a higher range
  if (categoryMin > range.max) {
    return `${categoryMin}-10000000`;
  }

  return `${range.min}-${range.max}`;
}
