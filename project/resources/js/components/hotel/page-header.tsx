import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
    eyebrow?: string;
    title: string;
    description: string;
    action?: {
        href: string;
        label: string;
    };
    backHref?: string;
}

export function PageHeader({ eyebrow, title, description, action, backHref }: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-[0_20px_60px_-30px_rgba(13,38,35,0.35)] backdrop-blur md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
                {eyebrow && <p className="text-xs font-semibold tracking-[0.28em] text-[#8a6a2f] uppercase">{eyebrow}</p>}
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        {backHref && (
                            <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-full">
                                <Link href={backHref}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                        )}
                        <h1 className="font-display text-3xl font-semibold tracking-tight text-[#14312c]">{title}</h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl text-sm leading-6">{description}</p>
                </div>
            </div>
            {action && (
                <Button asChild className="rounded-full bg-[#14312c] px-6 text-white hover:bg-[#1b433c]">
                    <Link href={action.href}>{action.label}</Link>
                </Button>
            )}
        </div>
    );
}
