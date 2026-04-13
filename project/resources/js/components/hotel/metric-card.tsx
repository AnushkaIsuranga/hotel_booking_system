import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string;
    hint: string;
    icon: LucideIcon;
    accent?: string;
}

export function MetricCard({ title, value, hint, icon: Icon, accent = 'from-[#14312c] to-[#2a6258]' }: MetricCardProps) {
    return (
        <Card className="overflow-hidden rounded-[24px] border-0 bg-white shadow-[0_18px_40px_-28px_rgba(14,49,44,0.45)]">
            <CardHeader className="relative pb-3">
                <div className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', accent)} />
                <div className="flex items-center justify-between">
                    <CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
                    <div className="rounded-full border border-[#d9e6e1] bg-[#f4f8f7] p-2 text-[#14312c]">
                        <Icon className="h-4 w-4" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="font-display text-3xl font-semibold tracking-tight text-[#14312c]">{value}</p>
                <p className="text-muted-foreground text-sm">{hint}</p>
            </CardContent>
        </Card>
    );
}
