import React from 'react';
import { Card } from './ui/card';
import { cn } from '../lib/utils';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface TripCardBaseProps {
  fromCity: string;
  toCity: string;
  date?: string;
  time?: string;
  className?: string;
  children?: React.ReactNode;
}

export const TripCardBase: React.FC<TripCardBaseProps> = ({
  fromCity,
  toCity,
  date,
  time,
  className,
  children,
}) => {
  return (
    <Card className={cn('p-4', className)}>
      <div className="space-y-3">
        {/* Route display */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-brand-text-dark">{fromCity}</span>
          <ArrowRightIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <span className="text-lg font-bold text-brand-text-dark">{toCity}</span>
        </div>

        {/* Date/Time display */}
        {(date || time) && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {date && <span>{date}</span>}
            {date && time && <span>•</span>}
            {time && <span>{time}</span>}
          </div>
        )}

        {/* Role-specific content slot */}
        {children}
      </div>
    </Card>
  );
};
