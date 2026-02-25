import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Vehicle {
    id: string;
    name: string;
    type: 'car' | 'motorcycle' | 'scooter' | 'truck' | 'suv' | 'van';
    make: string;
    model: string;
    year: number;
    fuelType: string;
    color: string;
    licensePlate: string;
    isActive: boolean;
}

interface VehiclesStore {
    vehicles: Vehicle[];
    addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
    updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
    deleteVehicle: (id: string) => void;
    getVehicle: (id: string) => Vehicle | undefined;
}

const INITIAL_VEHICLES: Vehicle[] = [];

export const useVehiclesStore = create<VehiclesStore>()(
    persist(
        (set, get) => ({
            vehicles: INITIAL_VEHICLES,
            addVehicle: (vehicleData) =>
                set((state) => ({
                    vehicles: [...state.vehicles, { ...vehicleData, id: 'v' + Date.now() }],
                })),
            updateVehicle: (id, updates) =>
                set((state) => ({
                    vehicles: state.vehicles.map((v) => (v.id === id ? { ...v, ...updates } : v)),
                })),
            deleteVehicle: (id) =>
                set((state) => ({ vehicles: state.vehicles.filter((v) => v.id !== id) })),
            getVehicle: (id) => get().vehicles.find((v) => v.id === id),
        }),
        { name: 'fuelup-vehicles' }
    )
);
