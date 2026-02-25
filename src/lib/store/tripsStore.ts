import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Trip {
    id: string;
    vehicleId: string;
    date: string;
    startLocation: string;
    endLocation: string;
    distance: number;
    purpose: 'commute' | 'business' | 'personal' | 'medical';
    isTaxDeductible: boolean;
    notes: string;
}

interface TripsStore {
    trips: Trip[];
    addTrip: (trip: Omit<Trip, 'id'>) => void;
    updateTrip: (id: string, updates: Partial<Omit<Trip, 'id'>>) => void;
    deleteTrip: (id: string) => void;
    getTaxDeductibleTrips: () => Trip[];
    getTotalDistance: () => number;
    getTripsByVehicle: (vehicleId: string) => Trip[];
    getTotalDistanceByVehicle: (vehicleId: string) => number;
}

const INITIAL_TRIPS: Trip[] = [];

export const useTripsStore = create<TripsStore>()(
    persist(
        (set, get) => ({
            trips: INITIAL_TRIPS,
            addTrip: (tripData) =>
                set((state) => ({
                    trips: [{ ...tripData, id: 't' + Date.now() }, ...state.trips],
                })),
            updateTrip: (id, updates) =>
                set((state) => ({
                    trips: state.trips.map((t) => (t.id === id ? { ...t, ...updates } : t)),
                })),
            deleteTrip: (id) => set((state) => ({ trips: state.trips.filter((t) => t.id !== id) })),
            getTaxDeductibleTrips: () => get().trips.filter((t) => t.isTaxDeductible),
            getTotalDistance: () => get().trips.reduce((sum, t) => sum + t.distance, 0),
            getTripsByVehicle: (vehicleId) => get().trips.filter((t) => t.vehicleId === vehicleId),
            getTotalDistanceByVehicle: (vehicleId) =>
                get().trips.filter((t) => t.vehicleId === vehicleId).reduce((sum, t) => sum + t.distance, 0),
        }),
        {
            name: 'fuelup-trips-v2' // Bumped version to force realistic mock data load
        }
    )
);
