import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import DoubleSlider from './DoubleSlider';
import FilterGroup from './FilterGroup';

interface FilterGroupProps {
  filterBuses: any;
  setFilterBuses: any;
  isFilterOpen: boolean;
  setIsFilterOpen: any;
  filteredTrips: any;
}

function FilterGroupModal({
  filterBuses,
  setFilterBuses,
  isFilterOpen,
  setIsFilterOpen,
  filteredTrips,
}: FilterGroupProps) {
  const [localFilters, setLocalFilters] = useState(filterBuses);

  useEffect(() => {
    setLocalFilters(filterBuses);
  }, [filterBuses, isFilterOpen]);

  // const OnTarvelModeSelected = (e: any, busGroup: string) => {
  //   let selectedvalue = e.target.value; //mass

  //   if (busGroup === 'Rating') {
  //     selectedvalue = parseInt(selectedvalue, 10);
  //   }

  //   setLocalFilters((prevValue:any) => {
  //     const updatedValues = [...prevValue[busGroup]];

  //     if (e.target.checked) {
  //       updatedValues.push(selectedvalue);
  //     } else {
  //       const index = updatedValues.indexOf(selectedvalue);
  //       if (index > -1) {
  //         updatedValues.splice(index, 1);
  //       }
  //     }
  //     return {
  //       ...prevValue,
  //       [busGroup]: updatedValues,
  //     };
  //   });
  // };

  //   const clearAllSelectedFilters = () => {
  //     // ...
  //     const clearedFilters = {
  //         BusType: [],
  //         Departure: [],
  //         Rating: [],
  //         Min:[initialMinPrice],
  //         Max:[initialMaxPrice],
  //     };

  //     setLocalFilters(clearedFilters);
  // };

  // const clearAllSelectedFilters = () => {
  //   setLocalFilters((prevState:any) => {
  //     const newState = { ...prevState }; // Clone the current state
  //     for (const key in newState) {
  //       newState[key] = []; // Set each key's value to an empty array
  //     }
  //     return newState;
  //   });
  // };

  // function areAllArraysEmpty(obj:any) {
  //   return Object.values(obj).every((arr:any) => arr.length === 0);
  // }

  const showBusesHandler = () => {
    setFilterBuses(localFilters);
    setIsFilterOpen(false);
  };

  // const [initialMinPrice, setInitialMinPrice] = useState(0)
  // const [initialMaxPrice, setInitialMaxPrice] = useState(0)

  // useEffect(() => {
  //   if (filteredTrips && filteredTrips.length > 0) {
  //     const prices = filteredTrips.map((trip: { price: any; }) => trip.price);  // Extract prices from trips
  //     setInitialMinPrice(Math.min(...prices));  // Spread operator to pass all prices as arguments
  //     setInitialMaxPrice(Math.max(...prices));
  //   }

  // },[filteredTrips])

  // useEffect(() => {
  //   setFilterBuses((prevState: any) => ({
  //     ...prevState,
  //     Min: [initialMinPrice],
  //     Max: [initialMaxPrice]
  //   }));
  // }, [initialMinPrice, initialMaxPrice]);

  // const handleMinPriceChange = (newMinPrice:any) => {
  //   setLocalFilters((prev:any) => ({
  //     ...prev,
  //     Min: newMinPrice
  //   }))
  // }

  // const handleMaxPriceChange = (newMaxPrice:any) => {
  //   setLocalFilters((prev:any) => ({
  //     ...prev,
  //     Max: newMaxPrice
  //   }))
  // }

  return (
    <Transition.Root
      appear
      show={isFilterOpen}
      as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0  overflow-auto z-10 '
        onClose={() => setIsFilterOpen(false)}>
        <div className='absolute inset-0 overflow-hidden'>
          <Dialog.Overlay className='absolute inset-0' />
          <div className='fixed inset-y-0 right-0  max-w-full flex'>
            <Transition.Child
              as={Fragment}
              enter='transform transition ease-in-out duration-500 sm:duration-700'
              enterFrom='translate-x-full'
              enterTo='translate-x-0'
              leave='transform transition ease-in-out duration-500 sm:duration-700'
              leaveFrom='translate-x-0'
              leaveTo='translate-x-full'>
              <div className='w-screen max-w-md'>
                <div className='md:hidden md:relative  h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl overflow-y-scroll scrollbar-hide'>
                  {/* our filters */}
                  <div className='flex absolute items-start justify-start gap-3 w-max m-2 '>
                    <button
                      type='button'
                      onClick={() => setIsFilterOpen(false)}
                      className='md:hidden  rotate-180 focus:outline-none'>
                      <Image
                        src='/icons/leftArrow.svg'
                        alt='leftArrow'
                        height={30}
                        width={30}
                      />
                    </button>
                  </div>
                  <FilterGroup
                    filteredTrips={filteredTrips}
                    filterBuses={localFilters}
                    setFilterBuses={setLocalFilters}
                  />

                  <div className='flex-shrink-0 px-4 py-4 flex mt-auto justify-center'>
                    <button
                      type='submit'
                      onClick={showBusesHandler}
                      className='ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#005687] hover:bg-[#148ace] focus:outline-none '>
                      عرض الباصات
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default FilterGroupModal;
