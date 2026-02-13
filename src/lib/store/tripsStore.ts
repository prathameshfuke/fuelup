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
    deleteTrip: (id: string) => void;
    getTaxDeductibleTrips: () => Trip[];
    getTotalDistance: () => number;
}

const INITIAL_TRIPS: Trip[] = [
    {
        id: 't1',
        vehicleId: 'v1',
        date: '2024-02-13',
        startLocation: 'Home',
        endLocation: 'Office',
        distance: 25.4,
        purpose: 'commute',
        isTaxDeductible: true,
        notes: 'Morning traffic',
    },
    {
        id: 't2',
        vehicleId: 'v1',
        date: '2024-02-11',
        startLocation: 'Office',
        endLocation: 'Client Site',
        distance: 12.8,
        purpose: 'business',
        isTaxDeductible: true,
        notes: 'Meeting with potential lead',
    },
    {
        id: 't3',
        vehicleId: 'v2',
        date: '2024-02-10',
        startLocation: 'Home',
        endLocation: 'Mountain Cafe',
        distance: 85.0,
        purpose: 'personal',
        isTaxDeductible: false,
        notes: 'Weekend canyon run',
    },
];

export const useTripsStore = create<TripsStore>()(
    persist(
        (set, get) => ({
            trips: INITIAL_TRIPS,
            addTrip: (tripData) =>
                set((state) => ({
                    trips: [{ ...tripData, id: 't' + Date.now() }, ...state.trips],
                })),
            deleteTrip: (id) => set((state) => ({ trips: state.trips.filter((t) => t.id !== id) })),
            getTaxDeductibleTrips: () => get().trips.filter((t) => t.isTaxDeductible),
            getTotalDistance: () => get().trips.reduce((sum, t) => sum + t.distance, 0),
        }),
        { name: 'fuelup-trips' }
    )
);
