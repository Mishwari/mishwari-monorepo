import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SEO } from '@mishwari/ui-web';
import {
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline';
import ModernTripCard from '@/components/ModernTripCard';
import { useRouter } from 'next/router';
import { tripsApi } from '@mishwari/api';
import { Trip } from '@/types/trip';
import FilterPanel from '@/components/FilterPanel';
import TripSkeleton from '@/components/Skeletons/TripSkeleton';
import { CityDropdown, DatePicker } from '@mishwari/ui-web';
import type { CityOption } from '@mishwari/ui-web';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  useTripsFilter,
  useTripsSort,
  SortOption,
} from '@mishwari/features-trips';
import MainHeader from '@/components/MainHeader';

export type SortItem = {
  code: string | null;
  id: number;
  name: string;
};

// to start test now add wrapping dev

function index() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [pickup, setPickup] = useState<string>('Unknown');
  const [destination, setDestination] = useState<string>('Unknown');
  const [tripType, setTripType] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [departureCities, setDepartureCities] = useState<CityOption[]>([]);
  const [destinationCities, setDestinationCities] = useState<CityOption[]>([]);
  const [fromCity, setFromCity] = useState(pickup);
  const [toCity, setToCity] = useState(destination);
  const [showCalendar, setShowCalendar] = useState(false);
  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.pickup && router.query.destination) {
      const pickupVal = router.query?.pickup as string;
      const destVal = router.query?.destination as string;
      setPickup(pickupVal);
      setDestination(destVal);
      setFromCity(pickupVal);
      setToCity(destVal);
    }
    if (router.query.tripType) {
      setTripType(Number(router.query.tripType));
    }
    if (router.query.date) {
      setSelectedDate(router.query.date as string);
    }
  }, [router.query, router.isReady]);

  useEffect(() => {
    const fetchDepartureCities = async () => {
      try {
        const cities = await tripsApi.getDepartureCities(selectedDate);
        setDepartureCities(cities);
      } catch (err) {
        setDepartureCities([]);
      }
    };
    if (selectedDate) fetchDepartureCities();
  }, [selectedDate]);

  useEffect(() => {
    if (!fromCity) {
      setDestinationCities([]);
      return;
    }
    const fetchDestinationCities = async () => {
      try {
        const cities = await tripsApi.getDestinationCities(
          fromCity,
          selectedDate
        );
        setDestinationCities(cities);
      } catch (err) {
        setDestinationCities([]);
      }
    };
    fetchDestinationCities();
  }, [fromCity, selectedDate]);

  const [trips, setTrips] = useState<Trip[]>([]);
  const { filteredTrips, filters, setFilters } = useTripsFilter(trips);
  const { sortedTrips, sortBy, setSortBy } = useTripsSort(filteredTrips);

  const [filterBuses, setFilterBuses] = useState<any>({
    BusType: [],
    Departure: [],
    Rating: [],
    Min: 0,
    Max: Infinity,
  });

  const sortList: Array<{ id: number; name: string; value: SortOption }> = [
    { id: 1, name: 'المغادرة', value: 'departure' },
    { id: 2, name: 'الأرخص', value: 'price' },
    { id: 3, name: 'الوصول', value: 'arrival' },
    { id: 4, name: 'التقييم', value: 'rating' },
  ];
  const [selectedSort, setSelectedSort] = useState(sortList[0]);

  // Filters

  useEffect(() => {
    setIsLoading(true);
    if (!router.isReady) return;

    const fetchTrips = async () => {
      try {
        const data = await tripsApi.search({
          pickup: router.query.pickup as string,
          destination: router.query.destination as string,
          date: router.query.date as string,
        });
        setTrips(data);
        setIsLoading(false);
      } catch (err: any) {
        setIsLoading(false);
        console.error('Error fetching trips:', err.message);
      }
    };
    fetchTrips();
  }, [
    router.isReady,
    router.query.pickup,
    router.query.destination,
    router.query.date,
  ]);

  useEffect(() => {
    setFilters({
      busTypes: filterBuses.BusType,
      ratings: filterBuses.Rating,
      minPrice: filterBuses.Min || 0,
      maxPrice: filterBuses.Max || Infinity,
    });
  }, [filterBuses, setFilters]);

  // For minPrice only
  const minimumTrip =
    sortedTrips.length > 0 ? Math.min(...sortedTrips.map((t) => t.price)) : 0;

  useEffect(() => {
    setSortBy(selectedSort.value);
  }, [selectedSort, setSortBy]);

  const currentDate = selectedDate ? new Date(selectedDate) : new Date();

  const handleDateChange = (newDate: string) => {
    router.push({
      pathname: '/bus_list',
      query: { ...router.query, date: newDate },
    });
  };

  const handlePrevDay = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    handleDateChange(format(prevDate, 'yyyy-MM-dd'));
  };

  const handleNextDay = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    handleDateChange(format(nextDate, 'yyyy-MM-dd'));
  };

  const handleDateSelect = (date: Date) => {
    handleDateChange(format(date, 'yyyy-MM-dd'));
    setShowCalendar(false);
  };

  const handleSwap = () => {
    router.push({
      pathname: '/bus_list',
      query: { ...router.query, pickup: destination, destination: pickup },
    });
  };

  const handleFromCityChange = (city: string) => {
    setFromCity(city);
    if (toCity) {
      router.push({
        pathname: '/bus_list',
        query: { ...router.query, pickup: city, destination: toCity },
      });
    }
  };

  const handleToCityChange = (city: string) => {
    setToCity(city);
    if (fromCity) {
      router.push({
        pathname: '/bus_list',
        query: { ...router.query, pickup: fromCity, destination: city },
      });
    }
  };

  const seoTitle = pickup && destination 
    ? `رحلات ${pickup} إلى ${destination}`
    : 'رحلات الباص في اليمن';
  
  const seoDescription = pickup && destination
    ? `اعثر على ${sortedTrips.length} رحلة متاحة من ${pickup} إلى ${destination}. قارن الأسعار واحجز فوراً.`
    : 'ابحث عن رحلات الباص في اليمن واحجز تذكرتك بسهولة';

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={`${pickup}, ${destination}, حجز باص, تذاكر باص اليمن`}
        canonical={`/bus_list?pickup=${pickup}&destination=${destination}&date=${selectedDate}`}
      />
    <div className='min-h-screen bg-light'>
      {showCalendar && (
        <>
          <div
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] animate-in fade-in duration-200'
            onClick={() => setShowCalendar(false)}
          />
          <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[110]'>
            <DatePicker
              selectedDate={currentDate}
              onDateSelect={handleDateSelect}
            />
          </div>
        </>
      )}

      <MainHeader
        backTo='/'
        showBackButton>
        <div className='relative min-w-0 flex items-center gap-4'>
          <div className='flex items-center gap-1.5 sm:flex-none min-w-0 max-w-[280px] sm:max-w-none'>
            {/* FROM CITY */}
            <div className=' min-w-[40px]'>
              <CityDropdown
                options={departureCities}
                value={fromCity}
                onChange={handleFromCityChange}
                placeholder='من'
                showTripCount={true}
                hideArrow={true}
              />
            </div>

            {/* SEPARATOR ICON */}
            <div className='shrink-0 text-slate-400'>
              <ChevronLeftIcon className='w-3 h-3 sm:w-4 sm:h-4' />
            </div>

            {/* TO CITY */}
            <div className=' min-w-[40px]'>
              <CityDropdown
                options={destinationCities}
                value={toCity}
                onChange={handleToCityChange}
                placeholder='إلى'
                showTripCount={true}
                disabled={!fromCity}
                hideArrow={true}
              />
            </div>

            {/* SWAP BUTTON */}
            <button
              onClick={handleSwap}
              className='hidden sm:flex p-1.5 bg-slate-50 hover:bg-hover rounded-full text-primary transition-all active:scale-95 shrink-0'>
              <ArrowsRightLeftIcon className='w-4 h-4' />
            </button>
          </div>

          <div className='h-6 w-px bg-slate-200 hidden sm:block shrink-0 mx-2' />

          <div className='flex items-center bg-slate-50 rounded-lg p-1 shrink-0 border border-slate-100 sm:border-transparent'>
            <button
              onClick={handlePrevDay}
              className='p-1 hover:bg-white hover:shadow-sm rounded-md text-slate-400 hover:text-primary transition-all'>
              <ChevronRightIcon className='w-4 h-4' />
            </button>
            <div
              onClick={() => setShowCalendar(true)}
              className='flex items-center gap-1.5 px-2 text-[10px] sm:text-xs font-bold cursor-pointer hover:text-primary transition-colors'>
              <CalendarIcon className='w-3 h-3 text-slate-400 hidden sm:block' />
              <span className='sm:hidden'>{currentDate.getDate()}</span>
              <span className='hidden sm:inline truncate'>
                {currentDate.getDate()}{' '}
                {format(currentDate, 'MMMM', { locale: ar })}
              </span>
            </div>
            <button
              onClick={handleNextDay}
              className='p-1 hover:bg-white hover:shadow-sm rounded-md text-slate-400 hover:text-primary transition-all'>
              <ChevronLeftIcon className='w-4 h-4' />
            </button>
          </div>
        </div>
      </MainHeader>

      <main className='w-full px-4 lg:px-6 xl:px-8 py-6'>
        <div className='max-w-[1600px] mx-auto'>
          <div className='flex gap-6 items-start justify-center'>
            <div className='hidden md:block w-72 shrink-0' />
            <div className='flex-1 max-w-4xl'>
              <div className='flex items-center justify-between mb-4 sticky top-[64px] z-40 bg-light py-3 transition-all'>
                <div className='flex items-baseline gap-2'>
                  <span className='text-xl font-black'>
                    {sortedTrips.length}
                  </span>
                  <span className='text-sm font-medium text-slate-500'>
                    رحلة متاحة
                  </span>
                  {sortedTrips.length > 0 && (
                    <span className='hidden sm:inline-block text-xs font-bold text-primary bg-brand-primary-light px-2 py-0.5 rounded-md ml-2 border border-blue-100'>
                      أقل سعر: {minimumTrip} ر.ي
                    </span>
                  )}
                </div>
                <div className='flex gap-2'>
                  <button
                    className='md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold shadow-sm'
                    onClick={() => setIsFilterOpen(true)}>
                    <AdjustmentsHorizontalIcon className='w-4 h-4' />
                    فلترة
                  </button>
                  <div className='hidden md:flex bg-white p-1 rounded-lg border border-slate-200'>
                    <button
                      onClick={() => setSelectedSort(sortList[0])}
                      className={`px-3 py-1 rounded text-xs font-bold ${
                        selectedSort.id === 1
                          ? 'bg-brand-primary text-white'
                          : 'text-slate-500 hover:bg-brand-primary-light'
                      }`}>
                      الأبكر
                    </button>
                    <button
                      onClick={() => setSelectedSort(sortList[1])}
                      className={`px-3 py-1 rounded text-xs font-bold ${
                        selectedSort.id === 2
                          ? 'bg-brand-primary text-white'
                          : 'text-slate-500 hover:bg-brand-primary-light'
                      }`}>
                      الأرخص
                    </button>
                    <button
                      onClick={() => setSelectedSort(sortList[3])}
                      className={`px-3 py-1 rounded text-xs font-bold ${
                        selectedSort.id === 4
                          ? 'bg-brand-primary text-white'
                          : 'text-slate-500 hover:bg-brand-primary-light'
                      }`}>
                      الأعلى تقييماً
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='flex gap-6 items-start justify-center'>
            <aside className='hidden md:block w-72 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sticky top-[130px] h-fit shrink-0'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='font-black text-lg'>الفلاتر</h2>
                <button
                  onClick={() =>
                    setFilterBuses({
                      BusType: [],
                      Departure: [],
                      Rating: [],
                      Min: 0,
                      Max: Infinity,
                    })
                  }
                  className='text-xs text-primary font-bold hover:underline'>
                  إعادة الكل
                </button>
              </div>
              <FilterPanel
                filterBuses={filterBuses}
                setFilterBuses={setFilterBuses}
                trips={trips}
              />
            </aside>

            <div className='flex-1 space-y-4 max-w-4xl'>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TripSkeleton key={index} />
                ))
              ) : sortedTrips.length !== 0 ? (
                sortedTrips.map((trip: Trip, index) => (
                  <Link
                    href={`/bus_list/${trip.id}?from_stop_id=${trip.from_stop_id}&to_stop_id=${trip.to_stop_id}&pickup=${pickup}&destination=${destination}&date=${selectedDate}`}
                    key={index}
                    className='block'>
                    <ModernTripCard trip={trip} />
                  </Link>
                ))
              ) : (
                <div className='flex flex-col items-center justify-center py-16 px-4 text-center'>
                  <div className='w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6'>
                    <div className='text-4xl'>🚌</div>
                  </div>
                  <h3 className='text-xl font-bold mb-2'>
                    لا توجد رحلات متاحة
                  </h3>
                  <p className='text-slate-500 max-w-sm mb-8'>
                    لم نتمكن من العثور على رحلات لهذا المسار في التاريخ المحدد.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {isFilterOpen && (
        <div className='fixed inset-0 z-50 flex items-end justify-center md:hidden'>
          <div
            className='absolute inset-0 bg-black/40 backdrop-blur-sm'
            onClick={() => setIsFilterOpen(false)}
          />
          <div className='bg-white w-full rounded-t-3xl p-6 relative max-h-[85vh] overflow-y-auto'>
            <div className='w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6' />
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold'>الفلاتر</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className='p-2 bg-slate-100 rounded-full'>
                <XMarkIcon className='w-5 h-5' />
              </button>
            </div>
            <div className='space-y-6 mb-6'>
              <div>
                <h3 className='font-bold mb-3 text-sm'>ترتيب حسب</h3>
                <div className='space-y-2'>
                  {[
                    { value: 'departure', label: 'الأبكر', id: 1 },
                    { value: 'price', label: 'الأرخص', id: 2 },
                    { value: 'rating', label: 'الأعلى تقييماً', id: 4 },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setSelectedSort(
                          sortList.find((s) => s.id === option.id)!
                        )
                      }
                      className={`w-full px-3 py-2 rounded-lg text-sm text-right transition-all ${
                        selectedSort.id === option.id
                          ? 'bg-brand-primary text-white'
                          : 'bg-slate-50 text-slate-700'
                      }`}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <hr className='border-slate-100' />
              <FilterPanel
                filterBuses={filterBuses}
                setFilterBuses={setFilterBuses}
                trips={trips}
                isMobile={true}
              />
            </div>
            <div className='sticky bottom-0 bg-white pt-4 pb-2 border-t border-slate-100'>
              <button
                onClick={() => setIsFilterOpen(false)}
                className='w-full bg-brand-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-900/10'>
                عرض {sortedTrips.length} رحلة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default index;
