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
        service: 'Full Synthetic Oil Change',
        dueDate: '2024-08-15',
        dueOdometer: 22000,
        priority: 'medium',
        isCompleted: false,
        notes: 'Replace filter and use 0W-20',
    },
    {
        id: 'm4',
        vehicleId: 'v1',
        service: 'Brake Pad Replacement',
        dueDate: '2024-05-10',
        dueOdometer: 18500,
        priority: 'high',
        isCompleted: false,
        notes: 'Front brake pads are wearing thin',
    },
    {
        id: 'm2',
        vehicleId: 'v2',
        service: 'Chain Clean & Lube',
        dueDate: '2024-03-01',
        dueOdometer: 6200,
        priority: 'medium',
        isCompleted: false,
        notes: 'Use Motul chain lube',
    },
    {
        id: 'm3',
        vehicleId: 'v1',
        service: 'Tire Rotation',
        isCompleted: true,
        completedDate: '2023-12-15',
        cost: 45.00,
        priority: 'low',
        notes: 'Rotated at dealership, tread depth 6/32',
    } as MaintenanceItem,
    {
        id: 'm5',
        vehicleId: 'v1',
        service: 'Cabin Air Filter',
        isCompleted: true,
        completedDate: '2023-10-05',
        cost: 25.50,
        priority: 'low',
        notes: 'DIY replacement, bought from Amazon',
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
        {
            name: 'fuelup-maintenance-v2' // Bumped version to force realistic mock data load 
        }
    )
);
