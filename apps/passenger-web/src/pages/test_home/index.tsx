import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ArrowsRightLeftIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
  XMarkIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  WifiIcon,
  BoltIcon,
  ShieldCheckIcon,
  BoltIcon as ZapIcon,
  TruckIcon,
  UserIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import DoubleSlider from './DoubleSlider';
import AuthModal from './AuthModal';

const CITIES = [
  { id: 1, name: 'صنعاء', trips: 142, popular: true },
  { id: 2, name: 'عدن', trips: 85, popular: true },
  { id: 3, name: 'تعز', trips: 67, popular: false },
  { id: 4, name: 'الحديدة', trips: 54, popular: false },
  { id: 5, name: 'إب', trips: 43, popular: false },
  { id: 6, name: 'ذمار', trips: 38, popular: false },
  { id: 7, name: 'مأرب', trips: 29, popular: false },
];

const DEMO_TRIPS = [
  // Today
  {
    id: 1,
    operator: 'النقل السريع',
    busNumber: 'GB-202',
    routeName: 'الطريق الصحراوي',
    type: 'VIP',
    fromTime: '08:00',
    toTime: '14:30',
    duration: '6.5 ساعة',
    price: 4500,
    rating: 4.8,
    seats: 12,
    features: ['WiFi', 'AC', 'USB'],
  },
  {
    id: 2,
    operator: 'الأمان للنقل',
    busNumber: 'BB-99',
    routeName: 'الطريق الزراعي',
    type: 'عادي',
    fromTime: '10:30',
    toTime: '17:00',
    duration: '6.5 ساعة',
    price: 3800,
    rating: 4.5,
    seats: 4,
    features: ['AC', 'USB'],
  },
  {
    id: 3,
    operator: 'الرحلات الذهبية',
    busNumber: 'GB-Elite',
    routeName: 'مباشر',
    type: 'VIP Plus',
    fromTime: '14:00',
    toTime: '20:30',
    duration: '6.5 ساعة',
    price: 5200,
    rating: 4.9,
    seats: 15,
    features: ['WiFi', 'وجبة', 'مقاعد واسعة'],
  },
  {
    id: 4,
    operator: 'النقل السريع',
    busNumber: 'SJ-101',
    routeName: 'الطريق الصحراوي',
    type: 'VIP',
    fromTime: '16:30',
    toTime: '23:00',
    duration: '6.5 ساعة',
    price: 4200,
    rating: 4.7,
    seats: 5,
    features: ['WiFi', 'AC'],
  },
  {
    id: 5,
    operator: 'الأمان للنقل',
    busNumber: 'BB-Biz',
    routeName: 'مباشر سريع',
    type: 'عادي',
    fromTime: '18:00',
    toTime: '00:30',
    duration: '6.5 ساعة',
    price: 3900,
    rating: 4.6,
    seats: 20,
    features: ['AC'],
  },
  {
    id: 6,
    operator: 'السفر المريح',
    busNumber: 'CM-77',
    routeName: 'الطريق الساحلي',
    type: 'VIP',
    fromTime: '06:30',
    toTime: '13:00',
    duration: '6.5 ساعة',
    price: 4400,
    rating: 4.7,
    seats: 8,
    features: ['WiFi', 'AC', 'USB'],
  },
  {
    id: 7,
    operator: 'الرحلات الذهبية',
    busNumber: 'GB-Pro',
    routeName: 'مباشر سريع',
    type: 'VIP Plus',
    fromTime: '20:00',
    toTime: '02:30',
    duration: '6.5 ساعة',
    price: 5500,
    rating: 4.9,
    seats: 18,
    features: ['WiFi', 'وجبة', 'مقاعد واسعة', 'USB'],
  },
  // Tomorrow
  {
    id: 8,
    operator: 'النقل السريع',
    busNumber: 'GB-205',
    routeName: 'الطريق الصحراوي',
    type: 'VIP',
    fromTime: '07:30',
    toTime: '14:00',
    duration: '6.5 ساعة',
    price: 4500,
    rating: 4.8,
    seats: 20,
    features: ['WiFi', 'AC', 'USB'],
  },
  {
    id: 9,
    operator: 'الأمان للنقل',
    busNumber: 'BB-100',
    routeName: 'الطريق الزراعي',
    type: 'عادي',
    fromTime: '09:00',
    toTime: '15:30',
    duration: '6.5 ساعة',
    price: 3700,
    rating: 4.5,
    seats: 15,
    features: ['AC', 'USB'],
  },
  {
    id: 10,
    operator: 'السفر المريح',
    busNumber: 'CM-80',
    routeName: 'الطريق الساحلي',
    type: 'VIP',
    fromTime: '11:00',
    toTime: '17:30',
    duration: '6.5 ساعة',
    price: 4300,
    rating: 4.6,
    seats: 10,
    features: ['WiFi', 'AC'],
  },
  {
    id: 11,
    operator: 'الرحلات الذهبية',
    busNumber: 'GB-Lux',
    routeName: 'مباشر',
    type: 'VIP Plus',
    fromTime: '15:30',
    toTime: '22:00',
    duration: '6.5 ساعة',
    price: 5400,
    rating: 4.9,
    seats: 12,
    features: ['WiFi', 'وجبة', 'مقاعد واسعة', 'USB'],
  },
  {
    id: 12,
    operator: 'النقل السريع',
    busNumber: 'SJ-105',
    routeName: 'الطريق الصحراوي',
    type: 'VIP',
    fromTime: '19:00',
    toTime: '01:30',
    duration: '6.5 ساعة',
    price: 4600,
    rating: 4.8,
    seats: 14,
    features: ['WiFi', 'AC', 'USB'],
  },
  // Yesterday
  {
    id: 13,
    operator: 'الأمان للنقل',
    busNumber: 'BB-95',
    routeName: 'الطريق الزراعي',
    type: 'عادي',
    fromTime: '08:30',
    toTime: '15:00',
    duration: '6.5 ساعة',
    price: 3600,
    rating: 4.4,
    seats: 3,
    features: ['AC'],
  },
  {
    id: 14,
    operator: 'السفر المريح',
    busNumber: 'CM-75',
    routeName: 'الطريق الساحلي',
    type: 'VIP',
    fromTime: '12:00',
    toTime: '18:30',
    duration: '6.5 ساعة',
    price: 4200,
    rating: 4.6,
    seats: 6,
    features: ['WiFi', 'AC', 'USB'],
  },
  {
    id: 15,
    operator: 'الرحلات الذهبية',
    busNumber: 'GB-Max',
    routeName: 'مباشر',
    type: 'VIP Plus',
    fromTime: '17:00',
    toTime: '23:30',
    duration: '6.5 ساعة',
    price: 5300,
    rating: 4.9,
    seats: 9,
    features: ['WiFi', 'وجبة', 'مقاعد واسعة'],
  },
];

const DEPARTURE_TIMES = [
  { id: 'morning', label: 'صباحاً', range: [6, 12] },
  { id: 'afternoon', label: 'ظهراً', range: [12, 18] },
  { id: 'evening', label: 'مساءً', range: [18, 24] },
  { id: 'night', label: 'ليلاً', range: [0, 6] },
];

const POPULAR_DESTINATIONS = [
  { name: 'عدن', image: 'bg-orange-100', price: 4500 },
  { name: 'تعز', image: 'bg-blue-100', price: 3800 },
  { name: 'الحديدة', image: 'bg-cyan-100', price: 4200 },
  { name: 'مأرب', image: 'bg-yellow-100', price: 5000 },
];

const CityCombobox = ({
  label,
  value,
  onChange,
  cities,
  icon: Icon,
  placeholder,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMobile]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (!isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isOpen) setSearchTerm('');
  }, [isOpen]);

  const filteredCities = cities.filter((city: any) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CityList = () => (
    <>
      <div className='p-2 border-b border-slate-100 bg-slate-50/50'>
        <div className='relative'>
          <MagnifyingGlassIcon className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
          <input
            ref={searchInputRef}
            type='text'
            placeholder='بحث عن مدينة...'
            className='w-full pr-9 pl-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#005687] focus:ring-2 focus:ring-[#e6f2f7]'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className='max-h-[280px] md:max-h-[280px] overflow-y-auto p-1'>
        {filteredCities.length > 0 ? (
          filteredCities.map((city: any) => (
            <div
              key={city.id}
              onClick={() => {
                onChange(city.name);
                setIsOpen(false);
              }}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                value === city.name ? 'bg-[#e6f2f7]' : 'hover:bg-slate-50'
              }`}>
              <div className='flex items-center gap-3'>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    value === city.name
                      ? 'bg-white text-[#005687]'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                  <MapPinIcon className='w-4 h-4' />
                </div>
                <div>
                  <div
                    className={`text-sm font-bold ${
                      value === city.name
                        ? 'text-[#005687]'
                        : 'text-[#042f40]'
                    }`}>
                    {city.name}
                  </div>
                  {city.popular && (
                    <div className='text-[10px] font-medium text-green-600'>
                      وجهة شائعة
                    </div>
                  )}
                </div>
              </div>
              {value === city.name && (
                <CheckIcon className='w-4 h-4 text-[#005687]' />
              )}
              {value !== city.name && (
                <span className='text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md'>
                  {city.trips} رحلة
                </span>
              )}
            </div>
          ))
        ) : (
          <div className='p-8 text-center text-slate-400 text-sm'>
            لا توجد مدن
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <div
        className='relative group'
        ref={wrapperRef}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer border ${
            isOpen && !isMobile
              ? 'bg-white border-[#005687] ring-4 ring-[#e6f2f7]'
              : 'bg-slate-50 hover:bg-[#F0F7FA] border-transparent hover:border-blue-100'
          }`}>
          <Icon className='w-5 h-5 shrink-0 text-[#005687]' />
          <div className='flex-1'>
            <label className='text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5'>
              {label}
            </label>
            <div className='text-base font-bold text-[#042f40] truncate leading-tight'>
              {value || placeholder}
            </div>
          </div>
          <ChevronDownIcon
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 hidden md:block ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>

        {/* Desktop Dropdown */}
        {isOpen && !isMobile && (
          <div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200'>
            <CityList />
          </div>
        )}
      </div>

      {/* Mobile Modal */}
      {isOpen && isMobile && (
        <div className='fixed inset-0 z-[200] flex items-end justify-center md:hidden'>
          <div className='bg-white w-full rounded-3xl relative max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-300'>
            <div className='sticky top-0 bg-white z-10 border-b border-slate-100'>
              <div className='w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-4' />
              <div className='flex items-center justify-between px-4 pb-4'>
                <h3 className='text-lg font-bold text-[#042f40]'>{label}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className='p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors'>
                  <XMarkIcon className='w-5 h-5 text-slate-600' />
                </button>
              </div>
            </div>
            <CityList />
          </div>
        </div>
      )}
    </>
  );
};

export default function ModernBusBooking() {
  const [viewState, setViewState] = useState<'home' | 'results'>('home');
  const [fromCity, setFromCity] = useState('صنعاء');
  const [toCity, setToCity] = useState('عدن');
  const [sortBy, setSortBy] = useState<'price' | 'departure' | 'rating'>(
    'departure'
  );
  const [filterBusType, setFilterBusType] = useState<string[]>([]);
  const [filterDeparture, setFilterDeparture] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 3000, max: 6000 });
  const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(
    null
  );
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  console.log('isAuthModalOpen:', isAuthModalOpen);

  const handleLogin = (userData: { email: string; name: string }) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setViewState('results'), 300);
  };

  const [isSwapping, setIsSwapping] = useState(false);

  const handleSwitch = () => {
    setIsSwapping(true);
    setTimeout(() => {
      const temp = fromCity;
      setFromCity(toCity);
      setToCity(temp);
      setIsSwapping(false);
    }, 150);
  };

  const sortedTrips = [...DEMO_TRIPS].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return a.fromTime.localeCompare(b.fromTime);
  });

  const filteredTrips = useMemo(
    () =>
      sortedTrips.filter((trip) => {
        if (filterBusType.length > 0 && !filterBusType.includes(trip.type))
          return false;
        if (trip.price < priceRange.min || trip.price > priceRange.max)
          return false;
        if (filterDeparture.length > 0) {
          const hour = parseInt(trip.fromTime.split(':')[0]);
          const matchesTime = filterDeparture.some((timeId) => {
            const time = DEPARTURE_TIMES.find((t) => t.id === timeId);
            return time && hour >= time.range[0] && hour < time.range[1];
          });
          if (!matchesTime) return false;
        }
        return true;
      }),
    [sortedTrips, filterBusType, priceRange, filterDeparture]
  );

  const minPrice = useMemo(
    () =>
      filteredTrips.length > 0
        ? Math.min(...filteredTrips.map((t) => t.price))
        : 0,
    [filteredTrips]
  );

  const toggleBusType = (type: string) => {
    setFilterBusType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleDeparture = (timeId: string) => {
    setFilterDeparture((prev) =>
      prev.includes(timeId)
        ? prev.filter((t) => t !== timeId)
        : [...prev, timeId]
    );
  };

  const resetFilters = () => {
    setFilterBusType([]);
    setFilterDeparture([]);
    setPriceRange({ min: 3000, max: 6000 });
  };

  if (viewState === 'home') {
    return (
      <>
        <div className='min-h-[85vh] flex flex-col justify-center items-center px-4 relative overflow-hidden bg-[#F8FAFC] transition-all duration-500 pt-16 md:pt-0'>
          {/* Modern Background Mesh */}
          <div className='absolute top-0 left-0 w-full h-full overflow-hidden z-0'>
            <div className='absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#e6f2f7] rounded-full blur-3xl opacity-80 mix-blend-multiply' />
            <div className='absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-3xl opacity-80 mix-blend-multiply' />
            <div className='absolute top-[40%] left-[20%] w-[30%] h-[30%] bg-white rounded-full blur-2xl opacity-60' />
          </div>

          {/* Hero Header */}
          <div className='absolute top-0 w-full p-4 flex justify-between items-center z-50 max-w-7xl mx-auto left-0 right-0'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 bg-[#005687] rounded-lg flex items-center justify-center text-white'>
                <TruckIcon className='w-5 h-5' />
              </div>
              <span className='font-black text-xl tracking-tighter text-[#005687]'>
                مشواري
              </span>
            </div>
            <div>
              {user ? (
                <button
                  onClick={handleLogout}
                  className='h-9 w-9 bg-[#005687] rounded-full flex items-center justify-center text-white text-xs font-bold ring-4 ring-white shadow-lg hover:bg-[#004a73] transition-colors'
                  title={user.email}>
                  {user.name.substring(0, 1).toUpperCase()}
                </button>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className='group flex items-center rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-[#005687] text-sm font-bold shadow-sm transition-all overflow-hidden'>
                  <div className='w-9 h-9 flex items-center justify-center shrink-0'>
                    <UserIcon className='w-4 h-4' />
                  </div>
                  <span className='opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto group-hover:px-3 transition-all duration-300 whitespace-nowrap'>
                    تسجيل الدخول
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className='w-full max-w-4xl z-10 space-y-8 animate-in fade-in zoom-in duration-500 mt-8 md:mt-16'>
            <div className='text-center space-y-4'>
              <h1 className='text-4xl md:text-7xl font-black text-[#042f40] tracking-tight leading-tight'>
                إلى أين تريد <br className='md:hidden' />
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#005687] to-[#0088cc]'>
                  الذهاب؟
                </span>
              </h1>
              <p className='text-lg text-slate-500 font-medium max-w-lg mx-auto leading-relaxed'>
                احجز تذكرة الحافلة في ثوانٍ. بدون طوابير، تأكيد فوري.
              </p>
            </div>

            {/* SEARCH CARD */}
            <div className='bg-white/70 backdrop-blur-xl p-2 rounded-[2rem] shadow-2xl shadow-blue-900/5 border border-white'>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
                className='bg-white rounded-[1.5rem] p-4 flex flex-col md:flex-row gap-2 border border-slate-100'>
                {/* Mobile: Stacked Layout */}
                <div className='flex-1 md:hidden relative'>
                  <div className='relative'>
                    {/* From */}
                    <div className='border-b border-slate-100'>
                      <CityCombobox
                        label='من'
                        value={fromCity}
                        onChange={setFromCity}
                        cities={CITIES}
                        icon={MapPinIcon}
                        placeholder='اختر مدينة'
                      />
                    </div>

                    {/* Swap Button - Centered on seam */}
                    <div className='absolute left-4 top-1/2 -translate-y-1/2 z-10'>
                      <button
                        type='button'
                        onClick={handleSwitch}
                        className='w-10 h-10 bg-white rounded-full border border-slate-200 shadow-lg flex items-center justify-center text-slate-500 hover:text-[#005687] hover:border-blue-100 active:scale-95 transition-all group'>
                        <ArrowsRightLeftIcon 
                          className={`w-4 h-4 rotate-90 transition-transform duration-300 ${isSwapping ? 'scale-110' : 'scale-100'}`}
                        />
                      </button>
                    </div>

                    {/* To */}
                    <div className='pt-3'>
                      <CityCombobox
                        label='إلى'
                        value={toCity}
                        onChange={setToCity}
                        cities={CITIES.filter((c) => c.name !== fromCity)}
                        icon={MapPinIcon}
                        placeholder='اختر مدينة'
                      />
                    </div>
                  </div>
                </div>

                {/* Desktop: Horizontal Layout */}
                <div className='hidden md:block flex-1'>
                  <CityCombobox
                    label='من'
                    value={fromCity}
                    onChange={setFromCity}
                    cities={CITIES}
                    icon={MapPinIcon}
                    placeholder='اختر مدينة'
                  />
                </div>

                {/* Desktop Swap */}
                <div className='hidden md:flex items-end justify-center pb-1'>
                  <button
                    type='button'
                    onClick={handleSwitch}
                    className='p-3 bg-slate-50 hover:bg-[#F0F7FA] rounded-full text-[#005687] transition-all active:scale-95 group'>
                    <ArrowsRightLeftIcon className='w-5 h-5 group-hover:scale-110 transition-transform' />
                  </button>
                </div>

                {/* Desktop To */}
                <div className='hidden md:block flex-1'>
                  <CityCombobox
                    label='إلى'
                    value={toCity}
                    onChange={setToCity}
                    cities={CITIES.filter((c) => c.name !== fromCity)}
                    icon={MapPinIcon}
                    placeholder='اختر مدينة'
                  />
                </div>

                {/* Date */}
                <div className='flex-1'>
                  <div className='flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer border bg-slate-50 hover:bg-[#F0F7FA] border-transparent hover:border-blue-100'>
                    <CalendarIcon className='text-[#005687] w-5 h-5 shrink-0' />
                    <div className='flex-1'>
                      <label className='text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5'>
                        متى
                      </label>
                      <span className='text-base font-bold text-[#042f40] leading-tight block'>
                        اليوم
                      </span>
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <div className='md:w-auto'>
                  <button
                    type='submit'
                    className='w-full h-full min-h-[56px] px-8 bg-[#005687] hover:bg-[#004a73] text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-2 group'>
                    <MagnifyingGlassIcon className='w-5 h-5 group-hover:scale-110 transition-transform' />
                    <span className='md:hidden'>بحث عن رحلات</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Landing Page Content */}
          <div className='w-full max-w-7xl mx-auto px-4 pb-20 space-y-12 mt-16'>
            {/* Popular Destinations */}
            <section>
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <h2 className='text-2xl md:text-3xl font-black text-[#042f40]'>
                    وجهات شائعة
                  </h2>
                  <p className='text-sm font-medium text-slate-500 mt-1'>
                    من{' '}
                    <strong className='text-[#005687] underline decoration-[#e6f2f7] decoration-2 underline-offset-2'>
                      {fromCity}
                    </strong>
                  </p>
                </div>
              </div>

              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {POPULAR_DESTINATIONS.filter(
                  (dest) => dest.name !== fromCity
                ).map((dest, idx) => (
                  <div
                    key={idx}
                    className={`relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer group hover:shadow-xl transition-all ${dest.image}`}>
                    <div className='absolute inset-0 bg-gradient-to-t from-[#042f40]/80 to-transparent opacity-80 group-hover:opacity-90 transition-opacity' />
                    <div className='absolute bottom-4 right-4 text-white'>
                      <h3 className='font-bold text-lg leading-tight mb-1'>
                        {dest.name}
                      </h3>
                      <div className='flex items-center gap-1 text-xs font-medium bg-white/20 backdrop-blur-md px-2 py-1 rounded-full w-fit'>
                        <span>من {dest.price} ر.ي</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Trust Indicators */}
            <section className='relative z-10 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 rounded-full bg-[#e6f2f7] flex items-center justify-center text-[#005687] shrink-0'>
                    <ShieldCheckIcon className='w-6 h-6' />
                  </div>
                  <div>
                    <h4 className='font-bold text-[#042f40]'>دفع آمن</h4>
                    <p className='text-sm text-slate-500'>
                      معالجة دفع آمنة 100% مع ضمان استرداد الأموال
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 rounded-full bg-[#e6f2f7] flex items-center justify-center text-[#005687] shrink-0'>
                    <ZapIcon className='w-6 h-6' />
                  </div>
                  <div>
                    <h4 className='font-bold text-[#042f40]'>حجز فوري</h4>
                    <p className='text-sm text-slate-500'>
                      احصل على تذاكرك على هاتفك فوراً
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 rounded-full bg-[#e6f2f7] flex items-center justify-center text-[#005687] shrink-0'>
                    <TruckIcon className='w-6 h-6' />
                  </div>
                  <div>
                    <h4 className='font-bold text-[#042f40]'>شركات موثوقة</h4>
                    <p className='text-sm text-slate-500'>
                      شريك رسمي لأفضل شركات النقل في اليمن
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onLogin={handleLogin}
        />
      </>
    );
  }

  const FilterPanel = ({ isMobile = false }) => (
    <div className={`space-y-8 ${isMobile ? 'pb-24' : ''}`}>
      <div>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='font-bold text-[#042f40] text-sm uppercase tracking-wide'>
            نطاق السعر
          </h3>
          <span className='text-xs font-bold text-[#005687]'>
            {priceRange.min} - {priceRange.max} ر.ي
          </span>
        </div>
        <div className='px-1'>
          <DoubleSlider
            min={3000}
            max={6000}
            value={priceRange}
            onChange={setPriceRange}
            step={100}
          />
        </div>
      </div>

      <div>
        <h3 className='font-bold text-[#042f40] mb-3 text-sm uppercase tracking-wide'>
          نوع الحافلة
        </h3>
        <div className='grid grid-cols-2 gap-2'>
          {['VIP Plus', 'VIP', 'عادي'].map((type) => (
            <label
              key={type}
              className='flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-blue-200 cursor-pointer bg-slate-50 hover:bg-white transition-all'>
              <div className='w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center'>
                {filterBusType.includes(type) && (
                  <div className='w-2.5 h-2.5 bg-[#005687] rounded-full' />
                )}
              </div>
              <span className='text-xs font-bold text-slate-600'>{type}</span>
              <input
                type='checkbox'
                checked={filterBusType.includes(type)}
                onChange={() => toggleBusType(type)}
                className='hidden'
              />
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className='font-bold text-[#042f40] mb-3 text-sm uppercase tracking-wide'>
          وقت المغادرة
        </h3>
        <div className='space-y-2'>
          {DEPARTURE_TIMES.map((time) => (
            <button
              key={time.id}
              onClick={() => toggleDeparture(time.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                filterDeparture.includes(time.id)
                  ? 'border-[#005687] bg-[#e6f2f7] text-[#005687]'
                  : 'border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-blue-50'
              }`}>
              <span className='font-bold'>{time.label}</span>
              <span className='text-slate-400 text-[10px]'>
                {time.range[0]}:00 - {time.range[1]}:00
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/60 animate-in slide-in-from-top duration-300'>
        <div className='max-w-7xl mx-auto px-4 py-2'>
          <div className='flex items-center gap-3'>
            {/* Route Summary */}
            <div
              className='flex items-center gap-2 cursor-pointer hover:bg-slate-100/50 p-2 -ml-2 rounded-xl transition-colors group'
              onClick={() => setViewState('home')}>
              <div className='h-8 w-8 rounded-full bg-[#e6f2f7] flex items-center justify-center text-[#005687] group-hover:scale-110 transition-transform'>
                <ArrowsRightLeftIcon className='w-4 h-4' />
              </div>
              <div className='flex flex-col'>
                <div className='flex items-center gap-1 text-[#042f40] font-bold text-sm leading-tight'>
                  <span className='truncate max-w-[80px] sm:max-w-[100px]'>
                    {fromCity}
                  </span>
                  <span className='text-slate-400 mx-1'>إلى</span>
                  <span className='truncate max-w-[80px] sm:max-w-[100px]'>
                    {toCity}
                  </span>
                </div>
                <div className='text-[10px] text-slate-500 font-medium flex items-center gap-1'>
                  <span>1 راكب</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className='h-6 w-px bg-slate-200 hidden sm:block' />

            {/* Compact Day Navigator */}
            <div className='flex items-center bg-slate-50 rounded-lg p-0.5 sm:p-1 shrink-0 border border-slate-100 sm:border-transparent'>
              <button className='p-1 hover:bg-white hover:shadow-sm rounded-md text-slate-400 hover:text-[#005687] transition-all'>
                <ChevronRightIcon className='w-3 h-3 sm:w-4 sm:h-4' />
              </button>
              <div className='flex items-center gap-1.5 px-2 text-xs font-bold text-[#042f40] whitespace-nowrap'>
                <CalendarIcon className='w-3 h-3 text-slate-400 hidden sm:block' />
                <span className='hidden sm:inline'>اليوم،</span>
                <span>24 نوفمبر</span>
              </div>
              <button className='p-1 hover:bg-white hover:shadow-sm rounded-md text-slate-400 hover:text-[#005687] transition-all'>
                <ChevronLeftIcon className='w-3 h-3 sm:w-4 sm:h-4' />
              </button>
            </div>

            {/* Spacer to push actions to right */}
            <div className='flex-1' />

            {/* Actions */}
            <div className='flex items-center gap-2'>
              {user ? (
                <button
                  onClick={handleLogout}
                  className='h-9 w-9 bg-[#005687] rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-md hover:bg-[#004a73] transition-colors'
                  title={user.email}>
                  {user.name.substring(0, 1).toUpperCase()}
                </button>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className='group flex items-center rounded-full bg-[#e6f2f7] hover:bg-slate-200 text-[#005687] text-xs sm:text-sm font-bold transition-all overflow-hidden'>
                  <div className='w-9 h-9 flex items-center justify-center shrink-0'>
                    <UserIcon className='w-4 h-4' />
                  </div>
                  <span className='opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto group-hover:px-3 transition-all duration-300 whitespace-nowrap'>
                    تسجيل الدخول
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className='max-w-7xl mx-auto px-4 py-6'>
        <div className='flex items-center justify-between mb-4 sticky top-[64px] z-40 bg-[#F8FAFC] py-3 transition-all'>
          <div className='flex items-baseline gap-2'>
            <span className='text-xl font-black text-[#042f40]'>
              {filteredTrips.length}
            </span>
            <span className='text-sm font-medium text-slate-500'>
              رحلة متاحة
            </span>
            {filteredTrips.length > 0 && (
              <span className='hidden sm:inline-block text-xs font-bold text-[#005687] bg-[#e6f2f7] px-2 py-0.5 rounded-md ml-2 border border-blue-100'>
                أقل سعر: {minPrice} ر.ي
              </span>
            )}
          </div>
          <div className='flex gap-2'>
            <button
              className='md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold shadow-sm'
              onClick={() => setMobileFilterOpen(true)}>
              <AdjustmentsHorizontalIcon className='w-4 h-4' />
              فلترة
            </button>
            <div className='hidden md:flex bg-white p-1 rounded-lg border border-slate-200'>
              <button
                onClick={() => setSortBy('departure')}
                className={`px-3 py-1 rounded text-xs font-bold ${
                  sortBy === 'departure'
                    ? 'bg-[#005687] text-white'
                    : 'text-slate-500 hover:bg-[#e6f2f7]'
                }`}>
                الأبكر
              </button>
              <button
                onClick={() => setSortBy('price')}
                className={`px-3 py-1 rounded text-xs font-bold ${
                  sortBy === 'price'
                    ? 'bg-[#005687] text-white'
                    : 'text-slate-500 hover:bg-[#e6f2f7]'
                }`}>
                الأرخص
              </button>
              <button
                onClick={() => setSortBy('rating')}
                className={`px-3 py-1 rounded text-xs font-bold ${
                  sortBy === 'rating'
                    ? 'bg-[#005687] text-white'
                    : 'text-slate-500 hover:bg-[#e6f2f7]'
                }`}>
                الأعلى تقييماً
              </button>
            </div>
          </div>
        </div>

        <div className='flex gap-6 items-start'>
          <aside className='hidden md:block w-72 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sticky top-[130px] h-fit'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='font-black text-lg text-[#042f40]'>الفلاتر</h2>
              <button
                onClick={resetFilters}
                className='text-xs text-[#005687] font-bold hover:underline'>
                إعادة الكل
              </button>
            </div>
            <FilterPanel />
          </aside>

          <div className='flex-1 space-y-4'>
            {filteredTrips.map((trip) => {
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
              const ratingStyle = getRatingColor(trip.rating);

              return (
                <div
                  key={trip.id}
                  className='bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300 cursor-pointer group relative overflow-hidden p-5'>
                  {/* Side Color Strip */}
                  <div className='hidden sm:block absolute right-0 top-0 bottom-0 w-1 bg-[#005687] opacity-0 group-hover:opacity-100 transition-opacity' />

                  {/* Top Row: Info + Price */}
                  <div className='flex justify-between items-start mb-5'>
                    {/* Operator Info */}
                    <div className='flex items-center gap-3'>
                      <div className='w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-[#005687] font-bold text-sm border border-slate-100'>
                        {trip.operator.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className='font-bold text-[#042f40] text-lg leading-tight'>
                          {trip.operator}
                        </h3>
                        <div className='flex items-center gap-2 text-xs font-medium text-slate-500 mt-1'>
                          <span className='bg-slate-100 px-2 py-0.5 rounded text-slate-600'>
                            {trip.type}
                          </span>
                          <span className='text-slate-300'>•</span>
                          <span>{trip.busNumber}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price (Top Right) */}
                    <div className='text-right'>
                      <div className='text-xl font-black text-[#005687]'>
                        {trip.price}{' '}
                        <span className='text-xs font-bold text-[#005687]/70'>
                          ر.ي
                        </span>
                      </div>
                      {trip.seats < 5 ? (
                        <div className='text-[10px] font-bold text-red-600 animate-pulse'>
                          {trip.seats} متبقية
                        </div>
                      ) : (
                        <div className='text-[10px] font-bold text-green-600'>
                          متاح
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle Row: Timeline */}
                  <div className='flex items-center gap-4 sm:gap-8 mb-6'>
                    <div className='text-center min-w-[50px]'>
                      <div className='text-lg font-black text-[#042f40]'>
                        {trip.fromTime}
                      </div>
                      <div className='text-[10px] font-bold text-slate-400 uppercase tracking-wide'>
                        مغادرة
                      </div>
                    </div>

                    <div className='flex-1 flex flex-col items-center'>
                      <div className='flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100 mb-1.5'>
                        <ClockIcon className='w-3 h-3' />
                        {trip.duration}
                      </div>
                      <div className='w-full h-px bg-slate-200 relative flex items-center justify-between'>
                        <div className='w-1.5 h-1.5 rounded-full bg-slate-300' />
                        <div className='flex-1 border-t border-dotted border-slate-300 mx-2' />
                        <div className='w-1.5 h-1.5 rounded-full bg-slate-300' />
                      </div>
                      <div className='text-[10px] font-medium text-slate-400 mt-1.5'>
                        {trip.routeName}
                      </div>
                    </div>

                    <div className='text-center min-w-[50px]'>
                      <div className='text-lg font-black text-[#042f40]'>
                        {trip.toTime}
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
                        <span className='text-[10px] font-bold'>
                          {trip.rating}
                        </span>
                      </div>
                      <div className='hidden sm:flex gap-2'>
                        {trip.features.slice(0, 3).map((f) => (
                          <span
                            key={f}
                            className='text-[10px] font-bold text-slate-400'
                            title={f}>
                            {f === 'WiFi' && <WifiIcon className='w-3 h-3' />}
                            {f === 'AC' && '❄️'}
                            {f === 'USB' && <BoltIcon className='w-3 h-3' />}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Compact Action Button */}
                    <button className='flex items-center gap-2 px-5 py-2 bg-[#005687] hover:bg-[#004a73] text-white font-bold rounded-lg shadow-md shadow-blue-900/10 active:scale-95 transition-all text-xs sm:text-sm'>
                      <span>اختيار</span>
                      <ChevronLeftIcon className='w-3 h-3 sm:w-4 sm:h-4' />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredTrips.length === 0 && (
              <div className='flex flex-col items-center justify-center py-16 px-4 text-center'>
                <div className='w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6'>
                  <div className='text-4xl'>🚌</div>
                </div>
                <h3 className='text-xl font-bold text-[#042f40] mb-2'>
                  لا توجد رحلات متاحة
                </h3>
                <p className='text-slate-500 max-w-sm mb-8'>
                  لم نتمكن من العثور على رحلات لهذا المسار في التاريخ المحدد.
                  جرب تغيير التاريخ أو الفلاتر.
                </p>
                <button
                  onClick={resetFilters}
                  className='px-6 py-3 bg-white border border-slate-200 text-[#042f40] font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors'>
                  إعادة تعيين الفلاتر
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {isMobileFilterOpen && (
        <div className='fixed inset-0 z-50 flex items-end justify-center md:hidden'>
          <div
            className='absolute inset-0 bg-black/40 backdrop-blur-sm'
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className='bg-white w-full rounded-t-3xl p-6 relative max-h-[85vh] overflow-y-auto'>
            <div className='w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6' />
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold'>الفلاتر</h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className='p-2 bg-slate-100 rounded-full'>
                <XMarkIcon className='w-5 h-5' />
              </button>
            </div>
            <div className='space-y-6 mb-6'>
              <div>
                <h3 className='font-bold text-[#042f40] mb-3 text-sm'>
                  ترتيب حسب
                </h3>
                <div className='space-y-2'>
                  {[
                    { value: 'departure', label: 'الأبكر' },
                    { value: 'price', label: 'الأرخص' },
                    { value: 'rating', label: 'الأعلى تقييماً' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value as any)}
                      className={`w-full px-3 py-2 rounded-lg text-sm text-right transition-all ${
                        sortBy === option.value
                          ? 'bg-[#005687] text-white'
                          : 'bg-slate-50 text-slate-700'
                      }`}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <hr className='border-slate-100' />
              <FilterPanel isMobile={true} />
            </div>
            <div className='sticky bottom-0 bg-white pt-4 pb-2 border-t border-slate-100'>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className='w-full bg-[#005687] text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-900/10'>
                عرض {filteredTrips.length} رحلة
              </button>
            </div>
          </div>
        </div>
      )}

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}
