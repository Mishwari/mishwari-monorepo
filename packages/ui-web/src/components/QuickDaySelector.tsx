import React, { useState, useEffect } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { ar } from 'date-fns/locale';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { DatePicker } from './DatePicker';

interface QuickDaySelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  showCalendar?: boolean;
  className?: string;
}

export const QuickDaySelector: React.FC<QuickDaySelectorProps> = ({ 
  selectedDate, 
  onDateSelect,
  showCalendar = true,
  className = ''
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [days, setDays] = useState<Array<{date: Date, label: string}>>([]);
  const [dayCount, setDayCount] = useState(4);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const updateDayCount = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const buttonSize = 48; // Fixed button size (h-12)
      const gap = 8; // gap-2
      const calendarButtonSize = showCalendar ? buttonSize + gap : 0;
      const availableWidth = containerWidth - calendarButtonSize - 16; // padding
      const maxButtons = Math.floor((availableWidth + gap) / (buttonSize + gap));
      setDayCount(Math.max(2, Math.min(maxButtons, 14))); // Min 2, max 14 days
    };
    
    updateDayCount();
    window.addEventListener('resize', updateDayCount);
    return () => window.removeEventListener('resize', updateDayCount);
  }, [showCalendar]);
  
  useEffect(() => {
    const today = new Date();
    const daysList = [];
    
    for (let i = 0; i < dayCount; i++) {
      const date = addDays(today, i);
      let label = '';
      
      if (i === 0) label = 'اليوم';
      else if (i === 1) label = 'غداً';
      else label = format(date, 'EEE', { locale: ar });
      
      daysList.push({ date, label });
    }
    
    setDays(daysList);
  }, [dayCount]);

  return (
    <div ref={containerRef} className={`w-full bg-transparent p-2 ${className}`}>
      <div className="flex justify-between">
        {days.map((day, index) => (
          <button
            type="button"
            key={index}
            onClick={() => onDateSelect(day.date)}
            className={`w-12 h-12 rounded-lg text-xs font-medium transition-all flex flex-col items-center justify-center ${
              isSameDay(day.date, selectedDate)
                ? 'bg-brand-primary text-white ring-2 ring-white shadow-lg'
                : 'bg-blue-100 text-brand-primary hover:bg-blue-200'
            }`}
          >
            <div className="truncate text-[10px]">{day.label}</div>
            <div className="font-bold">{format(day.date, 'd')}</div>
          </button>
        ))}
        
        {showCalendar && (
          <button
            type="button"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="w-12 h-12 rounded-lg bg-blue-100 text-brand-primary hover:bg-brand-primary hover:text-white flex flex-col items-center justify-center relative transition-colors"
          >
            <CalendarDaysIcon className="w-4 h-4" />
            <span className="text-[10px]">تقويم</span>
            
            {isCalendarOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsCalendarOpen(false)}
                />
                <div 
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DatePicker
                    selectedDate={selectedDate}
                    onDateSelect={(date) => {
                      onDateSelect(date);
                      setIsCalendarOpen(false);
                    }}
                  />
                </div>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
