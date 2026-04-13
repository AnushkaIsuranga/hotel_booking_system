import { Badge } from '@/components/ui/badge';
import { bookingStatusClass, formatLabel, roleClass, roomStatusClass } from '@/lib/hotel';

type StatusVariant = 'booking' | 'room' | 'role';

interface StatusBadgeProps {
    value: string;
    variant?: StatusVariant;
}

export function StatusBadge({ value, variant = 'booking' }: StatusBadgeProps) {
    const className = variant === 'room' ? roomStatusClass(value) : variant === 'role' ? roleClass(value) : bookingStatusClass(value);

    return (
        <Badge variant="outline" className={className}>
            {formatLabel(value)}
        </Badge>
    );
}
