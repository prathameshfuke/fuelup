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
    { id: 'm1', vehicleId: 'v1', service: 'Oil Change', dueOdometer: 25700, priority: 'high', isCompleted: false, notes: 'Use synthetic 5W-30' },
    { id: 'm2', vehicleId: 'v1', service: 'Tire Rotation', dueDate: '2026-02-22', priority: 'medium', isCompleted: false, notes: '' },
    { id: 'm3', vehicleId: 'v1', service: 'Air Filter Replacement', dueOdometer: 27200, priority: 'low', isCompleted: false, notes: '' },
    { id: 'm4', vehicleId: 'v1', service: 'Brake Pads Inspection', dueDate: '2026-03-15', priority: 'medium', isCompleted: false, notes: 'Check front and rear' },
    { id: 'm5', vehicleId: 'v1', service: 'Battery Check', dueDate: '2026-04-01', priority: 'low', isCompleted: false, notes: '' },
    { id: 'm6', vehicleId: 'v1', service: 'Spark Plugs', completedDate: '2026-01-05', priority: 'high', isCompleted: true, cost: 85, notes: 'Replaced all 4' },
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
