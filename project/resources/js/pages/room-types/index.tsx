import { ConfirmAction } from '@/components/hotel/confirm-action';
import { PageHeader } from '@/components/hotel/page-header';
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
    { title: 'Room Types', href: '/room-types' },
];

interface RoomTypeRow {
    id: number;
    name: string;
    code: string;
    base_rate: number;
    max_adults: number;
    max_children: number;
    bed_configuration: string | null;
    size_sqm: number | null;
    rooms_count: number;
    future_reservations: number;
    is_active: boolean;
    amenities: string[];
}

interface RoomTypesIndexProps {
    roomTypes: RoomTypeRow[];
    summary: {
        active_types: number;
        inventory: number;
        average_rate: number;
    };
}

export default function RoomTypesIndex({ roomTypes, summary }: RoomTypesIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Room Types" />

            <div className="min-h-full space-y-6 bg-[radial-gradient(circle_at_top_left,_rgba(204,181,126,0.14),_transparent_28%),linear-gradient(180deg,_#f7f3ea_0%,_#f4f8f7_48%,_#ffffff_100%)] p-4 dark:bg-[radial-gradient(circle_at_top_left,_rgba(204,181,126,0.08),_transparent_28%),linear-gradient(180deg,_#102925_0%,_#0f2622_55%,_#0b1d1a_100%)] md:p-6">
                <PageHeader
                    eyebrow="Inventory Design"
                    title="Room Types"
                    description="Shape the productized inventory your reservation team sells, then map physical rooms beneath each category."
                    action={{ href: route('room-types.create'), label: 'Add Room Type' }}
                />

                <div className="grid gap-4 md:grid-cols-3">
                    {[
                        { label: 'Active Types', value: summary.active_types },
                        { label: 'Physical Rooms', value: summary.inventory },
                        { label: 'Average Base Rate', value: formatCurrency(summary.average_rate) },
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
                                    <TableHead>Type</TableHead>
                                    <TableHead>Capacity</TableHead>
                                    <TableHead>Inventory</TableHead>
                                    <TableHead>Rate</TableHead>
                                    <TableHead>Amenities</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roomTypes.map((roomType) => (
                                    <TableRow key={roomType.id}>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <p className="font-medium text-[#14312c] dark:text-[#f5eed9]">{roomType.name}</p>
                                                <p className="text-xs tracking-[0.2em] text-[#8a6a2f] uppercase dark:text-[#cfb67c]">{roomType.code}</p>
                                                <p className="text-muted-foreground text-sm">{roomType.bed_configuration || 'Bed plan pending'}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {roomType.max_adults} adults / {roomType.max_children} children
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            <p>{roomType.rooms_count} rooms</p>
                                            <p>{roomType.future_reservations} future reserved</p>
                                        </TableCell>
                                        <TableCell className="font-medium text-[#14312c] dark:text-[#f5eed9]">{formatCurrency(roomType.base_rate)}</TableCell>
                                        <TableCell className="text-muted-foreground max-w-xs text-sm">
                                            {roomType.amenities.join(', ') || 'Amenities not set'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" asChild className="rounded-full">
                                                    <Link href={route('room-types.edit', roomType.id)}>
                                                        <Edit3 className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <ConfirmAction
                                                    title="Archive room type?"
                                                    description="The room type will be archived from active inventory setup while preserving historical reservation data."
                                                    actionLabel="Archive room type"
                                                    destructive={true}
                                                    onConfirm={() => router.delete(route('room-types.destroy', roomType.id))}
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
