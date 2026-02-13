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

const INITIAL_ITEMS: MaintenanceItem[] = [
    {
        id: 'm1',
        vehicleId: 'v1',
        service: 'Oil Change',
        dueDate: '2024-05-01',
        dueOdometer: 20000,
        priority: 'medium',
        isCompleted: false,
        notes: 'Standard synthetic oil check',
    },
    {
        id: 'm2',
        vehicleId: 'v2',
        service: 'Chain Lube',
        dueDate: '2024-02-20',
        dueOdometer: 6000,
        priority: 'low',
        isCompleted: false,
        notes: 'Clean and lube chain',
    },
    {
        id: 'm3',
        vehicleId: 'v1',
        service: 'Tire Rotation',
        isCompleted: true,
        completedDate: '2023-12-15',
        cost: 45.00,
        priority: 'low',
        notes: 'Rotated at dealership',
    } as MaintenanceItem,
];

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
