import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import DoubleSlider from './DoubleSlider';
import WhiteMassbus from '@mishwari/ui-web/public/icons/trip-types/White_massbus.svg';
import BlackMassbus from '@mishwari/ui-web/public/icons/trip-types/Black_massbus.svg';
import WhiteBulkabus from '@mishwari/ui-web/public/icons/trip-types/White_Bulkabus.svg';
import BlackBulkabus from '@mishwari/ui-web/public/icons/trip-types/Black_Bulkabus.svg';
import WhiteMorning from '@mishwari/ui-web/public/icons/trip-types/White_Morning.svg';
import BlackMorning from '@mishwari/ui-web/public/icons/trip-types/Black_Morning.svg';
import WhiteEvening from '@mishwari/ui-web/public/icons/trip-types/White_Evening.svg';
import BlackEvening from '@mishwari/ui-web/public/icons/trip-types/Black_Evening.svg';
import WhiteStarIcon from '@mishwari/ui-web/public/icons/trip-types/White_StarIcon.svg';
import BlackStarIcon from '@mishwari/ui-web/public/icons/trip-types/Black_StarIcon.svg';

interface FilterGroupProps {
  filterBuses: any;
  setFilterBuses: any;
  filteredTrips: any;
}

function FilterGroup({
  filterBuses,
  setFilterBuses,
  filteredTrips,
}: FilterGroupProps) {
  const OnTarvelModeSelected = (e: any, busGroup: string) => {
    let selectedvalue = e.target.value; //mass

    if (busGroup === 'Rating') {
      selectedvalue = parseInt(selectedvalue, 10);
    }

    setFilterBuses((prevValue: any) => {
      const updatedValues = [...prevValue[busGroup]];

      if (e.target.checked) {
        updatedValues.push(selectedvalue);
      } else {
        const index = updatedValues.indexOf(selectedvalue);
        if (index > -1) {
          updatedValues.splice(index, 1);
        }
      }
      return {
        ...prevValue,
        [busGroup]: updatedValues,
      };
    });
  };

  //   {
  //     "BusType": [],
  //     "Departure": [],
  //     "Rating": [],
  //     "Min": [
  //         230
  //     ],
  //     "Max": [
  //         230
  //     ]
  // }

  function areAllArraysEmpty(obj: any) {
    return Object.entries(obj)
      .filter(([key]) => key !== 'Min' && key !== 'Max')
      .every(([_, arr]) => Array.isArray(arr) && arr.length === 0);
  }

  const [initialMinPrice, setInitialMinPrice] = useState(0);
  const [initialMaxPrice, setInitialMaxPrice] = useState(0);

  useEffect(() => {
    if (filteredTrips && filteredTrips.length > 0) {
      const prices = filteredTrips.map((trip: { price: any }) => trip.price); // Extract prices from trips
      setInitialMinPrice(Math.min(...prices)); // Spread operator to pass all prices as arguments
      setInitialMaxPrice(Math.max(...prices));
    }
  }, [filteredTrips]);

  useEffect(() => {
    setFilterBuses((prevState: any) => ({
      ...prevState,
      Min: initialMinPrice,
      Max: initialMaxPrice,
    }));
  }, [initialMinPrice, initialMaxPrice]);

  const clearAllSelectedFilters = () => {
    // ...
    const clearedFilters = {
      BusType: [],
      Departure: [],
      Rating: [],
      Min: initialMinPrice,
      Max: initialMaxPrice,
    };

    setFilterBuses(clearedFilters);
  };

  const handleMinPriceChange = (newMinPrice: number) => {
    setFilterBuses((prev: any) => ({
      ...prev,
      Min: newMinPrice,
    }));
  };


  const handleMaxPriceChange = (newMaxPrice: any) => {
    setFilterBuses((prev: any) => ({
      ...prev,
      Max: newMaxPrice,
    }));
  };
  return (
    <div className=' flex flex-col py-3   md:overflow-y-auto'>
      {/* <div className='flex items-start justify-start gap-3 m-2'>
        <button
          type='button'
          onClick={() => setIsFilterOpen(false)}
          className='md:hidden rotate-180 focus:outline-none'>
          <Image
            src='/ui-web/icons/common/leftArrow.svg'
            alt='leftArrow'
            height={30}
            width={30}
          />
        </button>
        <Dialog.Title className='text-xl font-medium text-gray-900'>
          الفلاتر
        </Dialog.Title>
      </div> */}
      <div className='absolute  self-end'>
        {!areAllArraysEmpty(filterBuses) && (
          <button
            type='button'
            onClick={clearAllSelectedFilters}
            className='mx-2 text-lg text-sky-700 pr-4 '>
            حذف الاختيارات
          </button>
        )}
      </div>
      <div className='mt-8 h-full gap-8 relative flex flex-col px-4 sm:px-6'>
        {/* Bus type filter */}
        <div>
          <h1 className='font-bold'>نوع الباص </h1>
          <div className='flex items-center gap-x-4 py-2'>
            <label
              className={`border px-4 py-2 flex flex-col items-center rounded-lg cursor-pointer ${
                filterBuses['BusType'].includes('جماعي')
                  ? 'bg-[#005587db]  text-white'
                  : ' border-slate-300'
              }`}>
              <input
                type='checkbox'
                value='جماعي'
                className='hidden'
                checked={filterBuses['BusType'].includes('جماعي')}
                onChange={(e) => OnTarvelModeSelected(e, 'BusType')}
              />
              {filterBuses['BusType'].includes('جماعي') ? (
                <WhiteMassbus className='h-5 w-5' />
              ) : (
                <BlackMassbus className='h-5 w-5' />
              )}
              <p className='text-xs pt-1'>نقل جماعي</p>
            </label>

            <label
              className={`border px-4 py-2 flex flex-col items-center rounded-lg cursor-pointer ${
                filterBuses['BusType'].includes('بلكة')
                  ? 'bg-[#005587db] text-white'
                  : 'border-slate-300'
              }`}>
              <input
                className='hidden'
                type='checkbox'
                value='بلكة'
                checked={filterBuses['BusType'].includes('بلكة')}
                onChange={(e) => OnTarvelModeSelected(e, 'BusType')}
              />
              {filterBuses['BusType'].includes('بلكة') ? (
                <WhiteBulkabus className='h-5 w-5' />
              ) : (
                <BlackBulkabus className='h-5 w-5' />
              )}
              <p className='text-xs pt-1'>باص بلكة</p>
            </label>
          </div>
          <p className='border-b border-slate-500 h-2 w-full'></p>
        </div>

        {/* Bus Departure */}
        <div>
          <h1 className='font-bold pt-1'>المغادرة من المكلا</h1>
          <div className='flex items-center gap-x-2 py-2'>
            <label
              className={`h-16 w-24 border py-2 flex flex-col items-center rounded-lg cursor-pointer ${
                filterBuses['Departure'].includes('morning')
                  ? 'bg-[#005587db] text-white'
                  : ' border-slate-300'
              }`}>
              <input
                className='hidden'
                type='checkbox'
                value='morning'
                checked={filterBuses['Departure'].includes('morning')}
                onChange={(e) => OnTarvelModeSelected(e, 'Departure')}
              />
              {filterBuses['Departure'].includes('morning') ? (
                <WhiteMorning className='h-5 w-5' />
              ) : (
                <BlackMorning className='h-5 w-5' />
              )}
              <p className='text-xs pt-1'>الصباح</p>
            </label>

            <label
              className={`h-16 w-24 border p-2 flex flex-col items-center rounded-lg cursor-pointer ${
                filterBuses['Departure'].includes('evening')
                  ? 'bg-[#005587db] text-white'
                  : ' border-slate-300'
              }`}>
              <input
                className='hidden'
                type='checkbox'
                value='evening'
                onChange={(e) => OnTarvelModeSelected(e, 'Departure')}
                checked={filterBuses['Departure'].includes('evening')}
              />
              {filterBuses['Departure'].includes('evening') ? (
                <WhiteEvening className='h-5 w-5' />
              ) : (
                <BlackEvening className='h-5 w-5' />
              )}
              <p className='text-xs pt-1'>المساء</p>
            </label>
          </div>
          <p className=' border-b border-slate-500 h-2 w-full'></p>
        </div>

        {/* Bus Rating */}
        <div>
          <h1 className='font-bold pt-1'>تقييم الباص</h1>
          <div className='flex items-center flex-wrap gap-2 py-2'>
            <label
              className={`border  px-2 py-0.5  rounded-full  flex  justify-center items-center cursor-pointer ${
                filterBuses['Rating'].includes(4)
                  ? 'bg-[#005587db] text-white'
                  : ' border-slate-300'
              }`}>
              <input
                className='hidden'
                type='checkbox'
                value={4}
                checked={filterBuses['Rating'].includes(4)}
                onChange={(e) => OnTarvelModeSelected(e, 'Rating')}
              />
              {filterBuses['Rating'].includes(4) ? (
                <WhiteStarIcon className='h-6 w-6' />
              ) : (
                <BlackStarIcon className='h-6 w-6' />
              )}
              <p className='text-base'>4 و اعلى</p>
            </label>

            <label
              className={`border px-2 py-0.5 rounded-full   flex  justify-center items-center cursor-pointer ${
                filterBuses['Rating'].includes(3)
                  ? 'bg-[#005587db] text-white'
                  : ' border-slate-300'
              }`}>
              <input
                className='hidden'
                type='checkbox'
                value={3}
                checked={filterBuses['Rating'].includes(3)}
                onChange={(e) => OnTarvelModeSelected(e, 'Rating')}
              />
              {filterBuses['Rating'].includes(3) ? (
                <WhiteStarIcon className='h-6 w-6' />
              ) : (
                <BlackStarIcon className='h-6 w-6' />
              )}
              <p className='text-base'>3 و اعلى</p>
            </label>

            <label
              className={`border  px-2 py-0.5 rounded-full w-fit flex  justify-center items-center cursor-pointer ${
                filterBuses['Rating'].includes(2)
                  ? 'bg-[#005587db] text-white'
                  : ' border-slate-300'
              }`}>
              <input
                className='hidden'
                type='checkbox'
                value={2}
                checked={filterBuses['Rating'].includes(2)}
                onChange={(e) => OnTarvelModeSelected(e, 'Rating')}
              />
              {filterBuses['Rating'].includes(2) ? (
                <WhiteStarIcon className='h-6 w-6' />
              ) : (
                <BlackStarIcon className='h-6 w-6' />
              )}
              <p className='text-base'>2 و اعلى</p>
            </label>
          </div>
          <p className='border-b border-slate-500 h-2 w-full'></p>
        </div>

        {/* Bus Cost */}

        <div>
          <h1 className='font-bold pt-1'>السعر</h1>

          <DoubleSlider
            min={initialMinPrice}
            max={initialMaxPrice}
            modifiedMin={filterBuses.Min}
            modifiedMax={filterBuses.Max}
            handleMinPriceChange={handleMinPriceChange}
            handleMaxPriceChange={handleMaxPriceChange}
          />
        </div>
      </div>
    </div>
  );
}

export default FilterGroup;
