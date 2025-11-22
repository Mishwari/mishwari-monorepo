import Link from 'next/link';
import React, { useEffect, useState, Fragment } from 'react';
import Image from 'next/image';
import { Transition, Dialog } from '@headlessui/react';
import GreenCheckIcon from '@mishwari/ui-web/public/icons/common/greenCheck.svg';
import { Input, Button, PassengerList, PassengerForm, ConfirmDialog, RatingBadge } from '@mishwari/ui-web';
import { useRouter } from 'next/router';
import { tripsApi } from '@mishwari/api';
import { convertToReadableTime } from '@mishwari/utils';
import { usePassengerManager } from '@mishwari/features-passengers/core';
import { Passenger } from '@mishwari/types';
import { Trip } from '@/types/trip';
import { AppState } from '@/store/store';
import { useSelector } from 'react-redux';
import PageHeader from '@/layouts/PageHeader';
import useAuth from '@/hooks/useAuth';
import { UserDropdownMenu } from '@mishwari/ui-web';
import useLogout from '@/hooks/useLogout';
import { passengerNavConfig } from '@/config/navigation';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_EXTERNAL_URL;

interface ContactDetailsObject {
  name: string;
  phone: string;
  email: string;
}

function trip_details() {
  const { isAuthenticated } = useAuth();
  const logout = useLogout();
  const router = useRouter();
  const profile = useSelector((state: AppState) => state.profile);
  
  const {
    passengers: savedPassengers,
    loading: passengersLoading,
    fetchPassengers,
    addPassenger,
    updatePassenger,
    deletePassenger,
    bulkUpdateChecked,
  } = usePassengerManager();

  const [localPassengers, setLocalPassengers] = useState<Passenger[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState<Passenger | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [passengerToDelete, setPassengerToDelete] = useState<Passenger | null>(null);
  const [tripDetails, setTripDetails] = useState<Trip>();
  const [contactDetails, setContactDetails] = useState<ContactDetailsObject>({
    name: '',
    phone: '',
    email: '',
  });

  const { tripId, from_stop_id, to_stop_id } = router.query;

  const calculateDuration = (departure: string, arrival: string): string => {
    const departureDate = new Date(departure);
    const arrivalDate = new Date(arrival);
    const difference = arrivalDate.getTime() - departureDate.getTime();
    const hours = Math.floor(difference / 3600000);
    const minutes = Math.floor((difference % 3600000) / 60000);
    return `${hours}س ${minutes}د`;
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPassengers();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (profile) {
      setContactDetails({
        name: profile?.full_name || profile?.user.username || '',
        phone: profile?.phone || '',
        email: profile?.user.email || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (profile && savedPassengers.length > 0) {
      const passengersWithCheck = savedPassengers.map(p => ({
        ...p,
        is_checked: p.name === profile.full_name ? true : p.is_checked
      }));

      // Sort: account owner first, then checked, then unchecked
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
      
      if (!userExists && profile.full_name) {
        const userPassenger: Passenger = {
          id: null,
          name: profile.full_name,
          email: profile.user.email || '',
          phone: profile.phone || '',
          age: profile.age || null,
          is_checked: true,
          gender: profile.gender || 'male',
        };
        setLocalPassengers([userPassenger, ...sorted]);
      } else {
        setLocalPassengers(sorted);
      }
    } else if (profile && profile.full_name) {
      const userPassenger: Passenger = {
        id: null,
        name: profile.full_name,
        email: profile.user.email || '',
        phone: profile.phone || '',
        age: profile.age || null,
        is_checked: true,
        gender: profile.gender || 'male',
      };
      setLocalPassengers([userPassenger]);
    }
  }, [profile, savedPassengers]);

  useEffect(() => {
    if (!router.isReady || !tripId) return;
    const fetchTripDetails = async () => {
      try {
        const data = await tripsApi.getById(Number(tripId));
        console.log('Trip data:', data);
        console.log('from_stop_id:', from_stop_id, 'to_stop_id:', to_stop_id);
        console.log('seat_matrix:', data.seat_matrix);
        
        if (from_stop_id && to_stop_id && data.stops && data.seat_matrix) {
          const fromStop = data.stops.find((s: any) => s.id === Number(from_stop_id));
          const toStop = data.stops.find((s: any) => s.id === Number(to_stop_id));
          console.log('fromStop:', fromStop, 'toStop:', toStop);
          
          if (fromStop && toStop) {
            const segments = [];
            for (let i = fromStop.sequence; i < toStop.sequence; i++) {
              segments.push(`${i}-${i+1}`);
            }
            console.log('segments:', segments);
            const segmentSeats = segments.map(seg => {
              const seats = data.seat_matrix[seg] ?? 0;
              console.log(`Segment ${seg}: ${seats} seats`);
              return seats;
            });
            const availableSeats = segmentSeats.length > 0 ? Math.min(...segmentSeats) : 0;
            console.log('Available seats for journey:', availableSeats);
            
            const segmentData = {
              ...data,
              from_city: fromStop.city,
              to_city: toStop.city,
              departure_time: fromStop.planned_departure,
              arrival_time: toStop.planned_arrival,
              price: toStop.price_from_start - fromStop.price_from_start,
              distance: toStop.distance_from_start_km - fromStop.distance_from_start_km,
              available_seats: availableSeats,
            };
            setTripDetails(segmentData);
            return;
          }
        }
        
        setTripDetails(data);
      } catch (err: any) {
        console.error('Error fetching trip details:', err);
      }
    };
    fetchTripDetails();
  }, [router.isReady, tripId, from_stop_id, to_stop_id]);

  const handleContactDetailsInput = (name: string, value: any) => {
    setContactDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddPassenger = () => {
    setEditingPassenger(null);
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleEditPassenger = (passenger: Passenger) => {
    const index = localPassengers.findIndex(p => 
      p.id ? p.id === passenger.id : p.name === passenger.name && p.phone === passenger.phone
    );
    setEditingPassenger(passenger);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDeletePassenger = (passenger: Passenger) => {
    setPassengerToDelete(passenger);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (passengerToDelete) {
      // If passenger has ID, delete from database
      if (passengerToDelete.id) {
        try {
          await deletePassenger(passengerToDelete.id);
        } catch (err) {
          alert('فشل حذف الراكب');
          setDeleteConfirmOpen(false);
          setPassengerToDelete(null);
          return;
        }
      }
      // Remove from local state
      setLocalPassengers(prev => prev.filter(p => 
        p.id ? p.id !== passengerToDelete.id : !(p.name === passengerToDelete.name && p.phone === passengerToDelete.phone)
      ));
      setDeleteConfirmOpen(false);
      setPassengerToDelete(null);
    }
  };

  const handleToggleCheck = async (passenger: Passenger) => {
    const newCheckedState = !passenger.is_checked;
    
    setLocalPassengers(prev => prev.map(p => {
      if (p.id ? p.id === passenger.id : (p.name === passenger.name && p.phone === passenger.phone)) {
        return { ...p, is_checked: newCheckedState };
      }
      return p;
    }));
    
    if (passenger.id) {
      try {
        await bulkUpdateChecked([{ ...passenger, is_checked: newCheckedState }]);
      } catch (err) {
        console.error('Failed to update passenger status:', err);
      }
    }
  };

  const handleSubmitPassenger = async (data: Omit<Passenger, 'id'>) => {
    try {
      if (editingIndex !== null && editingPassenger) {
        if (editingPassenger.id) {
          await updatePassenger(editingPassenger.id, data);
        }
        setLocalPassengers(prev => prev.map((p, i) => 
          i === editingIndex ? { ...p, ...data } : p
        ));
      } else {
        const newPassenger = await addPassenger(data);
        setLocalPassengers(prev => [...prev, { ...newPassenger, is_checked: true }]);
      }
      setIsModalOpen(false);
      setEditingPassenger(null);
      setEditingIndex(null);
    } catch (err) {
      console.error('Failed to save passenger:', err);
      alert('فشل حفظ بيانات الراكب');
    }
  };

  const checkedPassengers = localPassengers.filter(p => p.is_checked);
  const amount = checkedPassengers.length * Number(tripDetails?.price || 0);

  const departureTime = tripDetails?.departure_time ? convertToReadableTime(tripDetails.departure_time) : '---';
  const arrivalTime = tripDetails?.arrival_time ? convertToReadableTime(tripDetails.arrival_time) : '---';
  const duration = tripDetails?.departure_time && tripDetails?.arrival_time 
    ? calculateDuration(tripDetails.departure_time, tripDetails.arrival_time) 
    : '---';

  const handleGoToPayment = () => {
    const bookingDraft = {
      tripId: Number(tripId),
      tripDetails,
      passengers: checkedPassengers,
      contactDetails,
      amount,
      fromStopId: from_stop_id ? Number(from_stop_id) : undefined,
      toStopId: to_stop_id ? Number(to_stop_id) : undefined,
      timestamp: Date.now(),
    };
    sessionStorage.setItem('bookingDraft', JSON.stringify(bookingDraft));
    router.push(`/checkout/payment?tripId=${tripId}&from_stop_id=${from_stop_id}&to_stop_id=${to_stop_id}`);
  };

  return (
    <main className='flex flex-col m-0 bg-gray-50 min-h-screen'>
      <PageHeader title='معلومات الرحلة'>
        {isAuthenticated && (
          <div className='absolute left-4 top-4'>
            <UserDropdownMenu items={passengerNavConfig.desktop.items} onLogout={logout} />
          </div>
        )}
      </PageHeader>

      <div className='flex flex-col md:flex-row justify-around px-2 md:px-4 mb-6'>
        <div className='px-2 sm:px-6 md:w-1/2 lg:max-w-xl'>
          <section className='mx-2 mt-4 p-4 bg-white shadow-lg text-brand-text-dark rounded-xl'>
            <div className='flex justify-between items-center'>
              <div className='flex flex-col text-center gap-1'>
                <h1 className='text-lg font-bold'>
                  {tripDetails?.from_city?.name || tripDetails?.from_city?.city || tripDetails?.pickup?.city}
                </h1>
                <p className='text-sm font-light'>{departureTime}</p>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <h1 className='text-xs'>{duration}</h1>
                <div className='relative arrow h-[0.5px] w-[60px] bg-black mt-3'>
                  <div className='absolute rotate-45 -left-[1px] top-1 w-[10px] h-[0.5px] bg-black'></div>
                  <div className='absolute -rotate-45 -left-[1px] -top-1 w-[10px] h-[0.5px] bg-black'></div>
                </div>
              </div>
              <div className='flex flex-col text-center gap-1'>
                <h1 className='text-lg font-bold'>
                  {tripDetails?.to_city?.name || tripDetails?.to_city?.city || tripDetails?.destination?.city}
                </h1>
                <p className='text-sm font-light'>{arrivalTime}</p>
              </div>
            </div>
            <div className='h-[1px] w-full my-4 bg-slate-200' />
            <div className='space-y-2'>
              <div className='flex justify-start items-center gap-2'>
                <h1 className='font-bold'>المسار:</h1>
                <h1>{tripDetails?.planned_route_name || tripDetails?.path_road || 'غير محدد'}</h1>
              </div>
              <div className='flex gap-2'>
                <h1 className='font-bold'>السعر:</h1>
                <h1>{tripDetails?.price} ريال</h1>
                <h1 className='mx-auto'>
                  ({Math.round(tripDetails?.distance || 0)} كم)
                </h1>
              </div>
              <div className='flex gap-2'>
                <h1 className='font-bold'>تاريخ الرحلة:</h1>
                <h1>{tripDetails?.journey_date || 'غير محدد'}</h1>
              </div>
              {tripDetails?.trip_type && (
                <div className='flex gap-2'>
                  <h1 className='font-bold'>نوع الرحلة:</h1>
                  <h1>{tripDetails.trip_type === 'scheduled' ? 'مجدولة' : 'مرنة'}</h1>
                </div>
              )}
              {tripDetails?.available_seats !== undefined && tripDetails.available_seats !== null && (
                <div className='flex gap-2'>
                  <h1 className='font-bold'>المقاعد المتاحة:</h1>
                  <h1>{tripDetails.available_seats} مقعد</h1>
                </div>
              )}
            </div>
          </section>

          <section className='mx-2 h-max p-4 my-4 bg-white rounded-xl shadow-lg text-brand-text-dark'>
            <div className='flex justify-start items-center gap-2 mb-4'>
              <h1 className='text-lg font-bold'>معلومات الباص</h1>
            </div>
            <div className='h-[1px] w-full mb-6 bg-slate-500' />
            <div className='mx-2 mt-4'>
              <div className='flex justify-between items-center'>
                <h1 className='font-bold'>
                  باص: {tripDetails?.driver?.operator?.name || 'غير محدد'}
                </h1>
                <RatingBadge rating={tripDetails?.driver?.driver_rating} size='md' />
              </div>
              <div className='flex flex-wrap justify-start items-center gap-2 mt-4'>
                {tripDetails?.bus?.amenities && Object.entries(tripDetails.bus.amenities).map(([key, value]) => {
                  if (value !== 'true') return null;
                  const amenity = [{ key: 'ac', label: 'مكيف' }, { key: 'wifi', label: 'واي فاي' }, { key: 'charging', label: 'شحن الجوال' }, { key: 'tv', label: 'تلفاز' }, { key: 'toilet', label: 'دورة مياه' }].find(a => a.key === key);
                  return (
                    <div key={key} className='flex justify-center items-center text-center text-gray-600 text-xs font-bold gap-1.5 px-3 py-1 bg-gray-100 shadow rounded-2xl'>
                      <h1>{amenity?.label || key}</h1>
                      <GreenCheckIcon width={15} height={15} />
                    </div>
                  );
                })}
              </div>
              <div className='mt-6 space-y-2'>
                <div className='flex gap-2'>
                  <strong>نوع الباص:</strong>
                  <p>{tripDetails?.bus?.bus_type === 'general' ? 'عام' : tripDetails?.bus?.bus_type || 'غير محدد'}</p>
                </div>
                <div className='flex gap-2'>
                  <strong>رقم الباص:</strong>
                  <p>{tripDetails?.bus?.bus_number || 'غير محدد'}</p>
                </div>
                {tripDetails?.available_seats !== undefined && (
                  <div className='flex gap-2'>
                    <strong>المقاعد المتاحة:</strong>
                    <p>{tripDetails.available_seats} مقعد</p>
                  </div>
                )}
                <div className='flex gap-2'>
                  <strong>السائق:</strong>
                  <p>{tripDetails?.driver?.driver_name || 'غير محدد'}</p>
                </div>
              </div>
            </div>
          </section>

          {tripDetails?.driver?.operator && (
            <section className='mx-2 h-max p-4 my-4 bg-white rounded-xl shadow-lg text-brand-text-dark'>
              <div className='flex justify-start items-center gap-2 mb-4'>
                <h1 className='text-lg font-bold'>معلومات الشركة</h1>
              </div>
              <div className='h-[1px] w-full mb-6 bg-slate-500' />
              <div className='mx-2 mt-4 space-y-2'>
                <div className='flex gap-2'>
                  <strong>اسم الشركة:</strong>
                  <p>{tripDetails.driver.operator.name}</p>
                </div>
                {tripDetails.driver.is_verified && (
                  <div className='flex gap-2 items-center'>
                    <strong>الحالة:</strong>
                    <span className='flex items-center gap-1 text-green-600'>
                      <GreenCheckIcon width={15} height={15} />
                      موثق
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}

          {tripDetails?.stops && tripDetails.stops.length > 0 && (
            <section className='mx-2 h-max p-4 my-4 bg-white rounded-xl shadow-lg text-brand-text-dark'>
              <div className='flex justify-start items-center gap-2 mb-4'>
                <h1 className='text-lg font-bold'>محطات الرحلة</h1>
              </div>
              <div className='h-[1px] w-full mb-6 bg-slate-500' />
              <div className='mx-2 mt-4 space-y-1 max-h-64 overflow-y-auto'>
                {tripDetails.stops.map((stop: any, index: number) => {
                  const isFromStop = from_stop_id && stop.id === Number(from_stop_id);
                  const isToStop = to_stop_id && stop.id === Number(to_stop_id);
                  const fromIndex = from_stop_id ? tripDetails.stops.findIndex((s: any) => s.id === Number(from_stop_id)) : -1;
                  const toIndex = to_stop_id ? tripDetails.stops.findIndex((s: any) => s.id === Number(to_stop_id)) : -1;
                  const isInSegment = fromIndex !== -1 && toIndex !== -1 && index >= fromIndex && index <= toIndex;
                  return (
                    <div key={stop.id} className='flex justify-between items-center py-3 px-3 bg-gray-50 rounded-lg'>
                      <div className='flex items-center gap-3'>
                        <div className='flex flex-col items-center'>
                          {index > 0 && <div className='w-0.5 h-4 bg-gray-300' />}
                          <div className={`w-3 h-3 rounded-full ${
                            isFromStop ? 'bg-green-500' : 
                            isToStop ? 'bg-red-500' : 
                            isInSegment ? 'bg-brand-primary' : 'bg-gray-400'
                          }`} />
                          {index < tripDetails.stops.length - 1 && <div className='w-0.5 h-4 bg-gray-300' />}
                        </div>
                        <div>
                          <h2 className='font-bold'>{stop.city.name}</h2>
                          <p className='text-xs text-gray-600'>
                            {convertToReadableTime(stop.planned_arrival)}
                          </p>
                        </div>
                      </div>
                      <div className='text-left text-sm'>
                        <p className='text-gray-600'>{Math.round(stop.distance_from_start_km)} كم</p>
                        <p className='font-semibold'>{stop.price_from_start} ريال</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <div className='px-2 sm:px-6 md:w-1/2 lg:max-w-xl'>
          <section className='flex flex-col my-4 p-4 mx-2 bg-white shadow-lg text-brand-text-dark rounded-xl'>
            <div className='flex justify-start items-center gap-2 py-2 mb-2'>
              <h1 className='text-lg font-bold'>معلومات التواصل</h1>
            </div>
            <div className='h-[1px] w-full mb-6 bg-slate-500' />
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>الاسم</label>
                <Input
                  value={contactDetails.name}
                  onChange={(e) => handleContactDetailsInput('name', e.target.value)}
                  placeholder='اسم الراكب'
                  className='text-right'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>رقم الجوال</label>
                <Input
                  value={contactDetails.phone}
                  onChange={(e) => handleContactDetailsInput('phone', e.target.value)}
                  placeholder='رقم الجوال'
                  className='text-right'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>الايميل</label>
                <Input
                  value={contactDetails.email}
                  onChange={(e) => handleContactDetailsInput('email', e.target.value)}
                  placeholder='الايميل'
                  type='email'
                  className='text-right'
                />
              </div>
            </div>
          </section>

          <section className='flex flex-col gap-3 mx-2 my-4 p-4 bg-white shadow-lg text-brand-text-dark rounded-xl'>
            <PassengerList
              passengers={localPassengers}
              onAdd={handleAddPassenger}
              onEdit={handleEditPassenger}
              onDelete={handleDeletePassenger}
              onToggleCheck={handleToggleCheck}
              showCheckbox={true}
              title="عدد الركاب"
              emptyMessage="لا يوجد ركاب"
            />
          </section>
        </div>
      </div>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
          <div className="fixed inset-0 bg-black/50" />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-right shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-xl font-bold mb-6 text-gray-900">
                    {editingPassenger ? 'تعديل معلومات الراكب' : 'إضافة راكب جديد'}
                  </Dialog.Title>
                  <PassengerForm
                    passenger={editingPassenger}
                    onSubmit={handleSubmitPassenger}
                    onCancel={() => setIsModalOpen(false)}
                    submitLabel={editingPassenger ? 'تحديث' : 'إضافة'}
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
        title="إزالة راكب"
        description="هل أنت متأكد من إزالة هذا الراكب من الحجز؟"
        confirmText="إزالة"
        cancelText="إلغاء"
        variant="destructive"
      />

      <footer className='sticky flex justify-between items-center bottom-0 mt-auto p-3 bg-blue-50 w-full'>
        <div className='flex gap-1 items-center'>
          <h1>الاجمالي:</h1>
          <strong>{amount || 0}</strong>
          <h1>ريال</h1>
        </div>
        {isAuthenticated ? (
          <Button
            onClick={handleGoToPayment}
            disabled={amount === 0}
            className={`${
              amount === 0
                ? 'bg-green-500/30 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            }`}>
            الانتقال لصفحة الدفع
          </Button>
        ) : (
          <Link href='/login'>
            <Button className='bg-green-500 hover:bg-green-600'>
              سجل دخولك لاكمال الدفع
            </Button>
          </Link>
        )}
      </footer>
    </main>
  );
}

export default trip_details;
