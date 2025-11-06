import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import Image from 'next/image';
import { performLogout } from '@/actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

function DriverProfile({isOpen,setIsOpen}:any) {
    // const { isOpen, setIsOpen } = useState<boolean>(false);
    const cancelButtonRef = useRef(null)

    const dispatch = useDispatch();
    const router = useRouter();
    const handleLogout = () => {
       dispatch(performLogout() as any);
       router.push('/login')
      }

      const driverDetails = useSelector((state: any) => state.driver.driverDetails );
        const driver =
            driverDetails && driverDetails.length > 0 ? driverDetails[0] : null;
    

    return (
        <>
            <Transition show={isOpen} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto opacity-100" initialFocus={cancelButtonRef} onClose={setIsOpen}>
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                    <Transition.Child
                        
                        as={Fragment}
                        enter="transition ease-out duration-700 transform"
                        enterFrom='translate-x-full'
                        enterTo='translate-x-0'
                        leave="transition ease-in duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                    >
                        <div className="bg-slate-100 w-64 h-full absolute right-0 top-0 ">
                            <div className='bg-[#005687] p-4 relative'>
                                <div className='absolute right-0 mr-2 h-6 w-6 bg-white hover:bg-gray-200 active:bg-gray-400 cursor-pointer overflow-hidden rounded-full rotate-180' onClick={() => setIsOpen(false)} ref={cancelButtonRef}>
                                    <Image className='h-6 w-5 ' src="./icons/backbutton.svg" alt="backbutton" />
                                </div>
                                <div className='mx-auto mt-8 rounded-full border border-white w-max h-max overflow-hidden '>

                                <Image className='bg-white ' src="./icons/user.svg" alt="" />
                                </div>
                                <p className='text-center text-white text-lg'>{driver?.d_name}</p>
                                <p className='text-center text-white text-base'>  Tel: {driver?.mobile_number}</p>
                            </div>
                            <div className='p-4 text-white '>
                                <Link onClick={() => {setIsOpen(false)}} href="/" ><h2 className='text-lg font-semibold border rounded-md p-2 bg-[#005687]'  >الرئيسية</h2></Link>
                                <Link onClick={() => {setIsOpen(false)}} href="/trips" ><h2 className='text-lg font-semibold border rounded-md p-2 bg-[#005687]' > الرحلات</h2></Link> 
                                <h2 className='text-lg font-semibold border rounded-md p-2 bg-[#005687]'>المحفظة</h2>
                                <h2 className='text-lg font-semibold border rounded-md p-2 bg-[#005687]'>Information</h2>
                                <h2 className='text-lg font-semibold border rounded-md p-2 bg-[#005687]'>الاحكام والشروط</h2>
                                <h2 onClick= {() =>{}} className='text-lg font-semibold border rounded-md p-2 bg-[#005687]'>من نحن</h2>
                                <h2 onClick={() => {
                                    setIsOpen(false);
                                    setTimeout(()=> {
                                        handleLogout();
                                    },500)
                                    }}  className='text-lg font-semibold border rounded-md p-2 bg-[#005687] cursor-poi'>تسجيل الخروج</h2>
                            </div>
                        </div>
                    </Transition.Child>
                </Dialog>
            </Transition>
        </>
    );
}

export default DriverProfile;
