import React, { useState, useEffect } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { ar } from 'date-fns/locale';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { DatePicker } from '@mishwari/ui-web';
import ClientOnly from './ClientOnly';

interface QuickDaySelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const QuickDaySelector: React.FC<QuickDaySelectorProps> = ({ selectedDate, onDateChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [days, setDays] = useState<Array<{date: Date, label: string}>>([]);
  const [dayCount, setDayCount] = useState(4);
  
  const selectedDateObj = new Date(selectedDate);
  
  useEffect(() => {
    const updateDayCount = () => {
      const width = window.innerWidth;
      if (width >= 1024) setDayCount(8); // Desktop
      else if (width >= 768) setDayCount(6); // Tablet
      else setDayCount(4); // Mobile
    };
    
    updateDayCount();
    window.addEventListener('resize', updateDayCount);
    return () => window.removeEventListener('resize', updateDayCount);
  }, []);
  
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
    <div className="w-full bg-transparent p-2">
      <div className="flex gap-2">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => onDateChange(format(day.date, 'yyyy-MM-dd'))}
            className={`flex-1 h-12 rounded-lg text-xs font-medium transition-colors flex flex-col items-center justify-center ${
              isSameDay(day.date, selectedDateObj)
                ? 'bg-brand-primary text-white'
                : 'bg-blue-100 text-brand-primary hover:bg-brand-primary hover:text-white'
            }`}
          >
            <div className="truncate text-[10px]">{day.label}</div>
            <div className="font-bold">{format(day.date, 'd')}</div>
          </button>
        ))}
        
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex-1 h-12 rounded-lg bg-blue-100 text-brand-primary hover:bg-brand-primary hover:text-white flex flex-col items-center justify-center relative transition-colors"
        >
          <CalendarDaysIcon className="w-4 h-4" />
          <span className="text-[10px]">تقويم</span>
          
          {showCalendar && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowCalendar(false)}
              />
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <ClientOnly>
                  <DatePicker
                    selectedDate={selectedDateObj}
                    onDateSelect={(date) => {
                      onDateChange(format(date, 'yyyy-MM-dd'));
                      setShowCalendar(false);
                    }}
                  />
                </ClientOnly>
              </div>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuickDaySelector;