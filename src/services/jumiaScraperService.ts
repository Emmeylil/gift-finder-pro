import type { JumiaProduct, ProductSearchParams } from "@/types/product";
import { jumiaCategoryMap, getBudgetPriceRange } from "@/data/jumiaCategoryMap";
import { isFuzzyMatch } from "@/lib/searchUtils";

// Build Jumia category URL with price filter
function buildJumiaCategoryUrl(category: string, budget: string, page: number = 1): string {
  const mapping = jumiaCategoryMap[category];
  const priceRange = getBudgetPriceRange(budget, category);
  const pageParam = page > 1 ? `&page=${page}` : "";

  if (mapping && mapping.startsWith("query:")) {
    const query = mapping.replace("query:", "");
    return `https://www.jumia.com.ng/catalog/?q=${encodeURIComponent(query)}&price=${priceRange}${pageParam}#catalog-listing`;
  }

  if (mapping) {
    return `https://www.jumia.com.ng/${mapping}/?price=${priceRange}${pageParam}#catalog-listing`;
  }

  // Fallback to general search if category is not in map
  return `https://www.jumia.com.ng/catalog/?q=${encodeURIComponent(category)}&price=${priceRange}${pageParam}#catalog-listing`;
}

// Map raw product data to JumiaProduct interface
function mapToJumiaProduct(product: any): JumiaProduct {
  return {
    ...product,
    sku: product.sku || `sku-${Math.random().toString(36).substring(2, 9)}`,
  };
}

// Fetch products from API endpoint
async function fetchFromAPI(jumiaUrl: string, page: number): Promise<any[]> {
  const apiUrl = `/api/jumia-products?url=${encodeURIComponent(jumiaUrl)}&page=${page}`;

  console.log(`Calling API: ${apiUrl}`);

  const response = await fetch(apiUrl);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.products || [];
}

// Main fetch function
export async function fetchJumiaProductsDirect(
  params: ProductSearchParams
): Promise<JumiaProduct[]> {
  const { category, budget } = params;
  const allProducts: JumiaProduct[] = [];
  const seenSkus = new Set<string>();

  console.log(`Starting multi-page fetch for: ${category}`);

  for (let page = 1; page <= 5; page++) {
    const categoryUrl = buildJumiaCategoryUrl(category, budget, page);
    console.log(`Fetching page ${page} from:`, categoryUrl);

    try {
      const rawProducts = await fetchFromAPI(categoryUrl, page);

      if (!rawProducts || rawProducts.length === 0) {
        console.warn(`No products found on page ${page}, stopping.`);
        break;
      }

      const mappedProducts = rawProducts.map(p => mapToJumiaProduct(p));

      // Filter by fuzzy match to ensure relevance (using 0.6 threshold for broader matching)
      const relevantProducts = mappedProducts.filter(product =>
        isFuzzyMatch(category, product.displayName, 0.6) ||
        (product.brand && isFuzzyMatch(category, product.brand, 0.6))
      );

      for (const product of relevantProducts) {
        if (!seenSkus.has(product.sku)) {
          seenSkus.add(product.sku);
          allProducts.push(product);
        }
      }

      console.log(`Page ${page}: Added ${mappedProducts.length} products (Total: ${allProducts.length})`);

    } catch (error) {
      console.error(`Failed to fetch Jumia products on page ${page}:`, error);
      // If first page fails, throw. Otherwise, return what we have.
      if (page === 1) throw error;
      break;
    }
  }

  return allProducts.slice(0, 100); // Return up to 100 aggregated products
}
