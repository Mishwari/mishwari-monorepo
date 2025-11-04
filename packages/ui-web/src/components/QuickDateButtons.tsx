import React from 'react';
import { format, isSameDay } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '../lib/utils';

interface QuickDateOption {
  date: Date;
  label: string;
}

interface QuickDateButtonsProps {
  options: QuickDateOption[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  className?: string;
}

export const QuickDateButtons: React.FC<QuickDateButtonsProps> = ({
  options,
  selectedDate,
  onDateSelect,
  className,
}) => {
  return (
    <div className={cn('flex gap-2', className)}>
      {options.map((option, index) => {
        const isSelected = isSameDay(option.date, selectedDate);
        
        return (
          <button
            type="button"
            key={index}
            onClick={() => onDateSelect(option.date)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              isSelected
                ? 'bg-brand-primary text-white'
                : 'bg-gray-200 text-brand-text-dark hover:bg-brand-primary/10'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
