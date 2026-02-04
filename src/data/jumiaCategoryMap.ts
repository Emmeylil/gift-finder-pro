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
  "Large Appliances": "large-appliances",
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

// Get budget price range string for Jumia URL
export function getBudgetPriceRange(budgetLabel: string): string {
  const budgetMap: Record<string, string> = {
    "Under ₦5,000": "100-4999",
    "₦5,000 - ₦15,000": "5000-14999",
    "₦15,000 - ₦50,000": "15000-49999",
    "₦50,000 - ₦100,000": "50000-99999",
    "₦100,000 - ₦500,000": "100000-499999",
    "Over ₦500,000": "500000-10000000",
  };
  return budgetMap[budgetLabel] || "100-10000000";
}
