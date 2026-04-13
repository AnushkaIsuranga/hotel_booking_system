import { PageHeader } from '@/components/hotel/page-header';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/hotel';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Minus, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bookings', href: '/bookings' },
];

interface BookingFormProps {
    mode: 'create' | 'edit';
    booking: {
        id?: number;
        booking_reference?: string;
        guest: {
            first_name: string;
            last_name: string;
            email: string;
            phone: string;
            nationality: string;
        };
        check_in: string;
        check_out: string;
        arrival_time: string;
        adults: string;
        children: string;
        status: string;
        source: string;
        total_amount: string;
        special_requests: string;
        internal_notes: string;
        items: Array<{
            room_type_id: string;
            quantity: string;
            nightly_rate: string;
            guests: string;
            notes: string;
        }>;
    };
    roomTypes: Array<{
        id: number;
        name: string;
        code: string;
        base_rate: number;
        max_adults: number;
        max_children: number;
        rooms_count: number;
    }>;
    statusOptions: Array<{ value: string; label: string }>;
    sourceOptions: Array<{ value: string; label: string }>;
}

export default function BookingForm({ mode, booking, roomTypes, statusOptions, sourceOptions }: BookingFormProps) {
    const { data, setData, post, processing, errors, transform } = useForm(booking);
    const roomTypeMap = Object.fromEntries(roomTypes.map((roomType) => [String(roomType.id), roomType]));

    const submit = () => {
        if (mode === 'create') {
            post(route('bookings.store'));

            return;
        }

        transform((currentData) => ({
            ...currentData,
            _method: 'put',
        })).post(route('bookings.update', booking.id), {
            preserveScroll: true,
        });
    };

    const updateGuest = (field: keyof typeof data.guest, value: string) => {
        setData('guest', {
            ...data.guest,
            [field]: value,
        });
    };

    const updateItem = (index: number, field: keyof (typeof data.items)[number], value: string) => {
        const nextItems = data.items.map((item, itemIndex) => {
            if (itemIndex !== index) {
                return item;
            }

            const updatedItem = {
                ...item,
                [field]: value,
            };

            if (field === 'room_type_id') {
                updatedItem.nightly_rate = String(roomTypeMap[value]?.base_rate ?? '');
            }

            return updatedItem;
        });

        setData('items', nextItems);
    };

    const addItem = () => {
        setData('items', [
            ...data.items,
            {
                room_type_id: '',
                quantity: '1',
                nightly_rate: '',
                guests: '2',
                notes: '',
            },
        ]);
    };

    const removeItem = (index: number) => {
        if (data.items.length === 1) {
            return;
        }

        setData(
            'items',
            data.items.filter((_, itemIndex) => itemIndex !== index),
        );
    };

    const nights = Math.max(1, Math.round((new Date(data.check_out).getTime() - new Date(data.check_in).getTime()) / (1000 * 60 * 60 * 24)) || 1);
    const estimatedTotal = data.items.reduce((total, item) => total + Number(item.quantity || 0) * Number(item.nightly_rate || 0) * nights, 0);
    const itemError = (index: number, field: string) => errors[`items.${index}.${field}` as keyof typeof errors];

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: mode === 'create' ? 'Create' : 'Edit', href: '#' }]}>
            <Head title={mode === 'create' ? 'Create Booking' : 'Edit Booking'} />

            <div className="min-h-full space-y-6 bg-[radial-gradient(circle_at_top_left,_rgba(204,181,126,0.14),_transparent_28%),linear-gradient(180deg,_#f7f3ea_0%,_#f4f8f7_48%,_#ffffff_100%)] p-4 dark:bg-[radial-gradient(circle_at_top_left,_rgba(204,181,126,0.08),_transparent_28%),linear-gradient(180deg,_#102925_0%,_#0f2622_55%,_#0b1d1a_100%)] md:p-6">
                <PageHeader
                    eyebrow="Reservation Form"
                    title={mode === 'create' ? 'Create Reservation' : `Edit ${booking.booking_reference}`}
                    description="Capture guest details, assign room types, and keep the reservation financially ready for operations."
                    backHref={route('bookings.index')}
                />

                <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                    <div className="space-y-6">
                        <Card className="rounded-[28px] border-white/80 bg-white/95 shadow-[0_20px_50px_-32px_rgba(14,49,44,0.45)] dark:border-[#294941] dark:bg-[#14312c]/95 dark:shadow-[0_20px_50px_-32px_rgba(0,0,0,0.8)]">
                            <CardHeader>
                                <CardTitle className="font-display text-2xl text-[#14312c] dark:text-[#f5eed9]">Guest Details</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>First name</Label>
                                    <Input
                                        value={data.guest.first_name}
                                        onChange={(e) => updateGuest('first_name', e.target.value)}
                                        className="h-12 rounded-2xl"
                                    />
                                    <InputError message={errors['guest.first_name']} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last name</Label>
                                    <Input
                                        value={data.guest.last_name}
                                        onChange={(e) => updateGuest('last_name', e.target.value)}
                                        className="h-12 rounded-2xl"
                                    />
                                    <InputError message={errors['guest.last_name']} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        value={data.guest.email}
                                        onChange={(e) => updateGuest('email', e.target.value)}
                                        className="h-12 rounded-2xl"
                                    />
                                    <InputError message={errors['guest.email']} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input
                                        value={data.guest.phone}
                                        onChange={(e) => updateGuest('phone', e.target.value)}
                                        className="h-12 rounded-2xl"
                                    />
                                    <InputError message={errors['guest.phone']} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Nationality</Label>
                                    <Input
                                        value={data.guest.nationality}
                                        onChange={(e) => updateGuest('nationality', e.target.value)}
                                        className="h-12 rounded-2xl"
                                    />
                                    <InputError message={errors['guest.nationality']} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-[28px] border-white/80 bg-white/95 shadow-[0_20px_50px_-32px_rgba(14,49,44,0.45)] dark:border-[#294941] dark:bg-[#14312c]/95 dark:shadow-[0_20px_50px_-32px_rgba(0,0,0,0.8)]">
                            <CardHeader>
                                <CardTitle className="font-display text-2xl text-[#14312c] dark:text-[#f5eed9]">Stay Details</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Check-in</Label>
                                    <Input
                                        type="date"
                                        value={data.check_in}
                                        onChange={(e) => setData('check_in', e.target.value)}
                                        className="h-12 rounded-2xl"
                                    />
                                    <InputError message={errors.check_in} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Check-out</Label>
                                    <Input
                                        type="date"
                                        value={data.check_out}
                                        onChange={(e) => setData('check_out', e.target.value)}
                                        className="h-12 rounded-2xl"
                                    />
                                    <InputError message={errors.check_out} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Arrival time</Label>
                                    <Input
                                        type="time"
                                        value={data.arrival_time}
                                        onChange={(e) => setData('arrival_time', e.target.value)}
                                        className="h-12 rounded-2xl"
                                    />
                                    <InputError message={errors.arrival_time} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Source</Label>
                                    <Select value={data.source} onValueChange={(value) => setData('source', value)}>
                                        <SelectTrigger className="h-12 rounded-2xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sourceOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.source} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Adults</Label>
                                    <Input value={data.adults} onChange={(e) => setData('adults', e.target.value)} className="h-12 rounded-2xl" />
                                    <InputError message={errors.adults} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Children</Label>
                                    <Input value={data.children} onChange={(e) => setData('children', e.target.value)} className="h-12 rounded-2xl" />
                                    <InputError message={errors.children} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Status</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger className="h-12 rounded-2xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="rounded-[28px] border-white/80 bg-white/95 shadow-[0_20px_50px_-32px_rgba(14,49,44,0.45)] dark:border-[#294941] dark:bg-[#14312c]/95 dark:shadow-[0_20px_50px_-32px_rgba(0,0,0,0.8)]">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="font-display text-2xl text-[#14312c] dark:text-[#f5eed9]">Room Plan</CardTitle>
                                <Button type="button" variant="outline" onClick={addItem} className="rounded-full">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Line
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data.items.map((item, index) => (
                                    <div key={`${index}-${item.room_type_id}`} className="rounded-[24px] border border-[#e4ece8] bg-[#fbfcfb] p-4 dark:border-[#2a4f47] dark:bg-[#173a33]">
                                        <div className="mb-4 flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-[#14312c] dark:text-[#f5eed9]">Reservation line {index + 1}</p>
                                                <p className="text-muted-foreground text-sm">Select a room type, quantity, and nightly rate.</p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeItem(index)}
                                                disabled={data.items.length === 1}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2 md:col-span-2">
                                                <Label>Room type</Label>
                                                <Select value={item.room_type_id} onValueChange={(value) => updateItem(index, 'room_type_id', value)}>
                                                    <SelectTrigger className="h-12 rounded-2xl">
                                                        <SelectValue placeholder="Select room type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {roomTypes.map((roomType) => (
                                                            <SelectItem key={roomType.id} value={String(roomType.id)}>
                                                                {roomType.name} ({roomType.code}) - {roomType.rooms_count} rooms
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <InputError message={itemError(index, 'room_type_id')} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Quantity</Label>
                                                <Input
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                    className="h-12 rounded-2xl"
                                                />
                                                <InputError message={itemError(index, 'quantity')} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Guests in this line</Label>
                                                <Input
                                                    value={item.guests}
                                                    onChange={(e) => updateItem(index, 'guests', e.target.value)}
                                                    className="h-12 rounded-2xl"
                                                />
                                                <InputError message={itemError(index, 'guests')} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Nightly rate</Label>
                                                <Input
                                                    value={item.nightly_rate}
                                                    onChange={(e) => updateItem(index, 'nightly_rate', e.target.value)}
                                                    className="h-12 rounded-2xl"
                                                />
                                                <InputError message={itemError(index, 'nightly_rate')} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Notes</Label>
                                                <Input
                                                    value={item.notes}
                                                    onChange={(e) => updateItem(index, 'notes', e.target.value)}
                                                    className="h-12 rounded-2xl"
                                                />
                                                <InputError message={itemError(index, 'notes')} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="rounded-[28px] border-white/80 bg-white/95 shadow-[0_20px_50px_-32px_rgba(14,49,44,0.45)] dark:border-[#294941] dark:bg-[#14312c]/95 dark:shadow-[0_20px_50px_-32px_rgba(0,0,0,0.8)]">
                            <CardHeader>
                                <CardTitle className="font-display text-2xl text-[#14312c] dark:text-[#f5eed9]">Notes & Commercials</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="space-y-2">
                                    <Label>Special requests</Label>
                                    <Textarea
                                        value={data.special_requests}
                                        onChange={(e) => setData('special_requests', e.target.value)}
                                        className="min-h-28 rounded-[22px]"
                                    />
                                    <InputError message={errors.special_requests} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Internal notes</Label>
                                    <Textarea
                                        value={data.internal_notes}
                                        onChange={(e) => setData('internal_notes', e.target.value)}
                                        className="min-h-24 rounded-[22px]"
                                    />
                                    <InputError message={errors.internal_notes} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Override total amount</Label>
                                    <Input
                                        value={data.total_amount}
                                        onChange={(e) => setData('total_amount', e.target.value)}
                                        className="h-12 rounded-2xl"
                                        placeholder="Leave blank to auto-calculate"
                                    />
                                    <InputError message={errors.total_amount} />
                                </div>
                                <div className="rounded-[24px] border border-[#dfe8e4] bg-[#f4f8f7] p-5 dark:border-[#2a4f47] dark:bg-[#173a33]">
                                    <p className="text-xs tracking-[0.2em] text-[#8a6a2f] uppercase dark:text-[#cfb67c]">Estimated stay value</p>
                                    <p className="font-display mt-2 text-3xl text-[#14312c] dark:text-[#f5eed9]">
                                        {formatCurrency(data.total_amount ? Number(data.total_amount) : estimatedTotal)}
                                    </p>
                                    <p className="text-muted-foreground mt-2 text-sm">{nights} nights based on the selected room lines.</p>
                                </div>
                                <Button
                                    type="button"
                                    onClick={submit}
                                    disabled={processing}
                                    className="h-12 w-full rounded-full bg-[#14312c] text-white hover:bg-[#1b433c] dark:bg-[#cfb67c] dark:text-[#14312c] dark:hover:bg-[#dcc99a]"
                                >
                                    {mode === 'create' ? 'Create Reservation' : 'Save Changes'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
