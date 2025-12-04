import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  UserIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { Button, ConfirmDialog } from '@mishwari/ui-web';
import { useCancelBooking } from '@mishwari/ui-primitives';
import { bookingsApi } from '@mishwari/api';

interface BookingsListProps {
  bookings: any[];
  loading?: boolean;
  emptyMessage?: string;
  showTripInfo?: boolean;
  onBookingCancelled?: (bookingId: number) => void;
}

export default function BookingsList({ 
  bookings, 
  loading = false, 
  emptyMessage = 'لا توجد حجوزات',
  showTripInfo = false,
  onBookingCancelled
}: BookingsListProps) {
  const router = useRouter();
  const { id: tripIdFromRoute } = router.query;
  const [localBookings, setLocalBookings] = useState(bookings);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const { requestCancel, confirmCancel, cancelRequest, cancelling, showConfirm } = useCancelBooking({
    onSuccess: () => {
      if (cancellingId) {
        setLocalBookings(prev => 
          prev.map(b => b.id === cancellingId ? { ...b, status: 'cancelled' } : b)
        );
        if (onBookingCancelled) onBookingCancelled(cancellingId);
        setCancellingId(null);
      }
    }
  });

  useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);

  const handleCancel = (e: React.MouseEvent, bookingId: number) => {
    e.stopPropagation();
    setCancellingId(bookingId);
    requestCancel(bookingId);
  };

  if (loading) {
    return (
      <div className="px-6 py-4 text-center text-gray-500">
        جاري التحميل...
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="px-6 py-4 text-center text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {localBookings.map((booking) => (
        <div
          key={booking.id}
          className="px-6 py-4 cursor-pointer hover:bg-gray-50"
          onClick={() => {
            const tripId = booking.trip_info?.id || 
                          (typeof booking.trip === 'object' ? booking.trip?.id : booking.trip) || 
                          tripIdFromRoute;
            router.push(`/trips/${tripId}/bookings/${booking.id}`);
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 bg-blue-100 rounded-full">
                <UserIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {booking.passengers?.[0]?.name || 'راكب'}
                  {booking.passengers?.length > 1 &&
                    ` +${booking.passengers.length - 1}`}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {booking.from_stop?.city?.city || 'N/A'} ← {booking.to_stop?.city?.city || 'N/A'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500">
                    {new Date(booking.booking_time).toLocaleString('en-GB')}
                  </p>
                  {booking.booking_source === 'physical' ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                      <DevicePhoneMobileIcon className="h-3 w-3" />
                      يدوي
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                      <CreditCardIcon className="h-3 w-3" />
                      اونلاين
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-left flex flex-col items-end gap-2">
              <p className="text-sm font-bold text-gray-900">
                {booking.total_fare} ريال
              </p>
              <span
                className={`inline-block px-2 py-1 rounded text-xs ${
                  booking.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : booking.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : booking.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {booking.status === 'confirmed'
                  ? 'مؤكد'
                  : booking.status === 'pending'
                  ? 'معلق'
                  : booking.status === 'cancelled'
                  ? 'ملغي'
                  : booking.status}
              </span>
              <div className="flex gap-2">
                {booking.status === 'pending' && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      bookingsApi.confirm(booking.id).then(() => {
                        setLocalBookings(prev => 
                          prev.map(b => b.id === booking.id ? { ...b, status: 'confirmed' } : b)
                        );
                      });
                    }}
                    className="text-xs"
                  >
                    تأكيد
                  </Button>
                )}
                {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleCancel(e, booking.id)}
                    disabled={cancelling}
                    className="text-xs"
                  >
                    <XCircleIcon className="h-4 w-4 ml-1" />
                    {cancelling ? 'جاري الإلغاء...' : 'إلغاء'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
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
    </div>
  );
}
