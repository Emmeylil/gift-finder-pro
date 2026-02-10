import type { VercelRequest, VercelResponse } from '@vercel/node';

// Extract valid JSON matches from script content (mobile/viewData format)
function extractValidJsonMatches(input: string): any[] {
    if (!input) return [];

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
function parseDesktopProducts(rawProducts: string): any[] {
    if (!rawProducts) return [];

    // Find the start of products array
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

// Extract products from HTML response
function extractProducts(html: string): any[] {
    if (!html) return [];

    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    let match;

    while ((match = scriptRegex.exec(html)) !== null) {
        const scriptContent = match[1];
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
                return desktopProducts;
            }

            // Try mobile/viewData format
            const mobileProducts = extractValidJsonMatches(scriptContent);
            if (mobileProducts.length > 0) {
                console.log(`Found ${mobileProducts.length} products via mobile parser`);
                return mobileProducts;
            }
        }

        // Pattern 2: __INITIAL_STATE__ format
        if (scriptContent.includes('__INITIAL_STATE__')) {
            try {
                const stateMatch = scriptContent.match(/window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});?\s*(?:<\/script>|window\.|$)/);
                if (stateMatch) {
                    const data = JSON.parse(stateMatch[1]);
                    if (data.products && Array.isArray(data.products)) {
                        console.log(`Found ${data.products.length} products via __INITIAL_STATE__`);
                        return data.products;
                    }
                }
            } catch (e) {
                // Continue to next pattern
            }
        }

        // Pattern 3: Next.js __NEXT_DATA__ format
        if (scriptContent.includes('__NEXT_DATA__') || scriptContent.includes('id="__NEXT_DATA__"')) {
            try {
                const jsonMatch = scriptContent.match(/({[\s\S]*})/);
                if (jsonMatch) {
                    const data = JSON.parse(jsonMatch[1]);
                    const products = data?.props?.pageProps?.products ||
                        data?.props?.initialState?.products ||
                        data?.query?.data?.products;
                    if (products && Array.isArray(products) && products.length > 0) {
                        console.log(`Found ${products.length} products via __NEXT_DATA__`);
                        return products;
                    }
                }
            } catch (e) {
                // Continue to next pattern
            }
        }
    }

    return [];
}

// Map raw product data to clean format
function mapToJumiaProduct(product: any, baseUrl: string): any {
    const prices = {
        discount: product.prices?.discount || "",
        oldPrice: product.prices?.oldPrice || "",
        price: product.prices?.price || product.prices?.rawPrice || "",
        rawPrice: product.prices?.rawPrice || "",
    };

    return {
        sku: product.sku || product.id || `sku-${Math.random().toString(36).substr(2, 9)}`,
        name: product.name || product.displayName || "Unknown Product",
        displayName: product.displayName || product.name || "Unknown Product",
        brand: product.brand || "",
        sellerId: product.sellerId || 0,
        categories: product.categories || [],
        prices: prices,
        rating: product.rating || { average: 0, totalRatings: 0 },
        image: product.image || "",
        url: product.url ? (product.url.startsWith('http') ? product.url : baseUrl + product.url) : baseUrl,
        oldPrice: prices.oldPrice,
        newPrice: prices.price,
        badges: product.badges || {},
        isBuyable: product.isBuyable !== undefined ? product.isBuyable : true,
    };
}

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { url, page = '1' } = req.query;

        if (!url || typeof url !== 'string') {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        console.log(`Fetching Jumia page: ${url}`);

        // Fetch directly from server (no CORS issues)
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
                'Cache-Control': 'max-age=0',
                'Connection': 'keep-alive',
                'Referer': 'https://www.jumia.com.ng/',
                'sec-ch-ua': '"Not A(Bread;7", "Chromium";"121", "Google Chrome";"121"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
            },
        });

        if (!response.ok) {
            console.error(`HTTP error: ${response.status}`);
            return res.status(response.status).json({
                error: `Failed to fetch from Jumia: ${response.status}`
            });
        }

        const html = await response.text();

        if (!html || html.length < 1000) {
            console.error('Response too short, likely blocked');
            return res.status(500).json({ error: 'Invalid response from Jumia' });
        }

        console.log('Successfully fetched HTML, extracting products...');
        const rawProducts = extractProducts(html);

        if (!rawProducts || rawProducts.length === 0) {
            console.warn('No products found in HTML');
            return res.status(200).json({ products: [], page: parseInt(page as string) });
        }

        const baseUrl = 'https://www.jumia.com.ng';
        const products = rawProducts.map(p => mapToJumiaProduct(p, baseUrl));

        console.log(`Successfully extracted ${products.length} products`);

        // Cache for 5 minutes
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

        return res.status(200).json({
            products,
            page: parseInt(page as string),
            total: products.length
        });

    } catch (error: any) {
        console.error('Error in API handler:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
