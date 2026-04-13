import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Compass, Flower2, Globe, Leaf, Mountain, Palmtree, Quote, Utensils } from 'lucide-react';

interface WelcomeProps {
    heroStats: {
        room_types: number;
        rooms: number;
        upcoming_reservations: number;
        rooms_ready: number;
    };
}

export default function Welcome({ heroStats }: WelcomeProps) {
    const { auth, brand } = usePage<SharedData>().props;

    const collectionCards = [
        {
            title: 'Maldives Archipelago',
            subtitle: 'A rhythm of waves and whispered secrets on secluded white sands.',
            cta: 'Explore Atoll',
            image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1600&q=80',
            span: 'md:col-span-8',
        },
        {
            title: 'Tea Country',
            subtitle: 'Mornings draped in mist, estates rich with stories and spice.',
            cta: 'View Estate',
            image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
            span: 'md:col-span-4',
        },
        {
            title: 'Historic Galle',
            subtitle: 'Colonial charm and ocean sunsets stitched into every lane.',
            cta: 'Experience History',
            image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
            span: 'md:col-span-4',
        },
        {
            title: 'Wild Southern Coast',
            subtitle: 'Where jungle textures meet the Indian Ocean in cinematic contrast.',
            cta: 'Discover Wilderness',
            image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80',
            span: 'md:col-span-8',
        },
    ];

    const stats = [
        { label: 'Room Types', value: heroStats.room_types },
        { label: 'Rooms', value: heroStats.rooms },
        { label: 'Upcoming', value: heroStats.upcoming_reservations },
        { label: 'Ready Now', value: heroStats.rooms_ready },
    ];

    const offers = [
        {
            label: 'Romantic Escapes',
            title: 'The Honeymoon Anthology',
            text: 'Private beach dinners, couples spa rituals, and a dedicated butler team.',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        },
        {
            label: 'Summer Collection',
            title: 'Island Hopping Journey',
            text: 'Extended-stay experiences crafted across multiple oceanfront destinations.',
            image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
        },
        {
            label: 'Culinary Arts',
            title: 'The Masterclass Series',
            text: 'Seasonal tasting programs designed around Sri Lankan spice heritage.',
            image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
        },
    ];

    return (
        <>
            <Head title="The Estate Editorial" />
            <div className="bg-background text-foreground">
                <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/75 backdrop-blur-xl dark:bg-[#0f2622]/85">
                    <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 lg:px-10">
                        <p className="font-display text-2xl tracking-tight text-[#14312c] dark:text-[#f5eed9]">{brand.product_name}</p>

                        <nav className="hidden items-center gap-8 md:flex">
                            {['Destinations', 'Rooms & Suites', 'Experiences', 'Dining', 'Offers', 'About'].map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className="text-sm tracking-[0.15em] text-[#14312c]/75 uppercase transition-colors hover:text-[#246b5a] dark:text-[#f5eed9]/70 dark:hover:text-[#cfb67c]"
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>

                        <div className="flex items-center gap-2">
                            <Button className="rounded-full bg-[#cfb67c] px-6 text-[#14312c] hover:bg-[#dcc99a]">
                                Inquire Now
                            </Button>
                        </div>
                    </div>
                </header>

                <main className="pt-16">
                    <section className="relative h-[86vh] min-h-[680px] overflow-hidden lg:h-[100vh]">
                        <img
                            src="https://plus.unsplash.com/premium_photo-1746327707391-d095ac370b9c?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Luxury coastal resort at dusk"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(6,42,32,0.35),rgba(31,64,53,0.88))]" />
                        <div className="absolute inset-0 flex items-center justify-center px-6">
                            <div className="max-w-4xl text-center text-white">
                                <p className="mb-4 text-xs tracking-[0.35em] text-[#cfb67c] uppercase">Unveiling The Extraordinary</p>
                                <h1 className="font-display text-5xl leading-tight md:text-7xl">Stay Where The Journey Begins</h1>
                                <p className="mx-auto mt-6 max-w-2xl text-base text-white/85 md:text-xl">
                                    A curated collection of sanctuaries where heritage architecture meets the untamed beauty of coastal wilderness.
                                </p>
                                <div className="mt-10 flex flex-wrap justify-center gap-4">
                                    <Button className="rounded-full bg-white px-8 py-6 text-[#14312c] hover:bg-[#f2f2ef]">Discover Collection</Button>
                                    <Button
                                        variant="outline"
                                        className="rounded-full border-white/70 bg-transparent px-8 py-6 text-white hover:bg-white/10"
                                    >
                                        Inquire Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
                        <p className="text-xs tracking-[0.22em] text-[#8a6a2f] uppercase">The Collection</p>
                        <h2 className="font-display mt-3 text-4xl text-[#14312c] md:text-5xl dark:text-[#f5eed9]">Signature Destinations</h2>

                        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12">
                            {collectionCards.map((card) => (
                                <article key={card.title} className={`group relative min-h-[280px] overflow-hidden rounded-2xl ${card.span}`}>
                                    <img src={card.image} alt={card.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#14312c]/90 via-[#14312c]/30 to-transparent" />
                                    <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                                        <h3 className="font-display text-2xl md:text-3xl">{card.title}</h3>
                                        <p className="mt-2 max-w-md text-white/85">{card.subtitle}</p>
                                        <button className="mt-5 text-xs tracking-[0.24em] underline underline-offset-8 decoration-white/30 uppercase">
                                            {card.cta}
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="bg-[#f2efea] py-24 dark:bg-[#102925]">
                        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2 lg:px-10">
                            <div className="relative">
                                <img
                                    src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=80"
                                    alt="Luxury dining deck"
                                    className="h-[560px] w-full rounded-3xl object-cover"
                                />
                                <img
                                    src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80"
                                    alt="Spa ritual"
                                    className="absolute -bottom-8 -right-4 hidden h-56 w-44 rounded-2xl border-8 border-[#f2efea] object-cover shadow-xl md:block dark:border-[#102925]"
                                />
                            </div>

                            <div>
                                <p className="text-xs tracking-[0.22em] text-[#8a6a2f] uppercase">Curated Moments</p>
                                <h2 className="font-display mt-4 text-4xl text-[#14312c] md:text-5xl dark:text-[#f5eed9]">Beyond The Stay</h2>
                                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                                    We do not only offer rooms. We shape perspective through culinary rituals, wellness, and place-led discovery.
                                </p>

                                <div className="mt-8 space-y-6">
                                    {[
                                        { icon: Utensils, title: 'Epicurean Mastery', copy: 'Farm-to-table dining inspired by ancient spice routes.' },
                                        { icon: Flower2, title: 'Elemental Wellness', copy: 'Holistic rituals rooted in tropical botanical wisdom.' },
                                        { icon: Mountain, title: 'Curated Adventure', copy: 'Private journeys through heritage trails and wild coastlines.' },
                                    ].map((item) => (
                                        <div key={item.title} className="flex gap-4">
                                            <div className="rounded-xl bg-white p-3 text-[#14312c] shadow-sm dark:bg-[#173a33] dark:text-[#cfb67c]">
                                                <item.icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-display text-2xl text-[#14312c] dark:text-[#f5eed9]">{item.title}</h3>
                                                <p className="text-muted-foreground">{item.copy}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
                        <div className="mb-10 flex items-end justify-between">
                            <div>
                                <p className="text-xs tracking-[0.22em] text-[#8a6a2f] uppercase">Exclusive Access</p>
                                <h2 className="font-display mt-3 text-4xl text-[#14312c] dark:text-[#f5eed9]">Seasonal Editorial</h2>
                            </div>
                            <div className="hidden gap-3 md:flex">
                                <Button variant="outline" size="icon" className="rounded-full">
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-full">
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-3">
                            {offers.map((offer) => (
                                <Card key={offer.title} className="overflow-hidden rounded-2xl border-[#e4ece8] dark:border-[#2a4f47] dark:bg-[#14312c]">
                                    <img src={offer.image} alt={offer.title} className="h-56 w-full object-cover" />
                                    <CardHeader>
                                        <p className="text-xs tracking-[0.2em] text-[#8a6a2f] uppercase dark:text-[#cfb67c]">{offer.label}</p>
                                        <CardTitle className="font-display text-3xl text-[#14312c] dark:text-[#f5eed9]">{offer.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{offer.text}</p>
                                        <button className="mt-5 text-xs tracking-[0.2em] text-[#14312c] underline underline-offset-8 decoration-[#14312c]/30 uppercase dark:text-[#cfb67c] dark:decoration-[#cfb67c]/40">
                                            Request Details
                                        </button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section className="relative overflow-hidden py-28">
                        <img
                            src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=2200&q=80"
                            alt="Ocean conservation landscape"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-[#14312c]/55" />
                        <div className="relative mx-auto max-w-5xl px-6 lg:px-10">
                            <Card className="rounded-3xl border-white/20 bg-white/90 p-4 shadow-2xl backdrop-blur dark:border-[#2a4f47] dark:bg-[#173a33]/90">
                                <CardContent className="p-8 text-center md:p-12">
                                    <p className="text-xs tracking-[0.3em] text-[#8a6a2f] uppercase">Our Philosophy</p>
                                    <h2 className="font-display mt-4 text-4xl text-[#14312c] md:text-5xl dark:text-[#f5eed9]">Conservation Through Hospitality</h2>
                                    <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                                        Every stay contributes to reforestation and coastal wildlife protection through local stewardship programs.
                                    </p>

                                    <div className="mt-10 grid grid-cols-3 gap-4">
                                        {[
                                            { value: '12k+', label: 'Trees Planted' },
                                            { value: '4', label: 'Sanctuaries' },
                                            { value: '100%', label: 'Plastic Free' },
                                        ].map((item) => (
                                            <div key={item.label}>
                                                <p className="font-display text-4xl text-[#14312c] dark:text-[#f5eed9]">{item.value}</p>
                                                <p className="mt-1 text-[11px] tracking-[0.2em] text-[#8a6a2f] uppercase dark:text-[#cfb67c]">{item.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    <section className="bg-[#fcf9f8] py-24 dark:bg-[#102925]">
                        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
                            <Quote className="mx-auto h-14 w-14 text-[#cfb67c]" />
                            <p className="font-display mt-6 text-3xl leading-relaxed text-[#14312c] dark:text-[#f5eed9]">
                                The estate experience offers a soulful connection to place. It feels less like travel and more like arriving home.
                            </p>
                            <p className="mt-8 text-lg font-semibold text-[#14312c] dark:text-[#f5eed9]">Julianne V.</p>
                            <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">London, UK</p>
                        </div>
                    </section>

                    <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
                        <Card className="overflow-hidden rounded-3xl border-0 bg-[#f9e0a5] text-[#2d220d]">
                            <CardContent className="relative grid gap-8 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12">
                                <Compass className="pointer-events-none absolute -right-8 -top-12 h-48 w-48 opacity-15" />

                                <div>
                                    <h2 className="font-display text-5xl">Plan Your Escape</h2>
                                    <p className="mt-3 text-lg text-[#4d3f19]">Let our concierge team craft a bespoke itinerary for your next adventure.</p>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <Button className="rounded-full bg-[#14312c] px-8 text-white hover:bg-[#1b433c]">Explore Resorts</Button>
                                    <Button variant="outline" className="rounded-full border-[#14312c] bg-transparent px-8 text-[#14312c] hover:bg-[#14312c]/10">
                                        Contact To Book
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <section className="mx-auto max-w-[1400px] px-6 pb-16 lg:px-10">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {stats.map((stat) => (
                                <Card key={stat.label} className="rounded-2xl border-[#d7ccad] bg-[#f8f4ea] dark:border-[#2a4f47] dark:bg-[#14312c]">
                                    <CardContent className="p-5">
                                        <p className="text-xs tracking-[0.2em] text-[#8a6a2f] uppercase dark:text-[#cfb67c]">{stat.label}</p>
                                        <p className="font-display mt-3 text-3xl text-[#14312c] dark:text-[#f5eed9]">{stat.value}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </main>

                <footer className="bg-[#1f4035] text-[#e8f0ec] dark:bg-[#0a1d18]">
                    <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-16 md:grid-cols-4 lg:px-10">
                        <div>
                            <h3 className="font-display text-3xl">{brand.product_name}</h3>
                            <p className="mt-4 max-w-xs text-sm text-[#d3e1db]">Curating luxury stays across evocative landscapes of the Indian Ocean.</p>
                            <div className="mt-5 flex gap-3 text-[#d3e1db]">
                                <Globe className="h-5 w-5" />
                                <Leaf className="h-5 w-5" />
                                <Palmtree className="h-5 w-5" />
                            </div>
                        </div>

                        <div>
                            <p className="text-xs tracking-[0.2em] text-[#cfb67c] uppercase">Destinations</p>
                            <ul className="mt-4 space-y-3 text-sm text-[#d3e1db]">
                                <li>Maldives</li>
                                <li>Tea Country</li>
                                <li>Cultural Triangle</li>
                                <li>South Coast</li>
                            </ul>
                        </div>

                        <div>
                            <p className="text-xs tracking-[0.2em] text-[#cfb67c] uppercase">Editorial</p>
                            <ul className="mt-4 space-y-3 text-sm text-[#d3e1db]">
                                <li>Journal</li>
                                <li>Experiences</li>
                                <li>Our Story</li>
                                <li>Sustainability</li>
                            </ul>
                        </div>

                        <div>
                            <p className="text-xs tracking-[0.2em] text-[#cfb67c] uppercase">Stay Connected</p>
                            <p className="mt-4 text-sm text-[#d3e1db]">Subscribe for private offers and curated travel inspiration.</p>
                            <div className="mt-4 flex gap-2">
                                <Input placeholder="Email address" className="border-[#2f5d51] bg-[#1a3a31] text-[#ecf3ef] placeholder:text-[#b4c6be]" />
                                <Button className="rounded-full bg-[#cfb67c] px-5 text-[#14312c] hover:bg-[#dcc99a]">Join</Button>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-[#2f5d51] px-6 py-5 text-center text-xs tracking-[0.15em] text-[#b6c8c0] uppercase lg:px-10">
                        {brand.product_name} • Staff operations portal with private dashboard URL access only
                    </div>
                </footer>
            </div>
        </>
    );
}
