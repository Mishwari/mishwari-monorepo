import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { format, addDays, isToday, isTomorrow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { CalendarDaysIcon as CalendarDaysIconSolid } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { citiesApi } from '@mishwari/api';
import { Button, Combobox, DatePicker, QuickDateButtons } from '@mishwari/ui-web';

export default function TripSearchForm() {
  const [fromCity, setFromCity] = useState<string>('');
  const [toCity, setToCity] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [cities, setCities] = useState<any[]>([]);
  const router = useRouter();

  const cityOptions = cities.map((city) => ({ value: city.city, label: city.city }));

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await citiesApi.getAll();
        setCities(response.data);
      } catch (err) {
        console.error('Error fetching cities:', err);
        setCities([]);
      }
    };
    fetchCities();
  }, []);

  const handleSwitchCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
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
          <Image src="/icons/pickIcon.svg" width={18} height={8} alt="pickup" className="sm:hidden object-contain" />
          <div className="flex flex-col w-full">
            <span className="text-xs font-medium text-gray-600">الانطلاق</span>
            <Combobox options={cityOptions} value={fromCity} onChange={setFromCity} placeholder="اختر مدينة الانطلاق" emptyMessage="لا توجد مدينة بهذا الاسم" />
          </div>
        </div>

        <div onClick={handleSwitchCities} className="absolute z-10 left-4 bg-inherit flex items-center justify-center self-center h-max w-max sm:w-28 sm:static sm:justify-center sm:items-center rounded-full sm:rotate-90 overflow-hidden">
          <div className="border-2 border-white hover:bg-brand-primary/10 active:bg-brand-primary/20 cursor-pointer sm:border-0 p-2.5 sm:p-0 rounded-full bg-inherit">
            <Image src="/icons/SwitchArrows.svg" alt="switch" height={25} width={25} />
          </div>
        </div>

        <div className="sm:hidden w-full h-[2px] bg-white" />

        <div className="flex justify-start items-center px-3 gap-4 w-full h-14">
          <Image src="/icons/destIcon.svg" width={15} height={8} alt="destination" className="sm:hidden object-contain" />
          <div className="flex flex-col w-full">
            <span className="text-xs font-medium text-gray-600">الوجهة</span>
            <Combobox options={cityOptions} value={toCity} onChange={setToCity} placeholder="اختر مدينة الوجهة" emptyMessage="لا توجد مدينة بهذا الاسم" />
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
