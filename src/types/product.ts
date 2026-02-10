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

export interface JumiaProduct {
  sku: string;
  name?: string;
  displayName: string;
  brand?: string;
  sellerId?: number;
  categories?: string[];
  prices?: iPrice;
  rating?: iRating;
  image: string;
  url: string;
  oldPrice: string;
  newPrice: string;
  badges?: {
    campaign?: iCampaign;
    main?: iMain;
  };
  isBuyable?: boolean;
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
