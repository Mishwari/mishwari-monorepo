import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { changeTripStatus } from '@/actions/tripsActions';
import ConfirmModal from './ConfirmModal';
import Image from 'next/image';

function TripDetails({key, setIsTripDetailsOpen, isTripDetailOpen, trip , onConfirm, stopPoints , calculateDuration, convertToReadableTime}: any) {



  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [ConfirmDialogParams, setConfirmDialogParams] = useState(null);

  const openConfirmDialog = (params:any) => {
    setConfirmDialogParams(params)
    setShowConfirmDialog(true)
  }

  return (
    <Transition.Root
      appear
      show={isTripDetailOpen}
      as={Fragment}>
      <Dialog
        as='div'
        className=' fixed inset-0 overflow-hidden z-10 '
        onClose={() => setIsTripDetailsOpen(true)}>
        <Transition.Child
          as='div'
          enter='transform transition ease-in-out duration-500'
          enterFrom='translate-y-full'
          enterTo='translate-y-0'
          leave='ease-in duration-200'
          leaveFrom='opacity-100 scale-100'
          leaveTo='opacity-0 scale-95'>
          <div className='w-screen h-screen max-w-2xl mx-auto   bg-white overflow-y-scroll scrollbar-hide  '>
            <div className='flex justify-between text-[#042F40]'>
              <div className='flex justify-center items-center gap-2'>
                <Image
                  src='./icons/leftArrow.svg'
                  alt="leftArrow"
                  onClick={() => setIsTripDetailsOpen(false)}
                  className='w-8 h-8 rotate-180 cursor-pointer hover:scale-105'
                />
                <h1 className='text-xl'>تفاصيل الرحلة</h1>
              </div>
              <div
                onClick={() =>
                  openConfirmDialog({
                  id: trip?.id,
                  status:'pending', 
                  title:'اعادة ضبط الرحلة',
                  message: 'سوف يتم اعادة ضبط الرحلة الى الحالة الافتراضية pending'
                })
                }
                className='m-auto h-2 w-2 px-1 flex items-center justify-center text-center opacity-[1%] bg-black  text-white text-xs'>
               
              </div>
              <div>
                <h1 className='p-2 text-lg'>#{trip?.id}</h1>
              </div>
            </div>

            <div className='mx-6 text-[#042F40] flex flex-col h-[90%]'>
              <div className='flex justify-between my-4  '>
                <div>
                  <h1 className=' text-xl font-semibold'>
                    {trip?.pickup} إلى {trip?.destination}
                  </h1>
                  <h1>{trip.available_seats && (trip.available_seats+ " راكب . " )}  {Math.round(trip?.distance)} كم</h1>
                  <h1 className='my-1 flex gap-1'> <p> {trip?.path_road} </p> - {Math.round(trip?.distance)} كم </h1>
                </div> 
                <div>
                  <h1 className='text-xl font-bold text-left pl-1'>
                    {trip?.price} ريال
                  </h1>
                  <h1
                    className={`font-bold text-xs mt-4 py-1.5 px-4  rounded-lg  ${
                      trip?.trip_status == 'pending'
                        ? 'text-[#F99E00] bg-[#FCEFD6]'
                        : trip?.trip_status == 'active'
                        ? 'text-[#1FBF83] bg-[#DBFFF1]'
                        : trip?.trip_status == 'stopped'
                        ? 'text-[#B84200] bg-[#FFD2C8]'
                        : trip?.trip_status == 'cancelled'
                        ? 'text-[#B84200] bg-[#FFD2C8]'
                        : trip?.trip_status == 'completed'
                        ? 'text-[#005687] bg-[#E7F0F6]'
                        : ''
                    } `}>
                    {trip?.trip_status == 'pending'
                      ? ((calculateDuration( (new Date(Date.now())).toISOString(),trip.departure_time,' ',' ')).slice(0,1)) == '-'? ' مر موعد الانطلاق !':
                      'تبدأ بعد ' + ((calculateDuration( (new Date(Date.now())).toISOString(),trip.departure_time,' ',' ')).slice(0,3))+ 'ساعات'
                      : trip?.trip_status == 'active'
                      ? 'الرحلة تمشي الان'
                      : trip?.trip_status == 'stopped'
                      ? 'تم ايقاف الرحلة'
                      : trip?.trip_status == 'cancelled'
                      ? 'تم الغاء الرحلة'
                      : trip?.trip_status == 'completed'
                      ? 'تمت الرحلة بنجاح'
                      : ''}
                  </h1>
                </div>
              </div>
              <h1 className=' font-bold text-lg'>التفاصيل</h1>
              <div className=' border border-[#7B7B7B] rounded-xl my-4  '>
                <div className='flex justify-between  p-2'>
                  <div className='flex gap-1 justify-center items-center'>
                    <Image
                      src='./icons/user_repo.svg'
                      alt='user_repo'
                      className='h-5 w-5'
                    />
                    <h1 className='text-sm'>{trip.available_seats}</h1>
                    <Image
                      src='./icons/commit_repo.svg'
                      alt='user_repo'
                      className='h-5 w-5'
                    />
                    <h1 className='text-sm'>{stopPoints?.length}</h1>
                  </div>
                  <div className='flex gap-1 justify-center items-center'>
                    <Image
                      src='./icons/clock_repo.svg'
                      alt='user_repo'
                      className='h-5 w-5'
                    />
                    <h1 className='text-sm'>{calculateDuration(trip.departure_time,trip.arrival_time,'س','د')} </h1>
                    <Image
                      src='./icons/flag_triangle.svg'
                      alt='user_repo'
                      className='h-5 w-5'
                    />
                    <h1 className='text-sm'>{Math.round(trip?.distance)} كم</h1>
                  </div>
                </div>
                <div className=' border border-b-[#7B7B7B] w-full' />{' '}
                {/** hline */}


                <div className='flex flex-col overflow-y-auto '>
                  <div className='flex justify-between py-3 px-4 bg-[#F4F4F4] overflow-visible'>
                    <div>
                      <h1 className='text-xs text-[#005687]'>
                        تبدأ الرحلة {convertToReadableTime(trip.departure_time)}
                      </h1>
                      <h1 className='font-semibold'>{trip?.pickup}</h1>
                    </div>
                    <div className='flex gap-1 '>
                      <Image
                        src='./icons/user_repo.svg'
                        alt='user_repo'
                        className='h-5 w-5'
                      />
                      <h1 className='text-sm'>{trip.available_seats}</h1>
                    </div>
                  </div>
                    <div>
                      
                    </div>
                    {
                      stopPoints  ? 
                      (stopPoints?.map((point:any, index:number ) =>(

                      <div key={index} className='flex justify-between py-3 px-4 '>
                        <div>
                          <h1 className='text-xs text-[#005687]'>{convertToReadableTime(point.point_arrival)}</h1>
                          <h1 className='font-semibold'>{point.point_name}</h1>
                        </div>
                        <div className='flex gap-1 '>
                          <Image
                            src='./icons/user_repo.svg'
                            alt='user_repo'
                            className='h-5 w-5'
                          />
                          <h1 className='text-sm'>{trip.available_seats}</h1>
                        </div>
                      </div>
                       ) ))
                      :
                      <div className='flex justify-between py-5 px-4 '>
                        <div>
                          <h1 className='font-semibold '>لا توجد نقاط توقف !</h1>
                        </div>
                        
                      </div>
                    }
                  <div className=' w-full flex justify-between py-3 px-4 bg-[#F4F4F4] overflow-visible rounded-b-xl'>
                    <div>
                      <h1 className='text-xs text-[#005687]'>
                        تنتهي الرحلة {convertToReadableTime(trip.arrival_time)}
                      </h1>
                      <h1 className='font-semibold'>{trip?.destination}</h1>
                    </div>
                    <div className='flex gap-1 '>
                      <Image
                        src='./icons/user_repo.svg'
                        alt='user_repo'
                        className='h-5 w-5'
                      />
                      <h1 className='text-sm'>{trip.available_seats}</h1>
                    </div>
                  </div>
                </div>


              </div>
              <div className='mt-auto flex justify-between text-white text-lg font-semibold gap-6'>
                <div
                  onClick={() =>
                    openConfirmDialog({
                    id: trip?.id,
                    status: trip?.trip_status === 'pending'? 'active' : 'completed', 
                    title:trip?.trip_status=== 'pending'? 'بدء الرحلة': 'إتمام الرحلة',
                    message: trip?.trip_status === 'pending' ? 'هل تريد ان تبدأ الرحلة الان؟' : 'هل أنت متاكد من اتمامك للرحلة؟'
                  })
                  }
                  className={`py-2 w-full text-center rounded-lg ${
                    trip?.trip_status == 'pending'
                      ? ' bg-[#1FBF83]'
                      : trip?.trip_status == 'active'
                      ? 'bg-[#005687]'
                      : 'hidden'
                  } cursor-pointer`}>
                  {trip?.trip_status == 'pending'
                    ? 'إبدأ الرحلة'
                    : trip?.trip_status == 'active'
                    ? 'اتمام الرحلة'
                    : ''}
                </div>
                <div
                  onClick={() =>
                    openConfirmDialog({
                    id: trip?.id,
                    status: trip?.trip_status === 'pending'? 'cancelled' : 'stopped', 
                    title:trip?.trip_status === 'pending'? 'إلغاء الرحلة': 'إيقاف الرحلة',
                    message: trip?.trip_status === 'pending' ? 'هل أنت متاكد من إلغاء الرحلة؟' : 'هل أنت متاكد من إيقاف الرحلة؟'
                  })
                  }
                  className={`py-2 w-full text-center  rounded-lg ${
                    trip?.trip_status == 'pending'
                      ? ' bg-[#B84200]'
                      : trip?.trip_status == 'active'
                      ? 'bg-[#B84200]'
                      : 'hidden'
                  } cursor-pointer`}>
                  {trip?.trip_status == 'pending'
                    ? 'إلغاء الرحلة'
                    : trip?.trip_status == 'active'
                    ? 'ايقاف اضطراري'
                    : ''}
                </div>
              </div>
            </div>
          </div>
          <ConfirmModal showConfirmDialog ={showConfirmDialog} setShowConfirmDialog={setShowConfirmDialog} params={ConfirmDialogParams} />
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
}

export default TripDetails;
