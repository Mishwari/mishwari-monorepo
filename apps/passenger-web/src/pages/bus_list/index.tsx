import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import EditIcon from '@mishwari/ui-web/public/icons/common/editIcon.svg';
import FilterIcon from '@mishwari/ui-web/public/icons/common/filter.svg';
import DownArrowIcon from '@mishwari/ui-web/public/icons/common/downArrow.svg';
import BusFrontViewIcon from '@mishwari/ui-web/public/icons/transport/busFrontView.svg';
import busNotFoundImage from '@mishwari/ui-web/public/images/busNotFound.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, FreeMode } from 'swiper/modules';
import { TripCard } from '@mishwari/ui-web';
import SortDropdown from '@/components/filters_bar/SortDropdown';
import { useRouter } from 'next/router';
import FilterGroupModal from '@/components/filters_bar/FilterGroupModal';
import { tripsApi } from '@mishwari/api';
import EditFromTo from '@/components/filter/EditFromTo';
import { Trip } from '@/types/trip';
import FilterGroup from '@/components/filters_bar/FilterGroup';
import TripSkeleton from '@/components/Skeletons/TripSkeleton';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { QuickDaySelector, UserDropdownMenu } from '@mishwari/ui-web';
import { format } from 'date-fns';
import { useTripsFilter, useTripsSort, SortOption } from '@mishwari/features-trips';
import useAuth from '@/hooks/useAuth';
import useLogout from '@/hooks/useLogout';
import { passengerNavConfig } from '@/config/navigation';

export type SortItem = {
  code: string | null;
  id: number;
  name: string;
};

function index() {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [pickup, setPickup] = useState<string>('Unknown');
  const [destination, setDestination] = useState<string>('Unknown');
  const [tripType, setTripType] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleDateChange = (newDate: string) => {
    router.push({
      pathname: '/bus_list',
      query: {
        ...router.query,
        date: newDate,
      },
    });
  };

  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.pickup && router.query.destination) {
      setPickup(router.query?.pickup as string);
      setDestination(router.query?.destination as string);
    }
    if (router.query.tripType) {
      setTripType(Number(router.query.tripType));
    }
    if (router.query.date) {
      setSelectedDate(router.query.date as string);
    }
  }, [router.query, router.isReady]);

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

  const [isEditFromTo, setIsEditFromTo] = useState<boolean>(false);

  const sortList: Array<{ id: number; name: string; value: SortOption }> = [
    { id: 1, name: 'المغادرة', value: 'departure' },
    { id: 2, name: 'الأرخص', value: 'price' },
    { id: 3, name: 'الوصول', value: 'arrival' },
    { id: 4, name: 'التقييم', value: 'rating' },
  ];
  const [selectedSort, setSelectedSort] = useState(sortList[0]);
  const { isAuthenticated } = useAuth();
  const logout = useLogout();

  // Filters

  useEffect(() => {
    setIsLoading(true);
    if (!router.isReady) return;

    const fetchTrips = async () => {
      try {
        const data = await tripsApi.search({
          pickup: router.query.pickup as string,
          destination: router.query.destination as string,
          date: router.query.date as string
        });
        setTrips(data);
        setIsLoading(false);
      } catch (err: any) {
        setIsLoading(false);
        console.error('Error fetching trips:', err.message);
      }
    };
    fetchTrips();
  }, [router.isReady, router.query.pickup, router.query.destination, router.query.date]);

  useEffect(() => {
    setFilters({
      busTypes: filterBuses.BusType,
      ratings: filterBuses.Rating,
      minPrice: filterBuses.Min || 0,
      maxPrice: filterBuses.Max || Infinity,
    });
  }, [filterBuses, setFilters]);

  // For minPrice only
  const minimumTrip = sortedTrips.length > 0 ? Math.min(...sortedTrips.map(t => t.price)) : 0;

  useEffect(() => {
    setSortBy(selectedSort.value);
  }, [selectedSort, setSortBy]);

  return (
    <div className='flex flex-col items-center bg-gray-50 bg-scroll h-screen'>
      <section className='fixed top-0 w-full z-10 bg-brand-primary overflow-y-hidden'>
        <div className='my-2'>
          <div className='flex justify-between items-center w-full'>
            <div className='flex items-center gap-4 pt-1 mr-2'>
              <button
                onClick={() => router.push('/')}
                className='text-white hover:bg-white/10 rounded-full p-2 transition-colors'
              >
                <ChevronRightIcon className='w-6 h-6' />
              </button>

              <div className='text-white'>
                <h1 className='text-xl	font-bold	'>
                  {pickup} - {destination}
                </h1>
              </div>
              <button
                onClick={() => setIsEditFromTo(true)}
                className='text-white hover:bg-white/10 rounded-full p-2 transition-colors'
              >
                <EditIcon width={20} height={20} />
              </button>
              <EditFromTo
                isEditFromTo={isEditFromTo}
                setIsEditFromTo={setIsEditFromTo}
                pickup={pickup}
                destination={destination}
                // setPickup={setPickup}
                // setDestination={setDestination}
              />
            </div>
            <div className='flex items-center gap-2 ml-2'>
              {isAuthenticated && (
                <UserDropdownMenu items={passengerNavConfig.desktop.items} onLogout={logout} />
              )}
            </div>

          </div>
        </div>
        <div className='md:hidden m-3 mt-5 pb-4'>
          <QuickDaySelector
            selectedDate={new Date(selectedDate || new Date())}
            onDateSelect={(date) => handleDateChange(format(date, 'yyyy-MM-dd'))}
          />
          <div className=' flex gap-2 mt-3'>
            <div
              className='flex items-center bg-blue-100 justify-center rounded-full px-6  gap-1.5 w-[90px] h-[30px] hover:bg-blue-200 transition-colors'
              onClick={() => setIsFilterOpen(true)}>
              <span className='font-semibold'>فلترة</span>
              <FilterIcon width={22} height={22} />
            </div>

            {/* Filter Panel hidden by default its state: isOpen */}
            <FilterGroupModal
              filterBuses={filterBuses}
              setFilterBuses={setFilterBuses}
              isFilterOpen={isFilterOpen}
              setIsFilterOpen={setIsFilterOpen}
              filteredTrips={trips}
            />

            <div className=' items-start justify-start '>
              <Swiper
                style={{
                  overflowY: 'visible',
                  position: 'fixed',
                }}
                freeMode={true}
                grabCursor={true}
                spaceBetween={8}
                mousewheel={{
                  invert: false,
                }}
                slidesPerView={'auto'}
                modules={[FreeMode, Mousewheel]}>
                <SwiperSlide style={{ width: 'auto' }}>
                  <div className='rounded-full px-3 flex items-center justify-center h-[30px] bg-blue-100'>
                    {/* Component */}
                    <SortDropdown
                      selectedSort={selectedSort}
                      setSelectedSort={setSelectedSort}
                      sortList={sortList}
                      label='ترتيب:'
                    />
                  </div>
                </SwiperSlide>
                <SwiperSlide style={{ width: 'auto' }}>
                  <div className='rounded-full px-3 flex items-center justify-center h-[30px] bg-blue-100'>
                    <h2 className='m-0 mr-1'>نوع الباص </h2>
                    <DownArrowIcon width={25} height={25} />
                  </div>
                </SwiperSlide>
                <SwiperSlide style={{ width: 'auto' }}>
                  <div className='rounded-full px-3 flex items-center justify-center h-[30px] bg-blue-100'>
                    <h2 className='m-0 mr-1'>وقت المغادرة (1)</h2>
                    <DownArrowIcon width={25} height={25} />
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      <section className='w-full h-full px-2 pt-[210px] md:pt-[80px] md:flex md:justify-between md:gap-4 md:overflow-y-hidden'>
        <div className='hidden md:block sticky md:w-[35%] pb-8 overflow-y-auto scrollbar-hide'>
          <QuickDaySelector
            selectedDate={new Date(selectedDate || new Date())}
            onDateSelect={(date) => handleDateChange(format(date, 'yyyy-MM-dd'))}
          />
          <div className=' '>
            <div className='flex flex-col gap-3 mt-4'>
              <div className='mx-2'>ترتيب حسب</div>
              <div className='mb-4 flex justify-between items-center overflow-x-auto '>
                {sortList?.map((item, index) => (
                  <div
                    onClick={() => setSelectedSort(item)}
                    key={index}
                    className={`flex justify-center items-center py-1.5 px-3 lg:px-0 lg:w-[19%] text-sm border rounded-3xl cursor-pointer transition-colors ${
                      item.id == selectedSort.id
                        ? 'bg-brand-primary text-white border-brand-primary'
                        : 'bg-white border-gray-400 hover:border-brand-primary'
                    }`}>
                    <button>{item.name}</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='border-2 bg-white rounded-2xl h-max mt-2'>
            <FilterGroup
              filteredTrips={trips}
              filterBuses={filterBuses}
              setFilterBuses={setFilterBuses}
            />
          </div>
        </div>

        {/* Trips Component */}
        {isLoading ? (
          <div className='flex flex-col w-full md:w-[65%] '>
            {Array.from({ length: 5 }).map((_, index) => (
              <TripSkeleton />
            ))}
          </div>
        ) : sortedTrips.length !== 0 ? (
          <div className='w-full pb-8 md:w-[65%] overflow-y-auto scrollbar-hide'>
            <div className='flex items-center rounded-xl border border-gray-300 p-2 mb-3 gap-2 bg-blue-50'>
              <BusFrontViewIcon width={20} height={20} />
              <h2 className='m-0 text-xs  text-gray-500 font-light '>
                تم العثور على{' '}
                <strong className='font-semibold text-black'>
                  {sortedTrips.length}
                </strong>{' '}
                {sortedTrips.length > 1 && sortedTrips.length < 9
                  ? 'رحلات'
                  : 'رحلة'}
                ، تبدأ من {''}
                <strong className='font-semibold text-black'>
                  {minimumTrip}ر.ي{' '}
                </strong>{' '}
                على الراكب
              </h2>
            </div>

            {sortedTrips.map((trip: Trip, index) => (
              <Link
                href={`/bus_list/${trip.id}?from_stop_id=${trip.from_stop_id}&to_stop_id=${trip.to_stop_id}`}
                key={index}>
                <TripCard trip={trip} />
              </Link>
            ))}
          </div>
        ) : (
          <div className='w-full  h-screen overflow-hidden   md:w-[65%] flex flex-col items-center  justify-start mt-8'>
            <div className='w-4/12 max-w-xl flex justify-center'>
              <Image
                src={busNotFoundImage}
                alt='bus not found'
                width={300}
                height={300}
              />
            </div>
            <h1 className='text-2xl font-bold leading-10  place-items-center mt-2 text-center text-black'>
              لم يتم العثور على رحلات مطابقة لبحثك
            </h1>
          </div>
        )}
      </section>
    </div>
  );
}

export default index;
