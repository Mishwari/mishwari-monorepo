import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BookingsList from '@/components/bookings/BookingsList';
import { Button, ConfirmDialog, CollapsibleSection, DropdownMenu, DropdownMenuItem } from '@mishwari/ui-web';
import { tripsApi, operatorApi } from '@mishwari/api';
import { Trip } from '@mishwari/types';
import { convertToReadableTime } from '@mishwari/utils';
import { useCanPublishTrip } from '@/hooks/useCanPublishTrip';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  TruckIcon,
  ArrowRightIcon,
  PlayIcon,
  XMarkIcon,
  UserIcon,
  TableCellsIcon,
  ArrowsRightLeftIcon,
  EllipsisVerticalIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

export default function TripDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  const { message: publishMessage } = useCanPublishTrip(
    trip?.bus || undefined,
    trip?.driver || undefined
  );

  useEffect(() => {
    if (!id) return;

    const fetchTrip = async () => {
      try {
        const data = await operatorApi.getTripById(Number(id));
        setTrip(data);
      } catch (error) {
        console.error('Failed to fetch trip:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchBookings = async () => {
      try {
        const data = await operatorApi.getTripBookings(Number(id));
        setBookings(data.slice(0, 10));
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };

    fetchBookings();
  }, [id]);

  const handlePublish = async () => {
    if (!trip) return;
    setActionLoading(true);
    try {
      await operatorApi.publishTrip(trip.id);
      const updated = await operatorApi.getTripById(Number(id));
      setTrip(updated);
    } catch (error: any) {
      alert(error?.response?.data?.detail || 'فشل نشر الرحلة');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDepartNow = async () => {
    if (!trip) return;
    setActionLoading(true);
    try {
      await operatorApi.departNow(trip.id);
      const updated = await operatorApi.getTripById(Number(id));
      setTrip(updated);
    } catch (error: any) {
      alert(error?.response?.data?.error || 'فشل بدء الرحلة');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!trip) return;
    setActionLoading(true);
    try {
      await operatorApi.cancelTrip(trip.id);
      const updated = await operatorApi.getTripById(Number(id));
      setTrip(updated);
    } catch (error: any) {
      alert(error?.response?.data?.error || 'فشل إلغاء الرحلة');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!trip) return;
    setActionLoading(true);
    try {
      const result = await operatorApi.completeTrip(trip.id);
      alert(`تم إكمال الرحلة بنجاح. تم إكمال ${result.bookings_completed} حجز`);
      const updated = await operatorApi.getTripById(Number(id));
      setTrip(updated);
    } catch (error: any) {
      alert(error?.response?.data?.error || 'فشل إكمال الرحلة');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className='text-center py-12'>
          <p className='text-gray-600'>جاري التحميل...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!trip) {
    return (
      <DashboardLayout>
        <div className='text-center py-12'>
          <p className='text-gray-600'>الرحلة غير موجودة</p>
        </div>
      </DashboardLayout>
    );
  }

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    published: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    draft: 'مسودة',
    published: 'منشورة',
    active: 'نشطة',
    completed: 'مكتملة',
    cancelled: 'ملغاة',
  };

  const canStartFlexibleTrip =
    trip?.trip_type === 'flexible' &&
    trip.departure_window_start &&
    trip.departure_window_end &&
    new Date() >= new Date(trip.departure_window_start) &&
    new Date() <= new Date(trip.departure_window_end);

  return (
    <DashboardLayout>
      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onConfirm={handleCancel}
        title='إلغاء الرحلة'
        description='هل أنت متأكد من إلغاء هذه الرحلة؟ لن تتمكن من التراجع عن هذا الإجراء.'
        confirmText='نعم، إلغاء'
        cancelText='تراجع'
        variant='destructive'
      />
      <ConfirmDialog
        open={showCompleteDialog}
        onOpenChange={setShowCompleteDialog}
        onConfirm={handleComplete}
        title='إكمال الرحلة'
        description='هل أنت متأكد من إكمال هذه الرحلة؟ سيتم تلقائياً إكمال جميع الحجوزات المرتبطة بها وسيتمكن الركاب من تقييم الرحلة.'
        confirmText='نعم، إكمال'
        cancelText='تراجع'
        variant='default'
      />
      <div className='max-w-4xl mx-auto space-y-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button
              onClick={() => router.push('/trips')}
              variant='outline'
              size='sm'>
              <ArrowRightIcon className='h-5 w-5' />
            </Button>
            <div>
              <h1 className='text-xl md:text-3xl font-bold text-gray-900'>
                {trip.from_city.city} ← {trip.to_city.city}
              </h1>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                  statusColors[trip.status]
                }`}>
                {statusLabels[trip.status]}
              </span>
            </div>
          </div>
          {/* Desktop buttons */}
          <div className='hidden md:flex gap-2'>
            {trip.status === 'draft' && (
              <>
                <Button
                  onClick={() => setShowCancelDialog(true)}
                  variant='outline'
                  disabled={actionLoading}
                  className='flex gap-2 items-center'>
                  <XMarkIcon className='h-4 w-4' />
                  إلغاء
                </Button>
                <Button
                  onClick={handlePublish}
                  variant='default'
                  disabled={!trip.can_publish}
                  loading={actionLoading}
                  title={publishMessage}>
                  نشر
                </Button>
              </>
            )}
            {trip.status === 'published' && (
              <>
                <Button
                  onClick={() => setShowCancelDialog(true)}
                  variant='outline'
                  disabled={actionLoading}
                  className='flex gap-2 items-center'>
                  <XMarkIcon className='h-4 w-4' />
                  إلغاء
                </Button>
                <Button
                  onClick={handleDepartNow}
                  variant='default'
                  disabled={actionLoading}
                  className='flex gap-2 items-center'>
                  <PlayIcon className='h-4 w-4' />
                  بدء الرحلة
                </Button>
              </>
            )}
            {trip.status === 'active' && (
              <Button
                onClick={() => setShowCompleteDialog(true)}
                variant='default'
                disabled={actionLoading}>
                إكمال الرحلة
              </Button>
            )}
          </div>

          {/* Mobile dropdown */}
          <div className='md:hidden'>
            <DropdownMenu
              trigger={
                <Button variant='outline' size='sm'>
                  <EllipsisVerticalIcon className='h-5 w-5' />
                </Button>
              }
              items={[
                ...(trip.status === 'draft'
                  ? [
                      {
                        label: 'نشر',
                        onClick: handlePublish,
                        icon: PlayIcon,
                        disabled: !trip.can_publish || actionLoading,
                      },
                      {
                        label: 'إلغاء',
                        onClick: () => setShowCancelDialog(true),
                        icon: XMarkIcon,
                        variant: 'destructive' as const,
                        disabled: actionLoading,
                      },
                    ]
                  : []),
                ...(trip.status === 'published'
                  ? [
                      {
                        label: 'بدء الرحلة',
                        onClick: handleDepartNow,
                        icon: PlayIcon,
                        disabled: actionLoading,
                      },
                      {
                        label: 'إلغاء',
                        onClick: () => setShowCancelDialog(true),
                        icon: XMarkIcon,
                        variant: 'destructive' as const,
                        disabled: actionLoading,
                      },
                    ]
                  : []),
                ...(trip.status === 'active'
                  ? [
                      {
                        label: 'إكمال الرحلة',
                        onClick: () => setShowCompleteDialog(true),
                        icon: CheckIcon,
                        disabled: actionLoading,
                      },
                    ]
                  : []),
              ]}
              align='left'
            />
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6 space-y-4'>
          <h2 className='text-xl font-semibold mb-4'>تفاصيل الرحلة</h2>

          <div className='grid grid-cols-2 gap-4'>
            <div className='flex items-center gap-2'>
              <CalendarIcon className='h-5 w-5 text-gray-400' />
              <div>
                <p className='text-sm text-gray-500'>التاريخ</p>
                <p className='font-medium'>
                  {new Date(trip.journey_date).toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>

            {trip.trip_type === 'scheduled' && trip.planned_departure && (
              <div className='flex items-center gap-2'>
                <ClockIcon className='h-5 w-5 text-gray-400' />
                <div>
                  <p className='text-sm text-gray-500'>وقت المغادرة</p>
                  <p className='font-medium'>
                    {convertToReadableTime(trip.planned_departure)}
                  </p>
                </div>
              </div>
            )}

            {trip.trip_type === 'flexible' &&
              trip.departure_window_start &&
              trip.departure_window_end && (
                <div className='flex items-center gap-2'>
                  <ClockIcon className='h-5 w-5 text-gray-400' />
                  <div>
                    <p className='text-sm text-gray-500'>نافذة المغادرة</p>
                    <p className='font-medium'>
                      {convertToReadableTime(trip.departure_window_start)}
                      {' - '}
                      {convertToReadableTime(trip.departure_window_end)}
                    </p>
                  </div>
                </div>
              )}

            <div className='flex items-center gap-2'>
              <TruckIcon className='h-5 w-5 text-gray-400' />
              <div>
                <p className='text-sm text-gray-500'>الحافلة</p>
                <p className='font-medium'>
                  {trip.bus?.bus_number || 'غير محدد'}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <ArrowsRightLeftIcon className='h-5 w-5 text-gray-400' />
              <div>
                <p className='text-sm text-gray-500'>النوع</p>
                <p className='font-medium'>
                  {trip.trip_type === 'scheduled' ? 'مجدولة' : 'مرنة'}
                </p>
              </div>
            </div>

            {trip.driver && (
              <div className='flex items-center gap-2'>
                <UserIcon className='h-5 w-5 text-gray-400' />
                <div>
                  <p className='text-sm text-gray-500'>السائق</p>
                  <p className='font-medium'>{trip.driver.driver_name}</p>
                </div>
              </div>
            )}

            {trip.planned_route_name && (
              <div className='flex items-center gap-2'>
                <MapPinIcon className='h-5 w-5 text-gray-400' />
                <div>
                  <p className='text-sm text-gray-500'>المسار</p>
                  <p className='font-medium'>{trip.planned_route_name}</p>
                </div>
              </div>
            )}

            {trip.available_seats !== undefined && (
              <div className='flex items-center gap-2'>
                <TableCellsIcon className='h-5 w-5 text-gray-400' />
                <div>
                  <p className='text-sm text-gray-500'>المقاعد المتاحة</p>
                  <p className='font-medium'>{trip.available_seats} مقعد</p>
                </div>
              </div>
            )}
          </div>

          {trip.price && (
            <div className='pt-4 border-t'>
              <p className='text-sm text-gray-500'>السعر</p>
              <p className='text-2xl font-bold '>{trip.price} ر.ي</p>
            </div>
          )}
        </div>

        {!trip.can_publish && trip.status === 'draft' && publishMessage && (
          <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
            <p className='text-amber-800'>💡 {publishMessage}</p>
          </div>
        )}

        {trip.stops && trip.stops.length > 2 && (
          <div className='bg-white rounded-lg shadow'>
            <CollapsibleSection
              title='نقاط التوقف'
              count={trip.stops.length - 2}
              defaultOpen={false}
              showBottomToggle={true}>
              <div className='divide-y'>
                {trip.stops.slice(1, -1).map((stop, index) => (
                  <div
                    key={stop.id}
                    className='py-3 hover:bg-gray-50 transition-colors'>
                    <div className='flex items-center gap-4'>
                      <div className='flex-shrink-0 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center font-semibold text-sm'>
                        {index + 1}
                      </div>
                      <div className='flex-1'>
                        <p className='font-medium text-gray-900'>
                          {stop.city.name}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {stop.distance_from_start_km.toFixed(1)} كم
                        </p>
                      </div>
                      <div className='text-left'>
                        <p className='font-semibold text-brand-primary'>
                          {stop.price_from_start} ر.ي
                        </p>
                        <p className='text-xs text-gray-500'>
                          {new Date(stop.planned_arrival).toLocaleTimeString(
                            'ar-YE',
                            { hour: '2-digit', minute: '2-digit' }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          </div>
        )}

        <div className='bg-white rounded-lg shadow'>
          <div className='px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
            <h2 className='text-xl font-semibold'>
              الحجوزات ({bookings.length})
            </h2>
            <div className='flex gap-2'>
              <Button
                onClick={() => router.push(`/trips/${trip.id}/bookings`)}
                variant='outline'
                size='sm'>
                عرض الكل
              </Button>
              <Button
                onClick={() => router.push(`/trips/${trip.id}/bookings/create`)}
                variant='default'
                size='sm'
                disabled={trip.status !== 'published' && trip.status !== 'active'}>
                إضافة حجز
              </Button>
            </div>
          </div>
          <BookingsList bookings={bookings} />
        </div>
      </div>
    </DashboardLayout>
  );
}
