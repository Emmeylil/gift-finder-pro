import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";
import type { ProductSearchParams, ProductSearchResponse, JumiaProduct } from "@/types/product";

// Firebase callable function reference
const searchJumiaProducts = httpsCallable<ProductSearchParams, ProductSearchResponse>(
  functions,
  "searchJumiaProducts"
);

export const fetchJumiaProducts = async (
  params: ProductSearchParams
): Promise<JumiaProduct[]> => {
  try {
    const result = await searchJumiaProducts(params);
    
    if (result.data.success) {
      return result.data.products;
    } else {
      console.error("Jumia search error:", result.data.error);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch Jumia products:", error);
    throw error;
  }
};

// Country domain mapping for Jumia
export const jumiaCountries = [
  { code: "NG", domain: ".com.ng", label: "Nigeria" },
  { code: "DZ", domain: ".dz", label: "Algeria" },
  { code: "EG", domain: ".com.eg", label: "Egypt" },
  { code: "GH", domain: ".com.gh", label: "Ghana" },
  { code: "CI", domain: ".ci", label: "Ivory Coast" },
  { code: "KE", domain: ".co.ke", label: "Kenya" },
  { code: "MA", domain: ".ma", label: "Morocco" },
  { code: "SN", domain: ".sn", label: "Senegal" },
  { code: "TN", domain: ".com.tn", label: "Tunisia" },
  { code: "UG", domain: ".ug", label: "Uganda" },
] as const;
