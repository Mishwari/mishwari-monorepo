
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, Button } from '@mishwari/ui-web';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '@/store/store';
import { setPaymentMethod, setTrip, addPassenger } from '@/store/slices/bookingCreationSlice';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { createBooking } from '@/store/actions/bookingActions';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import PageHeader from '@/layouts/PageHeader';
import { useRouter } from 'next/router';
import axios from 'axios';
import { UserDropdownMenu } from '@mishwari/ui-web';
import useAuth from '@/hooks/useAuth';
import useLogout from '@/hooks/useLogout';
import { passengerNavConfig } from '@/config/navigation';
import { CollapsibleSection } from '@mishwari/ui-web';

interface CardHolderObject {
  email: string;
  address: string;
  city: string;
  country: string;
}


function Payment() {
  const token = useSelector((state: AppState) => state.auth.token);
  const router = useRouter();
  const stripe = useStripe();
  const { isAuthenticated } = useAuth();
  const logout = useLogout();
  const dispatch = useDispatch();
  const booking_details = useSelector(
    (state: AppState) => state.bookingCreation
  );
  const selectedPayment = booking_details?.paymentMethod;

  useEffect(() => {
    if (!booking_details?.trip?.id) {
      const draft = sessionStorage.getItem('bookingDraft');
      if (draft) {
        const data = JSON.parse(draft);
        dispatch(setTrip(data.tripDetails));
        data.passengers.forEach((p: any) => dispatch(addPassenger(p)));
      } else {
        router.push('/bus_list');
      }
    }
  }, [booking_details?.trip?.id, dispatch, router]);
  // const [selectedPayment, setSelectedPayment] = useState<string | null>('card');
  const [cardHolderDetails, setCardHolderDetails] = useState<CardHolderObject>({
    email: '',
    address: '',
    city: '',
    country: '',
  });
  const [walletBalance, setWalletBalance] = useState<number | null>();
  const handleTogglePaymentOption = (value: string) => {
    dispatch(setPaymentMethod(value));
  };

  const handleCardDetailsInput = (name: string, value: any) => {
    setCardHolderDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitBooking = (event: React.FormEvent) => {
    event.preventDefault();
    const draft = sessionStorage.getItem('bookingDraft');
    let fromStopId, toStopId;
    if (draft) {
      const data = JSON.parse(draft);
      fromStopId = data.fromStopId;
      toStopId = data.toStopId;
    }
    dispatch(createBooking(stripe, fromStopId, toStopId) as any);
  };

  const handleClick = (methodName: string) => {
    setPaymentMethod(methodName);
    // setSelectedPayment((prev) => (prev === paymentIndex ? null : paymentIndex));
  };



  useEffect(() => {
    setWalletBalance(0);
    // Set first payment option as default if none selected
    if (!selectedPayment) {
      dispatch(setPaymentMethod('cash'));
    }
  }, []);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem('bookingDraft');
    };
  }, []);

  const variants = {
    hidden: { height: 0, opacity: 1, y: 0, transition: { duration: 0.7 } }, // op:0 y:-20
    visible: {
      height: 'auto',
      opacity: 1,
      y: 0,
      transition: { duration: 0.7 },
    },
  };

  const isLoading = booking_details.status === 'loading';

  const paymentOptions = [
    {
      label: 'الدفع نقداً',
      name: 'cash',
      button_label: 'احجز الآن',
      disabled: false,
      content: (
        <>
          <p>سوف يتم الدفع نقداً عند الصعود إلى الباص</p>
        </>
      ),
    },
    {
      label: 'البطاقة الاتمانية',
      name: 'stripe',
      button_label: 'غير متوفر حالياً',
      disabled: true,
      content: (
        <>
          <div className='px-4 py-2'>
            <label className='text-sm'>الايميل</label>
            <Input
              type='email'
              value={cardHolderDetails.email}
              onChange={(e) => handleCardDetailsInput('email', e.target.value)}
              placeholder=' '
              className='w-full'
            />
          </div>
          <div className='px-4 py-2'>
            <label className='text-sm'>عنوان السكن</label>
            <Input
              type='text'
              value={cardHolderDetails.address}
              onChange={(e) => handleCardDetailsInput('address', e.target.value)}
              placeholder=' '
              className='w-full'
            />
          </div>
          <div className='flex'>
            <div className='px-4 py-2 flex-1'>
              <label className='text-sm'>المدينة</label>
              <Input
                type='text'
                value={cardHolderDetails.city}
                onChange={(e) => handleCardDetailsInput('city', e.target.value)}
                placeholder=' '
                className='w-full'
              />
            </div>
            <div className='px-4 py-2 flex-1'>
              <label className='text-sm'>البلد</label>
              <Input
                type='text'
                value={cardHolderDetails.country}
                onChange={(e) => handleCardDetailsInput('country', e.target.value)}
                placeholder=' '
                className='w-full'
              />
            </div>
          </div>
          <div className='flex justify-center items-center my-2'></div>
        </>
      ),
    },
    {
      label: 'المحفظة',
      name: 'wallet',
      button_label: 'غير متوفر حالياً',
      disabled: true,
      content: (
        <>
          <p className='text-gray-500'>خاصية المحفظة غير متوفرة حالياً</p>
        </>
      ),
    },
  ];

  return (
    <main className='flex flex-col m-0 mb-0 bg-[#F4FAFE] bg-scroll h-screen'>
      <PageHeader title='الدفع'>
        {isAuthenticated && (
          <div className='absolute left-4 top-4'>
            <UserDropdownMenu items={passengerNavConfig.desktop.items} onLogout={logout} />
          </div>
        )}
      </PageHeader>
      <section className='mx-3 mt-4 p-6 bg-white shadow-lg text-[#042F40] rounded-xl space-y-4'>
        <div>
          <h2 className='text-lg font-bold mb-3'>ملخص الرحلة</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex items-center gap-2 py-2 border-b border-gray-100'>
              <span className='text-gray-600'>من:</span>
              <span className='font-semibold'>{booking_details?.trip?.from_city?.name || booking_details?.trip?.from_city?.city || booking_details?.trip?.pickup?.city}</span>
            </div>
            <div className='flex items-center gap-2 py-2 border-b border-gray-100'>
              <span className='text-gray-600'>إلى:</span>
              <span className='font-semibold'>{booking_details?.trip?.to_city?.name || booking_details?.trip?.to_city?.city || booking_details?.trip?.destination?.city}</span>
            </div>
            <div className='flex items-center gap-2 py-2 border-b border-gray-100'>
              <span className='text-gray-600'>سعر التذكرة:</span>
              <span className='font-semibold'>{booking_details?.trip?.price} ريال</span>
            </div>
            {booking_details?.trip?.departure_time && (
              <div className='flex items-center gap-2 py-2 border-b border-gray-100'>
                <span className='text-gray-600'>وقت المغادرة:</span>
                <span className='font-semibold'>{new Date(booking_details.trip.departure_time).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}</span>
              </div>
            )}
          </div>
        </div>

        <CollapsibleSection 
          title='الركاب' 
          count={booking_details?.passengers.filter((obj: { is_checked: boolean }) => obj.is_checked).length}
          defaultOpen={false}
        >
          <div className='space-y-2'>
            {booking_details?.passengers.filter((p: any) => p.is_checked).map((passenger: any, index: number) => (
              <div key={index} className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                <div className='w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold'>
                  {index + 1}
                </div>
                <div className='flex-1'>
                  <p className='font-semibold'>{passenger.name}</p>
                  {passenger.phone && <p className='text-sm text-gray-600'>{passenger.phone}</p>}
                </div>
                {passenger.age && <span className='text-xs bg-gray-200 px-2 py-1 rounded'>{passenger.age} سنة</span>}
              </div>
            ))}
          </div>
        </CollapsibleSection>

        <div className='pt-4 border-t-2 border-gray-200'>
          <div className='flex justify-between items-center text-xl'>
            <h1 className='font-bold'>المجموع الكلي:</h1>
            <h1 className='font-bold text-brand-primary'>
              {booking_details?.trip?.price *
                booking_details?.passengers.filter(
                  (obj: { is_checked: boolean }) => obj.is_checked
                ).length}{' '}
              ريال
            </h1>
          </div>
        </div>
      </section>
      <div className='flex justify-start items-center gap-2 mx-4 mt-4 py-4'>
        <h1 className='text-lg font-bold'>الدفع عبر</h1>
      </div>

      <div className='flex flex-col gap-2 mx-4'>
        {paymentOptions.map((option, index) => (
          <div
            key={index}
            className={`overflow-hidden shadow-lg bg-white text-[#042F40] rounded-xl ${option.disabled ? 'opacity-50' : ''}`}>
            <div
              className={`flex justify-between items-center w-full p-4 rounded-xl bg-inherit ${option.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => !option.disabled && dispatch(setPaymentMethod(option.name))}>
              <h1>{option.label}</h1>
              {option.disabled && <span className='text-sm text-gray-500'>قريباً</span>}
            </div>
            <AnimatePresence initial={false}>
              {selectedPayment === option.name && (
                <motion.div
                  key={index}
                  initial='hidden'
                  animate='visible'
                  exit='hidden'
                  variants={variants}
                  className='bg-inherit'>
                  <div className='flex flex-col gap-2 p-4'>
                    {option.content}
                    <Button
                      disabled={option.disabled}
                      loading={isLoading}
                      className='mt-4 px-6 mx-auto bg-[#005687] hover:bg-[#004570]'
                      onClick={handleSubmitBooking}>
                      {option.button_label}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Payment;
