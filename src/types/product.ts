export interface iPrice {
  discount?: string;
  oldPrice?: string;
  oldPriceEuro?: string;
  price: string;
  priceEuro?: string;
  rawPrice: string;
  taxEuro?: string;
}

export interface iRating {
  average: number;
  totalRatings: number;
}

export interface iStock {
  percent: number;
  text: string;
}

export interface iCampaign {
  name: string;
  identifier: string;
  image: string;
  url: string;
  bgColor: string;
  txtColor: string;
}

export interface iMain {
  name: string;
  identifier: string;
  url: string;
}

export interface iShopExpress {
  title: string;
}

export interface iShopGlobal {
  identifier: string;
  name: string;
}

// Full SKU interface matching Jumia's data structure
export interface iSKU {
  sku: string;
  name: string;
  details?: string;
  displayName: string;
  brand: string;
  sellerId: number;
  isShopExpress?: boolean;
  isShopGlobal?: boolean;
  categories: string[];
  prices: iPrice;
  tags?: string;
  stock?: iStock;
  rating?: iRating;
  image: string;
  url: string;
  badges?: {
    campaign?: iCampaign;
    main?: iMain;
  };
  isBuyable: boolean;
  shopExpress?: iShopExpress;
  shopGlobal?: iShopGlobal;
  selectedVariation?: string;
}

// Simplified product interface for display
export interface JumiaProduct {
  sku: string;
  displayName: string;
  brand?: string;
  image: string;
  url: string;
  prices: iPrice;
  rating?: iRating;
  stock?: iStock;
  isBuyable?: boolean;
  isShopExpress?: boolean;
}

export interface ProductSearchParams {
  archetype: string;
  category: string;
  budget: string;
  country?: string;
}

export interface ProductSearchResponse {
  success: boolean;
  products: JumiaProduct[];
  error?: string;
}
