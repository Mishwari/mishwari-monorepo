
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TextInput from '@/components/TextInput';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '@/store/store';
import { setPaymentMethod, setTrip, addPassenger } from '@/store/slices/bookingCreationSlice';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { createBooking } from '@/store/actions/bookingActions';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import HeaderLayout from '@/layouts/HeaderLayout';
import { useRouter } from 'next/router';
import axios from 'axios';

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
    dispatch(createBooking(stripe) as any);
  };

  const handleClick = (methodName: string) => {
    setPaymentMethod(methodName);
    // setSelectedPayment((prev) => (prev === paymentIndex ? null : paymentIndex));
  };

  const redirectToStripe = () => {
    // Redirect to Stripe Checkout
  };

  const performWalletPayment = () => {
    // Perform wallet payment
  };

  const performCashPayment = () => {
    // Perform cash payment
  };

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await axios.get('/api/next-external/wallet/balance', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setWalletBalance(response.data.balance || null);
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
        setWalletBalance(null);
      }
    };
    fetchWalletBalance();
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

  const paymentOptions = [
    {
      label: 'البطاقة الاتمانية',
      name: 'stripe',
      button_label: 'اكمل الدفع بامان عبر سترايب',
      content: (
        <>
          <div>
            <TextInput
              value={cardHolderDetails.email}
              setValue={(value: string) =>
                handleCardDetailsInput('email', value)
              }
              title='الايميل'
              placeholder=' '
            />
          </div>
          <div>
            <TextInput
              value={cardHolderDetails.address}
              setValue={(value: string) =>
                handleCardDetailsInput('address', value)
              }
              title='عنوان السكن'
              placeholder=' '
            />
          </div>
          <div className='flex '>
            <div>
              <TextInput
                value={cardHolderDetails.city}
                setValue={(value: string) =>
                  handleCardDetailsInput('city', value)
                }
                title='المدينة'
                placeholder=' '
              />
            </div>
            <div>
              <TextInput
                value={cardHolderDetails.country}
                setValue={(value: string) =>
                  handleCardDetailsInput('country', value)
                }
                title='البلد'
                placeholder=' '
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
      button_label: walletBalance ? 'احجز الآن' : 'لايمكنك الدفع !',
      content: (
        <>
          <p>رصيد محفظتك: {Number(walletBalance) || ' (!غير متوفر) '} ريال</p>
          <div className='flex justify-center items-center my-2'></div>
        </>
      ),
    },
    {
      label: 'الدفع نقداً',
      name: 'cash',
      button_label: 'احجز الآن',
      content: (
        <>
          <p>سوف يتم الدفع نقداً عند الصعود إلى الباص</p>
        </>
      ),
    },
  ];

  return (
    <main className='flex flex-col m-0 mb-0 bg-[#F4FAFE] bg-scroll h-screen'>
      <HeaderLayout title='الدفع' />
      <section className='mx-3 mt-4 p-4 bg-white shadow-lg text-[#042F40] rounded-xl'>
        <div className='flex justify-between items-center'>
          خط الرحلة: {booking_details?.trip?.pickup?.city} -{' '}
          {booking_details?.trip?.destination?.city} - الخط الساحلي
        </div>

        <div className='flex justify-start items-center gap-2 py-4'>
          <h1 className='font-bold'>عدد الركاب:</h1>

          <h1 className='flex'>
            <p className='ltr'>
              {booking_details?.trip?.price} *{' '}
              {
                booking_details?.passengers.filter(
                  (obj: { is_checked: boolean }) => obj.is_checked
                ).length
              }
            </p>
          </h1>
          <ExclamationCircleIcon className='h-5 w-5' />
        </div>
        <div className='flex gap-2'>
          <h1 className='font-bold'>المجموع: </h1>
          <h1 className=''>
            {booking_details?.trip?.price *
              booking_details?.passengers.filter(
                (obj: { is_checked: boolean }) => obj.is_checked
              ).length}{' '}
            ريال
          </h1>
        </div>
      </section>
      <div className='flex justify-start items-center gap-2 mx-4 mt-4 py-4'>
        <h1 className='text-lg font-bold'>الدفع عبر</h1>
      </div>

      <div className='flex flex-col gap-2 mx-4'>
        {paymentOptions.map((option, index) => (
          <div
            key={index}
            className='overflow-hidden shadow-lg bg-white text-[#042F40] rounded-xl'>
            <div
              className='flex justify-between items-center w-full p-4 rounded-xl bg-inherit cursor-pointer'
              onClick={() => dispatch(setPaymentMethod(option.name))}>
              <h1>{option.label}</h1>
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
                    <button
                      disabled={option.name === 'wallet' && !walletBalance}
                      className='mt-4 px-6 mx-auto bg-[#005687] text-white p-2 rounded-xl'
                      onClick={handleSubmitBooking}>
                      {option.button_label}
                    </button>
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
