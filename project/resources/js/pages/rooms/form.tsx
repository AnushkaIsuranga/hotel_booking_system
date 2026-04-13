import { PageHeader } from '@/components/hotel/page-header';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rooms', href: '/rooms' },
];

interface RoomsFormProps {
    mode: 'create' | 'edit';
    room: {
        id?: number;
        room_type_id: string;
        room_number: string;
        floor: string;
        status: string;
        rate_override: string;
        notes: string;
    };
    roomTypes: Array<{ id: number; name: string; code: string }>;
    statusOptions: Array<{ value: string; label: string }>;
}

export default function RoomsForm({ mode, room, roomTypes, statusOptions }: RoomsFormProps) {
    const { data, setData, post, processing, errors, transform } = useForm(room);

    const submit = () => {
        if (mode === 'create') {
            post(route('rooms.store'));

            return;
        }

        transform((currentData) => ({
            ...currentData,
            _method: 'put',
        })).post(route('rooms.update', room.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: mode === 'create' ? 'Create' : 'Edit', href: '#' }]}>
            <Head title={mode === 'create' ? 'Create Room' : 'Edit Room'} />

            <div className="min-h-full space-y-6 bg-[radial-gradient(circle_at_top_left,_rgba(204,181,126,0.14),_transparent_28%),linear-gradient(180deg,_#f7f3ea_0%,_#f4f8f7_48%,_#ffffff_100%)] p-4 dark:bg-[radial-gradient(circle_at_top_left,_rgba(204,181,126,0.08),_transparent_28%),linear-gradient(180deg,_#102925_0%,_#0f2622_55%,_#0b1d1a_100%)] md:p-6">
                <PageHeader
                    eyebrow="Physical Inventory"
                    title={mode === 'create' ? 'Add Room' : `Edit ${room.room_number}`}
                    description="Create or update a physical room record beneath one of your room categories."
                    backHref={route('rooms.index')}
                />

                <Card className="rounded-[28px] border-white/80 bg-white/95 shadow-[0_20px_50px_-32px_rgba(14,49,44,0.45)] dark:border-[#294941] dark:bg-[#14312c]/95 dark:shadow-[0_20px_50px_-32px_rgba(0,0,0,0.8)]">
                    <CardHeader>
                        <CardTitle className="font-display text-2xl text-[#14312c] dark:text-[#f5eed9]">Room Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Room type</Label>
                            <Select value={data.room_type_id} onValueChange={(value) => setData('room_type_id', value)}>
                                <SelectTrigger className="h-12 rounded-2xl">
                                    <SelectValue placeholder="Select room type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roomTypes.map((roomType) => (
                                        <SelectItem key={roomType.id} value={String(roomType.id)}>
                                            {roomType.name} ({roomType.code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.room_type_id} />
                        </div>
                        <div className="space-y-2">
                            <Label>Room number</Label>
                            <Input value={data.room_number} onChange={(e) => setData('room_number', e.target.value)} className="h-12 rounded-2xl" />
                            <InputError message={errors.room_number} />
                        </div>
                        <div className="space-y-2">
                            <Label>Floor</Label>
                            <Input value={data.floor} onChange={(e) => setData('floor', e.target.value)} className="h-12 rounded-2xl" />
                            <InputError message={errors.floor} />
                        </div>
                        <div className="space-y-2">
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
                        <div className="space-y-2 md:col-span-2">
                            <Label>Rate override</Label>
                            <Input
                                value={data.rate_override}
                                onChange={(e) => setData('rate_override', e.target.value)}
                                className="h-12 rounded-2xl"
                                placeholder="Leave blank to use room type rate"
                            />
                            <InputError message={errors.rate_override} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Operational notes</Label>
                            <Textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} className="min-h-24 rounded-[22px]" />
                            <InputError message={errors.notes} />
                        </div>
                        <div className="md:col-span-2">
                            <Button
                                type="button"
                                onClick={submit}
                                disabled={processing}
                                className="h-12 rounded-full bg-[#14312c] px-8 text-white hover:bg-[#1b433c] dark:bg-[#cfb67c] dark:text-[#14312c] dark:hover:bg-[#dcc99a]"
                            >
                                {mode === 'create' ? 'Add Room' : 'Save Changes'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
