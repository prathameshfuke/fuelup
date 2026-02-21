import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const fuelType = (searchParams.get('type') || 'petrol').toLowerCase();

    // Format city appropriately for BankBazaar URLs (e.g., 'new-delhi', 'mumbai', 'bangalore')
    let city = (searchParams.get('city') || 'mumbai').toLowerCase().replace(/\s+/g, '-');
    if (city === 'delhi') city = 'new-delhi'; // BankBazaar usually uses new-delhi

    try {
        const url = `https://www.bankbazaar.com/fuel/${fuelType}-price-${city}.html`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Cache-Control': 'no-cache',
            },
            next: { revalidate: 3600 } // Next.js fetch caching
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch from source: ${response.status}`);
        }

        const html = await response.text();

        // Strict real-world extraction using Regex on the parsed HTML
        let price = '';

        // BankBazaar usually formats prices like ₹ 103.44 or &#8377; 103.44
        const regexMatch = html.match(/&#8377;\s*<!--\s*-->\s*([0-9]{2,3}\.[0-9]{2})/i) || html.match(/₹\s*([0-9]{2,3}\.[0-9]{2})/i);

        if (regexMatch && regexMatch[1]) {
            price = regexMatch[1];
        }

        if (!price) {
            throw new Error(`Data extraction failed. Could not find price in HTML.`);
        }

        // Return only the exact matched live data
        return NextResponse.json({
            city: city.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase()),
            fuelType: fuelType.charAt(0).toUpperCase() + fuelType.slice(1),
            price: parseFloat(price),
            currency: 'INR',
            unit: 'Litre',
            lastUpdated: new Date().toISOString(),
            source: 'BankBazaar'
        });

    } catch (error) {
        // STRICT RULE: User specifically requested NO HARDCODED FALLBACKS.
        // If scraping fails, we must throw an error rather than faking data.
        console.error("[LIVE_PRICE_ERROR] Failed to fetch real-world fuel prices:", error);

        return NextResponse.json(
            { error: 'Failed to fetch live fuel price. Source is currently unavailable.' },
            { status: 503 } // 503 Service Unavailable
        );
    }
}
