import { ConfirmAction } from '@/components/hotel/confirm-action';
import { PageHeader } from '@/components/hotel/page-header';
import { StatusBadge } from '@/components/hotel/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/hotel';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit3, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bookings', href: '/bookings' },
];

interface BookingRow {
    id: number;
    booking_reference: string;
    guest_name: string;
    guest_email: string | null;
    guest_phone: string | null;
    check_in: string;
    check_out: string;
    arrival_time: string | null;
    status: string;
    source: string;
    total_amount: number;
    nights: number;
    booked_by: string | null;
    items_summary: string;
}

interface BookingsIndexProps {
    bookings: BookingRow[];
    filters: {
        search?: string;
        status?: string;
    };
    statusOptions: Array<{ value: string; label: string }>;
    summary: {
        total: number;
        pending: number;
        confirmed: number;
        checked_in: number;
        checked_out: number;
    };
    canDelete: boolean;
}

export default function BookingsIndex({ bookings, filters, statusOptions, summary, canDelete }: BookingsIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'all');

    const applyFilters = () => {
        router.get(
            route('bookings.index'),
            {
                search: search || undefined,
                status: status === 'all' ? undefined : status,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bookings" />

            <div className="min-h-full space-y-6 bg-[radial-gradient(circle_at_top_left,_rgba(204,181,126,0.14),_transparent_28%),linear-gradient(180deg,_#f7f3ea_0%,_#f4f8f7_48%,_#ffffff_100%)] p-4 dark:bg-[radial-gradient(circle_at_top_left,_rgba(204,181,126,0.08),_transparent_28%),linear-gradient(180deg,_#102925_0%,_#0f2622_55%,_#0b1d1a_100%)] md:p-6">
                <PageHeader
                    eyebrow="Reservations"
                    title="Booking Desk"
                    description="Track confirmed stays, pending requests, and in-house guests with a front-office view designed for daily hotel operations."
                    action={{ href: route('bookings.create'), label: 'Add Reservation' }}
                />

                <div className="grid gap-4 md:grid-cols-4">
                    {[
                        { label: 'All Reservations', value: summary.total },
                        { label: 'Pending', value: summary.pending },
                        { label: 'Confirmed', value: summary.confirmed },
                        { label: 'Checked In', value: summary.checked_in },
                    ].map((item) => (
                        <Card key={item.label} className="rounded-[24px] border-0 bg-white shadow-[0_18px_40px_-28px_rgba(14,49,44,0.35)] dark:border dark:border-[#2a4f47] dark:bg-[#14312c]/95 dark:shadow-[0_18px_40px_-28px_rgba(0,0,0,0.8)]">
                            <CardContent className="space-y-2 p-5">
                                <p className="text-xs tracking-[0.2em] text-[#8a6a2f] uppercase dark:text-[#cfb67c]">{item.label}</p>
                                <p className="font-display text-3xl text-[#14312c] dark:text-[#f5eed9]">{item.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="rounded-[28px] border-white/80 bg-white/95 shadow-[0_20px_50px_-32px_rgba(14,49,44,0.45)] dark:border-[#294941] dark:bg-[#14312c]/95 dark:shadow-[0_20px_50px_-32px_rgba(0,0,0,0.8)]">
                    <CardContent className="space-y-6 p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                            <div className="relative flex-1">
                                <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search by guest, reference, email, or phone"
                                    className="h-12 rounded-full pl-11"
                                />
                            </div>
                            <div className="grid gap-3 sm:grid-cols-[220px_auto]">
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="h-12 rounded-full">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All statuses</SelectItem>
                                        {statusOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={applyFilters} className="h-12 rounded-full bg-[#14312c] text-white hover:bg-[#1b433c] dark:bg-[#cfb67c] dark:text-[#14312c] dark:hover:bg-[#dcc99a]">
                                    Apply Filters
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-[24px] border border-[#e4ece8] dark:border-[#2a4f47]">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-[#f8faf9] dark:bg-[#173a33]">
                                        <TableHead>Guest</TableHead>
                                        <TableHead>Stay</TableHead>
                                        <TableHead>Room Plan</TableHead>
                                        <TableHead>Source</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookings.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-muted-foreground py-16 text-center text-sm">
                                                No reservations matched the current filters.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        bookings.map((booking) => (
                                            <TableRow key={booking.id}>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <p className="font-medium text-[#14312c] dark:text-[#f5eed9]">{booking.guest_name}</p>
                                                        <p className="text-xs tracking-[0.2em] text-[#8a6a2f] uppercase dark:text-[#cfb67c]">
                                                            {booking.booking_reference}
                                                        </p>
                                                        <p className="text-muted-foreground text-sm">
                                                            {booking.guest_phone || booking.guest_email || 'Contact pending'}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    <p>
                                                        {booking.check_in} to {booking.check_out}
                                                    </p>
                                                    <p>{booking.nights} night stay</p>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">{booking.items_summary}</TableCell>
                                                <TableCell className="text-muted-foreground text-sm capitalize">
                                                    {booking.source.replace('_', ' ')}
                                                </TableCell>
                                                <TableCell className="font-medium text-[#14312c] dark:text-[#f5eed9]">{formatCurrency(booking.total_amount)}</TableCell>
                                                <TableCell>
                                                    <StatusBadge value={booking.status} />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" size="sm" asChild className="rounded-full">
                                                            <Link href={route('bookings.edit', booking.id)}>
                                                                <Edit3 className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                        {canDelete && (
                                                            <ConfirmAction
                                                                title="Archive reservation?"
                                                                description="The booking will be marked as cancelled and archived from the active reservation list."
                                                                actionLabel="Archive booking"
                                                                destructive={true}
                                                                onConfirm={() => router.delete(route('bookings.destroy', booking.id))}
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="rounded-full text-rose-600 hover:text-rose-700"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Archive
                                                                </Button>
                                                            </ConfirmAction>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
