import React from 'react';
import { Passenger } from '@mishwari/types';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

interface PassengerItemProps {
  passenger: Passenger;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleCheck?: () => void;
  showCheckbox?: boolean;
}

export const PassengerItem: React.FC<PassengerItemProps> = ({
  passenger,
  onEdit,
  onDelete,
  onToggleCheck,
  showCheckbox = true,
}) => {
  return (
    <div className="group flex justify-start items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-200">
      {showCheckbox && onToggleCheck && (
        <input
          type="checkbox"
          checked={passenger.is_checked ?? false}
          onChange={onToggleCheck}
          className="w-5 h-5 cursor-pointer accent-brand-primary rounded border-gray-300 focus:ring-2 focus:ring-brand-primary focus:ring-offset-1 transition-all"
        />
      )}
      <div className="flex-1 min-w-0">
        <h1 className="font-bold text-gray-900 truncate group-hover:text-brand-primary transition-colors">{passenger.name}</h1>
        <div className="flex items-center gap-2 mt-1">
          {passenger.phone && (
            <p className="text-sm text-gray-600 truncate">{passenger.phone}</p>
          )}
          {passenger.age && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{passenger.age} سنة</span>
          )}
          {passenger.gender && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{passenger.gender === 'male' ? 'ذكر' : 'أنثى'}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-150"
            type="button"
            title="تعديل"
          >
            <PencilSquareIcon className="w-5 h-5" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-150"
            type="button"
            title="حذف"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};
