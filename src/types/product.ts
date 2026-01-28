export interface JumiaProduct {
  sku: string;
  displayName: string;
  image: string;
  url: string;
  oldPrice: string;
  newPrice: string;
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
