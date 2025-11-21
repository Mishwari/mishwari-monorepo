import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Passenger } from '@/types/passenger';
import { Input, Button, ToggleSwitch } from '@mishwari/ui-web';

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

                <div className='flex flex-col mx-4 p-4 text-[#042F40] rounded-xl text-right space-y-4'>
                  <div>
                    <label className='block text-sm font-medium mb-1'>الاسم</label>
                    <Input
                      value={passengerData.name}
                      onChange={(e) => updatePassengerData('name', e.target.value)}
                      placeholder='اسم الراكب'
                      className='text-right'
                    />
                  </div>
                  <div className='flex justify-start gap-4 items-end'>
                    <div className='w-1/3'>
                      <label className='block text-sm font-medium mb-1'>العمر</label>
                      <Input
                        value={passengerData?.age || ''}
                        onChange={(e) => updatePassengerData('age', Number(e.target.value))}
                        placeholder='العمر'
                        type='number'
                        className='text-right'
                      />
                    </div>
                    <div className='flex-1'>
                      <label className='block text-sm font-medium mb-1'>الجنس</label>
                      <ToggleSwitch
                        value={passengerData.gender}
                        onChange={(value) => updatePassengerData('gender', value)}
                        options={[
                          { value: 'male', label: 'ذكر' },
                          { value: 'female', label: 'انثى' },
                        ]}
                        activeColor='bg-[#005687]'
                      />
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium mb-1'>رقم الجوال</label>
                    <Input
                      value={passengerData?.phone}
                      onChange={(e) => updatePassengerData('phone', e.target.value)}
                      placeholder='رقم الجوال'
                      type='tel'
                      className='text-right'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium mb-1'>الايميل</label>
                    <Input
                      value={passengerData?.email}
                      onChange={(e) => updatePassengerData('email', e.target.value)}
                      placeholder='الايميل'
                      type='email'
                      className='text-right'
                    />
                  </div>
                </div>
                <div className='mt-4'>
                  <Button
                    className='w-full bg-[#005687] hover:bg-[#005687]/90 text-white text-lg font-semibold'
                    onClick={() => {
                      handleOperation(passengerData);
                      setIsAddPassenger(false);
                    }}>
                    {isEdit ? 'تحديث' : 'إضافة'}
                  </Button>
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
