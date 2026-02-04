import type { JumiaProduct, ProductSearchParams } from "@/types/product";
import { jumiaCategoryMap, getBudgetPriceRange } from "@/data/jumiaCategoryMap";

// Multiple CORS proxies for fallback
const CORS_PROXIES = [
  "https://api.allorigins.win/raw?url=",
  "https://corsproxy.io/?",
  "https://api.codetabs.com/v1/proxy?quest=",
];

// Extract valid JSON matches from script content (adapted from Finder class)
function extractValidJsonMatches(input: string): any[] {
  let matches: any[] = [];
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
          if (parsed.viewData) {
            matches = parsed.viewData.products || [];
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

// Desktop parser - extracts products from window.STORE
function parseDesktopProducts(rawProducts: string): any[] {
  if (!rawProducts) return [];

  // Try to find products with different patterns
  let start = rawProducts.indexOf('"products":');
  if (start === -1) {
    start = rawProducts.indexOf('"products" :');
  }
  if (start === -1) {
    start = rawProducts.indexOf("'products':");
  }

  if (start === -1) {
    console.warn("Could not find 'products' key in script");
    return [];
  }

  const products = '{' + rawProducts.substring(start);

  // Find the closing bracket for the products array
  const closingBraceIndices: number[] = [];
  const pattern = /\}]/g;
  let result;
  while ((result = pattern.exec(products))) {
    closingBraceIndices.push(result.index);
  }

  if (closingBraceIndices.length === 0) {
    console.warn("Could not find closing bracket for products array");
    return [];
  }

  const lastIdx = closingBraceIndices[closingBraceIndices.length - 1];
  const jsonStr = products.substring(0, lastIdx + 2) + '}';

  try {
    const parsed = JSON.parse(jsonStr);
    return parsed.products || [];
  } catch (error) {
    console.warn("Failed to parse products JSON:", error);
    return [];
  }
}

// Extract products from HTML response
function extractProducts(html: string): any[] {
  if (!html) return [];

  // Find script tags containing product data
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let scriptCount = 0;
  let productsScriptCount = 0;

  while ((match = scriptRegex.exec(html)) !== null) {
    const scriptContent = match[1];
    scriptCount++;

    // Pattern 1: Standard products array
    if (scriptContent && (
      scriptContent.includes('"products":[{') ||
      scriptContent.includes('"products": [{') ||
      scriptContent.includes("'products':[{")
    )) {
      productsScriptCount++;
      console.log(`Found script tag ${productsScriptCount} with products data`);

      // Try desktop format first
      const desktopProducts = parseDesktopProducts(scriptContent);
      if (desktopProducts.length > 0) {
        console.log(`✓ Found ${desktopProducts.length} products using desktop parser`);
        return desktopProducts;
      }

      // Try mobile/viewData format
      const mobileProducts = extractValidJsonMatches(scriptContent);
      if (mobileProducts.length > 0) {
        console.log(`✓ Found ${mobileProducts.length} products using mobile parser`);
        return mobileProducts;
      }
    }

    // Pattern 2: Next.js __NEXT_DATA__ format
    if (scriptContent.includes('__NEXT_DATA__') || scriptContent.includes('id="__NEXT_DATA__"')) {
      console.log('Found __NEXT_DATA__ script tag');
      try {
        const jsonMatch = scriptContent.match(/({[\s\S]*})/);
        if (jsonMatch) {
          const data = JSON.parse(jsonMatch[1]);
          // Try to find products in various Next.js data structures
          const products = data?.props?.pageProps?.products ||
            data?.props?.initialState?.products ||
            data?.query?.data?.products;
          if (products && Array.isArray(products) && products.length > 0) {
            console.log(`✓ Found ${products.length} products from __NEXT_DATA__`);
            return products;
          }
        }
      } catch (e) {
        console.warn('Failed to parse __NEXT_DATA__:', e);
      }
    }

    // Pattern 3: window.__INITIAL_STATE__ or similar
    if (scriptContent.includes('__INITIAL_STATE__') || scriptContent.includes('window.STORE')) {
      console.log('Found __INITIAL_STATE__ or window.STORE');
      try {
        // Try to extract JSON after the assignment
        const stateMatch = scriptContent.match(/=\s*({[\s\S]*?});?\s*$/);
        if (stateMatch) {
          const data = JSON.parse(stateMatch[1]);
          const products = data?.products || data?.catalog?.products || data?.items;
          if (products && Array.isArray(products) && products.length > 0) {
            console.log(`✓ Found ${products.length} products from __INITIAL_STATE__`);
            return products;
          }
        }
      } catch (e) {
        console.warn('Failed to parse __INITIAL_STATE__:', e);
      }
    }
  }

  console.warn(`Checked ${scriptCount} script tags, ${productsScriptCount} contained 'products' keyword, but no products extracted`);

  // Last resort: try to find any JSON structure with product-like data
  console.log('Attempting last-resort product extraction...');
  const allScripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
  for (const script of allScripts) {
    if (script.includes('sku') && script.includes('price') && script.includes('name')) {
      console.log('Found script with product-like fields (sku, price, name)');
      // This might be a different format, but we can try to extract it
    }
  }

  return [];
}

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
function mapToJumiaProduct(product: any, baseUrl: string): JumiaProduct {
  return {
    sku: product.sku || product.id || `sku-${Math.random().toString(36).substr(2, 9)}`,
    displayName: product.displayName || product.name || "Unknown Product",
    image: product.image || "",
    url: product.url ? (product.url.startsWith('http') ? product.url : baseUrl + product.url) : baseUrl,
    oldPrice: product.prices?.oldPrice || "",
    newPrice: product.prices?.price || product.prices?.rawPrice || "",
  };
}

// Fetch with timeout
async function fetchWithTimeout(url: string, timeoutMs: number = 15000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Try fetching with multiple CORS proxies
async function fetchWithFallback(targetUrl: string): Promise<string> {
  let lastError: Error | null = null;

  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = `${proxy}${encodeURIComponent(targetUrl)}`;
      console.log(`Trying proxy: ${proxy.split('?')[0]}...`);

      const response = await fetchWithTimeout(proxyUrl, 20000);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const html = await response.text();
      if (html && html.length > 1000) {
        console.log("Successfully fetched HTML");
        return html;
      }
      throw new Error("Response too short, likely blocked");

    } catch (error) {
      console.warn(`Proxy ${proxy.split('?')[0]} failed:`, error);
      lastError = error as Error;
      continue;
    }
  }

  throw lastError || new Error("All CORS proxies failed");
}

// Main fetch function
export async function fetchJumiaProductsDirect(
  params: ProductSearchParams
): Promise<JumiaProduct[]> {
  const { category, budget } = params;
  const baseUrl = "https://www.jumia.com.ng";
  const allProducts: JumiaProduct[] = [];
  const seenSkus = new Set<string>();

  console.log(`Starting multi-page fetch for: ${category}`);

  for (let page = 1; page <= 5; page++) {
    const categoryUrl = buildJumiaCategoryUrl(category, budget, page);
    console.log(`Fetching page ${page} from:`, categoryUrl);

    try {
      const html = await fetchWithFallback(categoryUrl);
      const rawProducts = extractProducts(html);

      if (!rawProducts || rawProducts.length === 0) {
        console.warn(`No products found on page ${page}, stopping.`);
        break;
      }

      const mappedProducts = rawProducts.map(p => mapToJumiaProduct(p, baseUrl));

      for (const product of mappedProducts) {
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
