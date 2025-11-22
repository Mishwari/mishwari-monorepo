import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { format, addDays, isToday, isTomorrow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { CalendarDaysIcon as CalendarDaysIconSolid } from '@heroicons/react/24/solid';
import PickIcon from '@mishwari/ui-web/public/icons/navigation/pickIcon.svg';
import DestIcon from '@mishwari/ui-web/public/icons/navigation/destIcon.svg';
import SwitchArrowsIcon from '@mishwari/ui-web/public/icons/common/SwitchArrows.svg';
import { tripsApi } from '@mishwari/api';
import { Button, DatePicker, QuickDateButtons } from '@mishwari/ui-web';
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
      } catch (err) {
        console.error('Error fetching departure cities:', err);
        setDepartureCities([]);
      } finally {
        setLoadingFrom(false);
      }
    };
    fetchDepartureCities();
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
      } catch (err) {
        console.error('Error fetching destination cities:', err);
        setDestinationCities([]);
      } finally {
        setLoadingTo(false);
      }
    };
    fetchDestinationCities();
  }, [fromCity, selectedDate]);

  const handleSwitchCities = () => {
    if (toCity && destinationCities.some(c => c.city === toCity)) {
      const temp = fromCity;
      setFromCity(toCity);
      setToCity(temp);
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
    <form
      onSubmit={handleSubmit}
      className="mt-8 w-full flex flex-wrap gap-4 lg:gap-0 lg:rounded-md lg:bg-white lg:shadow-md"
    >
      <div className="w-full lg:w-5/12 relative flex flex-wrap sm:flex-nowrap shadow-lg lg:shadow-none border border-gray-200 bg-gray-200 rounded-lg lg:rounded-l-none lg:border-l-0">
        <div className="flex justify-start items-center px-3 gap-4 w-full h-14">
          <PickIcon className="sm:hidden object-contain w-[18px] h-auto" />
          <div className="flex flex-col w-full">
            <span className="text-xs font-medium text-gray-600">الانطلاق</span>
            <CityDropdown
              options={departureCities}
              value={fromCity}
              onChange={setFromCity}
              placeholder="حدد اليوم واختر مدينة الانطلاق"
              emptyMessage="لا توجد رحلات متاحة"
              loading={loadingFrom}
              showTripCount={true}
            />
          </div>
        </div>

        <div onClick={handleSwitchCities} className="absolute z-10 left-4 bg-inherit flex items-center justify-center self-center h-max w-max sm:w-28 sm:static sm:justify-center sm:items-center rounded-full sm:rotate-90 overflow-hidden">
          <div className="border-2 border-white hover:bg-brand-primary/10 active:bg-brand-primary/20 cursor-pointer sm:border-0 p-2.5 sm:p-2 rounded-full bg-inherit flex items-center justify-center">
            <SwitchArrowsIcon style={{ width: '20px', height: '20px', display: 'block' }} />
          </div>
        </div>

        <div className="sm:hidden w-full h-[2px] bg-white" />

        <div className="flex justify-start items-center px-3 gap-4 w-full h-14">
          <DestIcon className="sm:hidden object-contain w-[15px] h-auto" />
          <div className="flex flex-col w-full">
            <span className="text-xs font-medium text-gray-600">الوجهة</span>
            <CityDropdown
              options={destinationCities}
              value={toCity}
              onChange={setToCity}
              placeholder={fromCity ? "اختر مدينة الوجهة" : "اختر مدينة الانطلاق أولاً"}
              emptyMessage="لا توجد وجهات متاحة"
              loading={loadingTo}
              showTripCount={true}
            />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-7/12 flex flex-wrap gap-4 sm:gap-0 sm:rounded-lg sm:shadow-lg lg:shadow-none overflow-hidden sm:border border-gray-200 lg:rounded-l-lg lg:rounded-r-none lg:border-r-0">
        <div className="w-full h-14 sm:w-10/12 md:w-9/12 lg:w-8/12 flex justify-start items-center gap-3 px-4 bg-gray-200 shadow-lg sm:shadow-none rounded-lg sm:rounded-none relative">
          <div className="flex items-center gap-3 flex-1">
            {!isToday(selectedDate) && !isTomorrow(selectedDate) ? (
              <CalendarDaysIconSolid className="w-5 h-5 text-brand-primary cursor-pointer" onClick={() => setShowCalendar(!showCalendar)} />
            ) : (
              <CalendarDaysIcon className="w-5 h-5 text-brand-primary cursor-pointer" onClick={() => setShowCalendar(!showCalendar)} />
            )}
            <span className="text-sm font-medium text-brand-text-dark">
              {format(selectedDate, 'd MMMM', { locale: ar })}
            </span>
            <QuickDateButtons
              options={[
                { date: new Date(), label: 'اليوم' },
                { date: addDays(new Date(), 1), label: 'غداً' },
              ]}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>
          {showCalendar && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowCalendar(false)} />
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <DatePicker selectedDate={selectedDate} onDateSelect={(date) => { setSelectedDate(date); setShowCalendar(false); }} />
              </div>
            </>
          )}
        </div>

        <Button type="submit" variant="default" size="lg" className="w-full h-12 sm:h-14 sm:w-2/12 md:w-3/12 lg:w-4/12 rounded-md sm:rounded-none text-base font-semibold">
          بحث
        </Button>
      </div>
    </form>
  );
}
