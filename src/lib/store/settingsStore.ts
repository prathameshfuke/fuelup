import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CurrencyCode = 'usd' | 'eur' | 'gbp' | 'inr' | 'cad' | 'aud' | 'aed' | 'sar' | 'cny' | 'jpy';
export type DistanceUnit = 'km' | 'mi';
export type VolumeUnit = 'liters' | 'gallons_us' | 'gallons_uk';
export type EfficiencyUnit = 'km/l' | 'l/100km' | 'mpg';
export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY';

export const CURRENCY_CONFIG: Record<CurrencyCode, { symbol: string; name: string; locale: string }> = {
    inr: { symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
    usd: { symbol: '$', name: 'US Dollar', locale: 'en-US' },
    eur: { symbol: '€', name: 'Euro', locale: 'de-DE' },
    gbp: { symbol: '£', name: 'British Pound', locale: 'en-GB' },
    cad: { symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
    aud: { symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
    aed: { symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE' },
    sar: { symbol: '﷼', name: 'Saudi Riyal', locale: 'ar-SA' },
    cny: { symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
    jpy: { symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
};

interface SettingsStore {
    currency: CurrencyCode;
    distanceUnit: DistanceUnit;
    volumeUnit: VolumeUnit;
    efficiencyUnit: EfficiencyUnit;
    dateFormat: DateFormat;
    autoDetectLocation: boolean;
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
    setEfficiencyUnit: (unit: EfficiencyUnit) => void;
    setDateFormat: (format: DateFormat) => void;
    setAutoDetectLocation: (autoDetect: boolean) => void;
    setDarkMode: (dark: boolean) => void;
    setNotification: (key: keyof SettingsStore['notifications'], value: boolean) => void;
    formatCurrency: (amount: number) => string;
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set, get) => ({
            currency: 'inr', // Default to INR
            distanceUnit: 'km',
            volumeUnit: 'liters',
            efficiencyUnit: 'km/l',
            dateFormat: 'DD/MM/YYYY',
            autoDetectLocation: true,
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
            setEfficiencyUnit: (efficiencyUnit) => set({ efficiencyUnit }),
            setDateFormat: (dateFormat) => set({ dateFormat }),
            setAutoDetectLocation: (autoDetectLocation) => set({ autoDetectLocation }),
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
