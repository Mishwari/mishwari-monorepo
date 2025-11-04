import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ar } from 'date-fns/locale';

interface DatePickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateSelect }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 6 }); // Saturday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 6 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const goToPreviousWeek = () => {
    setCurrentWeek(addDays(currentWeek, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeek(addDays(currentWeek, 7));
  };

  const dayNames = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س']; // Arabic day names

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={goToPreviousWeek}
          className="p-2 hover:bg-gray-100 rounded"
        >
          ←
        </button>
        <h3 className="font-semibold text-gray-800">
          {format(currentWeek, 'MMMM yyyy', { locale: ar })}
        </h3>
        <button 
          onClick={goToNextWeek}
          className="p-2 hover:bg-gray-100 rounded"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day, index) => (
          <div key={index} className="text-center text-sm font-medium text-gray-500 p-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={`
                p-3 text-sm rounded-lg transition-colors
                ${isSelected 
                  ? 'bg-brand-primary text-white' 
                  : isTodayDate 
                    ? 'bg-brand-primary/10 text-brand-primary font-bold'
                    : 'hover:bg-gray-100'
                }
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DatePicker;