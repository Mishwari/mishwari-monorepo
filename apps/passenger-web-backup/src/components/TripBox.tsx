import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Trip as TripForInterface } from '@/types/trip';

function convertToReadableTime(isoString: string) {
  const date = new Date(isoString);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'مساءاً' : 'صباحاً';

  hours = hours % 12;
  hours = hours || 12; // the hour '0' should be '12'

  const minutesStr = minutes < 10 ? '0' + minutes : minutes;

  return `${hours}:${minutesStr} ${ampm}`;
}

function calculateDuration(departure: any, arrival: any) {
  const departureDate: any = new Date(departure);
  const arrivalDate: any = new Date(arrival);

  const difference = arrivalDate - departureDate; // difference in milliseconds
  const hours = Math.floor(difference / 3600000); // convert milliseconds to hours
  const minutes = Math.floor((difference % 3600000) / 60000); // convert remaining milliseconds to minutes

  return `${hours}س ${minutes}د`;
}

export type TripProps = {
  trip: {
    id: number;
    driver: {
      id: number;
      d_name: string;
      driver_rating: string;
      operator: {
        id: number;
        name: string;
      };
    } | null;
    bus: {
      id: number;
      bus_number: string;
      bus_type: string;
      capacity: number;
      amenities: {
        ac?: boolean;
        wifi?: boolean;
        charger?: boolean;
      };
    } | null;
    from_city: {
      id: number;
      city: string;
    };
    to_city: {
      id: number;
      city: string;
    };
    planned_route_name: string;
    journey_date: string;
    departure_time: string;
    arrival_time: string;
    available_seats: number;
    price: number;
    status: string;
  };
};

interface Trip {
  trip: TripForInterface;
}

function TripBox({ trip }: Trip) {
  const formattedDepartureTime = convertToReadableTime(trip.departure_time);
  const formattedArrivalTime = convertToReadableTime(trip.arrival_time);
  const tripDuration = calculateDuration(
    trip.departure_time,
    trip.arrival_time
  );

  const router = useRouter();
  const handleTripClick = () => {
    router.push({
      pathname: '/bus_list/trip_details',
      query: {
        trip: trip?.id,
      },
    });
  };

  return (
    <div className='mt-5 justify-between md:flex px-2 sm:px-4 shadow-md border border-[#a4a4a48e] bg-white rounded-xl '>
      <div className='flex justify-between md:gap-9 items-center p-4'>
        <div className=''>
          <h1 className=' text-xl font-bold'>
            {trip.driver?.operator?.name || 'غير محدد'}
          </h1>
          <h5 className='text-sm font-light'>
            {trip.bus?.bus_type || 'غير محدد'} - {trip.planned_route_name}
          </h5>
        </div>
        <div
          className={`flex justify-center items-center rounded-xl px-1 py-0.5 h-[25px] w-[60px] ${
            Number(trip.driver?.driver_rating || 0) >= 3.5
              ? 'bg-[#21C17A]'
              : 'bg-[#FFA400]'
          }`}>
          <h1 className='text-white font-black pr-1 '>
            {Number(trip.driver?.driver_rating || 0)}
          </h1>
          <Image
            src='/icons/star.svg'
            alt='star'
            height={25}
            width={25}
          />
        </div>
      </div>
      <div className='flex p-4 gap-2 md:gap-9 justify-between items-center'>
        <div className=''>
          <div className='flex gap-1 items-center'>
            <h1 className='font-bold'>
              {formattedDepartureTime} - {formattedArrivalTime}
            </h1>
            {/** duration: */}
            {/* <h1 className='text-sm font-light'>({tripDuration})</h1> */}
          </div>
          <div className='flex gap-4 pt-2'>
            {trip.bus?.amenities?.ac && (
              <Image
                src='/icons/airConditionar.svg'
                alt='ac logo'
                height={15}
                width={15}
              />
            )}
            {trip.bus?.amenities?.wifi && (
              <Image
                src='/icons/wifiIcon.svg'
                alt='wifi logo'
                height={15}
                width={15}
              />
            )}
            {trip.bus?.amenities?.charger && (
              <Image
                src='/icons/mobileIcon.svg'
                alt='charger logo'
                height={15}
                width={15}
              />
            )}
          </div>
        </div>
        <div>
          <h1 className='text-2xl  flex justify-center items-center gap-1 font-black'>
            {trip.price}
            <p className='text-xs'>ريال</p>
          </h1>
          <h1
            className={`text-xs font-light text-center ${
              Number(trip.available_seats) < 5 ? 'text-orange-600' : ''
            }	`}>
            {trip.available_seats
              ? trip.available_seats > 1 && trip.available_seats < 11
                ? (trip.available_seats || '0') + ' مقاعد متاحة'
                : (trip.available_seats || '0') + ' مقعد متاح'
              : ''}{' '}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default TripBox;
