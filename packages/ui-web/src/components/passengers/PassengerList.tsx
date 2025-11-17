import React from 'react';
import { Passenger } from '@mishwari/types';
import { PassengerItem } from './PassengerItem';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/button';

interface PassengerListProps {
  passengers: Passenger[];
  onAdd?: () => void;
  onEdit?: (passenger: Passenger) => void;
  onDelete?: (passenger: Passenger) => void;
  onToggleCheck?: (passenger: Passenger) => void;
  showCheckbox?: boolean;
  title?: string;
  emptyMessage?: string;
}

export const PassengerList: React.FC<PassengerListProps> = ({
  passengers,
  onAdd,
  onEdit,
  onDelete,
  onToggleCheck,
  showCheckbox = true,
  title = 'الركاب',
  emptyMessage = 'لا يوجد ركاب',
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-start items-center gap-2 mb-2">
        <h1 className="text-lg font-bold">{title}</h1>
        {onAdd && (
          <button
            onClick={onAdd}
            className="mr-auto text-gray-600 hover:text-gray-900 transition-colors"
            type="button"
          >
            <UserPlusIcon className="h-6 w-6" />
          </button>
        )}
      </div>
      <div className="h-[1px] w-full mb-2 bg-slate-500" />
      {passengers.length === 0 ? (
        <div className="flex justify-center items-center py-8">
          {onAdd ? (
            <Button onClick={onAdd} variant="outline" className="w-1/3 min-w-[100px]">
              اضف راكب
            </Button>
          ) : (
            <p className="text-gray-500">{emptyMessage}</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col divide-y">
          {passengers.map((passenger) => (
            <PassengerItem
              key={passenger.id}
              passenger={passenger}
              onEdit={onEdit ? () => onEdit(passenger) : undefined}
              onDelete={onDelete ? () => onDelete(passenger) : undefined}
              onToggleCheck={onToggleCheck ? () => onToggleCheck(passenger) : undefined}
              showCheckbox={showCheckbox}
            />
          ))}
        </div>
      )}
    </div>
  );
};
