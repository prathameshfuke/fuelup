export function calculateFuelEfficiency(
    distance: number,
    fuelAmount: number
): number {
    if (fuelAmount <= 0) return 0;
    return distance / fuelAmount;
}

export function calculateCostPerDistance(
    totalCost: number,
    distance: number
): number {
    if (distance <= 0) return 0;
    return totalCost / distance;
}

export function calculateTotalCost(
    pricePerUnit: number,
    fuelAmount: number
): number {
    return pricePerUnit * fuelAmount;
}

export function calculatePricePerUnit(
    totalCost: number,
    fuelAmount: number
): number {
    if (fuelAmount <= 0) return 0;
    return totalCost / fuelAmount;
}

export function convertKmToMiles(km: number): number {
    return km * 0.621371;
}

export function convertMilesToKm(miles: number): number {
    return miles * 1.60934;
}

export function convertLitersToGallons(liters: number): number {
    return liters * 0.264172;
}

export function convertGallonsToLiters(gallons: number): number {
    return gallons * 3.78541;
}

export function kmPerLiterToMpg(kmPerLiter: number): number {
    return kmPerLiter * 2.35215;
}

export function mpgToKmPerLiter(mpg: number): number {
    return mpg / 2.35215;
}

export function calculateReimbursement(
    distance: number,
    rate: number
): number {
    return distance * rate;
}

// Calculate Haversine distance between two lat/lng points
export function calculateHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
