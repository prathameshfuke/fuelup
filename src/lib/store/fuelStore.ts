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
        id: 'f1',
        vehicleId: 'v1',
        date: '2024-02-10',
        odometer: 15250,
        fuelAmount: 42.5,
        totalCost: 65.45,
        pricePerUnit: 1.54,
        stationName: 'Shell Station',
        isFullTank: true,
        notes: 'Regular commute fill-up',
        efficiency: 14.2,
    },
    {
        id: 'f2',
        vehicleId: 'v1',
        date: '2024-01-25',
        odometer: 14800,
        fuelAmount: 40.0,
        totalCost: 60.00,
        pricePerUnit: 1.50,
        stationName: 'BP Connect',
        isFullTank: true,
        notes: '',
        efficiency: 13.8,
    },
    {
        id: 'f3',
        vehicleId: 'v2',
        date: '2024-02-12',
        odometer: 5600,
        fuelAmount: 11.2,
        totalCost: 18.50,
        pricePerUnit: 1.65,
        stationName: 'Texaco',
        isFullTank: true,
        notes: 'Fun weekend ride',
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
