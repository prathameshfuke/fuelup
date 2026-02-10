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
    deleteLog: (id: string) => void;
    getLogsByVehicle: (vehicleId: string) => FuelLog[];
    getTotalSpent: () => number;
    getTotalFuel: () => number;
    getAverageEfficiency: () => number;
}

const INITIAL_LOGS: FuelLog[] = [
    {
        id: 'f1', vehicleId: 'v1', date: '2026-02-10', odometer: 25200,
        fuelAmount: 35.2, totalCost: 52.80, pricePerUnit: 1.50,
        stationName: 'Shell Express', isFullTank: true, notes: '', efficiency: 14.8,
    },
    {
        id: 'f2', vehicleId: 'v1', date: '2026-01-28', odometer: 24680,
        fuelAmount: 42.1, totalCost: 63.15, pricePerUnit: 1.50,
        stationName: 'BP Highway', isFullTank: true, notes: '', efficiency: 15.2,
    },
    {
        id: 'f3', vehicleId: 'v1', date: '2026-01-20', odometer: 24040,
        fuelAmount: 38.5, totalCost: 57.75, pricePerUnit: 1.50,
        stationName: 'Chevron Downtown', isFullTank: true, notes: '', efficiency: 14.5,
    },
    {
        id: 'f4', vehicleId: 'v1', date: '2026-01-12', odometer: 23480,
        fuelAmount: 40.0, totalCost: 60.00, pricePerUnit: 1.50,
        stationName: 'Shell Express', isFullTank: true, notes: '', efficiency: 13.9,
    },
    {
        id: 'f5', vehicleId: 'v1', date: '2026-01-03', odometer: 22920,
        fuelAmount: 44.2, totalCost: 59.67, pricePerUnit: 1.35,
        stationName: 'Costco Gas', isFullTank: true, notes: '', efficiency: 14.1,
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
            deleteLog: (id) => set((state) => ({ logs: state.logs.filter((l) => l.id !== id) })),
            getLogsByVehicle: (vehicleId) => get().logs.filter((l) => l.vehicleId === vehicleId),
            getTotalSpent: () => get().logs.reduce((sum, l) => sum + l.totalCost, 0),
            getTotalFuel: () => get().logs.reduce((sum, l) => sum + l.fuelAmount, 0),
            getAverageEfficiency: () => {
                const logsWithEff = get().logs.filter((l) => l.efficiency);
                if (logsWithEff.length === 0) return 0;
                return logsWithEff.reduce((sum, l) => sum + (l.efficiency || 0), 0) / logsWithEff.length;
            },
        }),
        { name: 'fuelup-fuel-logs' }
    )
);
