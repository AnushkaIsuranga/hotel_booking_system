import { ConfirmAction } from '@/components/hotel/confirm-action';
import { PageHeader } from '@/components/hotel/page-header';
import { StatusBadge } from '@/components/hotel/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/hotel';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit3, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rooms', href: '/rooms' },
];

interface RoomRow {
    id: number;
    room_number: string;
    floor: number | null;
    status: string;
    rate_override: number | null;
    notes: string | null;
    room_type: string | null;
    room_type_id: number;
}

interface RoomsIndexProps {
    rooms: RoomRow[];
    summary: {
        inventory: number;
        vacant_clean: number;
        occupied: number;
        maintenance: number;
    };
}

export default function RoomsIndex({ rooms, summary }: RoomsIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rooms" />

            <div className="min-h-full space-y-6 bg-[radial-gradient(circle_at_top_left,_rgba(204,181,126,0.14),_transparent_28%),linear-gradient(180deg,_#f7f3ea_0%,_#f4f8f7_48%,_#ffffff_100%)] p-4 dark:bg-[radial-gradient(circle_at_top_left,_rgba(204,181,126,0.08),_transparent_28%),linear-gradient(180deg,_#102925_0%,_#0f2622_55%,_#0b1d1a_100%)] md:p-6">
                <PageHeader
                    eyebrow="Physical Inventory"
                    title="Rooms"
                    description="Manage the physical room inventory that sits beneath your commercial room types and reservation line items."
                    action={{ href: route('rooms.create'), label: 'Add Room' }}
                />

                <div className="grid gap-4 md:grid-cols-4">
                    {[
                        { label: 'Inventory', value: summary.inventory },
                        { label: 'Vacant Clean', value: summary.vacant_clean },
                        { label: 'Occupied', value: summary.occupied },
                        { label: 'Maintenance', value: summary.maintenance },
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
                    <CardContent className="overflow-hidden rounded-[24px] border border-[#e4ece8] p-0 dark:border-[#2a4f47]">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[#f8faf9] dark:bg-[#173a33]">
                                    <TableHead>Room</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Rate Override</TableHead>
                                    <TableHead>Notes</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rooms.map((room) => (
                                    <TableRow key={room.id}>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <p className="font-medium text-[#14312c] dark:text-[#f5eed9]">{room.room_number}</p>
                                                <p className="text-muted-foreground text-sm">Floor {room.floor || 'TBD'}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{room.room_type || 'Unassigned type'}</TableCell>
                                        <TableCell>
                                            <StatusBadge value={room.status} variant="room" />
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {room.rate_override ? formatCurrency(room.rate_override) : 'Standard rate'}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground max-w-xs text-sm">
                                            {room.notes || 'No operational notes'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" asChild className="rounded-full">
                                                    <Link href={route('rooms.edit', room.id)}>
                                                        <Edit3 className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <ConfirmAction
                                                    title="Archive room?"
                                                    description="The room will be archived from active inventory while preserving historical reservation data."
                                                    actionLabel="Archive room"
                                                    destructive={true}
                                                    onConfirm={() => router.delete(route('rooms.destroy', room.id))}
                                                >
                                                    <Button variant="outline" size="sm" className="rounded-full text-rose-600 hover:text-rose-700">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Archive
                                                    </Button>
                                                </ConfirmAction>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
