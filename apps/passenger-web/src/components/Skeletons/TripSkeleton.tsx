import {
  CreditCardIcon,
  UsersIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/solid';
import React from 'react';
import useAuth from '@/hooks/useAuth';

const TripSkeleton: React.FC = () => {
  return (
    <div className='animate-pulse mt-5 justify-between md:flex px-2 sm:px-4 shadow-md border border-[#a4a4a48e] bg-white rounded-xl transition ease-out duration-400'>
      <div className='flex justify-between md:gap-9 items-center p-4'>
        <div className=''>
          <h1 className=' bg-gray-400 h-[26px] mb-[2px] w-[150px] rounded-lg'></h1>
          <h5 className='bg-gray-400 h-[20px] w-[60px] rounded-lg'></h5>
        </div>
        <div
          className={`flex justify-center items-center rounded-xl px-1 py-0.5 h-[25px] w-[60px]  bg-gray-400`}>
          <h1 className='text-white font-black pr-1 '></h1>
        </div>
      </div>
      <div className='flex p-4 gap-2 md:gap-9 justify-between items-center'>
        <div className=''>
          <div className='flex gap-1 items-center'>
            <h1 className='bg-gray-400 h-[24px] w-[150px] rounded-lg'></h1>
          </div>
          <div className='flex gap-4 mt-2  h-[24px] w-full '>
            <span className='h-full w-[24px] bg-gray-400 rounded-full'></span>
            <span className='h-full w-[24px] bg-gray-400 rounded-full'></span>
            <span className='h-full w-[24px] bg-gray-400 rounded-full'></span>
          </div>
        </div>
        <div>
          <h1 className='bg-gray-400 h-[32px] w-[100px] rounded-lg'></h1>
          <h1
            className={`bg-gray-400 my-[1px] h-[14px] w-[60px] rounded-lg`}></h1>
        </div>
      </div>
    </div>
  );
};

export default TripSkeleton;
