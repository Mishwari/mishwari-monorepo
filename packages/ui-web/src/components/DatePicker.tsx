import React, { useState } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, isSameMonth, isBefore, startOfDay } from 'date-fns';
import { ar } from 'date-fns/locale';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface DatePickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  minDate?: Date;
}

export const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateSelect, minDate = new Date() }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 6 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 6 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const goToPreviousMonth = () => setCurrentMonth(addMonths(currentMonth, -1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const dayNames = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  const dayNamesShort = ['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج'];

  return (
    <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 w-[calc(100vw-2rem)] sm:w-full max-w-md border border-mishwari-gray-200">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <button 
          type="button"
          onClick={goToPreviousMonth} 
          className="p-2 hover:bg-mishwari-gray-100 rounded-lg transition-colors"
        >
          <ChevronRightIcon className="w-5 h-5 text-mishwari-text-dark" />
        </button>
        <h3 className="text-lg font-bold text-mishwari-text-dark">
          {format(currentMonth, 'MMMM yyyy', { locale: ar })}
        </h3>
        <button 
          type="button"
          onClick={goToNextMonth} 
          className="p-2 hover:bg-mishwari-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5 text-mishwari-text-dark" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-3">
        {dayNames.map((day, index) => (
          <div key={index} className="text-center text-xs sm:text-sm font-semibold text-mishwari-gray-600 py-2">
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{dayNamesShort[index]}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {calendarDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isPast = isBefore(startOfDay(day), startOfDay(minDate));

          return (
            <button
              type="button"
              key={day.toISOString()}
              onClick={() => !isPast && onDateSelect(day)}
              disabled={isPast}
              className={`
                relative aspect-square rounded-lg text-sm sm:text-base font-medium transition-all flex items-center justify-center
                ${
                  isPast
                    ? 'text-mishwari-gray-300 cursor-not-allowed'
                    : isSelected
                      ? 'bg-mishwari-primary text-white shadow-md scale-105'
                      : isTodayDate
                        ? 'bg-mishwari-primary/10 text-mishwari-primary font-bold ring-2 ring-mishwari-primary/30'
                        : isCurrentMonth
                          ? 'text-mishwari-text-dark hover:bg-mishwari-gray-100 hover:scale-105'
                          : 'text-mishwari-gray-400'
                }
              `}
            >
              {format(day, 'd')}
              {isTodayDate && !isSelected && (
                <span className="absolute bottom-0.5 sm:bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-mishwari-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
