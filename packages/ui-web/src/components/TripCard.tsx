import React from 'react';
import Image from 'next/image';
import StarIcon from '@mishwari/ui-web/public/icons/common/star.svg';
import AirConditionarIcon from '@mishwari/ui-web/public/icons/amenities/airConditionar.svg';
import WifiIcon from '@mishwari/ui-web/public/icons/amenities/wifiIcon.svg';
import MobileIcon from '@mishwari/ui-web/public/icons/amenities/mobileIcon.svg';

export interface TripCardProps {
  trip: {
    id: number;
    driver?: {
      id?: number;
      d_name?: string;
      driver_rating?: string | number;
      operator?: {
        id?: number;
        name?: string;
      };
    } | null;
    bus?: {
      id?: number;
      bus_number?: string;
      bus_type?: string;
      capacity?: number;
      amenities?: {
        ac?: boolean;
        wifi?: boolean;
        charger?: boolean;
      };
    } | null;
    from_city?: {
      id?: number;
      city?: string;
    };
    to_city?: {
      id?: number;
      city?: string;
    };
    planned_route_name?: string;
    journey_date?: string;
    departure_time: string;
    arrival_time: string;
    available_seats?: number;
    price: number;
    status?: string;
  };
  onClick?: () => void;
}

function convertToReadableTime(isoString: string): string {
  const date = new Date(isoString);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'مساءاً' : 'صباحاً';

  hours = hours % 12;
  hours = hours || 12;

  const minutesStr = minutes < 10 ? '0' + minutes : minutes;

  return `${hours}:${minutesStr} ${ampm}`;
}

function calculateDuration(departure: string, arrival: string): string {
  const departureDate = new Date(departure);
  const arrivalDate = new Date(arrival);

  const difference = arrivalDate.getTime() - departureDate.getTime();
  const hours = Math.floor(difference / 3600000);
  const minutes = Math.floor((difference % 3600000) / 60000);

  return `${hours}س ${minutes}د`;
}

export function TripCard({ trip, onClick }: TripCardProps) {
  const formattedDepartureTime = convertToReadableTime(trip.departure_time);
  const formattedArrivalTime = convertToReadableTime(trip.arrival_time);
  const tripDuration = calculateDuration(trip.departure_time, trip.arrival_time);
  const rating = Number(trip.driver?.driver_rating || 0);

  return (
    <div
      className='mb-4 justify-between md:flex px-3 sm:px-4 py-3 shadow-md border border-gray-300 bg-white rounded-xl hover:shadow-lg transition-shadow cursor-pointer active:scale-[0.99]'
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}>
      <div className='flex justify-between md:gap-9 items-center py-2'>
        <div className='flex-1 min-w-0'>
          <h2 className='text-lg md:text-xl font-bold text-brand-text-dark truncate'>
            {trip.driver?.operator?.name || 'غير محدد'}
          </h2>
          <p className='text-xs md:text-sm text-gray-600 truncate'>
            {trip.bus?.bus_type || 'غير محدد'} - {trip.planned_route_name}
          </p>
        </div>
        <div
          className={`flex justify-center items-center rounded-lg px-1.5 py-0.5 gap-0.5 shrink-0 ${
            rating >= 3.5 ? 'bg-green-500' : 'bg-orange-400'
          }`}>
          <span className='text-white font-bold text-sm'>{rating.toFixed(1)}</span>
          <StarIcon width={16} height={16} />
        </div>
      </div>
      <div className='flex gap-3 md:gap-9 justify-between items-center py-2 border-t border-gray-100'>
        <div className='flex-1'>
          <div className='flex gap-2 items-center mb-2'>
            <p className='font-bold text-sm md:text-base text-brand-text-dark'>
              {formattedDepartureTime} - {formattedArrivalTime}
            </p>
            <span className='text-xs text-gray-500'>({tripDuration})</span>
          </div>
          <div className='flex gap-3'>
            {trip.bus?.amenities?.ac && (
              <AirConditionarIcon width={16} height={16} className='opacity-70' />
            )}
            {trip.bus?.amenities?.wifi && (
              <WifiIcon width={16} height={16} className='opacity-70' />
            )}
            {trip.bus?.amenities?.charger && (
              <MobileIcon width={16} height={16} className='opacity-70' />
            )}
          </div>
        </div>
        <div className='text-left shrink-0'>
          <div className='flex items-baseline gap-1 justify-end'>
            <span className='text-xl md:text-2xl font-black text-brand-primary'>
              {trip.price}
            </span>
            <span className='text-xs text-gray-600'>ريال</span>
          </div>
          <p
            className={`text-xs mt-1 text-left ${
              Number(trip.available_seats) < 5
                ? 'text-orange-600 font-medium'
                : 'text-gray-600'
            }`}>
            {trip.available_seats
              ? trip.available_seats > 1 && trip.available_seats < 11
                ? `${trip.available_seats} مقاعد متاحة`
                : `${trip.available_seats} مقعد متاح`
              : ''}
          </p>
        </div>
      </div>
    </div>
  );
}
