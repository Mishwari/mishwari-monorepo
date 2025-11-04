import React from 'react';
import { CalendarDaysIcon, CreditCardIcon, UsersIcon  } from '@heroicons/react/24/outline';
import { Booking } from '@/types/booking';

interface MiniTicketProps {
    booking: Booking;
  }
function MiniTicket({booking}:MiniTicketProps) {
  return (
    <div className='bg-inherit relative flex items-center justify-center  '>
        {/* fix with https://codepen.io/ahmedbeheiry/pen/rNBQOLE?editors=1100 */}
     <div className={` upper-part2 rounded-lg  shadow-lg  py-2 px-4 w-full mx-2 ${booking.status === 'cancelled'? 'bg-rose-100':'bg-gray-200'} `}>
        <div className='flex justify-between px-4 mb-4 py-1 items-center'>
          <div>
            <h2 className='text-lg text-gray-700 font-semibold'>{booking.trip.pickup.city}</h2>
          </div>
          <div className='text-center'>
            <p className='text-sm text-gray-700 font-semibold'>3:05 ساعة</p>
          </div>
          <div>
            <h2 className='text-lg text-gray-700 font-semibold'>{booking.trip.destination.city}</h2>
          </div>
        </div>
        
        <div className='mx-auto border-t border-dashed border-gray-900  w-full'></div>
        <div className='flex justify-between items-center px-4 text-gray-600 text-xs mt-2'>
          <div className='flex items-center gap-1.5 '>
            
          <CalendarDaysIcon className="h-6 w-6 text-gray-500" />
            <p>27 مارس</p>
          </div>
          <div className='flex gap-1.5 items-center space-x-2'>
          <UsersIcon  className="h-6 w-6 text-gray-500" />
            <p>{booking.passengers.length} اشخاص</p>
          </div>
          <div className='flex gap-1.5 items-center space-x-2'>
            
          <CreditCardIcon  className="h-6 w-6 text-gray-500" />
            <p>{booking.trip.price} ريال</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiniTicket;
