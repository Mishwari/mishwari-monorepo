import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, FreeMode } from 'swiper/modules';
import TripBox from '@/components/TripBox';
import SortDropdown from '@/components/filters_bar/SortDropdown';
import { useRouter } from 'next/router';
import FilterGroupModal from '@/components/filters_bar/FilterGroupModal';
import { tripsApi } from '@mishwari/api';
import EditFromTo from '@/components/filter/EditFromTo';
import { Trip } from '@/types/trip';
import BackButton from '@/components/BackButton';
import FilterGroup from '@/components/filters_bar/FilterGroup';
import TripSkeleton from '@/components/Skeletons/TripSkeleton';
import QuickDaySelector from '@/components/QuickDaySelector';

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

  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]); //9 ref

  const [finalFilteredTrips, setFinalFilteredTrips] = useState<Trip[]>([]);

  const [filterBuses, setFilterBuses] = useState<any>({
    BusType: [],
    Departure: [],
    Rating: [],
    Min: [],
    Max: [],
  });

  useEffect(() => {
    setFilterBuses((prevState: any) => ({
      ...prevState,
      Min: [],
      Max: [],
    }));
  }, []);

  const [isEditFromTo, setIsEditFromTo] = useState<boolean>(false);

  const sortList = [
    { id: 1, name: ' المغادرة', code: null },
    { id: 2, name: 'الارخص', code: null },
    { id: 3, name: ' الوصول', code: null },
    { id: 4, name: ' التقييم', code: null },
  ];
  const [selectedSort, setSelectedSort] = useState<SortItem>(sortList[0]);

  // Filters

  useEffect(() => {
    setIsLoading(true);
    if (!router.isReady) return;

    const fetchTrips = async () => {
      try {
        const response = await tripsApi.search({
          from_city: router.query.pickup as string,
          to_city: router.query.destination as string,
          date: router.query.date as string
        });
        setFilteredTrips(response.data);
        setIsLoading(false);
      } catch (err: any) {
        setIsLoading(false);
        console.error('Error fetching trips:', err.message);
      }
    };
    fetchTrips();
  }, [router.isReady, router.query.pickup, router.query.destination, router.query.date]);

  useEffect(() => {
    let newFinal = [];
    for (let i = 0; i < filteredTrips?.length; i++) {
      if (
        (filterBuses.BusType.length === 0 ||
          filterBuses.BusType.includes(
            filteredTrips[i].bus?.bus_type
          )) &&
        (filterBuses.Rating.length === 0 ||
          Number(filteredTrips[i].driver?.driver_rating) >
            Math.min(...filterBuses.Rating)) &&
        Number(filteredTrips[i].price) >= Number(filterBuses.Min) &&
        Number(filteredTrips[i].price) <= Number(filterBuses.Max)
      ) {
        newFinal.push(filteredTrips[i]);
      }
    }
    setFinalFilteredTrips(newFinal);
  }, [filteredTrips, filterBuses]);

  // For minPrice only
  const [minimumTrip, setMinimumTrip] = useState(0);

  useEffect(() => {
    if (finalFilteredTrips && finalFilteredTrips.length > 0) {
      const prices = finalFilteredTrips.map((trip: any) => trip.price); // Extract prices from trips
      setMinimumTrip(Math.min(...prices)); // Spread operator to pass all prices as arguments
    }
    finalFilteredTrips;
  }, [finalFilteredTrips]);

  useEffect(() => {
    if (selectedSort.id == 1) {
      const sortedTrips = [...filteredTrips].sort((a, b) => {
        const departureTimeA: any = new Date(a.departure_time);
        const departureTimeB: any = new Date(b.departure_time);
        return departureTimeA - departureTimeB;
      });
      setFilteredTrips(sortedTrips);
      // arrival time
    } else if (selectedSort.id == 3) {
      const sortedTrips = [...filteredTrips].sort((a, b) => {
        const arrivalTimeA: any = new Date(a.arrival_time);
        const arrivalTimeB: any = new Date(b.arrival_time);
        return arrivalTimeA - arrivalTimeB;
      });
      setFilteredTrips(sortedTrips);
    } else if (selectedSort.id == 2) {
      const sortedTrips = [...filteredTrips].sort((a, b) => a.price - b.price);
      setFilteredTrips(sortedTrips);
    }
    //rate
    else if (selectedSort.id == 4) {
      const sortedTrips: Trip[] = [...filteredTrips].sort(
        (a, b) =>
          Number(b.driver?.driver_rating || 0) -
          Number(a.driver?.driver_rating || 0)
      );
      setFilteredTrips(sortedTrips);
    }
  }, [selectedSort]);

  return (
    <div className='flex flex-col items-center bg-[#F4FAFE] bg-scroll h-screen '>
      <section className=' fixed top-0 w-full z-10  bg-[#005687] overflow-y-hidden'>
        <div className='my-2'>
          <div className='flex justify-between items-center w-full'>
            <div className='flex items-center gap-4 pt-1 mr-2'>
              <BackButton />

              <div className='text-white'>
                <p className='text-right text-xs font-bold underline'>
                  {tripType == 1
                    ? `داخل المدينة / ${router.query.city}`
                    : tripType == 2
                    ? 'بين المدن'
                    : 'غير معروف'}
                </p>
                <h1 className='text-xl	font-bold	'>
                  {pickup} - {destination}
                </h1>
              </div>
            </div>
            <div
              onClick={() => setIsEditFromTo(true)}
              className='ml-5 mt-3 justify-self-end cursor-pointer  '>
              <Image
                src='/icons/editIcon.svg'
                alt='edit'
                height={25}
                width={25}
              />
            </div>

            <EditFromTo
              isEditFromTo={isEditFromTo}
              setIsEditFromTo={setIsEditFromTo}
              pickup={pickup}
              destination={destination}
              // setPickup={setPickup}
              // setDestination={setDestination}
            />
          </div>
        </div>
        <div className='md:hidden m-3 mt-5 pb-4 '>
          <QuickDaySelector 
            selectedDate={selectedDate || new Date().toISOString().split('T')[0]}
            onDateChange={handleDateChange}
          />
          <div className=' flex gap-2 mt-3'>
            <div
              className='flex items-center justify-center rounded-full px-6  gap-1.5 w-[90px] h-[30px]'
              style={{
                backgroundColor: 'lightblue',
              }}
              onClick={() => setIsFilterOpen(true)}>
              <h2 className='m-0 font-semibold cursor-pointer'>فلترة </h2>
              <Image
                src='/icons/filter.svg'
                alt='down arrow'
                width={22}
                height={22}
              />
            </div>

            {/* Filter Panel hidden by default its state: isOpen */}
            <FilterGroupModal
              filterBuses={filterBuses}
              setFilterBuses={setFilterBuses}
              isFilterOpen={isFilterOpen}
              setIsFilterOpen={setIsFilterOpen}
              filteredTrips={filteredTrips}
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
                  <div
                    className='rounded-full  px-3 flex items-center justify-center  h-[30px]'
                    style={{ backgroundColor: 'lightblue' }}>
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
                  <div
                    className='rounded-full px-3 flex items-center justify-center h-[30px]'
                    style={{ backgroundColor: 'lightblue' }}>
                    <h2 className='m-0 mr-1'>نوع الباص </h2>
                    <Image
                      src='/icons/downArrow.svg'
                      alt='down arrow'
                      width={25}
                      height={25}
                    />
                  </div>
                </SwiperSlide>
                <SwiperSlide style={{ width: 'auto' }}>
                  <div
                    className='rounded-full px-3 flex items-center justify-center h-[30px]'
                    style={{ backgroundColor: 'lightblue' }}>
                    <h2 className='m-0 mr-1'>وقت المغادرة (1)</h2>
                    <Image
                      src='/icons/downArrow.svg'
                      alt='down arrow'
                      width={25}
                      height={25}
                    />
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      <section className='w-full h-full px-2 mt-[145px] md:mt-[80px] md:flex md:justify-between md:gap-4 md:overflow-y-hidden'>
        <div className='hidden md:block sticky md:w-[35%] pb-8 overflow-y-auto scrollbar-hide '>
          <QuickDaySelector 
            selectedDate={selectedDate || new Date().toISOString().split('T')[0]}
            onDateChange={handleDateChange}
          />
          <div className=' '>
            <div className='flex flex-col gap-3 mt-4'>
              <div className='mx-2'>ترتيب حسب</div>
              <div className='mb-4 flex justify-between items-center overflow-x-auto '>
                {sortList?.map((item, index) => (
                  <div
                    onClick={() => setSelectedSort(item)}
                    key={index}
                    className={`
                    flex justify-center items-center py-1.5 px-3 lg:px-0 lg:w-[19%] text-سs bg-white border border-slate-400 rounded-3xl  
                    ${
                      item.id == selectedSort.id
                        ? '!bg-[#005687] text-white'
                        : ''
                    } 
                   `}>
                    <button>{item.name}</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className=' border-2 bg-white rounded-2xl h-max mt-2'>
            <FilterGroup
              filteredTrips={filteredTrips}
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
        ) : finalFilteredTrips.length !== 0 ? (
          <div className='w-full pb-8 md:w-[65%] overflow-y-auto scrollbar-hide'>
            <div
              className='flex items-center rounded-xl border border-slate-300	p-2 mb-3 gap-2'
              style={{ backgroundColor: 'azure' }}>
              <Image
                src='/icons/busFrontView.svg'
                alt='bus front View'
                width={20}
                height={20}
              />
              <h2 className='m-0 text-xs  text-gray-500 font-light '>
                تم العثور على{' '}
                <strong className='font-semibold text-black'>
                  {finalFilteredTrips.length}
                </strong>{' '}
                {finalFilteredTrips.length > 1 && finalFilteredTrips.length < 9
                  ? 'رحلات'
                  : 'رحلة'}
                ، تبدأ من {''}
                <strong className='font-semibold text-black'>
                  {minimumTrip}ر.ي{' '}
                </strong>{' '}
                على الراكب
              </h2>
            </div>

            {finalFilteredTrips.map((trip: Trip, index) => (
              <div className='just-to-maintain-md '>
                <Link
                  href={`/bus_list/${trip.id}`}
                  key={index}>
                  <TripBox trip={trip} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className='w-full  h-screen overflow-hidden   md:w-[65%] flex flex-col items-center  justify-start mt-8'>
            <div className='w-4/12 max-w-xl flex justify-center'>
              <Image
                src='/images/busNotFound.png'
                alt='bus not found'
                width={300}
                height={300}
                // layout='responsive'
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
