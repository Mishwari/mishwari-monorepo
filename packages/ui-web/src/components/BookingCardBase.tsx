import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';

interface BookingCardBaseProps {
  bookingId: string | number;
  fromCity: string;
  toCity: string;
  date?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  className?: string;
  children?: React.ReactNode;
}

const statusVariants = {
  pending: 'warning' as const,
  confirmed: 'success' as const,
  cancelled: 'destructive' as const,
  completed: 'info' as const,
};

const statusLabels = {
  pending: 'قيد الانتظار',
  confirmed: 'مؤكد',
  cancelled: 'ملغي',
  completed: 'مكتمل',
};

export const BookingCardBase: React.FC<BookingCardBaseProps> = ({
  bookingId,
  fromCity,
  toCity,
  date,
  status,
  className,
  children,
}) => {
  return (
    <Card className={cn('p-4', className)}>
      <div className="space-y-3">
        {/* Booking ID and Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">رقم الحجز: {bookingId}</span>
          {status && (
            <Badge variant={statusVariants[status]}>
              {statusLabels[status]}
            </Badge>
          )}
        </div>

        {/* Route */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-brand-text-dark">{fromCity}</span>
          <span className="text-gray-400">←</span>
          <span className="font-bold text-brand-text-dark">{toCity}</span>
        </div>

        {/* Date */}
        {date && (
          <div className="text-sm text-gray-600">{date}</div>
        )}

        {/* Role-specific content slot */}
        {children}
      </div>
    </Card>
  );
};
