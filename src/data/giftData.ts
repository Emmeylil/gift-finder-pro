export interface ArchetypeData {
  day: string;
  archetype: string;
  tagline: string;
  categories: string[];
}

export const archetypeData: ArchetypeData[] = [
  {
    day: "Feb 2",
    archetype: "Single Pringles",
    tagline: "Valentine deals made for you",
    categories: ["Beauty & Spa Kits", "Fitness", "Fashion", "Fashion Accessories", "Home Decor", "Gadgets", "Headphones", "Smartwatches"]
  },
  {
    day: "Feb 3",
    archetype: "My Techie",
    tagline: "Smart Tech for Modern Love",
    categories: ["Phones", "Mobile Accessories", "Computing", "Computing Accessories"]
  },
  {
    day: "Feb 4",
    archetype: "The 'Odogwu'",
    tagline: "Big energy deserves big spend",
    categories: ["Starlink", "Large Appliances", "TV", "Generators", "Solar Stations", "ACs", "Fridge/Freezers", "High Fashion"]
  },
  {
    day: "Feb 5",
    archetype: "The Intentional Lover",
    tagline: "Say it with a gift",
    categories: ["Flowers", "Teddy Bears", "Fashion", "Appliances", "Phones", "Phone Accessories", "Jewellery", "Beauty", "Shoes"]
  },
  {
    day: "Feb 6",
    archetype: "My Day Ones",
    tagline: "Show Love to your OGs",
    categories: ["Phones", "Powerbank", "Smart Watch", "Headphone", "Bluetooth Speaker", "Perfumes", "Sunglasses", "Wallets", "Shoes", "Sneakers", "Bags", "Skincare", "Fitness Products", "Scented Candles", "Wine", "Jewellery"]
  },
  {
    day: "Feb 7",
    archetype: "My Yard People",
    tagline: "Celebrate the Love at Home",
    categories: ["Grocery", "Beverage", "Home Decor", "Fashion", "Shoes", "Phones", "Mobile Accessories", "Smart Watch", "Earbuds", "Perfume", "Laptops", "Toys"]
  },
  {
    day: "Feb 8",
    archetype: "The Husband Material",
    tagline: "Spoil your man",
    categories: ["Men's Fashion", "Wristwatch", "Belt", "Sunglasses", "Necklace", "Bracelet", "Perfume", "Grooming Kit", "Men Skincare", "Earbuds", "Bluetooth Speaker", "Powerbank", "Smart Watch", "Whiskey", "Tequila", "Vodka", "Wine"]
  },
  {
    day: "Feb 9",
    archetype: "My Office People",
    tagline: "Gifts for Work Fam",
    categories: ["Water Bottle", "Tumbler", "Mug", "Backpack", "Laptop Bag", "Phones", "Small Appliances", "Home Decor", "Scented Candle", "Lipcare", "Skincare", "Perfume", "Shoes", "Sneakers", "Powerbank", "Headset", "Earphone"]
  },
  {
    day: "Feb 10",
    archetype: "The Patient Lover",
    tagline: "For the one who waited",
    categories: ["Jewellery", "Fashion Accessories", "Beauty", "Kitchen Appliances", "Fashion", "Shoes"]
  },
  {
    day: "Feb 11",
    archetype: "The Wife Material",
    tagline: "Spoil your woman",
    categories: ["Beauty", "Home Esthetics", "Kitchen Appliances", "Utensils", "Home Decor", "Fashion", "Fashion Accessories"]
  },
  {
    day: "Feb 12",
    archetype: "The Special Someone",
    tagline: "Gifts as special as they are",
    categories: ["Perfumes", "Jewellery", "Tech Gadgets", "Fashion", "Fashion Accessories", "Skincare", "Appliances", "Mobile Accessories", "Scented Candles", "Teddy Bears"]
  },
  {
    day: "Feb 13",
    archetype: "The Fitness Lover",
    tagline: "Gifts built for the Grind",
    categories: ["Dumbbells", "Resistance Bands", "Kettlebells", "Yoga Mat", "Skipping Rope", "Treadmill", "Smartwatch", "Fitness Tracker", "Headphone", "Earbud", "Gym Leggings", "Active Wear", "Training Shoes", "Gym Bag", "Air Fryer", "Smoothie Blender"]
  },
  {
    day: "Feb 14",
    archetype: "The Secret Admirer",
    tagline: "Surprise your Crush",
    categories: ["Perfumes", "Jewellery", "Teddy Bear", "Artwork", "Scented Candles", "Fashion", "Shoes", "Sneakers", "Bag", "Hats", "Cap", "Phones", "Wine"]
  },
  {
    day: "Feb 15",
    archetype: "The 'Us'",
    tagline: "The grand finale: Everything for Everyone",
    categories: ["All Categories"]
  }
];

export const budgetRanges = [
  { label: "Under ₦5,000", min: 0, max: 5000 },
  { label: "₦5,000 - ₦15,000", min: 5000, max: 15000 },
  { label: "₦15,000 - ₦50,000", min: 15000, max: 50000 },
  { label: "₦50,000 - ₦100,000", min: 50000, max: 100000 },
  { label: "₦100,000 - ₦500,000", min: 100000, max: 500000 },
  { label: "Over ₦500,000", min: 500000, max: Infinity }
];

export const getArchetypeEmoji = (archetype: string): string => {
  const emojiMap: Record<string, string> = {
    "Single Pringles": "💅",
    "My Techie": "📱",
    "The 'Odogwu'": "👑",
    "The Intentional Lover": "💐",
    "My Day Ones": "🤝",
    "My Yard People": "🏠",
    "The Husband Material": "👔",
    "My Office People": "💼",
    "The Patient Lover": "💎",
    "The Wife Material": "👗",
    "The Special Someone": "✨",
    "The Fitness Lover": "💪",
    "The Secret Admirer": "🥰",
    "The 'Us'": "💕"
  };
  return emojiMap[archetype] || "🎁";
};
