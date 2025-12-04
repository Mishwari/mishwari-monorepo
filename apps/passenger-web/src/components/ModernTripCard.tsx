import React from 'react';
import {
  StarIcon,
  ClockIcon,
  WifiIcon,
  BoltIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';
import { Wind, Phone, Zap, Wifi } from 'lucide-react';
import { Trip } from '@/types/trip';

interface ModernTripCardProps {
  trip: Trip;
}

export default function ModernTripCard({ trip }: ModernTripCardProps) {
  const getRatingColor = (score: number) => {
    if (score >= 4.5)
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-100',
      };
    return {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-100',
    };
  };
  const operatorRating = trip.operator?.avg_rating || 0;
  const ratingStyle = getRatingColor(operatorRating);

  // Extract time only from datetime string
  const getTimeOnly = (datetime: string) => {
    if (!datetime) return '00:00';
    // If it's already in HH:MM format, return as is
    if (datetime.includes(':') && !datetime.includes('T')) return datetime;
    // If it's ISO datetime, extract time
    const date = new Date(datetime);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  // Calculate duration from departure and arrival times
  const calculateDuration = () => {
    if (!trip.departure_time || !trip.arrival_time) return '';
    const depTime = getTimeOnly(trip.departure_time);
    const arrTime = getTimeOnly(trip.arrival_time);
    const [depHour, depMin] = depTime.split(':').map(Number);
    const [arrHour, arrMin] = arrTime.split(':').map(Number);
    const depMinutes = depHour * 60 + depMin;
    const arrMinutes = arrHour * 60 + arrMin;
    const diff = arrMinutes - depMinutes;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}.${minutes > 0 ? 5 : 0} ساعة`;
  };

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300 cursor-pointer group relative overflow-hidden p-5'>
      {/* Side Color Strip */}
      <div className='hidden sm:block absolute right-0 top-0 bottom-0 w-1 bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity' />

      {/* Top Row: Info + Price */}
      <div className='flex justify-between items-start mb-5'>
        {/* Operator Info */}
        <div className='flex items-center gap-3'>
          <div className='w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-primary font-bold text-sm border border-slate-100'>
            {trip.bus_operator?.substring(0, 2).toUpperCase() || 'BU'}
          </div>
          <div>
            <h3 className='font-bold text-lg leading-tight'>
              {trip.bus_operator || 'شركة النقل'}
            </h3>
            <div className='flex items-center gap-2 text-xs font-medium text-slate-500 mt-1'>
              <span className='bg-slate-100 px-2 py-0.5 rounded text-slate-600'>
                {trip.bus_type || 'VIP'}
              </span>
              <span className='text-slate-300'>•</span>
              <span>{trip.bus_number || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Price (Top Right) */}
        <div className='text-right'>
          <div className='text-xl font-black text-primary'>
            {trip.price}{' '}
            <span className='text-xs font-bold text-primary/70'>ر.ي</span>
          </div>
          {trip.available_seats < 5 ? (
            <div className='text-[10px] font-bold text-red-600 animate-pulse'>
              {trip.available_seats} متبقية
            </div>
          ) : (
            <div className='text-[10px] font-bold text-green-600'>متاح</div>
          )}
        </div>
      </div>

      {/* Middle Row: Timeline */}
      <div className='flex items-center gap-4 sm:gap-8 mb-6'>
        <div className='text-center min-w-[50px]'>
          <div className='text-lg font-black'>
            {getTimeOnly(trip.departure_time)}
          </div>
          <div className='text-[10px] font-bold text-slate-400 uppercase tracking-wide'>
            مغادرة
          </div>
        </div>

        <div className='flex-1 flex flex-col items-center'>
          <div className='flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100 mb-1.5'>
            <ClockIcon className='w-3 h-3' />
            {calculateDuration()}
          </div>
          <div className='w-full h-px bg-slate-200 relative flex items-center justify-between'>
            <div className='w-1.5 h-1.5 rounded-full bg-slate-300' />
            <div className='flex-1 border-t border-dotted border-slate-300 mx-2' />
            <div className='w-1.5 h-1.5 rounded-full bg-slate-300' />
          </div>
          <div className='text-[10px] font-medium text-slate-400 mt-1.5'>
            {trip.planned_route_name || 'مباشر'}
          </div>
        </div>

        <div className='text-center min-w-[50px]'>
          <div className='text-lg font-black'>
            {getTimeOnly(trip.arrival_time)}
          </div>
          <div className='text-[10px] font-bold text-slate-400 uppercase tracking-wide'>
            وصول
          </div>
        </div>
      </div>

      {/* Bottom Row: Amenities + Select Button */}
      <div className='flex items-center justify-between pt-4 border-t border-slate-50'>
        {/* Amenities & Rating */}
        <div className='flex items-center gap-3'>
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md border shadow-sm ${ratingStyle.bg} ${ratingStyle.text} ${ratingStyle.border}`}>
            <StarIcon className={`w-3 h-3 fill-current`} />
            <span className='text-[10px] font-bold'>{operatorRating.toFixed(1)}</span>
            {trip.operator?.total_reviews > 0 && (
              <span className='text-[9px] opacity-70'>({trip.operator.total_reviews})</span>
            )}
          </div>
          <div className='hidden sm:flex gap-2'>
            {trip.bus?.has_wifi && (
              <Wifi className='w-3 h-3 text-slate-400' />
            )}
            {trip.bus?.has_ac && (
              <Wind className='w-3 h-3 text-slate-400' />
            )}
            {trip.bus?.has_usb_charging && (
              <Zap className='w-3 h-3 text-slate-400' />
            )}
          </div>
        </div>

        {/* Compact Action Button */}
        <button className='flex items-center gap-2 px-5 py-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-bold rounded-lg shadow-md shadow-blue-900/10 active:scale-95 transition-all text-xs sm:text-sm'>
          <span>اختيار</span>
          <ChevronLeftIcon className='w-3 h-3 sm:w-4 sm:h-4' />
        </button>
      </div>
    </div>
  );
}
