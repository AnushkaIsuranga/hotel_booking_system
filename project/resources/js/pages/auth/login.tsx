import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, ConciergeBell, LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { brand } = usePage<SharedData>().props;
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Staff Login" />
            <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(207,182,124,0.28),_transparent_24%),linear-gradient(135deg,_#102925_0%,_#1c463e_44%,_#f3efe5_44%,_#f8f5ee_100%)] px-6 py-8 lg:px-8">
                <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-[36px] border border-white/12 bg-white/6 shadow-[0_30px_100px_-42px_rgba(0,0,0,0.6)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="flex flex-col justify-between p-8 text-white md:p-12">
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <Link href={route('home')} className="space-y-1">
                                    <p className="font-display text-2xl">{brand.product_name}</p>
                                    <p className="text-xs tracking-[0.26em] text-white/60 uppercase">{brand.location}</p>
                                </Link>
                                <div className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs tracking-[0.22em] text-[#cfb67c] uppercase">
                                    Staff Only
                                </div>
                            </div>

                            <div className="space-y-5">
                                <p className="text-xs font-semibold tracking-[0.3em] text-[#cfb67c] uppercase">Hotel Staff Portal</p>
                                <h1 className="font-display max-w-xl text-5xl leading-tight">
                                    Sign in to manage reservations, room readiness, and the full guest arrival journey.
                                </h1>
                                <p className="max-w-xl text-lg leading-8 text-white/76">
                                    Public users cannot register or place bookings on their own. All reservations are handled internally by the desk
                                    and admin teams to keep hotel operations precise and secure.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-[28px] border border-white/10 bg-white/8 p-5">
                                <div className="inline-flex rounded-full border border-white/10 bg-black/10 p-3 text-[#cfb67c]">
                                    <ConciergeBell className="h-5 w-5" />
                                </div>
                                <p className="mt-4 font-medium">Front desk aligned</p>
                                <p className="mt-2 text-sm leading-7 text-[#14312c]/70">
                                    Arrivals, departures, inventory, and staff permissions stay in one shared workspace.
                                </p>
                            </div>
                            <div className="rounded-[28px] border border-white/10 bg-white/8 p-5">
                                <p className="text-xs tracking-[0.2em] text-[#cfb67c] uppercase">Access Policy</p>
                                <p className="mt-4 text-sm leading-7 text-[#14312c]/70">
                                    Request credentials from your property administrator if you need access to Asteria Desk.
                                </p>
                                <a
                                    href={`mailto:${brand.support_email}`}
                                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#14312c] hover:text-[#246b5a]"
                                >
                                    Contact reservations
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 md:p-12">
                        <div className="mx-auto flex h-full max-w-md flex-col justify-center">
                            <div className="space-y-2">
                                <p className="text-xs font-semibold tracking-[0.26em] text-[#8a6a2f] uppercase">Secure Access</p>
                                <h2 className="font-display text-4xl font-semibold text-[#14312c]">Welcome back</h2>
                                <p className="text-muted-foreground text-sm leading-6">
                                    Use your staff email and password to enter the hotel operations workspace.
                                </p>
                            </div>

                            {status && (
                                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                    {status}
                                </div>
                            )}

                            <form className="mt-8 flex flex-col gap-6" onSubmit={submit}>
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Work email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="frontdesk@hotel.com"
                                            className="h-12 rounded-2xl"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Password</Label>
                                            {canResetPassword && (
                                                <TextLink href={route('password.request')} className="ml-auto text-sm text-[#246b5a]" tabIndex={5}>
                                                    Forgot password?
                                                </TextLink>
                                            )}
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Enter your password"
                                            className="h-12 rounded-2xl"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center space-x-3 rounded-2xl border border-[#e6ece9] px-4 py-3">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                            checked={data.remember}
                                            onCheckedChange={(checked) => setData('remember', checked === true)}
                                        />
                                        <Label htmlFor="remember">Keep me signed in on this device</Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-2 h-12 rounded-full bg-[#14312c] text-white hover:bg-[#1b433c]"
                                        tabIndex={4}
                                        disabled={processing}
                                    >
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Enter Dashboard
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
