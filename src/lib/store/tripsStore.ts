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
    { id: 't1', vehicleId: 'v1', date: '2026-02-10', startLocation: 'Home', endLocation: 'Downtown Office', distance: 24.5, purpose: 'commute', isTaxDeductible: false, notes: 'Daily commute' },
    { id: 't2', vehicleId: 'v1', date: '2026-02-08', startLocation: 'Office', endLocation: 'Client HQ', distance: 85.2, purpose: 'business', isTaxDeductible: true, notes: 'Client meeting' },
    { id: 't3', vehicleId: 'v1', date: '2026-02-05', startLocation: 'Home', endLocation: 'City Hospital', distance: 32, purpose: 'medical', isTaxDeductible: true, notes: 'Annual checkup' },
    { id: 't4', vehicleId: 'v1', date: '2026-02-02', startLocation: 'Home', endLocation: 'Beach Resort', distance: 180.5, purpose: 'personal', isTaxDeductible: false, notes: 'Weekend getaway' },
    { id: 't5', vehicleId: 'v1', date: '2026-01-28', startLocation: 'Office', endLocation: 'Tech Conference', distance: 120.3, purpose: 'business', isTaxDeductible: true, notes: 'Industry conference' },
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
