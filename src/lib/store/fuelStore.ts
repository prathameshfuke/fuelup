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

const INITIAL_LOGS: FuelLog[] = [];

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
