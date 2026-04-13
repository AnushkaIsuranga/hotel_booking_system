import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { CircleAlert } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create New Booking',
        href: '/bookings/create',
    },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        check_in_date: '',
        check_out_date: '',
        number_of_guests: '',
        single_count: '',
        double_count: '',
        suite_count: '',
        arival_time: '',
        special_requests: '',
    });

    const handleSuubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const toastId = toast.loading('Creating booking...');

        post(route('bookings.store'), {
            onSuccess: () => {
                toast.success('Booking created successfully');
                console.log('Bookings changed in DB, reloading...');

                router.reload({
                    only: ['bookings'],
                    preserveScroll: true,
                    preserveState: true,
                });
            },
            onError: () => toast.error('Failed to create booking'),
            onFinish: () => toast.dismiss(toastId),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create New Booking" />
            <div className="w-8/12 p-4">
                <form onSubmit={handleSuubmit} className="space-y-4">
                    {/* Display Error */}
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive">
                            <CircleAlert className="h-4 w-4" />
                            <AlertTitle>There were some errors with your submission:</AlertTitle>
                            <AlertDescription>
                                {Object.entries(errors).map(([field, message]) => (
                                    <li key={field}>{message}</li>
                                ))}
                            </AlertDescription>
                        </Alert>
                    )}
                    <FieldSet>
                        <FieldLegend>Customer Details</FieldLegend>
                        <div className="grid grid-cols-3 gap-4">
                            <Field>
                                <FieldLabel htmlFor="name">Name</FieldLabel>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Enter name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    placeholder="Enter email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                                <Input
                                    id="phone"
                                    name="phone"
                                    placeholder="Enter phone"
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                            </Field>
                        </div>
                    </FieldSet>
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="check_in_date">Check-in Date</FieldLabel>
                                <Input
                                    id="check_in_date"
                                    name="check_in_date"
                                    type="date"
                                    value={data.check_in_date}
                                    onChange={(e) => setData('check_in_date', e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="check_out_date">Check-out Date</FieldLabel>
                                <Input
                                    id="check_out_date"
                                    name="check_out_date"
                                    type="date"
                                    value={data.check_out_date}
                                    onChange={(e) => setData('check_out_date', e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="number_of_guests">Number of Guests</FieldLabel>
                                <Input
                                    id="number_of_guests"
                                    name="number_of_guests"
                                    placeholder="Enter number of guests"
                                    type="number"
                                    value={data.number_of_guests}
                                    onChange={(e) => setData('number_of_guests', e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="arival_time">Arrival Time</FieldLabel>
                                <Input
                                    id="arival_time"
                                    name="arival_time"
                                    placeholder="Enter arival time"
                                    type="time"
                                    value={data.arival_time}
                                    onChange={(e) => setData('arival_time', e.target.value)}
                                />
                            </Field>
                        </div>
                    </FieldGroup>
                    <FieldSet>
                        <FieldLegend>Room Type</FieldLegend>
                        <FieldDescription>Leave empty if no guests are staying in that room</FieldDescription>
                        <div className="grid grid-cols-3 gap-4">
                            <Field>
                                <FieldLabel htmlFor="single">Single</FieldLabel>
                                <Input
                                    id="single_count"
                                    name="single_count"
                                    placeholder="Count of people for single room"
                                    type="number"
                                    value={data.single_count}
                                    onChange={(e) => setData('single_count', e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="double">Double</FieldLabel>
                                <Input
                                    id="double_count"
                                    name="double_count"
                                    placeholder="Count of people for double room"
                                    type="number"
                                    value={data.double_count}
                                    onChange={(e) => setData('double_count', e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="suite">Suite</FieldLabel>
                                <Input
                                    id="suite_count"
                                    name="suite_count"
                                    placeholder="Count of people for suite room"
                                    type="number"
                                    value={data.suite_count}
                                    onChange={(e) => setData('suite_count', e.target.value)}
                                />
                            </Field>
                        </div>
                    </FieldSet>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="special_requests">Special Requests</FieldLabel>
                            <Textarea
                                id="special_requests"
                                name="special_requests"
                                placeholder="Enter any special requests"
                                value={data.special_requests}
                                onChange={(e) => setData('special_requests', e.target.value)}
                            />
                        </Field>
                    </FieldGroup>
                    <Button type="submit" className="mt-4">
                        Create Booking
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
