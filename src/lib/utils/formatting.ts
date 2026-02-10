import { format, formatDistanceToNow, parseISO, differenceInDays } from 'date-fns';

export function formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'MMM d, yyyy');
}

export function formatDateTime(date: string | Date): string {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'MMM d, yyyy h:mm a');
}

export function formatRelative(date: string | Date): string {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(d, { addSuffix: true });
}

export function daysUntil(date: string | Date): number {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return differenceInDays(d, new Date());
}

export function formatCurrency(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function formatNumber(num: number, decimals = 1): string {
    return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

export function formatEfficiency(value: number, unit: 'km' | 'miles' = 'km'): string {
    if (unit === 'km') {
        return `${formatNumber(value)} km/L`;
    }
    return `${formatNumber(value)} MPG`;
}

export function formatDistance(value: number, unit: 'km' | 'miles' = 'km'): string {
    return `${formatNumber(value, 0)} ${unit}`;
}

export function formatFuelAmount(value: number, unit: 'liters' | 'gallons' = 'liters'): string {
    return `${formatNumber(value, 2)} ${unit === 'liters' ? 'L' : 'gal'}`;
}
