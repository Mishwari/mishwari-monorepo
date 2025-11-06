import React, { Fragment, useState } from 'react';
import Image from 'next/image';
import SideMenu from './SideMenu';
import {
  ArrowLeftStartOnRectangleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition, Listbox } from '@headlessui/react';
import SortDropdown from './filters_bar/SortDropdown';
import { Bars3Icon, Bars2Icon } from '@heroicons/react/24/outline';
import useLogout from '@/hooks/useLogout';
import useAuth from '@/hooks/useAuth';
import { Link } from '@nextui-org/react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface SortItem {
  code: string | null;
  id: number;
  name: string;
}
interface SideMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Navbar() {
  const { isAuthenticated } = useAuth();
  const logout = useLogout();
  const [isBurgerOpen, setBurgerIsOpen] = useState<boolean>(false);

  const sortList = [
    { id: 1, name: ' ريال سعودي', code: 'SAR' },
    { id: 2, name: 'دولار', code: 'USD' },
    { id: 3, name: ' ريال يمني', code: 'YER' },
    { id: 4, name: ' ريال عماني', code: 'OMR' },
    { id: 5, name: '  جنية مصري', code: 'EGP' },
  ];

  const [selectedSort, setSelectedSort] = useState<SortItem>(sortList[0]);

  return (
    <div className=' fixed z-20 top-0 bg-[#005687] max-w-[100rem] flex justify-between items-center px-4 h-16 w-full  '>
      <Link
        href='/'
        className='w-max flex gap-1 '>
        <h1 className='text-[#d5f0ff] font-bold text-xl'>مشواري</h1>
        <h1 className='text-white text-[10px] font-normal self-end'>(Demro)</h1>
      </Link>

      <div className='flex text-white w-full gap-6 justify-end items-center'>
        <div className='hidden md:block'>
          <SortDropdown
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            sortList={sortList}
          />
        </div>

        <div className='hidden md:block items-center'>مساعدة</div>

        <div className='flex gap-2 px-2 p-1   items-center overflows-hidden'>
          {/* <Link
            href='/profile'
            className=' md:hidden'>
            <span className='  rounded-full  hover:bg-[#d8f1ff20]'>

              <svg
                className='h-6 w-6 bg-[#0081cc] text-gray-300 rounded-full p-0.5'
                fill='currentColor'
                viewBox='0 0 24 24'>
                <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
              </svg>
            </span>
          </Link> */}
          {isAuthenticated ? (
            <>
              {/* for mobile */}
              <div
                onClick={() => setBurgerIsOpen(!isBurgerOpen)}
                className=' md:hidden cursor-pointer '>
                <Bars3Icon className='h-7 w-7 text-white' />

                <SideMenu
                  isOpen={isBurgerOpen}
                  setIsOpen={setBurgerIsOpen}
                />
              </div>
              {/* for desktop */}
              <div className='hidden md:flex gap-2 justify-center'>
                <>
                  <span className='  rounded-full  hover:bg-[#d8f1ff20]'>
                    {/* <div className=' bg-[#ffffff34] rounded-full p-1 flex items-center justify-center'> */}

                    <svg
                      className='h-6 w-6 bg-[#0081cc] text-gray-300 rounded-full p-0.5'
                      fill='currentColor'
                      viewBox='0 0 24 24'>
                      <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
                    </svg>
                    {/* </div> */}
                  </span>
                  <Menu
                    as='div'
                    className='relative text-left'>
                    <div>
                      <Menu.Button className='relative inline-flex gap-1.5 items-center w-full justify-center   font-medium text-white  focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75'>
                        الحساب
                        <ChevronDownIcon
                          className=' h-5 w-5 text-violet-200 hover:text-violet-100'
                          aria-hidden='true'
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter='transition ease-out duration-100'
                      enterFrom='transform opacity-0 scale-95'
                      enterTo='transform opacity-100 scale-100'
                      leave='transition ease-in duration-75'
                      leaveFrom='transform opacity-100 scale-100'
                      leaveTo='transform opacity-0 scale-95'>
                      <Menu.Items className='absolute z-10 left-0 mt-2 w-max px-0 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href='/profile'
                              className={`${
                                active ? 'bg-[lightblue] text-[#005687] ' : ''
                              } group flex w-full text-gray-900 items-center rounded-md px-6 py-2 text-sm`}>
                              الاعدادت
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href='/my_trips'
                              className={`${
                                active ? 'bg-[lightblue] text-[#005687]' : ''
                              } group flex w-full items-center text-gray-900 rounded-md px-6 py-2 text-sm`}>
                              الرحلات
                            </Link>
                          )}
                        </Menu.Item>

                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href='/profile/wallet'
                              className={`${
                                active ? 'bg-[lightblue] text-[#005687]' : ''
                              } group flex w-full items-center text-gray-900 rounded-md px-6 py-2 text-sm`}>
                              المحفظة
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => {
                                logout();
                              }}
                              className={`${
                                active ? 'bg-[lightblue] text-[#005687]' : ''
                              } group flex w-full items-center text-gray-900 rounded-md px-6 py-2 text-sm`}>
                              تسجيل الخروج
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </>
              </div>
            </>
          ) : (
            <Link
              href='/login'
              className='flex gap-2 text-sm md:text-base items-center justify-center text-white border-1 border-blue-300 rounded-full px-4 py-1.5 bg-[#ffffff1a]'>
              تسجيل الدخول
              <ArrowLeftStartOnRectangleIcon className='w-5 md:w-6 h-5 md:h-6' />
            </Link>
          )}
        </div>
      </div>

      {/* <button className='hidden md:block' onClick={() => setBurgerIsOpen(true)}>
          <Image width={15} height={15} src="./icons/burger_menu.svg" alt="burger_menu" className='h-6 w-6' />
        </button>
        <SideMenu isOpen={isBurgerOpen} setIsOpen={setBurgerIsOpen} /> */}
    </div>
  );
}

export default Navbar;
