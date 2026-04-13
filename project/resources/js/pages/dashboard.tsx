import { MetricCard } from '@/components/hotel/metric-card';
import { PageHeader } from '@/components/hotel/page-header';
import { StatusBadge } from '@/components/hotel/status-badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/hotel';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { BedDouble, CalendarDays, DoorOpen, Sparkles, Wallet } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    summary: {
        occupancy_rate: number;
        arrivals_today: number;
        departures_today: number;
        active_stays: number;
        monthly_revenue: number;
        total_rooms: number;
    };
    room_statuses: Record<string, number>;
    upcoming_arrivals: Array<{
        id: number;
        booking_reference: string;
        guest_name: string;
        check_in: string;
        status: string;
        arrival_time: string | null;
        room_summary: string;
    }>;
    recent_bookings: Array<{
        id: number;
        booking_reference: string;
        guest_name: string;
        status: string;
        source: string;
        check_in: string;
        check_out: string;
        total_amount: number;
        booked_by: string | null;
    }>;
    room_type_snapshot: Array<{
        id: number;
        name: string;
        code: string;
        base_rate: number;
        rooms_count: number;
        reserved_rooms: number;
    }>;
}

export default function Dashboard({ summary, room_statuses, upcoming_arrivals, recent_bookings, room_type_snapshot }: DashboardProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="min-h-full space-y-6 bg-[radial-gradient(circle_at_top_left,_rgba(204,181,126,0.16),_transparent_28%),linear-gradient(180deg,_#f7f3ea_0%,_#f4f8f7_55%,_#ffffff_100%)] p-4 dark:bg-[radial-gradient(circle_at_top_left,_rgba(204,181,126,0.08),_transparent_28%),linear-gradient(180deg,_#102925_0%,_#0f2622_55%,_#0b1d1a_100%)] md:p-6">
                <PageHeader
                    eyebrow="Operations Overview"
                    title={`Welcome back, ${auth.user?.name?.split(' ')[0] ?? 'Team'}`}
                    description="Track arrivals, room readiness, and revenue at a glance. The dashboard follows a shadcn-style management layout while staying tailored to boutique hotel operations."
                    action={{ href: route('bookings.create'), label: 'Add Reservation' }}
                />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <MetricCard
                        title="Occupancy"
                        value={`${summary.occupancy_rate}%`}
                        hint={`${summary.total_rooms} rooms currently tracked in inventory`}
                        icon={DoorOpen}
                    />
                    <MetricCard
                        title="Arrivals Today"
                        value={String(summary.arrivals_today)}
                        hint={`${summary.departures_today} departures scheduled before night audit`}
                        icon={CalendarDays}
                        accent="from-[#8a6a2f] to-[#cfb67c]"
                    />
                    <MetricCard
                        title="In-House Guests"
                        value={String(summary.active_stays)}
                        hint="Live count of checked-in stays requiring front-desk attention"
                        icon={BedDouble}
                        accent="from-[#246b5a] to-[#6fa290]"
                    />
                    <MetricCard
                        title="Month Revenue"
                        value={formatCurrency(summary.monthly_revenue)}
                        hint="Confirmed and in-house bookings for the current month"
                        icon={Wallet}
                        accent="from-[#1f3f59] to-[#5e89a7]"
                    />
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <Card className="rounded-[28px] border-white/80 bg-white/95 shadow-[0_20px_50px_-32px_rgba(14,49,44,0.45)] dark:border-[#294941] dark:bg-[#14312c]/95 dark:shadow-[0_20px_50px_-32px_rgba(0,0,0,0.8)]">
                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                            <div>
                                <CardTitle className="font-display text-2xl text-[#14312c] dark:text-[#f5eed9]">Upcoming Arrivals</CardTitle>
                                <CardDescription>Front office visibility for the next reservations entering the property.</CardDescription>
                            </div>
                            <div className="rounded-full border border-[#d7e8e1] bg-[#f2f8f5] p-2 text-[#246b5a] dark:border-[#2a4f47] dark:bg-[#1c433b] dark:text-[#cfb67c]">
                                <Sparkles className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {upcoming_arrivals.length === 0 ? (
                                <div className="text-muted-foreground rounded-3xl border border-dashed border-[#cfdcd7] bg-[#f9fbfa] p-8 text-center text-sm dark:border-[#2a4f47] dark:bg-[#173a33]">
                                    No arrivals queued yet. New reservations will appear here as soon as the desk team adds them.
                                </div>
                            ) : (
                                upcoming_arrivals.map((arrival) => (
                                    <div
                                        key={arrival.id}
                                        className="flex flex-col gap-3 rounded-[24px] border border-[#e5ece8] bg-[#fbfcfb] p-4 md:flex-row md:items-center md:justify-between dark:border-[#2a4f47] dark:bg-[#173a33]"
                                    >
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-[#14312c] dark:text-[#f5eed9]">{arrival.guest_name}</p>
                                            <p className="text-xs tracking-[0.22em] text-[#8a6a2f] uppercase dark:text-[#cfb67c]">{arrival.booking_reference}</p>
                                            <p className="text-muted-foreground text-sm">{arrival.room_summary}</p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-[#14312c] dark:text-[#f5eed9]">{arrival.check_in}</p>
                                                <p className="text-muted-foreground text-xs">{arrival.arrival_time || 'Arrival time pending'}</p>
                                            </div>
                                            <StatusBadge value={arrival.status} />
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card className="rounded-[28px] border-white/80 bg-white/95 shadow-[0_20px_50px_-32px_rgba(14,49,44,0.45)] dark:border-[#294941] dark:bg-[#14312c]/95 dark:shadow-[0_20px_50px_-32px_rgba(0,0,0,0.8)]">
                        <CardHeader>
                            <CardTitle className="font-display text-2xl text-[#14312c] dark:text-[#f5eed9]">Room Readiness</CardTitle>
                            <CardDescription>Operational room status distribution across the property.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { key: 'vacant_clean', label: 'Vacant Clean', tone: 'bg-emerald-500' },
                                { key: 'vacant_dirty', label: 'Vacant Dirty', tone: 'bg-amber-500' },
                                { key: 'occupied', label: 'Occupied', tone: 'bg-sky-500' },
                                { key: 'maintenance', label: 'Maintenance', tone: 'bg-orange-500' },
                                { key: 'out_of_service', label: 'Out of Service', tone: 'bg-rose-500' },
                            ].map((item) => {
                                const count = room_statuses[item.key] || 0;
                                const width = summary.total_rooms > 0 ? Math.max((count / summary.total_rooms) * 100, count > 0 ? 8 : 0) : 0;

                                return (
                                    <div key={item.key} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-[#14312c] dark:text-[#f5eed9]">{item.label}</span>
                                            <span className="text-muted-foreground">{count} rooms</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-[#edf2f0] dark:bg-[#24453e]">
                                            <div className={`h-2 rounded-full ${item.tone}`} style={{ width: `${width}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <Card className="rounded-[28px] border-white/80 bg-white/95 shadow-[0_20px_50px_-32px_rgba(14,49,44,0.45)] dark:border-[#294941] dark:bg-[#14312c]/95 dark:shadow-[0_20px_50px_-32px_rgba(0,0,0,0.8)]">
                        <CardHeader>
                            <CardTitle className="font-display text-2xl text-[#14312c] dark:text-[#f5eed9]">Recent Reservations</CardTitle>
                            <CardDescription>Latest team activity across reservations, rate sources, and guest stays.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Reservation</TableHead>
                                        <TableHead>Stay</TableHead>
                                        <TableHead>Source</TableHead>
                                        <TableHead>Desk Agent</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recent_bookings.map((booking) => (
                                        <TableRow key={booking.id}>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="font-medium text-[#14312c] dark:text-[#f5eed9]">{booking.guest_name}</p>
                                                    <p className="text-xs tracking-[0.2em] text-[#8a6a2f] uppercase dark:text-[#cfb67c]">{booking.booking_reference}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {booking.check_in} to {booking.check_out}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm capitalize">
                                                {booking.source.replace('_', ' ')}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{booking.booked_by || 'System'}</TableCell>
                                            <TableCell className="font-medium text-[#14312c] dark:text-[#f5eed9]">{formatCurrency(booking.total_amount)}</TableCell>
                                            <TableCell>
                                                <StatusBadge value={booking.status} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[28px] border-white/80 bg-white/95 shadow-[0_20px_50px_-32px_rgba(14,49,44,0.45)] dark:border-[#294941] dark:bg-[#14312c]/95 dark:shadow-[0_20px_50px_-32px_rgba(0,0,0,0.8)]">
                        <CardHeader>
                            <CardTitle className="font-display text-2xl text-[#14312c] dark:text-[#f5eed9]">Room Type Mix</CardTitle>
                            <CardDescription>Inventory and current room pressure by category.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {room_type_snapshot.map((roomType) => (
                                <div key={roomType.id} className="rounded-[22px] border border-[#e5ece8] bg-[#fbfcfb] p-4 dark:border-[#2a4f47] dark:bg-[#173a33]">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="font-medium text-[#14312c] dark:text-[#f5eed9]">{roomType.name}</p>
                                            <p className="text-xs tracking-[0.2em] text-[#8a6a2f] uppercase dark:text-[#cfb67c]">{roomType.code}</p>
                                        </div>
                                        <p className="font-medium text-[#14312c] dark:text-[#f5eed9]">{formatCurrency(roomType.base_rate)}</p>
                                    </div>
                                    <div className="text-muted-foreground mt-3 flex items-center justify-between text-sm">
                                        <span>{roomType.rooms_count} rooms in inventory</span>
                                        <span>{roomType.reserved_rooms} reserved tonight</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
