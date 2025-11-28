import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { createPortal } from 'react-dom';
import {
  MapPinIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline';
import { tripsApi } from '@mishwari/api';
import { DatePicker } from '@mishwari/ui-web';
import { CityDropdown } from '@mishwari/ui-web';
import type { CityOption } from '@mishwari/ui-web';
import type { CityWithTripCount } from '@mishwari/api';

export default function TripSearchForm() {
  const [fromCity, setFromCity] = useState<string>('');
  const [toCity, setToCity] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [departureCities, setDepartureCities] = useState<CityOption[]>([]);
  const [destinationCities, setDestinationCities] = useState<CityOption[]>([]);
  const [loadingFrom, setLoadingFrom] = useState(false);
  const [loadingTo, setLoadingTo] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDepartureCities = async () => {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      console.log('Fetching departure cities for date:', dateStr);
      setLoadingFrom(true);
      try {
        const cities = await tripsApi.getDepartureCities(dateStr);
        console.log('Departure cities:', cities);
        setDepartureCities(cities);
      } catch (err: any) {
        console.error('Error fetching departure cities:', err);
        setDepartureCities([]);
      } finally {
        setLoadingFrom(false);
      }
    };
    fetchDepartureCities().catch(() => {});
  }, [selectedDate]);

  useEffect(() => {
    if (!fromCity) {
      setDestinationCities([]);
      setToCity('');
      return;
    }

    const fetchDestinationCities = async () => {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      console.log('Fetching destination cities for:', fromCity, dateStr);
      setLoadingTo(true);
      try {
        const cities = await tripsApi.getDestinationCities(fromCity, dateStr);
        console.log('Destination cities:', cities);
        setDestinationCities(cities);
      } catch (err: any) {
        console.error('Error fetching destination cities:', err);
        setDestinationCities([]);
      } finally {
        setLoadingTo(false);
      }
    };
    fetchDestinationCities().catch(() => {});
  }, [fromCity, selectedDate]);

  const [isSwapping, setIsSwapping] = useState(false);

  const handleSwitchCities = () => {
    if (toCity) {
      setIsSwapping(true);
      setTimeout(() => {
        const temp = fromCity;
        setFromCity(toCity);
        setToCity(temp);
        setIsSwapping(false);
      }, 150);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromCity && toCity) {
      router.push({
        pathname: '/bus_list',
        query: {
          tripType: 2,
          city: '',
          pickup: fromCity,
          destination: toCity,
          date: format(selectedDate, 'yyyy-MM-dd'),
        },
      });
    } else {
      alert('الرجاء اختيار المدينتين');
    }
  };

  return (
    <>
      {showCalendar && createPortal(
        <>
          <div
            className='fixed inset-0 bg-black/40 backdrop-blur-sm z-[10000] animate-in fade-in duration-200'
            onClick={() => setShowCalendar(false)}
          />
          <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000]'>
            <DatePicker
              selectedDate={selectedDate}
              onDateSelect={(date) => {
                setSelectedDate(date);
                setShowCalendar(false);
              }}
            />
          </div>
        </>,
        document.body
      )}

      <div className='w-full max-w-4xl relative space-y-8 animate-in fade-in zoom-in duration-500'>
        <div className='text-center space-y-4'>
          <h1 className='text-4xl md:text-7xl font-black tracking-tight leading-tight'>
            إلى أين تريد <br className='md:hidden' />
            <span className='bg-clip-text text-transparent bg-gradient-to-l from-brand-gradient to-brand-primary'>
              الذهاب؟
            </span>
          </h1>
          <p className='text-lg text-slate-500 font-medium max-w-lg mx-auto leading-relaxed'>
            احجز تذكرة الحافلة في ثوانٍ. بدون طوابير، تأكيد فوري.
          </p>
        </div>

        <div className='bg-white/70 backdrop-blur-xl p-2 rounded-[2rem] shadow-2xl shadow-blue-900/5 border border-white'>
          <form
            onSubmit={handleSubmit}
            className='bg-white rounded-[1.5rem] p-4 flex flex-col md:flex-row gap-2 border border-slate-100'>
            {/* Mobile: Stacked with swap button */}
            <div className='md:hidden relative grid grid-rows-2 gap-2'>
              <div className='h-full'>
                <CityDropdown
                  options={departureCities}
                  value={fromCity}
                  onChange={setFromCity}
                  placeholder='اختر مدينة'
                  emptyMessage='لا توجد رحلات متاحة'
                  loading={loadingFrom}
                  showTripCount={true}
                  label='من'
                  icon={MapPinIcon}
                />
              </div>
              {toCity && (
                <div className='absolute left-4 top-1/2 -translate-y-1/2 z-10 animate-in zoom-in duration-200'>
                  <button
                    type='button'
                    onClick={handleSwitchCities}
                    className='w-10 h-10 bg-white rounded-full border border-slate-200 shadow-lg flex items-center justify-center text-slate-500 hover:text-[#005687] hover:border-blue-100 active:scale-95 transition-all'>
                    <ArrowsRightLeftIcon
                      className={`w-4 h-4 rotate-90 transition-transform ${
                        isSwapping ? 'scale-110' : ''
                      }`}
                    />
                  </button>
                </div>
              )}
              <div className='h-full'>
                <CityDropdown
                  options={destinationCities}
                  value={toCity}
                  onChange={setToCity}
                  placeholder='اختر مدينة'
                  emptyMessage='لا توجد وجهات متاحة'
                  loading={loadingTo}
                  showTripCount={true}
                  disabled={!fromCity}
                  label='إلى'
                  icon={MapPinIcon}
                />
              </div>
            </div>

            {/* Desktop: Horizontal layout */}
            <div className='hidden md:flex flex-1 gap-2'>
              <div className='relative flex-1 transition-all duration-300'>
                <CityDropdown
                  options={departureCities}
                  value={fromCity}
                  onChange={setFromCity}
                  placeholder='اختر مدينة'
                  emptyMessage='لا توجد رحلات متاحة'
                  loading={loadingFrom}
                  showTripCount={true}
                  label='من'
                  icon={MapPinIcon}
                />
              </div>

              {toCity && (
                <div className='flex items-end justify-center pb-1 animate-in zoom-in duration-200'>
                  <button
                    type='button'
                    onClick={handleSwitchCities}
                    className='p-3 bg-slate-50 hover:bg-hover rounded-full text-primary transition-all active:scale-95 group'>
                    <ArrowsRightLeftIcon
                      className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                        isSwapping ? 'scale-110' : ''
                      }`}
                    />
                  </button>
                </div>
              )}

              <div className='relative flex-1 transition-all duration-300'>
                <CityDropdown
                  options={destinationCities}
                  value={toCity}
                  onChange={setToCity}
                  placeholder='اختر مدينة'
                  emptyMessage='لا توجد وجهات متاحة'
                  loading={loadingTo}
                  showTripCount={true}
                  disabled={!fromCity}
                  label='إلى'
                  icon={MapPinIcon}
                />
              </div>
            </div>

            <div className='md:flex-none md:w-auto border-t border-slate-100 pt-2 md:border-t-0 md:pt-0'>
              <div
                className='flex items-center gap-2 p-2 sm:p-3 rounded-xl transition-all cursor-pointer border bg-slate-50 hover:bg-hover border-transparent hover:border-blue-100 h-full'
                onClick={() => setShowCalendar(!showCalendar)}>
                <CalendarIcon className='text-primary w-5 h-5 shrink-0' />
                <div className='flex-1 min-w-0 flex flex-col justify-center text-right pl-1'>
                  <span className='text-[10px] text-slate-400 font-bold mb-0.5 leading-none'>
                    متى
                  </span>
                  <div className='truncate text-sm sm:text-base font-bold text-[#042f40] w-full leading-tight'>
                    {format(selectedDate, 'd MMMM', { locale: ar })}
                  </div>
                </div>
              </div>
            </div>

            <div className='md:w-auto'>
              <button
                type='submit'
                className='w-full h-full min-h-[56px] px-8 bg-brand-primary hover:bg-brand-primary-dark text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-2 group'>
                <MagnifyingGlassIcon className='w-5 h-5 group-hover:scale-110 transition-transform' />
                <span className='md:hidden'>بحث عن رحلات</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
