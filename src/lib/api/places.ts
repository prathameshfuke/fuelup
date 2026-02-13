export interface FuelStation {
    id: number;
    lat: number;
    lon: number;
    name?: string;
    brand?: string;
    address?: string;
    distance?: number; // Distance in km from user
}

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

interface OverpassElement {
    type: 'node' | 'way';
    id: number;
    lat?: number;
    lon?: number;
    tags?: {
        name?: string;
        brand?: string;
        'addr:street'?: string;
        'addr:housenumber'?: string;
        [key: string]: string | undefined;
    };
}

interface OverpassResponse {
    elements: OverpassElement[];
}

export async function fetchFuelStations(lat: number, lon: number, radiusKm: number = 5): Promise<FuelStation[]> {
    const radiusMeters = radiusKm * 1000;
    // Overpass QL query: find nodes with amenity=fuel within radius
    const query = `
        [out:json][timeout:25];
        (
          node["amenity"="fuel"](around:${radiusMeters},${lat},${lon});
          way["amenity"="fuel"](around:${radiusMeters},${lat},${lon});
        );
        out body;
        >;
        out skel qt;
    `;

    try {
        const response = await fetch(OVERPASS_API_URL, {
            method: 'POST',
            body: query,
            // headers: { 'Content-Type': 'application/x-www-form-urlencoded' } // Overpass accepts raw body usually
        });

        if (!response.ok) {
            throw new Error(`Overpass API error: ${response.statusText}`);
        }

        const data = (await response.json()) as OverpassResponse;

        if (!data.elements) return [];

        // Basic parsing - for Ways we'd need to calculate center, but for now let's focus on Nodes or simplified Way handling
        // A robust implementation would calculate centroids for ways. 
        // For simplicity in this demo, we'll map nodes directly and filter ways without center logic if complex.
        // Actually, 'out center;' in query can give center of ways directly. Let's update query slightly if we want center.
        // But for 'out body', we get nodes. 

        const stations: FuelStation[] = data.elements.map((element: OverpassElement) => {
            const tags = element.tags || {};
            // Calculate distance (simple Haversine or similar could be done here, or let the map handle it)
            return {
                id: element.id,
                lat: element.lat || 0, // Note: Ways might not have lat/lon in 'out body' unless using 'out center'
                lon: element.lon || 0,
                name: tags.name || tags.brand || 'Unknown Station',
                brand: tags.brand,
                address: tags['addr:street'] ? `${tags['addr:street']} ${tags['addr:housenumber'] || ''}` : undefined,
                distance: calculateDistance(lat, lon, element.lat || 0, element.lon || 0)
            };
        }).filter((s: FuelStation) => s.lat !== 0 && s.lon !== 0); // Filter out elements without coordinates (like ways if not using center)

        return stations.sort((a, b) => (a.distance || 0) - (b.distance || 0));

    } catch (error) {
        console.error("Failed to fetch fuel stations:", error);
        return [];
    }
}

// Simple Haversine formula for distance in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}
