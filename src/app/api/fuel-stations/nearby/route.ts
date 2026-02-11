import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { latitude, longitude, radius } = await request.json();

        // In a production app, you would call the mapbox search API here
        // const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        // const url = `https://api.mapbox.com/search/searchbox/v1/category/gas_station?access_token=${mapboxToken}&language=en&limit=10&proximity=${longitude},${latitude}`;

        // For now, let's return some mock data around the user's location
        // to ensure the UI works even without a valid backend setup for now.

        // Generate 5 mock stations around the user
        const stations = Array.from({ length: 5 }).map((_, i) => ({
            id: `station-${i}`,
            name: `Fuel Station ${i + 1}`,
            address: `${100 + i * 10} Main St`,
            latitude: latitude + (Math.random() - 0.5) * 0.02,
            longitude: longitude + (Math.random() - 0.5) * 0.02,
            brand: 'Generic',
            currentPrices: {
                regular: 3.50 + Math.random() * 0.5,
                premium: 4.00 + Math.random() * 0.5,
                diesel: 4.20 + Math.random() * 0.5,
            },
            distance: Math.random() * 5,
        }));

        return NextResponse.json({ stations });
    } catch (error) {
        console.error('Error fetching stations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stations' },
            { status: 500 }
        );
    }
}
