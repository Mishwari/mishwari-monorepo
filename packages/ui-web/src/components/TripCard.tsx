import React from 'react';
import Image from 'next/image';
import { convertToReadableTime } from '@mishwari/utils';
import { BUS_AMENITIES_WITH_ICONS } from '../data/amenities';
import { RatingBadge } from './RatingBadge';

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
        <RatingBadge rating={trip.driver?.driver_rating} size='sm' className='shrink-0' />
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
            {BUS_AMENITIES_WITH_ICONS.filter(a => trip.bus?.amenities?.[a.key] === 'true').map((amenity) => (
              amenity.Icon ? (
                <amenity.Icon key={amenity.key} width={16} height={16} className='opacity-70' />
              ) : (
                <span key={amenity.key} className='text-xs text-gray-600 opacity-70'>{amenity.label}</span>
              )
            ))}
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
