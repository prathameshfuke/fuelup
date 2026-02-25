import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MaintenanceItem {
    id: string;
    vehicleId: string;
    service: string;
    dueDate?: string;
    dueOdometer?: number;
    priority: 'high' | 'medium' | 'low';
    isCompleted: boolean;
    completedDate?: string;
    cost?: number;
    notes: string;
}

interface MaintenanceStore {
    items: MaintenanceItem[];
    addItem: (item: Omit<MaintenanceItem, 'id'>) => void;
    updateItem: (id: string, updates: Partial<Omit<MaintenanceItem, 'id'>>) => void;
    completeItem: (id: string, cost?: number) => void;
    deleteItem: (id: string) => void;
    getUpcoming: () => MaintenanceItem[];
    getCompleted: () => MaintenanceItem[];
    getUpcomingByVehicle: (vehicleId: string) => MaintenanceItem[];
    getCompletedByVehicle: (vehicleId: string) => MaintenanceItem[];
}

const INITIAL_ITEMS: MaintenanceItem[] = [];

export const useMaintenanceStore = create<MaintenanceStore>()(
    persist(
        (set, get) => ({
            items: INITIAL_ITEMS,
            addItem: (itemData) =>
                set((state) => ({
                    items: [{ ...itemData, id: 'm' + Date.now() }, ...state.items],
                })),
            updateItem: (id, updates) =>
                set((state) => ({
                    items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
                })),
            completeItem: (id, cost) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id
                            ? { ...item, isCompleted: true, completedDate: new Date().toISOString().split('T')[0], cost }
                            : item
                    ),
                })),
            deleteItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
            getUpcoming: () => get().items.filter((i) => !i.isCompleted),
            getCompleted: () => get().items.filter((i) => i.isCompleted),
            getUpcomingByVehicle: (vehicleId) => get().items.filter((i) => !i.isCompleted && i.vehicleId === vehicleId),
            getCompletedByVehicle: (vehicleId) => get().items.filter((i) => i.isCompleted && i.vehicleId === vehicleId),
        }),
        {
            name: 'fuelup-maintenance-v2' // Bumped version to force realistic mock data load 
        }
    )
);
