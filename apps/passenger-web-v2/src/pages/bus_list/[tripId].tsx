import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import FlipButton from '@/components/FlipButton';
import TextInput from '@/components/TextInput';
import { Transition } from '@headlessui/react';
import {
  UserPlusIcon,
  TrashIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

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

  const [busDetailFlip, setBusDetailsFlip] = useState<boolean>(false);
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

  return (
    <main className='flex  flex-col m-0  bg-[#F4FAFE] bg-scroll h-screen '>
      <HeaderLayout title='معلومات الرحلة' />

      <div className='flex flex-col md:flex-row justify-around px-2 md:px-4 mb-6'>
        <div className='px-2 sm:px-6 md:w-1/2 lg:max-w-xl'>
          <section className=' mx-2 mt-4 p-4 bg-white shadow-lg  text-[#042F40] rounded-xl'>
            <div className='flex justify-between items-center'>
              <div className='flex flex-col text-center gap-1'>
                <h1 className='text-lg font-bold '>
                  {tripDetails?.from_city?.city || tripDetails?.pickup?.city}
                </h1>
                <p className='text-sm font-light'>3:00 صباحاً</p>
              </div>
              <div className='flex flex-col justify-center items-center '>
                <h1 className='text-xs'>7 س 32 د</h1>
                <div className='relative arrow h-[0.5px] w-[60px] bg-black mt-3 '>
                  <div className='absolute rotate-45 -left-[1px] top-1 w-[10px] h-[0.5px] bg-black'></div>
                  <div className='absolute -rotate-45 -left-[1px] -top-1 w-[10px] h-[0.5px] bg-black'></div>
                </div>
              </div>

              <div className='flex flex-col text-center gap-1'>
                <h1 className='text-lg font-bold'>
                  {tripDetails?.to_city?.city || tripDetails?.destination?.city}
                </h1>
                <p className='text-sm font-light'>6:00 مساءاً</p>
              </div>
            </div>
            <div className='flex justify-start items-center gap-2 py-4 '>
              <h1 className=' font-bold'>المسار:</h1>
              <h1 className=' flex'>
                <p> {tripDetails?.planned_route_name || tripDetails?.path_road} </p> - <p> 6 نقاط توقف</p>
              </h1>
              <FlipButton />
            </div>
            <div className='flex gap-2'>
              <h1 className='font-bold'>السعر: </h1>
              <h1 className=' '>{tripDetails?.price} ريال</h1>
              <h1 className='mx-auto'>
                ({Math.round(tripDetails?.distance || 0)} كم)
              </h1>
            </div>
          </section>

          <section
            className={`   mx-2 h-max p-4 my-4 bg-white rounded-xl sfhadow-lg shadow-lg  text-[#042F40] rfounded-xl transition-transform delay-300 `}>
            <div className='flex justify-start items-center gap-2   mb-4'>
              <h1 className='text-lg font-bold'>معلومات الباص</h1>
            </div>
            <div className='h-[1px] w-full mb-6 bg-slate-500' />

            <div className='  mx-2 mt-4'>
              <div className='flex justify-between items-center'>
                <h1 className='font-bold'>
                  {' '}
                  باص: {tripDetails?.driver?.operator?.name}
                </h1>
                <div
                  className={`flex justify-center items-center rounded-xl px-1 py-0.5 h-[25px] w-[60px] ${
                    Number(tripDetails?.driver?.driver_rating) >= 3.5
                      ? 'bg-[#21C17A]'
                      : ' bg-[#FFA400]'
                  }`}>
                  <h1 className='text-white font-black pr-1 '>
                    {tripDetails?.driver?.driver_rating?.toString().slice(0, 3)}
                  </h1>
                  <Image
                    src='/icons/star.svg'
                    alt='star'
                    height={25}
                    width={25}
                  />
                </div>
              </div>
              <div className='flex flex-wrap justify-start items-center gap-2 mt-4'>
                {feature_list &&
                  feature_list.map((item, index) => (
                    <div key={index}>
                      {Object.values(item)[0] && (
                        <div className='flex justify-center items-center text-center text-[#747474] text-xs font-bold gap-1.5 px-3 bg-[#e7f0f680] shadow rounded-2xl '>
                          <h1>{Object.keys(item)[0]}</h1>
                          <Image
                            src='/icons/greenCheck.svg'
                            alt='phone'
                            height={15}
                            width={15}
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
              <div>
                <h1 className='flex flex-wrap gap-1 mt-6'>
                  <strong>نوع الباص: </strong>
                  <p>{tripDetails?.bus?.bus_type}</p>
                  <strong className='mr-4'>السائق : </strong>
                  <p>{tripDetails?.driver?.driver_name}</p>
                </h1>
              </div>
            </div>
          </section>
        </div>

        <div className='px-2 sm:px-6 md:w-1/2 lg:max-w-xl'>
          <section className='flex flex-col my-4 p-4 mx-2 bg-white shadow-lg  text-[#042F40] rounded-xl'>
            <div className='flex justify-start items-center gap-2  py-2  mb-2'>
              <h1 className='text-lg font-bold'>معلومات التواصل</h1>
            </div>
            <div className='h-[1px] w-full mb-6 bg-slate-500' />
            <div>
              <TextInput
                value={contactDetails.name}
                setValue={(value: string) =>
                  handleContactDetailsInput('name', value)
                }
                title='الاسم'
                placeholder='اسم الراكب'
              />
            </div>
            <div>
              <TextInput
                value={contactDetails.phone}
                setValue={(value: string) =>
                  handleContactDetailsInput('phone', value)
                }
                title='رقم الجوال'
                placeholder=''
              />
            </div>
            <div>
              <TextInput
                value={contactDetails.email}
                setValue={(value: string) =>
                  handleContactDetailsInput('email', value)
                }
                title='الايميل'
                placeholder=' '
              />
            </div>
          </section>

          <section className='flex flex-col gap-3 mx-2 my-4 p-4 bg-white shadow-lg  text-[#042F40] rounded-xl'>
            <div className='flex justify-start items-center gap-2    mb-2 '>
              <h1 className='text-lg font-bold'>عدد الركاب </h1>
              <div
                className='text-3xl font-bold text-gray-600 mr-auto pl-2 cursor-pointer'
                onClick={openAddPassengerModal}>
                <UserPlusIcon className='h-6 w-6 font-bold ' />
              </div>
            </div>
            <div className='h-[1px] w-full mb-2 bg-slate-500' />
            {passengers.length != 0 ? (
              <div className='flex flex-col divide-y-1 gap-4 '>
                {passengers.map((passenger: Passenger, key: number) => (
                  <div
                    key={key}
                    className='flex justify-start items-center gap-2 px-2 pt-4'>
                    <TrashIcon
                      onClick={() => handleDeletePassenger(key)}
                      className='h-5 w-5 min-w-5 cursor-pointer text-red-600  ml-2 '
                    />

                    <input
                      type='checkbox'
                      checked={passenger.is_checked}
                      onChange={() => performCheck(key)}></input>
                    <h1 className='font-bold truncate'>{passenger.name}</h1>
                    <div
                      className='mr-auto cursor-pointer'
                      onClick={() => openEditPassengerModal(key)}>
                      <PencilSquareIcon className='w-5 h-5 ' />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex  justify-center items-center'>
                <button
                  onClick={openAddPassengerModal}
                  className=' py-1 w-1/3 mx-auto min-w-[100px] bf-slate-100 border text-[#005678] border-[#00567873] rounded-full'>
                  <span>اضف راكب</span>
                  {/* <span>
                <PlusCircleIcon className='w-6 h-6' />
              </span> */}
                </button>
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

      {/* footer */}
      <footer className='sticky flex justify-between items-center bottom-0  mt-auto p-3 bg-[#dfedfa] w-full'>
        {/* <div
          onClick={handleSubmitBooking}
          className='  px-2 py-1 w-max rounded-sm justify-start  items-start text-center bg-[#21C17A] cursor-pointer hover:brightness-105 active:brightness-110 transition ease-in-out duration-200'>
          <h1 className='text-white text-center font-bold '>اكمل الحجز </h1>
          
        </div> */}
        <div className='flex justify-between gap-1 items-center '>
          <h1>الاجمالي: </h1>
          {/* TODO: useEffect to store total amount in redux */}
          <strong>{amount || 0} </strong>
          <h1 className=''> ريال</h1>
        </div>
        <Link href={isAuthenticated ? '/checkout/payment' : '/login'}>
          {/* <CardElement /> */}
          <button
            className={`px-3 py-1 rounded text-white 
              ${
                amount == 0 && isAuthenticated
                  ? ' bg-[#21c17943] border border-white cursor-not-allowed'
                  : ' bg-[#21C17A]  '
              }
              `}
            disabled={amount == 0 && isAuthenticated}
            type='submit'>
            {isAuthenticated
              ? 'الانتقال لصفحة الدفع'
              : ' سجل دخولك لاكمال الدفع'}

            {/* {loading ? 'Processing...' : 'Pay'} */}
          </button>
        </Link>
      </footer>
    </main>
  );
}

export default trip_details;
