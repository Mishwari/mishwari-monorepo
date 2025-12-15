import React, { useEffect, useState, Fragment, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Transition, Dialog } from '@headlessui/react';
import { GetServerSideProps } from 'next';
import { SEO } from '@mishwari/ui-web';

// Icons
import {
  Calendar,
  User,
  Phone,
  Mail,
  Check,
  Star,
  Bus,
  Wifi,
  Wind,
  Zap,
  Tv,
  Edit2,
  Trash2,
  Plus,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  Route,
  CheckCircle2,
  Users,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// Hooks & Api (Preserved from your code)
import { convertToReadableTime } from '@mishwari/utils';
import axios from 'axios';

// Create a public axios instance without auth
const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/',
  headers: { 'Content-Type': 'application/json' },
});
import { usePassengerManager } from '@mishwari/features-passengers/core';
import useAuth from '@/hooks/useAuth';
import useLogout from '@/hooks/useLogout';

// Components
import MainHeader from '@/components/MainHeader';
// We replace the UI library components with raw Tailwind for the new design
// but keep Input/PassengerForm for the modal logic if needed,
// or rebuild them to match the style. For this file, I will use standard inputs
// styled with Tailwind for the Contact section to ensure consistency.
import { PassengerForm, ConfirmDialog } from '@mishwari/ui-web'; // Keeping these for functionality
import LoginModal from '@/components/LoginModal';
import ProfileFormModal from '@/components/ProfileFormModal';

// --- HELPER COMPONENTS ---

const RatingBadge = ({ rating }) => (
  <div className='flex items-center gap-1 text-[10px] font-bold text-white bg-yellow-500 px-1.5 py-0.5 rounded-md shadow-sm'>
    <Star className='w-2.5 h-2.5 fill-white' /> {rating || 'New'}
  </div>
);

const getAmenityIcon = (key) => {
  switch (key) {
    case 'ac':
      return { icon: Wind, label: 'مكيف' };
    case 'wifi':
      return { icon: Wifi, label: 'واي فاي' };
    case 'charging':
      return { icon: Zap, label: 'شحن' };
    case 'tv':
      return { icon: Tv, label: 'تلفاز' };
    case 'toilet':
      return { icon: User, label: 'دورة مياه' };
    default:
      return { icon: Check, label: key };
  }
};

export default function TripDetailsPage() {
  // --- STATE & HOOKS (Preserved) ---
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const profile = useSelector((state) => state.profile);
  const auth = useSelector((state) => state.auth);
  const isFullyAuthenticated = isAuthenticated && !!profile?.full_name;

  const {
    passengers: savedPassengers,
    fetchPassengers,
    addPassenger,
    updatePassenger,
    deletePassenger,
    bulkUpdateChecked,
  } = usePassengerManager();

  const [localPassengers, setLocalPassengers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [passengerToDelete, setPassengerToDelete] = useState(null);
  const [tripDetails, setTripDetails] = useState(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isPathOpen, setIsPathOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [contactDetails, setContactDetails] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [autoAddedPassengerId, setAutoAddedPassengerId] = useState(null);

  const { tripId, from_stop_id, to_stop_id } = router.query;

  // --- LOGIC (Preserved) ---
  const calculateDuration = (departure, arrival) => {
    const departureDate = new Date(departure);
    const arrivalDate = new Date(arrival);
    const difference = arrivalDate.getTime() - departureDate.getTime();
    const hours = Math.floor(difference / 3600000);
    const minutes = Math.floor((difference % 3600000) / 60000);
    return `${hours}س ${minutes}د`;
  };

  useEffect(() => {
    if (isFullyAuthenticated) {
      const timer = setTimeout(() => {
        fetchPassengers().catch(() => {});
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isFullyAuthenticated]);

  useEffect(() => {
    if (profile) {
      setContactDetails({
        name: profile?.full_name || profile?.user.username || '',
        phone: profile?.mobile_number || '',
        email: profile?.user.email || '',
      });
    }
  }, [profile]);

  const calculateAge = (birthDate: string | null | undefined): number | null => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    if (!isFullyAuthenticated || !profile?.full_name) return;
    
    const passengersWithCheck = savedPassengers.map((p) => {
      const existingLocal = localPassengers.find((lp) => lp.id === p.id);
      return {
        ...p,
        is_checked: p.name === profile.full_name ? true : (existingLocal?.is_checked ?? p.is_checked),
      };
    });

    const sorted = passengersWithCheck.sort((a, b) => {
      const aIsOwner = a.name === profile.full_name;
      const bIsOwner = b.name === profile.full_name;
      if (aIsOwner) return -1;
      if (bIsOwner) return 1;
      if (a.is_checked && !b.is_checked) return -1;
      if (!a.is_checked && b.is_checked) return 1;
      return 0;
    });

    const userExists = sorted.some((p) => p.name === profile.full_name);
    if (!userExists) {
      const userPassenger = {
        id: null,
        name: profile.full_name,
        age: calculateAge(profile.birth_date),
        is_checked: true,
        gender: profile.gender || 'male',
      };
      setLocalPassengers([userPassenger, ...sorted]);
    } else {
      setLocalPassengers(sorted);
    }
  }, [profile, savedPassengers, isFullyAuthenticated]);

  // Fetch Trip Logic (Preserved)
  useEffect(() => {
    if (!router.isReady || !tripId) return;
    const fetchTripDetails = async () => {
      try {
        // Use public API without auth for trip details
        const response = await publicApi.get(`trips/${tripId}/`);
        const data = response.data;

        if (from_stop_id && to_stop_id && data.stops && data.seat_matrix) {
          const fromStop = data.stops.find(
            (s) => s.id === Number(from_stop_id)
          );
          const toStop = data.stops.find((s) => s.id === Number(to_stop_id));

          if (fromStop && toStop) {
            const segments = [];
            for (let i = fromStop.sequence; i < toStop.sequence; i++) {
              segments.push(`${i}-${i + 1}`);
            }
            const segmentSeats = segments.map(
              (seg) => data.seat_matrix[seg] ?? 0
            );
            const availableSeats =
              segmentSeats.length > 0 ? Math.min(...segmentSeats) : 0;

            const segmentData = {
              ...data,
              from_city: fromStop.city,
              to_city: toStop.city,
              departure_time: fromStop.planned_departure,
              arrival_time: toStop.planned_arrival,
              price: toStop.price_from_start - fromStop.price_from_start,
              distance:
                toStop.distance_from_start_km - fromStop.distance_from_start_km,
              available_seats: availableSeats,
            };
            setTripDetails(segmentData);
            return;
          }
        }
        setTripDetails(data);
      } catch (err) {
        console.error('Error fetching trip details:', err);
      }
    };
    fetchTripDetails();
  }, [router.isReady, tripId, from_stop_id, to_stop_id]);

  useEffect(() => {
    if (isFullyAuthenticated) return;
    
    const timer = setTimeout(() => {
      if (contactDetails.name && contactDetails.phone && localPassengers.length === 0) {
        const autoId = `auto-${Date.now()}`;
        const newPassenger = {
          id: null,
          autoId,
          name: contactDetails.name,
          age: null,
          is_checked: true,
          gender: 'male',
        };
        setLocalPassengers([newPassenger]);
        setAutoAddedPassengerId(autoId);
      } else if (autoAddedPassengerId && contactDetails.name && contactDetails.phone) {
        setLocalPassengers((prev) =>
          prev.map((p) =>
            p.autoId === autoAddedPassengerId
              ? { ...p, name: contactDetails.name }
              : p
          )
        );
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [contactDetails, localPassengers.length, autoAddedPassengerId, isFullyAuthenticated]);

  const handleContactDetailsInput = (name, value) => {
    setContactDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPassenger = () => {
    setEditingPassenger(null);
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleEditPassenger = (passenger) => {
    const index = localPassengers.findIndex((p) =>
      p.id
        ? p.id === passenger.id
        : p.name === passenger.name
    );
    setEditingPassenger(passenger);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDeletePassenger = (passenger) => {
    setPassengerToDelete(passenger);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (passengerToDelete) {
      if (passengerToDelete.id && isFullyAuthenticated) {
        try {
          await deletePassenger(passengerToDelete.id);
        } catch (err) {
          alert('فشل حذف الراكب');
          setDeleteConfirmOpen(false);
          return;
        }
      }
      setLocalPassengers((prev) =>
        prev.filter((p) =>
          p.id
            ? p.id !== passengerToDelete.id
            : p.name !== passengerToDelete.name
        )
      );
      setDeleteConfirmOpen(false);
      setPassengerToDelete(null);
    }
  };

  const handleToggleCheck = async (passenger) => {
    const newCheckedState = !passenger.is_checked;
    setLocalPassengers((prev) =>
      prev.map((p) => {
        if (
          p.id
            ? p.id === passenger.id
            : p.name === passenger.name
        ) {
          return { ...p, is_checked: newCheckedState };
        }
        return p;
      })
    );

    if (passenger.id) {
      try {
        await bulkUpdateChecked([
          { ...passenger, is_checked: newCheckedState },
        ]);
      } catch (err) {
        console.error('Failed to update passenger status:', err);
      }
    }
  };

  const handleSubmitPassenger = async (data) => {
    try {
      if (editingIndex !== null && editingPassenger) {
        if (editingPassenger.id && isFullyAuthenticated) {
          await updatePassenger(editingPassenger.id, data);
        }
        setLocalPassengers((prev) =>
          prev.map((p, i) => (i === editingIndex ? { ...p, ...data } : p))
        );
      } else {
        if (isFullyAuthenticated) {
          const newPassenger = await addPassenger(data);
          setLocalPassengers((prev) => [
            ...prev,
            { ...newPassenger, is_checked: true },
          ]);
        } else {
          setLocalPassengers((prev) => [
            ...prev,
            { ...data, id: null, is_checked: true },
          ]);
        }
      }
      setIsModalOpen(false);
      setEditingPassenger(null);
      setEditingIndex(null);
    } catch (err) {
      console.error('Failed to save passenger:', err);
      alert('فشل حفظ بيانات الراكب');
    }
  };

  const handleGoToPayment = () => {
    if (!profile?.full_name) {
      setShowProfileModal(true);
      return;
    }
    const checkedPassengers = localPassengers.filter((p) => p.is_checked);
    const bookingDraft = {
      tripId: Number(tripId),
      tripDetails,
      passengers: checkedPassengers,
      contactDetails,
      amount: checkedPassengers.length * Number(tripDetails?.price || 0),
      fromStopId: from_stop_id ? Number(from_stop_id) : undefined,
      toStopId: to_stop_id ? Number(to_stop_id) : undefined,
      timestamp: Date.now(),
    };
    sessionStorage.setItem('bookingDraft', JSON.stringify(bookingDraft));
    const { pickup, destination, date } = router.query;
    router.push(
      `/checkout/payment?tripId=${tripId}&from_stop_id=${from_stop_id}&to_stop_id=${to_stop_id}${
        pickup ? `&pickup=${pickup}` : ''
      }${destination ? `&destination=${destination}` : ''}${
        date ? `&date=${date}` : ''
      }`
    );
  };

  // Calculations
  const checkedPassengers = localPassengers.filter((p) => p.is_checked);
  const amount = checkedPassengers.length * Number(tripDetails?.price || 0);
  const departureTime = tripDetails?.departure_time
    ? convertToReadableTime(tripDetails.departure_time)
    : '---';
  const arrivalTime = tripDetails?.arrival_time
    ? convertToReadableTime(tripDetails.arrival_time)
    : '---';
  const duration =
    tripDetails?.departure_time && tripDetails?.arrival_time
      ? calculateDuration(tripDetails.departure_time, tripDetails.arrival_time)
      : '---';

  const backTo =
    router.query.pickup && router.query.destination && router.query.date
      ? `/bus_list?pickup=${router.query.pickup}&destination=${router.query.destination}&date=${router.query.date}`
      : '/';

  if (!tripDetails)
    return (
      <div className='min-h-screen flex items-center justify-center bg-light'>
        Loading...
      </div>
    );

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BusTrip',
    name: `${tripDetails.from_city?.name || tripDetails.from_city?.city} - ${tripDetails.to_city?.name || tripDetails.to_city?.city}`,
    provider: {
      '@type': 'Organization',
      name: tripDetails.driver?.operator?.name || 'يلا باص',
    },
    departureStation: {
      '@type': 'BusStation',
      name: tripDetails.from_city?.name || tripDetails.from_city?.city,
    },
    arrivalStation: {
      '@type': 'BusStation',
      name: tripDetails.to_city?.name || tripDetails.to_city?.city,
    },
    departureTime: tripDetails.departure_time,
    offers: {
      '@type': 'Offer',
      price: tripDetails.price,
      priceCurrency: 'YER',
      availability: tripDetails.available_seats > 0 ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
    },
  };

  return (
    <>
      <SEO
        title={`رحلة ${tripDetails.from_city?.name || tripDetails.from_city?.city} إلى ${tripDetails.to_city?.name || tripDetails.to_city?.city} - ${tripDetails.price} ر.ي`}
        description={`احجز رحلة من ${tripDetails.from_city?.name || tripDetails.from_city?.city} إلى ${tripDetails.to_city?.name || tripDetails.to_city?.city} مع ${tripDetails.driver?.operator?.name || 'يلا باص'}. المغادرة ${departureTime}. السعر ${tripDetails.price} ريال يمني.`}
        keywords={`${tripDetails.from_city?.name}, ${tripDetails.to_city?.name}, حجز باص اليمن, ${tripDetails.driver?.operator?.name}`}
        canonical={`/bus_list/${tripId}`}
        structuredData={structuredData}
      />
    <main
      className='flex flex-col m-0 bg-light min-h-screen text-brand'
      dir='rtl'>
      <MainHeader
        showBackButton
        backTo={backTo}>
        <div className='flex flex-col items-start mr-2'>
          {/* Main Route: From -> To */}
          <div className='flex items-center gap-1.5 text-sm font-black text-brand'>
            <span>
              {tripDetails?.from_city?.name ||
                tripDetails?.from_city?.city ||
                tripDetails?.pickup?.city}
            </span>
            <ArrowRight className='w-3.5 h-3.5 text-slate-400 rotate-180' />
            <span>
              {tripDetails?.to_city?.name ||
                tripDetails?.to_city?.city ||
                tripDetails?.destination?.city}
            </span>
          </div>

          {/* Meta Info: ID & Route Name */}
          <div className='flex items-center gap-1.5 text-[9px] text-slate-500 font-bold'>
            <span className='bg-slate-100 px-1 py-0.5 rounded text-slate-600'>
              #{tripDetails?.id}
            </span>
            <span className='w-0.5 h-0.5 rounded-full bg-slate-300' />
            <span className='truncate max-w-[150px]'>
              {tripDetails?.planned_route_name || tripDetails?.path_road}
            </span>
          </div>
        </div>
      </MainHeader>

      <div className='max-w-6xl mx-auto w-full px-4 py-8 mb-20 lg:mb-6'>
        {/* Mobile Trip Summary (Collapsible) */}
        <div className='lg:hidden mb-6 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden'>
          {/* Header (Click to Toggle) */}
          <div
            className='p-4 flex items-center justify-between bg-slate-50 cursor-pointer'
            onClick={() => setIsSummaryOpen(!isSummaryOpen)}>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white'>
                <Bus className='w-5 h-5' />
              </div>
              <div>
                <div className='text-xs font-bold text-slate-500'>
                  ملخص الرحلة
                </div>
                <div className='font-black text-brand text-sm'>
                  {tripDetails.journey_date} • {departureTime}
                </div>
              </div>
            </div>
            {isSummaryOpen ? (
              <ChevronUp className='w-5 h-5 text-slate-400' />
            ) : (
              <ChevronDown className='w-5 h-5 text-slate-400' />
            )}
          </div>

          {/* Expanded Content (Operator, Bus, Price) */}
          {isSummaryOpen && (
            <div className='p-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200'>
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <div className='space-y-1'>
                  <span className='text-[10px] text-slate-400 uppercase font-bold'>
                    المشغل
                  </span>
                  <div className='text-sm font-bold text-brand'>
                    {tripDetails.driver?.operator?.name || 'غير محدد'}
                  </div>
                </div>
                <div className='space-y-1'>
                  <span className='text-[10px] text-slate-400 uppercase font-bold'>
                    الباص
                  </span>
                  <div className='text-sm font-bold text-brand'>
                    #{tripDetails.bus?.bus_number || 'N/A'}
                  </div>
                </div>
              </div>
              <div className='flex items-center justify-between bg-brand-primary-light p-3 rounded-xl'>
                <span className='text-xs font-bold text-primary'>
                  السعر للمقعد
                </span>
                <span className='text-lg font-black text-primary'>
                  {tripDetails.price} ريال
                </span>
              </div>
            </div>
          )}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
          {/* RIGHT COLUMN: Content (Experience, Itinerary, Forms) - 8 cols */}
          <div className='lg:col-span-8 space-y-8'>
            {/* 1. Trip Experience (Merged Bus & Driver) */}
            <section className='bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden'>
              <div className='p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50'>
                <div className='w-10 h-10 bg-brand-primary-light rounded-xl flex items-center justify-center text-primary'>
                  <Star className='w-5 h-5' />
                </div>
                <div>
                  <h2 className='font-black text-lg text-brand'>
                    معلومات الرحلة
                  </h2>
                  <p className='text-xs text-slate-400 font-medium'>
                    الباص والسائق
                  </p>
                </div>
              </div>

              <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-8'>
                {/* Bus Features */}
                <div>
                  <div className='flex items-center gap-2 mb-4'>
                    <Bus className='w-4 h-4 text-slate-400' />
                    <span className='text-sm font-bold text-slate-600'>
                      مميزات الباص
                    </span>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {tripDetails.bus?.has_wifi && (
                      <div className='flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-brand'>
                        <Wifi className='w-4 h-4 text-primary' />
                        واي فاي
                      </div>
                    )}
                    {tripDetails.bus?.has_ac && (
                      <div className='flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-brand'>
                        <Wind className='w-4 h-4 text-primary' />
                        مكيف
                      </div>
                    )}
                    {tripDetails.bus?.has_usb_charging && (
                      <div className='flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-brand'>
                        <Zap className='w-4 h-4 text-primary' />
                        شحن USB
                      </div>
                    )}
                    <div className='flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-brand'>
                      <span className='font-mono text-slate-500'>
                        #{tripDetails.bus?.bus_number}
                      </span>
                      {tripDetails.bus?.bus_type === 'general'
                        ? 'عام'
                        : tripDetails.bus?.bus_type}
                    </div>
                  </div>
                </div>

                {/* Driver Info */}
                <div className='md:border-r md:border-slate-100 md:pr-8'>
                  <div className='flex items-center gap-2 mb-4'>
                    <User className='w-4 h-4 text-slate-400' />
                    <span className='text-sm font-bold text-slate-600'>
                      السائق
                    </span>
                  </div>
                  <div className='flex items-center gap-4 bg-light p-3 rounded-2xl border border-slate-100'>
                    <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 border-2 border-white shadow-sm'>
                      <User className='w-6 h-6' />
                    </div>
                    <div>
                      <div className='font-bold text-brand text-sm'>
                        {tripDetails.driver?.driver_name || 'غير محدد'}
                      </div>
                      <div className='flex items-center gap-2 mt-1'>
                        <RatingBadge
                          rating={tripDetails.driver?.driver_rating}
                        />
                        {tripDetails.driver?.is_verified && (
                          <span className='text-[10px] text-green-600 font-bold flex items-center gap-0.5'>
                            <CheckCircle2 className='w-3 h-3' /> موثق
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Itinerary (Stops) */}
            {(() => {
              const filteredStops =
                tripDetails.stops && from_stop_id && to_stop_id
                  ? (() => {
                      const fromStop = tripDetails.stops.find(
                        (s) => s.id === Number(from_stop_id)
                      );
                      const toStop = tripDetails.stops.find(
                        (s) => s.id === Number(to_stop_id)
                      );
                      if (fromStop && toStop) {
                        return tripDetails.stops.filter(
                          (s) =>
                            s.sequence >= fromStop.sequence &&
                            s.sequence <= toStop.sequence
                        );
                      }
                      return tripDetails.stops;
                    })()
                  : tripDetails.stops;

              return (
                filteredStops &&
                filteredStops.length > 0 && (
                  <section className='bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden'>
                    <div
                      className='p-6 border-b border-slate-100 flex justify-between items-center cursor-pointer hover:bg-slate-50/50 transition-colors'
                      onClick={() => setIsPathOpen(!isPathOpen)}>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-brand-primary-light rounded-xl flex items-center justify-center text-primary'>
                          <Route className='w-5 h-5' />
                        </div>
                        <div>
                          <h2 className='font-black text-lg text-brand'>
                            مسار الرحلة
                          </h2>
                          <p className='text-xs text-slate-400 font-medium'>
                            {filteredStops.length} محطات • {tripDetails.planned_route_name || tripDetails.path_road}
                          </p>
                        </div>
                      </div>
                      {isPathOpen ? (
                        <ChevronUp className='w-5 h-5 text-slate-400' />
                      ) : (
                        <ChevronDown className='w-5 h-5 text-slate-400' />
                      )}
                    </div>

                    {isPathOpen && (
                      <>
                        <div className='p-6 relative max-h-96 overflow-y-auto custom-scrollbar animate-in slide-in-from-top-2 duration-200'>
                          <div className='space-y-6'>
                            {filteredStops.map((stop, idx) => {
                              const isMajor =
                                idx === 0 || idx === filteredStops.length - 1;
                              const timeFormatted = stop.planned_departure
                                ? convertToReadableTime(stop.planned_departure)
                                : '---';

                              return (
                                <div
                                  key={stop.id}
                                  className='relative flex items-start justify-between group'>
                                  <div className='relative z-10 flex flex-col items-center w-8 ml-4'>
                                    {idx > 0 && (
                                      <div className='w-0.5 h-8 bg-slate-200 -mt-8' />
                                    )}
                                    <div
                                      className={`rounded-full border-4 border-white shadow-sm transition-all ${
                                        isMajor
                                          ? 'bg-brand-primary w-4 h-4 ring-4 ring-brand-primary-light'
                                          : 'bg-white border-slate-300 w-3 h-3'
                                      }`}
                                    />
                                    {idx < filteredStops.length - 1 && (
                                      <div className='w-0.5 h-8 bg-slate-200' />
                                    )}
                                  </div>
                                  <div className='flex-1'>
                                    <div
                                      className={`font-bold text-brand ${
                                        isMajor ? 'text-base' : 'text-sm'
                                      }`}>
                                      {stop.city.name}
                                    </div>
                                    <div className='text-xs text-slate-400 mt-1 flex items-center gap-2 font-medium'>
                                      <span className='bg-slate-50 px-2 py-0.5 rounded border border-slate-100'>
                                        {Math.round(
                                          stop.distance_from_start_km
                                        )}{' '}
                                        كم
                                      </span>
                                    </div>
                                  </div>
                                  <div className='w-16 text-left pt-0.5'>
                                    <div
                                      className={`font-bold ${
                                        isMajor
                                          ? 'text-primary text-base'
                                          : 'text-slate-500 text-sm'
                                      }`}>
                                      {timeFormatted}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        {filteredStops.length > 5 && (
                          <button
                            onClick={() => setIsPathOpen(false)}
                            className='w-full p-3 border-t border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-slate-500'>
                            <ChevronUp className='w-4 h-4' />
                            إخفاء المسار
                          </button>
                        )}
                      </>
                    )}
                  </section>
                )
              );
            })()}

            {/* 3. Passenger Form (Modernized) */}
            <section className='bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden'>
              <div className='p-6 border-b border-slate-100 flex justify-between items-center'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-brand-primary-light rounded-xl flex items-center justify-center text-primary'>
                    <Users className='w-5 h-5' />
                  </div>
                  <div>
                    <h2 className='font-black text-lg text-brand'>الركاب</h2>
                    <p className='text-xs text-slate-400 font-medium'>
                      حدد من سيسافر معك
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleAddPassenger}
                  className='text-sm font-bold text-white bg-brand-primary hover:bg-brand-primary-dark px-4 py-2 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2'>
                  <Plus className='w-4 h-4' /> إضافة
                </button>
              </div>

              <div className='p-4 space-y-3'>
                {localPassengers.map((p) => (
                  <div
                    key={p.id || p.name}
                    className={`group flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer border-2 ${
                      p.is_checked
                        ? 'bg-brand-primary-light/30 border-brand-primary/20'
                        : 'bg-white border-slate-50 hover:border-slate-200'
                    }`}>
                    <div
                      className='flex items-center gap-4 flex-1'
                      onClick={() => handleToggleCheck(p)}>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          p.is_checked
                            ? 'bg-brand-primary border-brand-primary'
                            : 'border-slate-300 bg-white'
                        }`}>
                        {p.is_checked && (
                          <Check className='w-4 h-4 text-white' />
                        )}
                      </div>
                      <div>
                        <div
                          className={`font-bold text-sm ${
                            p.is_checked ? 'text-primary' : 'text-brand'
                          }`}>
                          {p.name}
                        </div>
                        {(p.age || p.gender) && (
                          <div className='text-xs text-slate-400 mt-0.5 flex items-center gap-2'>
                            {p.age && <span>{p.age} سنة</span>}
                            {p.age && p.gender && <span>•</span>}
                            {p.gender && <span>{p.gender === 'male' ? 'ذكر' : 'أنثى'}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity'>
                      <button
                        onClick={() => handleEditPassenger(p)}
                        className='p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-colors'>
                        <Edit2 className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() => handleDeletePassenger(p)}
                        className='p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors'>
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                ))}
                {localPassengers.length === 0 && (
                  <div className='text-center py-8 text-slate-400 text-sm font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200'>
                    لا يوجد ركاب مضافين حالياً
                  </div>
                )}
              </div>
            </section>

            {/* 4. Contact Info */}
            <section className='bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden'>
              <div className='p-6 border-b border-slate-100 flex items-center gap-3'>
                <div className='w-10 h-10 bg-brand-primary-light rounded-xl flex items-center justify-center text-primary'>
                  <Phone className='w-5 h-5' />
                </div>
                <div>
                  <h2 className='font-black text-lg text-brand'>
                    معلومات التواصل
                  </h2>
                  <p className='text-xs text-slate-400 font-medium'>
                    لاستلام التذكرة وتأكيد الحجز
                  </p>
                </div>
              </div>
              <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500'>
                    الاسم الكامل
                  </label>
                  <div className='flex items-center gap-3 p-3.5 bg-light rounded-xl border border-slate-200 focus-within:border-brand-primary transition-all'>
                    <User className='w-5 h-5 text-slate-400' />
                    <input
                      type='text'
                      value={contactDetails.name}
                      onChange={(e) =>
                        handleContactDetailsInput('name', e.target.value)
                      }
                      className='bg-transparent w-full text-sm font-bold text-brand outline-none'
                      placeholder='الاسم'
                    />
                  </div>
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500'>
                    رقم الجوال
                  </label>
                  <div className='flex items-center gap-3 p-3.5 bg-light rounded-xl border border-slate-200 focus-within:border-brand-primary transition-all'>
                    <Phone className='w-5 h-5 text-slate-400' />
                    <input
                      type='tel'
                      value={contactDetails.phone}
                      onChange={(e) =>
                        handleContactDetailsInput('phone', e.target.value)
                      }
                      className='bg-transparent w-full text-sm font-bold text-brand outline-none dir-ltr text-right'
                      placeholder='967...'
                    />
                  </div>
                </div>
                <div className='space-y-1.5 md:col-span-2'>
                  <label className='text-xs font-bold text-slate-500'>
                    البريد الالكتروني
                  </label>
                  <div className='flex items-center gap-3 p-3.5 bg-light rounded-xl border border-slate-200 focus-within:border-brand-primary transition-all'>
                    <Mail className='w-5 h-5 text-slate-400' />
                    <input
                      type='email'
                      value={contactDetails.email}
                      onChange={(e) =>
                        handleContactDetailsInput('email', e.target.value)
                      }
                      className='bg-transparent w-full text-sm font-bold text-brand outline-none'
                      placeholder='example@mail.com'
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* LEFT COLUMN: Sticky Summary (Desktop) - 4 cols */}
          <div className='hidden lg:block lg:col-span-4'>
            <div className='sticky top-24 space-y-6'>
              {/* Trip Ticket Card */}
              <div className='bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden'>
                <div className='bg-brand-primary p-6 text-white relative overflow-hidden'>
                  <div className='absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl' />

                  <div className='flex justify-between items-start mb-8 relative z-10'>
                    <div>
                      <div className='font-bold text-lg tracking-wide'>
                        {tripDetails.driver?.operator?.name}
                      </div>
                      <div className='flex items-center gap-1.5 text-blue-200 text-xs mt-1 bg-brand-primary-dark px-2 py-0.5 rounded-full w-fit'>
                        <ShieldCheck className='w-3 h-3' /> موثق
                      </div>
                    </div>
                    <div className='bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-center'>
                      <div className='text-[10px] text-blue-100 uppercase font-bold'>
                        باص رقم
                      </div>
                      <div className='font-mono font-bold dir-ltr'>
                        {tripDetails.bus?.bus_number}
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center justify-between relative z-10'>
                    <div className='text-right'>
                      <div className='text-3xl font-black tracking-tight'>
                        {departureTime}
                      </div>
                      <div className='text-sm font-medium text-blue-100 mt-1'>
                        {tripDetails.from_city?.name ||
                          tripDetails.from_city?.city}
                      </div>
                    </div>
                    <div className='flex-1 px-4 flex flex-col items-center justify-center'>
                      <div className='text-[10px] font-bold text-blue-200 bg-brand-primary-dark px-2 py-0.5 rounded-full mb-2 text-center'>
                        {duration}
                      </div>
                      <div className='w-full flex items-center gap-1 opacity-50'>
                        <div className='h-2 w-2 rounded-full bg-white' />
                        <div className='h-0.5 flex-1 bg-white rounded-full' />
                        <div className='h-2 w-2 rounded-full bg-white' />
                      </div>
                    </div>
                    <div className='text-left'>
                      <div className='text-3xl font-black tracking-tight'>
                        {arrivalTime}
                      </div>
                      <div className='text-sm font-medium text-blue-100 mt-1'>
                        {tripDetails.to_city?.name || tripDetails.to_city?.city}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='p-6'>
                  <div className='flex items-center justify-between p-4 bg-light rounded-2xl border border-slate-100 mb-4'>
                    <div className='flex flex-col gap-1'>
                      <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider'>
                        التاريخ
                      </span>
                      <div className='font-bold text-brand flex items-center gap-2'>
                        <Calendar className='w-4 h-4 text-primary' />
                        {tripDetails.journey_date}
                      </div>
                    </div>
                    <div className='h-8 w-px bg-slate-200' />
                    <div className='flex flex-col gap-1 text-left'>
                      <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider'>
                        سعر المقعد
                      </span>
                      <div className='font-bold text-brand flex items-center justify-end gap-1'>
                        {tripDetails.price}{' '}
                        <span className='text-xs font-medium text-slate-500'>
                          ريال
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 text-xs font-bold text-green-700 bg-green-50 p-3 rounded-xl border border-green-100 justify-center'>
                    <CheckCircle2 className='w-4 h-4' />
                    إلغاء مجاني متاح
                  </div>
                </div>
              </div>

              {/* Desktop Payment Action */}
              <div className='bg-white p-6 rounded-3xl shadow-sm border border-slate-100'>
                <div className='flex justify-between items-center mb-6'>
                  <span className='text-slate-500 font-bold'>
                    الإجمالي المطلوب
                  </span>
                  <span className='text-3xl font-black text-primary'>
                    {amount} <span className='text-sm'>ريال</span>
                  </span>
                </div>

                {isAuthenticated ? (
                  <button
                    onClick={handleGoToPayment}
                    disabled={amount === 0}
                    className='w-full py-4 bg-brand-primary hover:bg-brand-primary-dark disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl shadow-xl shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-2'>
                    <CreditCard className='w-5 h-5' />
                    الانتقال للدفع
                  </button>
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className='w-full py-4 bg-white border-2 border-brand-primary text-primary font-bold rounded-xl hover:bg-blue-50 transition-all'>
                    سجل دخولك للحجز
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS (Preserved Logic) */}
      <Transition
        appear
        show={isModalOpen}
        as={Fragment}>
        <Dialog
          as='div'
          className='relative z-50'
          onClose={() => setIsModalOpen(false)}>
          <div className='fixed inset-0 bg-black/60 backdrop-blur-sm' />
          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'>
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-6 text-right shadow-2xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='text-xl font-bold mb-6 text-brand'>
                    {editingPassenger
                      ? 'تعديل بيانات الراكب'
                      : 'إضافة راكب جديد'}
                  </Dialog.Title>

                  {/* Using imported component but wiring logic */}
                  <PassengerForm
                    passenger={editingPassenger}
                    onSubmit={handleSubmitPassenger}
                    onCancel={() => setIsModalOpen(false)}
                    submitLabel={
                      editingPassenger ? 'حفظ التعديلات' : 'إضافة الراكب'
                    }
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
        title='إزالة الراكب'
        description='هل أنت متأكد من رغبتك في إزالة هذا الراكب من قائمة الحجز؟'
        confirmText='نعم، إزالة'
        cancelText='تراجع'
        variant='destructive'
      />

      {/* MOBILE STICKY FOOTER */}
      <div className='fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] lg:hidden z-40'>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <div className='text-xs text-slate-400 font-bold uppercase'>
              الإجمالي
            </div>
            <div className='text-xl font-black text-primary'>
              {amount} <span className='text-xs'>ريال</span>
            </div>
          </div>
          {isAuthenticated ? (
            <button
              onClick={handleGoToPayment}
              disabled={amount === 0}
              className='flex-1 py-3 bg-brand-primary hover:bg-brand-primary-dark disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2'>
              <span> اللإنتقال لصفحة الدفع  </span>
              <ArrowRight className='w-4 h-4 rotate-180' />
            </button>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className='flex-1 py-3 bg-slate-100 text-brand font-bold rounded-xl border border-slate-200'>
              سجل دخول
            </button>
          )}
        </div>
      </div>

      {/* Login & Profile Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onOpenProfileModal={() => setShowProfileModal(true)}
      />
      <ProfileFormModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        initialData={contactDetails}
      />
    </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return { props: {} };
};
