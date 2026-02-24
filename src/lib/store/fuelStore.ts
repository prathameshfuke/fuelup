import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FuelLog {
    id: string;
    vehicleId: string;
    date: string;
    odometer: number;
    fuelAmount: number;
    totalCost: number;
    pricePerUnit: number;
    stationName: string;
    isFullTank: boolean;
    notes: string;
    efficiency?: number;
}

interface FuelStore {
    logs: FuelLog[];
    addLog: (log: Omit<FuelLog, 'id' | 'pricePerUnit' | 'efficiency'>) => void;
    updateLog: (id: string, updates: Partial<Omit<FuelLog, 'id' | 'pricePerUnit' | 'efficiency'>>) => void;
    deleteLog: (id: string) => void;
    getLogsByVehicle: (vehicleId: string) => FuelLog[];
    getTotalSpent: () => number;
    getTotalFuel: () => number;
    getAverageEfficiency: () => number;
    getTotalSpentByVehicle: (vehicleId: string) => number;
    getTotalFuelByVehicle: (vehicleId: string) => number;
    getAverageEfficiencyByVehicle: (vehicleId: string) => number;
}

const INITIAL_LOGS: FuelLog[] = [
    {
        id: 'f1',
        vehicleId: 'v1',
        date: '2026-02-22',
        odometer: 15682,
        fuelAmount: 43.2,
        totalCost: 66.52,
        pricePerUnit: 1.54,
        stationName: 'Shell Station',
        isFullTank: true,
        notes: 'Commute and city driving',
        efficiency: 14.2,
    },
    {
        id: 'f2',
        vehicleId: 'v1',
        date: '2026-02-08',
        odometer: 15068,
        fuelAmount: 41.5,
        totalCost: 61.42,
        pricePerUnit: 1.48,
        stationName: 'Chevron',
        isFullTank: true,
        notes: '',
        efficiency: 14.8,
    },
    {
        id: 'f3',
        vehicleId: 'v1',
        date: '2026-01-26',
        odometer: 14454,
        fuelAmount: 45.1,
        totalCost: 68.10,
        pricePerUnit: 1.51,
        stationName: 'BP Connect',
        isFullTank: true,
        notes: 'Winter tires efficiency drop',
        efficiency: 13.6,
    },
    {
        id: 'f4',
        vehicleId: 'v1',
        date: '2026-01-12',
        odometer: 13840,
        fuelAmount: 42.8,
        totalCost: 62.91,
        pricePerUnit: 1.47,
        stationName: 'Costco Gas',
        isFullTank: true,
        notes: '',
        efficiency: 14.3,
    },
    {
        id: 'f5',
        vehicleId: 'v1',
        date: '2025-12-28',
        odometer: 13228,
        fuelAmount: 44.0,
        totalCost: 64.68,
        pricePerUnit: 1.47,
        stationName: 'Shell Station',
        isFullTank: true,
        notes: 'Holiday travel',
        efficiency: 13.9,
    },
    {
        id: 'f6',
        vehicleId: 'v2',
        date: '2026-02-18',
        odometer: 5850,
        fuelAmount: 12.5,
        totalCost: 20.62,
        pricePerUnit: 1.65,
        stationName: 'Texaco',
        isFullTank: true,
        notes: 'Sunday canyon run',
        efficiency: 20.0,
    },
    {
        id: 'f7',
        vehicleId: 'v2',
        date: '2026-01-20',
        odometer: 5600,
        fuelAmount: 11.2,
        totalCost: 18.50,
        pricePerUnit: 1.65,
        stationName: 'Texaco',
        isFullTank: true,
        notes: 'Track day prep',
        efficiency: 22.5,
    },
];

export const useFuelStore = create<FuelStore>()(
    persist(
        (set, get) => ({
            logs: INITIAL_LOGS,
            addLog: (logData) => {
                const pricePerUnit = logData.totalCost / logData.fuelAmount;
                const logs = get().logs;
                const sameVehicleLogs = logs
                    .filter((l) => l.vehicleId === logData.vehicleId)
                    .sort((a, b) => b.odometer - a.odometer);
                const previousLog = sameVehicleLogs[0];
                const efficiency = previousLog
                    ? (logData.odometer - previousLog.odometer) / logData.fuelAmount
                    : undefined;

                const newLog: FuelLog = {
                    ...logData,
                    id: 'f' + Date.now(),
                    pricePerUnit: Math.round(pricePerUnit * 1000) / 1000,
                    efficiency: efficiency ? Math.round(efficiency * 10) / 10 : undefined,
                };
                set({ logs: [newLog, ...logs] });
            },
            updateLog: (id, updates) => {
                const logs = get().logs;
                const updatedLogs = logs.map((l) => {
                    if (l.id !== id) return l;
                    const merged = { ...l, ...updates };
                    const pricePerUnit = merged.fuelAmount > 0 ? merged.totalCost / merged.fuelAmount : l.pricePerUnit;
                    // Recalculate efficiency: find previous log for this vehicle by odometer
                    const vehicleLogs = logs
                        .filter((x) => x.vehicleId === merged.vehicleId && x.id !== id)
                        .sort((a, b) => b.odometer - a.odometer);
                    const prevLog = vehicleLogs.find((x) => x.odometer < merged.odometer);
                    const efficiency = prevLog
                        ? (merged.odometer - prevLog.odometer) / merged.fuelAmount
                        : undefined;
                    return {
                        ...merged,
                        pricePerUnit: Math.round(pricePerUnit * 1000) / 1000,
                        efficiency: efficiency ? Math.round(efficiency * 10) / 10 : merged.efficiency,
                    };
                });
                set({ logs: updatedLogs });
            },
            deleteLog: (id) => set((state) => ({ logs: state.logs.filter((l) => l.id !== id) })),
            getLogsByVehicle: (vehicleId) => get().logs.filter((l) => l.vehicleId === vehicleId),
            getTotalSpent: () => get().logs.reduce((sum, l) => sum + l.totalCost, 0),
            getTotalFuel: () => get().logs.reduce((sum, l) => sum + l.fuelAmount, 0),
            getAverageEfficiency: () => {
                const logsWithEff = get().logs.filter((l) => l.efficiency);
                if (logsWithEff.length === 0) return 0;
                return logsWithEff.reduce((sum, l) => sum + (l.efficiency || 0), 0) / logsWithEff.length;
            },
            getTotalSpentByVehicle: (vehicleId) =>
                get().logs.filter((l) => l.vehicleId === vehicleId).reduce((sum, l) => sum + l.totalCost, 0),
            getTotalFuelByVehicle: (vehicleId) =>
                get().logs.filter((l) => l.vehicleId === vehicleId).reduce((sum, l) => sum + l.fuelAmount, 0),
            getAverageEfficiencyByVehicle: (vehicleId) => {
                const vehicleLogs = get().logs.filter((l) => l.vehicleId === vehicleId && l.efficiency);
                if (vehicleLogs.length === 0) return 0;
                return vehicleLogs.reduce((sum, l) => sum + (l.efficiency || 0), 0) / vehicleLogs.length;
            },
        }),
        {
            name: 'fuelup-fuel-logs-v3', // Bumped version to force realistic mock data load
        }
    )
);
