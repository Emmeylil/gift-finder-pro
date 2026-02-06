import type { JumiaProduct, ProductSearchParams, iSKU } from "@/types/product";
import { jumiaCategoryMap, getBudgetPriceRange } from "@/data/jumiaCategoryMap";

// CORS proxies for client-side fetching
const CORS_PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
];

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

  return `https://www.jumia.com.ng/catalog/?q=${encodeURIComponent(category)}&price=${priceRange}${pageParam}#catalog-listing`;
}

// Fetch with timeout
async function fetchWithTimeout(url: string, timeout = 15000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Fetch with CORS proxy fallback
async function fetchWithFallback(url: string): Promise<string> {
  let lastError: Error | null = null;

  for (const proxyFn of CORS_PROXIES) {
    const proxyUrl = proxyFn(url);
    console.log(`Trying proxy: ${proxyUrl.substring(0, 50)}...`);
    
    try {
      const response = await fetchWithTimeout(proxyUrl, 20000);
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const text = await response.text();
      
      // Validate we got HTML, not an error page
      if (text && text.length > 1000 && text.includes('<!')) {
        console.log(`Proxy success, got ${text.length} chars`);
        return text;
      }
      
      throw new Error('Invalid response content');
    } catch (error: any) {
      console.warn(`Proxy failed: ${error.message}`);
      lastError = error;
    }
  }

  throw lastError || new Error('All proxies failed');
}

// Extract valid JSON matches from script content (mobile/viewData format)
function extractValidJsonMatches(input: string): iSKU[] {
  if (!input) return [];
  
  let matches: iSKU[] = [];
  let depth = 0;
  let start = -1;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        const jsonString = input.slice(start, i + 1);
        try {
          const parsed = JSON.parse(jsonString);
          if (parsed.viewData && parsed.viewData.products) {
            matches = parsed.viewData.products;
            break;
          }
        } catch {
          // Continue searching
        }
        start = -1;
      }
    }
  }

  return matches;
}

// Helper to find closing brace indices
function braceIndices(str: string, brace: string): number[] {
  const escaped = brace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(escaped, 'gi');
  const indices: number[] = [];
  let result;
  while ((result = regex.exec(str))) {
    indices.push(result.index);
  }
  return indices;
}

// Desktop parser - extracts products from window.STORE or similar
function parseDesktopProducts(rawProducts: string): iSKU[] {
  if (!rawProducts) return [];

  let start = rawProducts.indexOf('"products":');
  if (start === -1) {
    start = rawProducts.indexOf('"products" :');
  }
  if (start === -1) {
    start = rawProducts.indexOf("'products':");
  }

  if (start === -1) {
    return [];
  }

  const products = '{' + rawProducts.substring(start);
  const closingBraceIndices = braceIndices(products, '}]');

  if (closingBraceIndices.length === 0) {
    return [];
  }

  const lastIdx = closingBraceIndices[closingBraceIndices.length - 1];
  const jsonStr = products.substring(0, lastIdx + 2) + '}';

  try {
    const parsed = JSON.parse(jsonStr);
    return parsed.products || [];
  } catch (error) {
    console.error('Failed to parse desktop products:', error);
    return [];
  }
}

// Extract products from HTML using a temporary DOM element
function extractProductsFromHTML(html: string): iSKU[] {
  if (!html) return [];

  // Create temporary element to parse scripts
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  const scripts = tempDiv.querySelectorAll('script');
  
  for (const script of scripts) {
    const scriptContent = script.innerHTML;
    if (!scriptContent) continue;

    // Check if script contains products data
    if (
      scriptContent.includes('"products":[{') ||
      scriptContent.includes('"products": [{') ||
      scriptContent.includes("'products':[{")
    ) {
      // Try desktop format first (window.STORE style)
      const desktopProducts = parseDesktopProducts(scriptContent);
      if (desktopProducts.length > 0) {
        console.log(`Found ${desktopProducts.length} products via desktop parser`);
        tempDiv.innerHTML = '';
        return desktopProducts;
      }

      // Try mobile/viewData format
      const mobileProducts = extractValidJsonMatches(scriptContent);
      if (mobileProducts.length > 0) {
        console.log(`Found ${mobileProducts.length} products via mobile parser`);
        tempDiv.innerHTML = '';
        return mobileProducts;
      }
    }
  }

  // Cleanup
  tempDiv.innerHTML = '';
  return [];
}

// Map iSKU to simplified JumiaProduct for display
function mapToJumiaProduct(sku: iSKU): JumiaProduct {
  return {
    sku: sku.sku || `sku-${Math.random().toString(36).substr(2, 9)}`,
    displayName: sku.displayName || sku.name || 'Unknown Product',
    brand: sku.brand || '',
    image: sku.image || '',
    url: sku.url?.startsWith('http') ? sku.url : `https://www.jumia.com.ng${sku.url || ''}`,
    prices: sku.prices || { rawPrice: '0', price: '₦ 0', priceEuro: '0', taxEuro: '0' },
    rating: sku.rating || { average: 0, totalRatings: 0 },
    stock: sku.stock || { percent: 100, text: 'In Stock' },
    isBuyable: sku.isBuyable !== false,
    isShopExpress: sku.isShopExpress || false,
  };
}

// Fetch products from a single page
async function fetchPage(url: string): Promise<iSKU[]> {
  console.log(`Fetching: ${url}`);
  
  try {
    const html = await fetchWithFallback(url);
    const products = extractProductsFromHTML(html);
    return products;
  } catch (error) {
    console.error(`Failed to fetch page:`, error);
    return [];
  }
}

// Main fetch function
export async function fetchJumiaProductsDirect(
  params: ProductSearchParams
): Promise<JumiaProduct[]> {
  const { category, budget } = params;
  const allProducts: JumiaProduct[] = [];
  const seenSkus = new Set<string>();

  console.log(`Starting multi-page fetch for: ${category}`);

  for (let page = 1; page <= 3; page++) {
    const categoryUrl = buildJumiaCategoryUrl(category, budget, page);
    console.log(`Fetching page ${page} from:`, categoryUrl);

    try {
      const rawProducts = await fetchPage(categoryUrl);

      if (!rawProducts || rawProducts.length === 0) {
        console.warn(`No products found on page ${page}, stopping.`);
        break;
      }

      const mappedProducts = rawProducts.map(p => mapToJumiaProduct(p));

      for (const product of mappedProducts) {
        if (!seenSkus.has(product.sku)) {
          seenSkus.add(product.sku);
          allProducts.push(product);
        }
      }

      console.log(`Page ${page}: Added ${mappedProducts.length} products (Total: ${allProducts.length})`);

    } catch (error) {
      console.error(`Failed to fetch Jumia products on page ${page}:`, error);
      if (page === 1) throw error;
      break;
    }
  }

  return allProducts.slice(0, 100);
}
