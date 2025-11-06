import React from 'react';
import { format, addDays, isToday, isTomorrow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface QuickDateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const QuickDateSelector: React.FC<QuickDateSelectorProps> = ({ selectedDate, onDateSelect }) => {
  const today = new Date();
  const tomorrow = addDays(today, 1);

  const formatDateArabic = (date: Date) => {
    return format(date, 'EEEE, d MMMM', { locale: ar });
  };

  return (
    <div className="flex gap-2 items-center">
      <span className="text-gray-700 font-medium">
        {formatDateArabic(selectedDate)}
      </span>
      
      <button
        onClick={() => onDateSelect(today)}
        className={`px-3 py-1 rounded-xl text-sm transition-colors ${
          isToday(selectedDate)
            ? 'bg-[#f4fafe] text-gray-500 border border-[#23547011]'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        اليوم
      </button>
      
      <button
        onClick={() => onDateSelect(tomorrow)}
        className={`px-3 py-1 rounded-xl text-sm font-bold transition-colors ${
          isTomorrow(selectedDate)
            ? 'bg-blue-100 text-[#005687] shadow-sm border border-[#437ea186]'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        غداً
      </button>
    </div>
  );
};

export default QuickDateSelector;