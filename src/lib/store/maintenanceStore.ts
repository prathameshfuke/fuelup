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
    completeItem: (id: string, cost?: number) => void;
    deleteItem: (id: string) => void;
    getUpcoming: () => MaintenanceItem[];
    getCompleted: () => MaintenanceItem[];
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
        }),
        { name: 'fuelup-maintenance' }
    )
);
