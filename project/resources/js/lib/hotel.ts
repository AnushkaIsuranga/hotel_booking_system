export const currencyFormatter = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
});

export function formatCurrency(value: number) {
    return currencyFormatter.format(value || 0);
}

export function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function bookingStatusClass(status: string) {
    switch (status) {
        case 'checked_in':
            return 'border-emerald-200 bg-emerald-50 text-emerald-700';
        case 'confirmed':
            return 'border-sky-200 bg-sky-50 text-sky-700';
        case 'pending':
            return 'border-amber-200 bg-amber-50 text-amber-700';
        case 'checked_out':
            return 'border-stone-200 bg-stone-100 text-stone-700';
        case 'cancelled':
            return 'border-rose-200 bg-rose-50 text-rose-700';
        default:
            return 'border-border bg-secondary text-secondary-foreground';
    }
}

export function roomStatusClass(status: string) {
    switch (status) {
        case 'vacant_clean':
            return 'border-emerald-200 bg-emerald-50 text-emerald-700';
        case 'vacant_dirty':
            return 'border-amber-200 bg-amber-50 text-amber-700';
        case 'occupied':
            return 'border-sky-200 bg-sky-50 text-sky-700';
        case 'maintenance':
            return 'border-orange-200 bg-orange-50 text-orange-700';
        case 'out_of_service':
            return 'border-rose-200 bg-rose-50 text-rose-700';
        default:
            return 'border-border bg-secondary text-secondary-foreground';
    }
}

export function roleClass(role: string) {
    return role === 'admin' ? 'border-[#cfb67c]/50 bg-[#f6efe0] text-[#8a6a2f]' : 'border-[#abc9c1]/50 bg-[#edf7f4] text-[#246b5a]';
}
