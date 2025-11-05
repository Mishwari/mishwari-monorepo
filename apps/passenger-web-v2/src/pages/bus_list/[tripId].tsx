import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Transition } from '@headlessui/react';
import {
  UserPlusIcon,
  TrashIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { Input, Button } from '@mishwari/ui-web';

import { useRouter } from 'next/router';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { tripsApi } from '@mishwari/api';
import { TripProps } from '@/components/TripBox';
import PassengerModal from '@/components/PassengerModal';

import { AppState } from '@/store/store';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPassengers } from '@/store/actions/passengersActions';
import {
  setTrip,
  addPassenger,
  setAmount,
  deletePassenger,
  updatePassenger,
  checkPassenger,
} from '@/store/slices/bookingCreationSlice';
import { setSelectedTrip } from '@/store/slices/selectedTripSlice';
import { createBooking } from '@/store/actions/bookingActions';

import { Passenger } from '@/types/passenger';
import { Trip } from '@/types/trip';
import BackButton from '@/components/BackButton';
import HeaderLayout from '@/layouts/HeaderLayout';
import useAuth from '@/hooks/useAuth';

const feature_list = [
  { 'شحن الجوال': true },
  { مكيف: true },
  { 'واي فاي': false },
];

const apiBaseUrl = process.env.NEXT_PUBLIC_API_EXTERNAL_URL;

interface ContactDetailsObject {
  name: string;
  phone: string;
  email: string;
}

function trip_details() {
  const stripe = useStripe();
  const { isAuthenticated } = useAuth();
  const profile = useSelector((state: AppState) => state.profile);
  const passengers = useSelector(
    (state: AppState) => state.bookingCreation.passengers
  );
  const router = useRouter();
  const dispatch = useDispatch();

  const convertToReadableTime = (isoString: string): string => {
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'مساءاً' : 'صباحاً';
    hours = hours % 12 || 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const calculateDuration = (departure: string, arrival: string): string => {
    const departureDate = new Date(departure);
    const arrivalDate = new Date(arrival);
    const difference = arrivalDate.getTime() - departureDate.getTime();
    const hours = Math.floor(difference / 3600000);
    const minutes = Math.floor((difference % 3600000) / 60000);
    return `${hours}س ${minutes}د`;
  };

  const [contactDetails, setContactDetails] = useState<ContactDetailsObject>({
    name: '',
    phone: '',
    email: '',
  });

  const [isAddPassenger, setIsAddPassenger] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentPassenger, setCurrentPassenger] = useState<Passenger | null>(
    null
  );

  useEffect(() => {
    if (profile) {
      dispatch(fetchPassengers() as any);
    }
  }, [profile, dispatch]);

  useEffect(() => {
    // Add user details if not already in passengers list
    if (profile) {
      const userExists = passengers.some(
        (passenger: Passenger) => passenger.name === profile.full_name
      );
      // setTimeout(() => {

      if (
        !userExists &&
        (profile.full_name || profile.user.username || profile.user.email)
      ) {
        const userPassenger: Passenger = {
          id: null,
          name: profile?.full_name,
          email: profile?.user.email || '',
          phone: profile?.phone || '',
          age: profile?.age || null,
          is_checked: true,
          gender: profile?.gender || 'male',
        };
        dispatch(addPassenger(userPassenger));
      }
      // },200)
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      setContactDetails(() => {
        return {
          name: profile?.user.username,
          phone: profile?.phone,
          email: profile?.user.email,
        };
      });
    }
  }, [profile]); // no need for passengers dependency

  const handleContactDetailsInput = (name: string, value: any) => {
    setContactDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [tripDetails, setTripDetails] = useState<Trip>();

  const { tripId } = router.query;

  useEffect(() => {
    dispatch(setTrip(tripDetails as Trip));
  }, [tripDetails]);

  useEffect(() => {
    if (!router.isReady || !tripId) return;
    const fetchTripDetails = async () => {
      try {
        const response = await tripsApi.getById(Number(tripId));
        console.log('Fetched trip details:', response.data);
        setTripDetails(response.data);
      } catch (err: any) {
        console.error('Error fetching trip details:', err.message);
      }
    };
    fetchTripDetails();
  }, [router.isReady, tripId]);

  const performCheck = (index: number) => {
    dispatch(checkPassenger(index));
  };

  const handleDeletePassenger = (index: number) => {
    dispatch(deletePassenger(index));
  };

  const handleAddPassenger = (passengerData: Passenger) => {
    dispatch(addPassenger(passengerData));
  };

  const handleEditPassenger = (passenger: Passenger, index: any) => {

    dispatch(updatePassenger({ index, passenger }));
  };

  const openAddPassengerModal = () => {
    setCurrentPassenger(null);
    setIsEdit(false);
    setIsAddPassenger(true);
  };

  const openEditPassengerModal = (index: number) => {
    setCurrentPassenger(passengers[index]);
    setEditIndex(index);
    setIsEdit(true);
    setIsAddPassenger(true);
  };
  const handleSubmitBooking = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(createBooking(stripe) as any);
  };

  const amount =
    passengers.filter((obj: { is_checked: boolean }) => obj.is_checked).length *
    Number(tripDetails?.price);

  const departureTime = tripDetails?.departure_time ? convertToReadableTime(tripDetails.departure_time) : '---';
  const arrivalTime = tripDetails?.arrival_time ? convertToReadableTime(tripDetails.arrival_time) : '---';
  const duration = tripDetails?.departure_time && tripDetails?.arrival_time 
    ? calculateDuration(tripDetails.departure_time, tripDetails.arrival_time) 
    : '---';

  return (
    <main className='flex flex-col m-0 bg-gray-50 bg-scroll h-screen'>
      <HeaderLayout title='معلومات الرحلة' />

      <div className='flex flex-col md:flex-row justify-around px-2 md:px-4 mb-6'>
        <div className='px-2 sm:px-6 md:w-1/2 lg:max-w-xl'>
          <section className='mx-2 mt-4 p-4 bg-white shadow-lg text-brand-text-dark rounded-xl'>
            <div className='flex justify-between items-center'>
              <div className='flex flex-col text-center gap-1'>
                <h1 className='text-lg font-bold'>
                  {tripDetails?.from_city?.city || tripDetails?.pickup?.city}
                </h1>
                <p className='text-sm font-light'>{departureTime}</p>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <h1 className='text-xs'>{duration}</h1>
                <div className='relative arrow h-[0.5px] w-[60px] bg-black mt-3'>
                  <div className='absolute rotate-45 -left-[1px] top-1 w-[10px] h-[0.5px] bg-black'></div>
                  <div className='absolute -rotate-45 -left-[1px] -top-1 w-[10px] h-[0.5px] bg-black'></div>
                </div>
              </div>
              <div className='flex flex-col text-center gap-1'>
                <h1 className='text-lg font-bold'>
                  {tripDetails?.to_city?.city || tripDetails?.destination?.city}
                </h1>
                <p className='text-sm font-light'>{arrivalTime}</p>
              </div>
            </div>
            <div className='flex justify-start items-center gap-2 py-4'>
              <h1 className='font-bold'>المسار:</h1>
              <h1>{tripDetails?.planned_route_name || tripDetails?.path_road || 'غير محدد'}</h1>
            </div>
            <div className='flex gap-2'>
              <h1 className='font-bold'>السعر:</h1>
              <h1>{tripDetails?.price} ريال</h1>
              <h1 className='mx-auto'>
                ({Math.round(tripDetails?.distance || 0)} كم)
              </h1>
            </div>
            {tripDetails?.trip_type && (
              <div className='flex gap-2 mt-2'>
                <h1 className='font-bold'>نوع الرحلة:</h1>
                <h1>{tripDetails.trip_type}</h1>
              </div>
            )}
          </section>

          <section className='mx-2 h-max p-4 my-4 bg-white rounded-xl shadow-lg text-brand-text-dark'>
            <div className='flex justify-start items-center gap-2 mb-4'>
              <h1 className='text-lg font-bold'>معلومات الباص</h1>
            </div>
            <div className='h-[1px] w-full mb-6 bg-slate-500' />
            <div className='mx-2 mt-4'>
              <div className='flex justify-between items-center'>
                <h1 className='font-bold'>
                  باص: {tripDetails?.driver?.operator?.name || 'غير محدد'}
                </h1>
                {tripDetails?.driver?.driver_rating && (
                  <div
                    className={`flex justify-center items-center rounded-xl px-1 py-0.5 h-[25px] w-[60px] ${
                      Number(tripDetails.driver.driver_rating) >= 3.5
                        ? 'bg-green-500'
                        : 'bg-orange-400'
                    }`}>
                    <h1 className='text-white font-black pr-1'>
                      {Number(tripDetails.driver.driver_rating).toFixed(1)}
                    </h1>
                    <Image
                      src='/icons/star.svg'
                      alt='star'
                      height={25}
                      width={25}
                    />
                  </div>
                )}
              </div>
              <div className='flex flex-wrap justify-start items-center gap-2 mt-4'>
                {feature_list.map((item, index) => (
                  <div key={index}>
                    {Object.values(item)[0] && (
                      <div className='flex justify-center items-center text-center text-gray-600 text-xs font-bold gap-1.5 px-3 bg-gray-100 shadow rounded-2xl'>
                        <h1>{Object.keys(item)[0]}</h1>
                        <Image
                          src='/icons/greenCheck.svg'
                          alt='check'
                          height={15}
                          width={15}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className='mt-6 space-y-2'>
                <div className='flex gap-2'>
                  <strong>نوع الباص:</strong>
                  <p>{tripDetails?.bus?.bus_type || 'غير محدد'}</p>
                </div>
                <div className='flex gap-2'>
                  <strong>السائق:</strong>
                  <p>{tripDetails?.driver?.driver_name || 'غير محدد'}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className='px-2 sm:px-6 md:w-1/2 lg:max-w-xl'>
          <section className='flex flex-col my-4 p-4 mx-2 bg-white shadow-lg text-brand-text-dark rounded-xl'>
            <div className='flex justify-start items-center gap-2 py-2 mb-2'>
              <h1 className='text-lg font-bold'>معلومات التواصل</h1>
            </div>
            <div className='h-[1px] w-full mb-6 bg-slate-500' />
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>الاسم</label>
                <Input
                  value={contactDetails.name}
                  onChange={(e) => handleContactDetailsInput('name', e.target.value)}
                  placeholder='اسم الراكب'
                  className='text-right'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>رقم الجوال</label>
                <Input
                  value={contactDetails.phone}
                  onChange={(e) => handleContactDetailsInput('phone', e.target.value)}
                  placeholder='رقم الجوال'
                  className='text-right'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>الايميل</label>
                <Input
                  value={contactDetails.email}
                  onChange={(e) => handleContactDetailsInput('email', e.target.value)}
                  placeholder='الايميل'
                  type='email'
                  className='text-right'
                />
              </div>
            </div>
          </section>

          <section className='flex flex-col gap-3 mx-2 my-4 p-4 bg-white shadow-lg text-brand-text-dark rounded-xl'>
            <div className='flex justify-start items-center gap-2 mb-2'>
              <h1 className='text-lg font-bold'>عدد الركاب</h1>
              <button
                onClick={openAddPassengerModal}
                className='mr-auto text-gray-600 hover:text-gray-900 transition-colors'>
                <UserPlusIcon className='h-6 w-6' />
              </button>
            </div>
            <div className='h-[1px] w-full mb-2 bg-slate-500' />
            {passengers.length !== 0 ? (
              <div className='flex flex-col divide-y gap-4'>
                {passengers.map((passenger: Passenger, key: number) => (
                  <div
                    key={key}
                    className='flex justify-start items-center gap-2 px-2 pt-4'>
                    <button
                      onClick={() => handleDeletePassenger(key)}
                      className='text-red-600 hover:text-red-700 transition-colors'>
                      <TrashIcon className='h-5 w-5 min-w-5' />
                    </button>
                    <input
                      type='checkbox'
                      checked={passenger.is_checked}
                      onChange={() => performCheck(key)}
                      className='cursor-pointer'
                    />
                    <h1 className='font-bold truncate'>{passenger.name}</h1>
                    <button
                      onClick={() => openEditPassengerModal(key)}
                      className='mr-auto text-gray-600 hover:text-gray-900 transition-colors'>
                      <PencilSquareIcon className='w-5 h-5' />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex justify-center items-center'>
                <Button
                  onClick={openAddPassengerModal}
                  variant='outline'
                  className='w-1/3 min-w-[100px]'>
                  اضف راكب
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>
      <PassengerModal
        setIsAddPassenger={setIsAddPassenger}
        isAddPassenger={isAddPassenger}
        passenger={currentPassenger}
        isEdit={isEdit}
        handleOperation={
          isEdit
            ? (data: Passenger) => handleEditPassenger(data, editIndex)
            : handleAddPassenger
        }
        key={currentPassenger?.id}
      />

      <footer className='sticky flex justify-between items-center bottom-0 mt-auto p-3 bg-blue-50 w-full'>
        <div className='flex gap-1 items-center'>
          <h1>الاجمالي:</h1>
          <strong>{amount || 0}</strong>
          <h1>ريال</h1>
        </div>
        <Link href={isAuthenticated ? '/checkout/payment' : '/login'}>
          <Button
            disabled={amount === 0 && isAuthenticated}
            className={`${
              amount === 0 && isAuthenticated
                ? 'bg-green-500/30 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            }`}>
            {isAuthenticated
              ? 'الانتقال لصفحة الدفع'
              : 'سجل دخولك لاكمال الدفع'}
          </Button>
        </Link>
      </footer>
    </main>
  );
}

export default trip_details;
