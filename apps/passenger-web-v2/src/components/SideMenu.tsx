import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import Image from 'next/image';
// import { performLogout } from '@/actions/authActions';
import { ArrowLeftIcon, UserCircleIcon } from '@heroicons/react/24/outline';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import useLogout from '@/hooks/useLogout';
import useAuth from '@/hooks/useAuth';
import { AppState } from '@/store/store';

interface SideMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function SideMenu({ isOpen, setIsOpen }: SideMenuProps) {
  // const { isOpen, setIsOpen } = useState<boolean>(false);
  const profile = useSelector((state: AppState) => state.profile);
  const { isAuthenticated } = useAuth();
  const logout = useLogout();
  const cancelButtonRef = useRef(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogout = () => {
    //    dispatch(performLogout() as any);
    router.push('/login');
  };

  //   const driverDetails = useSelector((state: any) => state.driver.driverDetails);
  //   const driver =
  //     driverDetails && driverDetails.length > 0 ? driverDetails[0] : null;

  return (
    <>
      <Transition
        show={isOpen}
        as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-30 overflow-y-auto opacity-100 md:hidden'
          initialFocus={cancelButtonRef}
          onClose={() => setIsOpen(!isOpen)}>
          <Dialog.Overlay className='fixed inset-0 bg-black opacity-70' />
          <Transition.Child
            as={Fragment}
            enter='transition ease-out duration-700 transform'
            enterFrom='-translate-x-full'
            enterTo='translate-x-0'
            leave='transition ease-in duration-300 transform'
            leaveFrom='translate-x-0'
            leaveTo='-translate-x-full'>
            <div className='bg-gray-50 w-[70%] h-full flex flex-col bg-scroll absolute left-0 top-0 rounded-b-md'>
              <div className='bg-brand-primary p-4 w-full h-max'>
                <div
                  className='absolute left-0 ml-2  cursor-pointer overflow-hidden '
                  onClick={() => setIsOpen(false)}
                  ref={cancelButtonRef}>
                  <ArrowLeftIcon className='w-6 h-6 text-white' />
                </div>
                <div className='mx-auto mt-8 rounded-full borderd bordder-white w-max h-max overflow-hidden '>
                  <UserCircleIcon className='h-12 w-12 text-white' />
                </div>
                <p className='text-center text-white text-lg truncate mx-4 '>
                  {profile?.full_name || profile?.user.username}
                </p>
                <p className='text-center text-white text-base'>
                  {' '}
                  {/* Tel: {driver?.mobile_number} */}
                </p>
              </div>
              <div className='p-4 text-white mt-4 h-full flex flex-col gap-2 '>
                {isAuthenticated && (
                  <>
                    <Link
                      onClick={() => {
                        setIsOpen(false);
                      }}
                      href='/profile'
                      className='text-lg font-semibold border rounded-md p-2 bg-brand-primary'>
                      الملف الشخصي
                    </Link>
                    <Link
                      onClick={() => {
                        setIsOpen(false);
                      }}
                      href='/my_trips'
                      className='text-lg font-semibold border rounded-md p-2 bg-brand-primary'>
                      الرحلات
                    </Link>
                    <Link
                      className='text-lg font-semibold border rounded-md p-2 bg-brand-primary'
                      href='profile/wallet'>
                      المحفظة
                    </Link>
                  </>
                )}
                <h2 className='text-lg font-semibold border rounded-md p-2 bg-brand-primary'>
                  قائمة الركاب
                </h2>
                {/* 
                <h2 className='text-lg font-semibold border rounded-md p-2 bg-[#005687]'>
                  تطبيق السائق
                </h2>
                <h2 className='text-lg font-semibold border rounded-md p-2 bg-[#005687]'>
                  الاحكام والشروط
                </h2>
                <h2
                  onClick={() => {}}
                  className='text-lg font-semibold border rounded-md p-2 bg-[#005687]'>
                  من نحن
                </h2> */}
                {isAuthenticated && (
                  <button
                    type='button'
                    onClick={logout}
                    className='text-lg mt-auto mb-4 font-semibold border rounded-md p-2 bg-brand-primary cursor-pointer'>
                    تسجيل الخروج
                  </button>
                )}
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

export default SideMenu;
