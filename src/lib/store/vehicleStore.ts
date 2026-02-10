import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VehicleStore {
    activeVehicleId: string | null;
    setActiveVehicleId: (id: string | null) => void;
}

export const useVehicleStore = create<VehicleStore>()(
    persist(
        (set) => ({
            activeVehicleId: null,
            setActiveVehicleId: (id) => set({ activeVehicleId: id }),
        }),
        {
            name: 'fuelup-vehicle-store',
        }
    )
);
