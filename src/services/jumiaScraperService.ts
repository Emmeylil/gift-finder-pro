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
  
  const start = rawProducts.indexOf('"products":');
  if (start === -1) return [];
  
  const products = '{' + rawProducts.substring(start);
  
  // Find the closing bracket for the products array
  const closingBraceIndices: number[] = [];
  const pattern = /\}\]/g;
  let result;
  while ((result = pattern.exec(products))) {
    closingBraceIndices.push(result.index);
  }
  
  if (closingBraceIndices.length === 0) return [];
  
  const lastIdx = closingBraceIndices[closingBraceIndices.length - 1];
  const jsonStr = products.substring(0, lastIdx + 2) + '}';
  
  try {
    return JSON.parse(jsonStr).products || [];
  } catch {
    return [];
  }
}

// Extract products from HTML response
function extractProducts(html: string): any[] {
  if (!html) return [];
  
  // Find script tags containing product data
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  
  while ((match = scriptRegex.exec(html)) !== null) {
    const scriptContent = match[1];
    
    // Check for products array in the script
    if (scriptContent && scriptContent.includes('"products":[{')) {
      // Try desktop format first
      const desktopProducts = parseDesktopProducts(scriptContent);
      if (desktopProducts.length > 0) {
        return desktopProducts;
      }
      
      // Try mobile/viewData format
      const mobileProducts = extractValidJsonMatches(scriptContent);
      if (mobileProducts.length > 0) {
        return mobileProducts;
      }
    }
  }
  
  return [];
}

// Build Jumia category URL with price filter
function buildJumiaCategoryUrl(category: string, budget: string): string {
  const categorySlug = jumiaCategoryMap[category] || category.toLowerCase().replace(/\s+/g, '-');
  const priceRange = getBudgetPriceRange(budget);
  return `https://www.jumia.com.ng/${categorySlug}/?price=${priceRange}#catalog-listing`;
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
      console.warn(`Proxy failed:`, error);
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
  const categoryUrl = buildJumiaCategoryUrl(category, budget);
  
  console.log("Fetching from:", categoryUrl);
  
  try {
    const html = await fetchWithFallback(categoryUrl);
    const products = extractProducts(html);
    
    if (!products || products.length === 0) {
      console.warn("No products found in response");
      return [];
    }
    
    return products
      .slice(0, 20)
      .map(p => mapToJumiaProduct(p, baseUrl));
      
  } catch (error) {
    console.error("Failed to fetch Jumia products:", error);
    throw error;
  }
}
