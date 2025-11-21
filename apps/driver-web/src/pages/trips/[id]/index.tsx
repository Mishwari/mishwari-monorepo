import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button, ConfirmDialog } from '@mishwari/ui-web';
import { tripsApi, operatorApi } from '@mishwari/api';
import { Trip } from '@mishwari/types';
import { convertToReadableTime } from '@mishwari/utils';
import { CalendarIcon, ClockIcon, MapPinIcon, TruckIcon, ArrowRightIcon, PlayIcon, XMarkIcon, UserIcon, TableCellsIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

export default function TripDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { canPublish, profile } = useSelector((state: AppState) => state.auth);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!trip) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">الرحلة غير موجودة</p>
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

  const canStartFlexibleTrip = trip?.trip_type === 'flexible' && 
    trip.departure_window_start && 
    trip.departure_window_end &&
    new Date() >= new Date(trip.departure_window_start) &&
    new Date() <= new Date(trip.departure_window_end);

  const getPublishMessage = () => {
    if (!trip) return '';
    if (trip.can_publish) return '';
    
    const missing = [];
    
    // Check operator
    if (trip.operator && !trip.operator.is_verified) {
      missing.push('المشغل');
    }
    
    // Check bus
    if (trip.bus) {
      if (!trip.bus.is_verified) {
        missing.push('الحافلة');
      }
    } else {
      missing.push('الحافلة (غير محددة)');
    }
    
    // Check driver
    if (trip.driver) {
      if (!trip.driver.is_verified) {
        missing.push('السائق');
      }
    } else {
      missing.push('السائق (غير محدد)');
    }
    
    if (missing.length === 0) return 'لا يمكن نشر الرحلة';
    return `لنشر هذه الرحلة، يجب توثيق: ${missing.join('، ')}`;
  };

  return (
    <DashboardLayout>
      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onConfirm={handleCancel}
        title="إلغاء الرحلة"
        description="هل أنت متأكد من إلغاء هذه الرحلة؟ لن تتمكن من التراجع عن هذا الإجراء."
        confirmText="نعم، إلغاء"
        cancelText="تراجع"
        variant="destructive"
      />
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => router.push('/trips')} variant="outline" size="sm">
              <ArrowRightIcon className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {trip.from_city.city} ← {trip.to_city.city}
              </h1>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${statusColors[trip.status]}`}>
                {statusLabels[trip.status]}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {trip.status === 'draft' && (
              <>
                <Button
                  onClick={() => setShowCancelDialog(true)}
                  variant="outline"
                  disabled={actionLoading}
                  className="flex gap-2 items-center"
                >
                  <XMarkIcon className="h-4 w-4" />
                  إلغاء
                </Button>
                <Button
                  onClick={handlePublish}
                  variant="default"
                  disabled={!trip.can_publish}
                  loading={actionLoading}
                  title={getPublishMessage()}
                >
                  نشر
                </Button>
              </>
            )}
            {trip.status === 'published' && (
              <>
                <Button
                  onClick={() => setShowCancelDialog(true)}
                  variant="outline"
                  disabled={actionLoading}
                  className="flex gap-2 items-center"
                >
                  <XMarkIcon className="h-4 w-4" />
                  إلغاء
                </Button>
                {canStartFlexibleTrip && (
                  <Button
                    onClick={handleDepartNow}
                    variant="default"
                    disabled={actionLoading}
                    className="flex gap-2 items-center"
                  >
                    <PlayIcon className="h-4 w-4" />
                    بدء الرحلة
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">تفاصيل الرحلة</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">التاريخ</p>
                <p className="font-medium">{new Date(trip.journey_date).toLocaleDateString('en-GB')}</p>
              </div>
            </div>

            {trip.trip_type === 'scheduled' && trip.planned_departure && (
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">وقت المغادرة</p>
                  <p className="font-medium">{convertToReadableTime(trip.planned_departure)}</p>
                </div>
              </div>
            )}

            {trip.trip_type === 'flexible' && trip.departure_window_start && trip.departure_window_end && (
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">نافذة المغادرة</p>
                  <p className="font-medium">
                    {convertToReadableTime(trip.departure_window_start)}
                    {' - '}
                    {convertToReadableTime(trip.departure_window_end)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <TruckIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">الحافلة</p>
                <p className="font-medium">{trip.bus?.bus_number || 'غير محدد'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ArrowsRightLeftIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">النوع</p>
                <p className="font-medium">{trip.trip_type === 'scheduled' ? 'مجدولة' : 'مرنة'}</p>
              </div>
            </div>

             {trip.driver && (
              <div className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">السائق</p>
                  <p className="font-medium">{trip.driver.driver_name}</p>
                </div>
              </div>
            )}

            {trip.planned_route_name && (
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">المسار</p>
                  <p className="font-medium">{trip.planned_route_name}</p>
                </div>
              </div>
            )}

            {trip.available_seats !== undefined && (
              <div className="flex items-center gap-2">
                <TableCellsIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">المقاعد المتاحة</p>
                  <p className="font-medium">{trip.available_seats} مقعد</p>
                </div>
              </div>
            )}
          </div>

          {trip.price && (
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">السعر</p>
              <p className="text-2xl font-bold ">{trip.price} ر.ي</p>
            </div>
          )}
        </div>

        {!trip.can_publish && trip.status === 'draft' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800">
              💡 {getPublishMessage()}
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">الحجوزات ({bookings.length})</h2>
            <div className="flex gap-2">
              <Button onClick={() => router.push(`/trips/${trip.id}/bookings`)} variant="outline" size="sm">
                عرض الكل
              </Button>
              <Button onClick={() => router.push(`/trips/${trip.id}/bookings/create`)} variant="default" size="sm">
                إضافة حجز
              </Button>
            </div>
          </div>
          {bookings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">لا توجد حجوزات</p>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div 
                  key={booking.id} 
                  onClick={() => router.push(`/trips/${trip.id}/bookings/${booking.id}`)}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">#{booking.id} <span className="text-sm text-gray-500">({booking.from_stop?.city?.city || 'N/A'} → {booking.to_stop?.city?.city || 'N/A'})</span></p>
                      <p className="text-sm text-gray-600">{booking.passengers?.length || 0} راكب</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
