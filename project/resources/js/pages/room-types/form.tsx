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
    { title: 'Room Types', href: '/room-types' },
];

interface RoomTypeFormProps {
    mode: 'create' | 'edit';
    roomType: {
        id?: number;
        name: string;
        code: string;
        base_rate: string;
        max_adults: string;
        max_children: string;
        bed_configuration: string;
        size_sqm: string;
        description: string;
        amenities: string;
        is_active: boolean;
    };
}

export default function RoomTypeForm({ mode, roomType }: RoomTypeFormProps) {
    const { data, setData, post, processing, errors, transform } = useForm(roomType);

    const submit = () => {
        if (mode === 'create') {
            post(route('room-types.store'));

            return;
        }

        transform((currentData) => ({
            ...currentData,
            _method: 'put',
        })).post(route('room-types.update', roomType.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: mode === 'create' ? 'Create' : 'Edit', href: '#' }]}>
            <Head title={mode === 'create' ? 'Create Room Type' : 'Edit Room Type'} />

            <div className="min-h-full space-y-6 bg-[radial-gradient(circle_at_top_left,_rgba(204,181,126,0.14),_transparent_28%),linear-gradient(180deg,_#f7f3ea_0%,_#f4f8f7_48%,_#ffffff_100%)] p-4 dark:bg-[radial-gradient(circle_at_top_left,_rgba(204,181,126,0.08),_transparent_28%),linear-gradient(180deg,_#102925_0%,_#0f2622_55%,_#0b1d1a_100%)] md:p-6">
                <PageHeader
                    eyebrow="Inventory Blueprint"
                    title={mode === 'create' ? 'Create Room Type' : `Edit ${roomType.name}`}
                    description="Define pricing, capacity, and amenities for a sellable room category."
                    backHref={route('room-types.index')}
                />

                <Card className="rounded-[28px] border-white/80 bg-white/95 shadow-[0_20px_50px_-32px_rgba(14,49,44,0.45)] dark:border-[#294941] dark:bg-[#14312c]/95 dark:shadow-[0_20px_50px_-32px_rgba(0,0,0,0.8)]">
                    <CardHeader>
                        <CardTitle className="font-display text-2xl text-[#14312c] dark:text-[#f5eed9]">Room Type Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} className="h-12 rounded-2xl" />
                            <InputError message={errors.name} />
                        </div>
                        <div className="space-y-2">
                            <Label>Code</Label>
                            <Input value={data.code} onChange={(e) => setData('code', e.target.value.toUpperCase())} className="h-12 rounded-2xl" />
                            <InputError message={errors.code} />
                        </div>
                        <div className="space-y-2">
                            <Label>Base rate</Label>
                            <Input value={data.base_rate} onChange={(e) => setData('base_rate', e.target.value)} className="h-12 rounded-2xl" />
                            <InputError message={errors.base_rate} />
                        </div>
                        <div className="space-y-2">
                            <Label>Bed configuration</Label>
                            <Input
                                value={data.bed_configuration}
                                onChange={(e) => setData('bed_configuration', e.target.value)}
                                className="h-12 rounded-2xl"
                            />
                            <InputError message={errors.bed_configuration} />
                        </div>
                        <div className="space-y-2">
                            <Label>Max adults</Label>
                            <Input value={data.max_adults} onChange={(e) => setData('max_adults', e.target.value)} className="h-12 rounded-2xl" />
                            <InputError message={errors.max_adults} />
                        </div>
                        <div className="space-y-2">
                            <Label>Max children</Label>
                            <Input value={data.max_children} onChange={(e) => setData('max_children', e.target.value)} className="h-12 rounded-2xl" />
                            <InputError message={errors.max_children} />
                        </div>
                        <div className="space-y-2">
                            <Label>Size in sqm</Label>
                            <Input value={data.size_sqm} onChange={(e) => setData('size_sqm', e.target.value)} className="h-12 rounded-2xl" />
                            <InputError message={errors.size_sqm} />
                        </div>
                        <div className="space-y-2">
                            <Label>Availability</Label>
                            <Select value={String(data.is_active)} onValueChange={(value) => setData('is_active', value === 'true')}>
                                <SelectTrigger className="h-12 rounded-2xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Active</SelectItem>
                                    <SelectItem value="false">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.is_active} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Description</Label>
                            <Textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="min-h-28 rounded-[22px]"
                            />
                            <InputError message={errors.description} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Amenities</Label>
                            <Textarea
                                value={data.amenities}
                                onChange={(e) => setData('amenities', e.target.value)}
                                className="min-h-24 rounded-[22px]"
                                placeholder="Separate amenities with commas"
                            />
                            <InputError message={errors.amenities} />
                        </div>
                        <div className="md:col-span-2">
                            <Button
                                type="button"
                                onClick={submit}
                                disabled={processing}
                                className="h-12 rounded-full bg-[#14312c] px-8 text-white hover:bg-[#1b433c] dark:bg-[#cfb67c] dark:text-[#14312c] dark:hover:bg-[#dcc99a]"
                            >
                                {mode === 'create' ? 'Create Room Type' : 'Save Changes'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
