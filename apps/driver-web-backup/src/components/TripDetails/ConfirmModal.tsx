import { changeTripStatus } from '@/actions/tripsActions';
import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function ConfirmModal({showConfirmDialog, setShowConfirmDialog, params}:any) {

  const { token } = useSelector((state: any) => state.auth);

  const dispatch = useDispatch();
  const handleStopClick = (action: string) => {
    dispatch(changeTripStatus(params?.id, action, token) as any);
    // onConfirm(params);
    console.log('id: ', action);
    setShowConfirmDialog(false);
  };

  const cancelButtonRef = useRef(null);



  return (
    <Transition show={showConfirmDialog} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto " onClose={() => setShowConfirmDialog(false)}
                >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
            <Transition.Child
                        as={Fragment}
                        enter="transition ease-in duration-300 transform"
                        enterFrom="translate-y-full"
                        enterTo="translate-y-0"
                        leave="transition ease-in duration-300 transform"
                        leaveFrom="translate-y-0"
                        leaveTo="translate-y-full"
            >
                <div className="flex  justify-center items-center bg-[#E7F0F6] w-max  h-max xl:min-w-[400px] rounded-xl border border-slate-500 overflow-hidden fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl">
                  <div className='min-w-[310px] md:min-h-full w-full  '>
                    <div className='flex justify-between px-3 py-3 text-[#005687] bg-[#ccdbe4] text-xl font-black'>
                        <h1> {params?.title}</h1>
                        <div className='relative w-7 h-7  text-[#ccdbe4] rounded-full cursor-pointer bg-[#00558782] hover:brightness-125 transform ease duration-150'
                         onClick={() => setShowConfirmDialog(false)}>
                          <div className='absolute left-[13.1px] top-[6.8px] bg-[#ccdbe4] justify-center w-0.5 h-[14px]  rotate-45' />
                          <div className='absolute left-[13.1px] top-[6.8px] bg-[#ccdbe4] justify-center w-0.5 h-[14px] -rotate-45' />
                        </div>
                    </div>
                    <div className='p-4 my-3  max-w-[310px]'>
                        <h1 className='text-lg  '>{params?.message}</h1>
                    </div>
                    <div className='  w-full flex justify-between text-white font-black  ' >
                        <div onClick={() => setShowConfirmDialog(false)} className='py-2 w-full text-center cursor-pointer bg-[#585858] hover:brightness-125 transform ease duration-150'>إلغاء</div>
                        <div onClick={() => handleStopClick(params?.status)} className='py-2 w-full text-center cursor-pointer bg-[#005687] hover:brightness-125 transform ease duration-150'>موافق</div>
                    </div>
                  </div>
                </div>

            </Transition.Child>
            
        </Dialog>
    </Transition>
  )
}

export default ConfirmModal