import React, { useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import Image from 'next/image';
import { SortItem } from '../../pages/bus_list/index'; //type
import { ChevronDownIcon } from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface SortDropdownProps {
  selectedSort: SortItem;
  sortList: SortItem[];
  label?: string;
  //   code?: string;
  setSelectedSort: React.Dispatch<React.SetStateAction<SortItem>>;
}

const SortDropdown = ({
  selectedSort,
  setSelectedSort,
  sortList,
  label = '',
}: SortDropdownProps) => {
  return (
    <Listbox
      value={selectedSort}
      onChange={setSelectedSort}>
      {({ open }) => (
        <>
          <div className='relative z-10'>
            {/* <div className='relative'> */}
            <Listbox.Button className=' left-0 top-0 flex gap-1 items-center focus:outline-none'>
              <span className=''>
                {label} {selectedSort.code || selectedSort.name}
              </span>
              <span className='items-center'>
                <ChevronDownIcon className='w-5 h-5 ' />
              </span>
            </Listbox.Button>
            {/* </div> */}

            <Transition
              show={open}
              as={React.Fragment}
              enter='transition ease-out duration-700'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'>
              <Listbox.Options className='absolute top-8  w-[100] bg-white shadow-lg max-h-60 rounded-md py-1 text-base 5ring-1 ring-black ring-opacity-5 overflow-y-visible focus:outline-none sm:text-sm'>
                {sortList.map((listItem) => (
                  <Listbox.Option
                    key={listItem.id}
                    className={({ active }) =>
                      classNames(
                        active
                          ? 'text-[#005687] bg-[lightblue]'
                          : 'text-gray-900',
                        'rounded-md cursor-default select-none relative py-2 pl-3 pr-9 '
                      )
                    }
                    value={listItem}>
                    {({ selected, active }) => (
                      <div className='flex w-full justify-between z-30 '>
                        {selectedSort.id == listItem.id && (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 left-0 flex items-center pl-2 '
                            )}>
                            <Image
                              src='/icons/checkListIcon.svg'
                              alt='checkListIcon'
                              className='stroke-[blue]'
                              width={20}
                              height={20}
                            />
                          </span>
                        )}

                        <span
                          className={classNames(
                            selected ? 'font-bold' : 'font-normal',
                            'w-full text-right ml-8 block truncate'
                          )}>
                          {listItem.name}
                        </span>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default SortDropdown;
