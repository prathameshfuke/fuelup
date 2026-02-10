import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CurrencyCode = 'usd' | 'eur' | 'gbp' | 'inr' | 'jpy' | 'cad' | 'aud';
export type DistanceUnit = 'km' | 'mi';
export type VolumeUnit = 'liters' | 'gallons_us' | 'gallons_uk';

export const CURRENCY_CONFIG: Record<CurrencyCode, { symbol: string; name: string; locale: string }> = {
    usd: { symbol: '$', name: 'US Dollar', locale: 'en-US' },
    eur: { symbol: '€', name: 'Euro', locale: 'de-DE' },
    gbp: { symbol: '£', name: 'British Pound', locale: 'en-GB' },
    inr: { symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
    jpy: { symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
    cad: { symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
    aud: { symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
};

interface SettingsStore {
    currency: CurrencyCode;
    distanceUnit: DistanceUnit;
    volumeUnit: VolumeUnit;
    darkMode: boolean;
    notifications: {
        maintenance: boolean;
        priceDrops: boolean;
        weeklySummary: boolean;
        push: boolean;
    };
    setCurrency: (currency: CurrencyCode) => void;
    setDistanceUnit: (unit: DistanceUnit) => void;
    setVolumeUnit: (unit: VolumeUnit) => void;
    setDarkMode: (dark: boolean) => void;
    setNotification: (key: keyof SettingsStore['notifications'], value: boolean) => void;
    formatCurrency: (amount: number) => string;
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set, get) => ({
            currency: 'usd',
            distanceUnit: 'km',
            volumeUnit: 'liters',
            darkMode: true,
            notifications: {
                maintenance: true,
                priceDrops: true,
                weeklySummary: false,
                push: true,
            },
            setCurrency: (currency) => set({ currency }),
            setDistanceUnit: (distanceUnit) => set({ distanceUnit }),
            setVolumeUnit: (volumeUnit) => set({ volumeUnit }),
            setDarkMode: (darkMode) => set({ darkMode }),
            setNotification: (key, value) =>
                set((state) => ({
                    notifications: { ...state.notifications, [key]: value },
                })),
            formatCurrency: (amount: number) => {
                const { currency } = get();
                const config = CURRENCY_CONFIG[currency];
                return new Intl.NumberFormat(config.locale, {
                    style: 'currency',
                    currency: currency.toUpperCase(),
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(amount);
            },
        }),
        {
            name: 'fuelup-settings',
        }
    )
);
