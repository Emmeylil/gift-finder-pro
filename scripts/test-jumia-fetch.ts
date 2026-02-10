import fetch from 'node-fetch';

async function testJumiaFetch() {
    const url = 'https://www.jumia.com.ng/smartphones/';
    console.log(`Testing fetch from: ${url}`);

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
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

        console.log(`Status: ${response.status} ${response.statusText}`);

        if (response.ok) {
            const html = await response.text();
            console.log(`Success! Fetched ${html.length} characters.`);
            if (html.length < 1000) {
                console.warn('Warning: Response body is suspiciously small.');
            } else {
                console.log('Sample content found. Parsing would likely succeed.');
            }
        } else {
            console.error(`Failed with status ${response.status}`);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testJumiaFetch();
