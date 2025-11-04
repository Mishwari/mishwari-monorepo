import React, { Fragment, useEffect, useRef, useState } from 'react';
import TextInput from './TextInput';
import SwitchSlide from './SwitchSlide';
import { Dialog, Transition } from '@headlessui/react';
import { Passenger } from '@/types/passenger';

function PassengerModal({
  isAddPassenger,
  setIsAddPassenger,
  handleOperation,
  passenger,
  isEdit,
  key,
}: any) {
  const [passengerData, setPassengerData] = useState<Passenger>({
    id: null,
    name: '',
    email: '',
    phone: '',
    age: null,
    is_checked: true,
    gender: 'male',
  });

  useEffect(() => {
    if (passenger !== null && passenger) {
      setPassengerData((prev) => ({
        ...prev,
        id: passenger.id,
        name: passenger.name,
        email: passenger.email,
        phone: passenger.phone,
        age: Number(passenger.age),
        is_checked: passenger.is_checked,
        gender: passenger.gender,
      }));
    }
  }, [passenger]);

  const updatePassengerData = (name: string, value: any) => {
    setPassengerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Transition
      appear
      show={isAddPassenger}
      as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        onClose={() => {
          setIsAddPassenger(false);
        }}>
        <div className='fixed inset-0 bg-black/50' />

        <div className='fixed inset-0 border-3 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center  text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'>
              <Dialog.Panel className='w-full  h-max overflow-scroll sm:overflow-hidden scrollbar-hide mt-auto sm:m-auto sm:relative  sm:max-w-[500px]   rounded-t-[50px] sm:rounded-2xl bg-white   shadow-xl '>
                <Dialog.Title
                  as='h3'
                  className='text-xl font-bold leading-6 text-center mt-8 text-gray-900'>
                  {isEdit ? 'تعديل معلومات الراكب' : 'اضف معلومات الراكب'}
                </Dialog.Title>

                <div className='flex flex-col mx-4 p-4   text-[#042F40] rounded-xl text-right'>
                  <div>
                    <TextInput
                      value={passengerData.name}
                      setValue={(value: string) =>
                        updatePassengerData('name', value)
                      }
                      title='الاسم'
                      placeholder='اسم الراكب'
                    />
                  </div>
                  <div className='flex mt-4 justify-start gap-4 items-center '>
                    <div className='w-1/4'>
                      <TextInput
                        value={passengerData?.age}
                        setValue={(value: number) =>
                          updatePassengerData('age', Number(value))
                        }
                        title='العمر'
                        placeholder=''
                        type='number'
                      />
                    </div>
                    <div className='w-1/2 mx-auto mt-auto '>
                      <SwitchSlide
                        initial={passengerData.gender}
                        setInitial={(value: number) =>
                          updatePassengerData('gender', value)
                        }
                      />
                    </div>
                  </div>
                  <div className='flex mt-4'>
                    <TextInput
                      value={passengerData?.phone}
                      setValue={(value: string) =>
                        updatePassengerData('phone', value)
                      }
                      title=' رقم الجوال'
                      placeholder=''
                      type='number'
                    />
                  </div>
                  <div className='flex mt-4'>
                    <TextInput
                      value={passengerData?.email}
                      setValue={(value: string) =>
                        updatePassengerData('email', value)
                      }
                      title='  الايميل'
                      placeholder=''
                      type='text'
                    />
                  </div>
                </div>
                <div className='mt-4'>
                  <button
                    className=' justify-center items-center text-center text-white text-lg bg-[#005687] font-semibold w-full p-2'
                    onClick={() => {
                      handleOperation(passengerData);
                      setIsAddPassenger(false);
                    }}>
                    {isEdit ? 'تحديث' : 'إضافة'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default PassengerModal;
