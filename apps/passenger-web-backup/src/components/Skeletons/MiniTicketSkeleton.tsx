import {
  CreditCardIcon,
  UsersIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/solid';
import React from 'react';
import useAuth from '@/hooks/useAuth';

const MiniTicketSkeleton: React.FC = () => {
  return (
    <div className='bg-inherit relative flex items-center justify-center  '>
      {/* fix with https://codepen.io/ahmedbeheiry/pen/rNBQOLE?editors=1100 */}
      <div
        className={` upper-part2  rounded-lg  shadow-lg  py-2 px-4 w-full mx-2 ${
          false ? 'bg-rose-100' : 'bg-gray-200'
        } `}>
        <div className='animate-pulse flex justify-between px-4 mb-4 py-1 items-center'>
          <div>
            <h2 className='text-lg bg-gray-400 h-[28px] w-[60px] rounded-lg font-semibold'></h2>
          </div>
          <div className='text-center'>
            <p className='text-sm bg-gray-400 h-[20px] w-[60px] rounded-lg font-semibold'></p>
          </div>
          <div>
            <h2 className='text-lg bg-gray-400 h-[28px] w-[60px] rounded-lg font-semibold'></h2>
          </div>
        </div>

        <div className='mx-auto border-t border-dashed border-gray-900  w-full'></div>
        <div className='animate-pulse flex justify-between items-center px-4 text-gray-600 text-xs mt-2'>
          <div className='flex items-center gap-1.5 '>
            <CalendarDaysIcon className='h-6 w-6 text-gray-500' />
            <p className='bg-gray-400 h-[16px] w-[47px] rounded-lg'> </p>
          </div>
          <div className='flex gap-1.5 items-center space-x-2'>
            <UsersIcon className='h-6 w-6 text-gray-500' />
            <p className='bg-gray-400 h-[16px] w-[47px] rounded-lg'> </p>
          </div>
          <div className='flex gap-1.5 items-center space-x-2'>
            <CreditCardIcon className='h-6 w-6 text-gray-500' />
            <p className='bg-gray-400 h-[16px] w-[47px] rounded-lg'> </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniTicketSkeleton;
