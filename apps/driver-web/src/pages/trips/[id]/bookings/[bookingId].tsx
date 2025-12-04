import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button, ConfirmDialog } from '@mishwari/ui-web';
import { operatorApi, bookingsApi } from '@mishwari/api';
import { ArrowRightIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useCancelBooking } from '@mishwari/ui-primitives';

export default function BookingDetailsPage() {
  const router = useRouter();
  const { id, bookingId } = router.query;
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { requestCancel, confirmCancel, cancelRequest, cancelling, showConfirm } = useCancelBooking({
    onSuccess: () => setBooking({ ...booking, status: 'cancelled' })
  });

  useEffect(() => {
    if (!id || !bookingId) return;

    const fetchBooking = async () => {
      try {
        const bookings = await operatorApi.getTripBookings(Number(id));
        const foundBooking = bookings.find(
          (b: any) => b.id === Number(bookingId)
        );
        setBooking(foundBooking || null);
      } catch (error) {
        console.error('Failed to fetch booking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, bookingId]);

  const handleCancelClick = () => {
    if (booking) requestCancel(booking.id);
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabels: Record<string, string> = {
    pending: 'قيد الانتظار',
    confirmed: 'مؤكد',
    cancelled: 'ملغي',
  };

  return (
    <DashboardLayout>
      <div className='max-w-4xl mx-auto space-y-6'>
        <div className='flex items-center gap-4'>
          <Button
            onClick={() => router.back()}
            variant='outline'
            size='sm'>
            <ArrowRightIcon className='h-5 w-5' />
          </Button>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>تفاصيل الحجز</h1>
            <p className='text-gray-600 mt-1'>رقم الحجز: {bookingId}</p>
          </div>
        </div>

        {loading ? (
          <div className='text-center py-12'>
            <p className='text-gray-600'>جاري التحميل...</p>
          </div>
        ) : !booking ? (
          <div className='text-center py-12 bg-white rounded-lg shadow'>
            <p className='text-red-600'>الحجز غير موجود</p>
          </div>
        ) : (
          <div className='bg-white rounded-lg shadow-lg p-6 space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-bold'>معلومات الحجز</h2>
              <div className='flex items-center gap-3'>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[booking.status]
                  }`}>
                  {statusLabels[booking.status]}
                </span>
                {booking.status === 'pending' && (
                  <Button
                    variant='default'
                    onClick={() => {
                      bookingsApi.confirm(booking.id).then(() => {
                        setBooking({ ...booking, status: 'confirmed' });
                      });
                    }}
                  >
                    تأكيد الحجز
                  </Button>
                )}
                {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                  <Button
                    variant='outline'
                    onClick={handleCancelClick}
                    disabled={cancelling}
                  >
                    <XCircleIcon className='h-5 w-5 ml-2' />
                    {cancelling ? 'جاري الإلغاء...' : 'إلغاء الحجز'}
                  </Button>
                )}
              </div>
            </div>
            
            <ConfirmDialog
              open={showConfirm}
              onOpenChange={cancelRequest}
              onConfirm={confirmCancel}
              title="إلغاء الحجز"
              description="هل أنت متأكد من إلغاء هذا الحجز؟"
              confirmText="إلغاء"
              cancelText="رجوع"
              variant="destructive"
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <h3 className='text-sm font-medium text-gray-500 mb-2'>
                  الرحلة
                </h3>
                <p className='text-lg font-semibold'>
                  {booking.trip?.from_city?.city} ←{' '}
                  {booking.trip?.to_city?.city}
                </p>
                <p className='text-sm text-gray-600'>
                  {booking.trip?.journey_date}
                </p>
              </div>

              <div>
                <h3 className='text-sm font-medium text-gray-500 mb-2'>
                  محطات الحجز
                </h3>
                <p className='text-lg font-semibold'>
                  {booking.from_stop?.city?.city || 'N/A'} ←{' '}
                  {booking.to_stop?.city?.city || 'N/A'}
                </p>
                <p className='text-2xl font-bold text-blue-600 mt-1'>
                  {booking.total_fare} ر.ي
                </p>
                <p className='text-sm text-gray-600'>
                  ({booking.passengers?.length || 0} راكب ×{' '}
                  {booking.passengers?.length
                    ? (booking.total_fare / booking.passengers.length).toFixed(
                        2
                      )
                    : 0}{' '}
                  ر.ي)
                </p>
              </div>

              <div>
                <h3 className='text-sm font-medium text-gray-500 mb-2'>
                  طريقة الدفع
                </h3>
                <p className='text-lg'>
                  {booking.payment_method === 'cash' ? 'نقدي' : 'محفظة'}
                </p>
              </div>

              <div>
                <h3 className='text-sm font-medium text-gray-500 mb-2'>
                  وقت الحجز
                </h3>
                <p className='text-lg'>
                  {new Date(booking.booking_time).toLocaleString('en-GB')}
                </p>
              </div>

              <div>
                <h3 className='text-sm font-medium text-gray-500 mb-2'>
                  المصدر
                </h3>
                <p className='text-lg'>
                  {booking.booking_source === 'physical' ? 'يدوي' : 'أونلاين'}
                </p>
              </div>
            </div>

            {(booking.contact_name || booking.contact_phone || booking.contact_email) && (
              <div>
                <h3 className='text-lg font-bold mb-4'>معلومات الاتصال</h3>
                <div className='border border-gray-200 rounded-lg p-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    {booking.contact_name && (
                      <div>
                        <p className='text-sm text-gray-500'>الاسم</p>
                        <p className='font-medium'>{booking.contact_name}</p>
                      </div>
                    )}
                    {booking.contact_phone && (
                      <div>
                        <p className='text-sm text-gray-500'>الهاتف</p>
                        <p className='font-medium'>{booking.contact_phone}</p>
                      </div>
                    )}
                    {booking.contact_email && (
                      <div>
                        <p className='text-sm text-gray-500'>البريد الإلكتروني</p>
                        <p className='font-medium'>{booking.contact_email}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className='text-lg font-bold mb-4'>
                الركاب ({booking.passengers?.length || 0})
              </h3>
              <div className='space-y-3'>
                {booking.passengers?.map((passenger: any, index: number) => (
                  <div
                    key={index}
                    className='border border-gray-200 rounded-lg p-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <p className='text-sm text-gray-500'>الاسم</p>
                        <p className='font-medium'>{passenger.name}</p>
                      </div>
                      {passenger.age && (
                        <div>
                          <p className='text-sm text-gray-500'>العمر</p>
                          <p className='font-medium'>{passenger.age}</p>
                        </div>
                      )}
                      {passenger.gender && (
                        <div>
                          <p className='text-sm text-gray-500'>الجنس</p>
                          <p className='font-medium'>{passenger.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
                        </div>
                      )}
                      {passenger.seat_number && (
                        <div>
                          <p className='text-sm text-gray-500'>رقم المقعد</p>
                          <p className='font-medium'>{passenger.seat_number}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
