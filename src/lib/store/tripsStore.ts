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
    getTripsByVehicle: (vehicleId: string) => Trip[];
    getTotalDistanceByVehicle: (vehicleId: string) => number;
}

const INITIAL_TRIPS: Trip[] = [
    {
        id: 't1',
        vehicleId: 'v1',
        date: '2024-02-21',
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
        date: '2024-02-20',
        startLocation: 'Office',
        endLocation: 'Client Site',
        distance: 18.2,
        purpose: 'business',
        isTaxDeductible: true,
        notes: 'Quarterly review meeting',
    },
    {
        id: 't3',
        vehicleId: 'v1',
        date: '2024-02-18',
        startLocation: 'Home',
        endLocation: 'Hardware Store',
        distance: 5.8,
        purpose: 'personal',
        isTaxDeductible: false,
        notes: '',
    },
    {
        id: 't4',
        vehicleId: 'v1',
        date: '2024-02-15',
        startLocation: 'Home',
        endLocation: 'Medical Center',
        distance: 12.1,
        purpose: 'medical',
        isTaxDeductible: true,
        notes: 'Annual checkup',
    },
    {
        id: 't5',
        vehicleId: 'v2',
        date: '2024-02-18',
        startLocation: 'Home',
        endLocation: 'Mountain Pass',
        distance: 120.5,
        purpose: 'personal',
        isTaxDeductible: false,
        notes: 'Weekend canyon sweep',
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
            getTripsByVehicle: (vehicleId) => get().trips.filter((t) => t.vehicleId === vehicleId),
            getTotalDistanceByVehicle: (vehicleId) =>
                get().trips.filter((t) => t.vehicleId === vehicleId).reduce((sum, t) => sum + t.distance, 0),
        }),
        {
            name: 'fuelup-trips-v2' // Bumped version to force realistic mock data load
        }
    )
);
