import { PageHeader } from '@/components/hotel/page-header';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Team', href: '/staff' },
];

interface StaffFormProps {
    mode: 'create' | 'edit';
    user: {
        id?: number;
        name: string;
        email: string;
        phone: string;
        job_title: string;
        role: 'admin' | 'staff';
        is_active: boolean;
        password: string;
        password_confirmation: string;
    };
    roleOptions: Array<{ value: string; label: string }>;
}

export default function StaffForm({ mode, user, roleOptions }: StaffFormProps) {
    const { data, setData, post, processing, errors, transform } = useForm(user);

    const submit = () => {
        if (mode === 'create') {
            post(route('staff.store'));

            return;
        }

        transform((currentData) => ({
            ...currentData,
            _method: 'put',
        })).post(route('staff.update', user.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: mode === 'create' ? 'Create' : 'Edit', href: '#' }]}>
            <Head title={mode === 'create' ? 'Add Team Member' : 'Edit Team Member'} />

            <div className="min-h-full space-y-6 bg-[radial-gradient(circle_at_top_left,_rgba(204,181,126,0.14),_transparent_28%),linear-gradient(180deg,_#f7f3ea_0%,_#f4f8f7_48%,_#ffffff_100%)] p-4 dark:bg-[radial-gradient(circle_at_top_left,_rgba(204,181,126,0.08),_transparent_28%),linear-gradient(180deg,_#102925_0%,_#0f2622_55%,_#0b1d1a_100%)] md:p-6">
                <PageHeader
                    eyebrow="Access Control"
                    title={mode === 'create' ? 'Add Team Member' : `Edit ${user.name}`}
                    description="Create or update a staff account with the correct hotel operations access level."
                    backHref={route('staff.index')}
                />

                <Card className="rounded-[28px] border-white/80 bg-white/95 shadow-[0_20px_50px_-32px_rgba(14,49,44,0.45)] dark:border-[#294941] dark:bg-[#14312c]/95 dark:shadow-[0_20px_50px_-32px_rgba(0,0,0,0.8)]">
                    <CardHeader>
                        <CardTitle className="font-display text-2xl text-[#14312c] dark:text-[#f5eed9]">Staff Account</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} className="h-12 rounded-2xl" />
                            <InputError message={errors.name} />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={data.email} onChange={(e) => setData('email', e.target.value)} className="h-12 rounded-2xl" />
                            <InputError message={errors.email} />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input value={data.phone} onChange={(e) => setData('phone', e.target.value)} className="h-12 rounded-2xl" />
                            <InputError message={errors.phone} />
                        </div>
                        <div className="space-y-2">
                            <Label>Job title</Label>
                            <Input value={data.job_title} onChange={(e) => setData('job_title', e.target.value)} className="h-12 rounded-2xl" />
                            <InputError message={errors.job_title} />
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select value={data.role} onValueChange={(value) => setData('role', value as 'admin' | 'staff')}>
                                <SelectTrigger className="h-12 rounded-2xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {roleOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.role} />
                        </div>
                        <div className="space-y-2">
                            <Label>Account status</Label>
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
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                type="password"
                                className="h-12 rounded-2xl"
                            />
                            <InputError message={errors.password} />
                        </div>
                        <div className="space-y-2">
                            <Label>Confirm password</Label>
                            <Input
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                type="password"
                                className="h-12 rounded-2xl"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <Button
                                type="button"
                                onClick={submit}
                                disabled={processing}
                                className="h-12 rounded-full bg-[#14312c] px-8 text-white hover:bg-[#1b433c] dark:bg-[#cfb67c] dark:text-[#14312c] dark:hover:bg-[#dcc99a]"
                            >
                                {mode === 'create' ? 'Create Team Member' : 'Save Changes'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
