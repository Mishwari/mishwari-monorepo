import { useRouter } from 'next/router';
import {
  UserIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';

interface BookingsListProps {
  bookings: any[];
  loading?: boolean;
  emptyMessage?: string;
  showTripInfo?: boolean;
}

export default function BookingsList({ 
  bookings, 
  loading = false, 
  emptyMessage = 'لا توجد حجوزات',
  showTripInfo = false 
}: BookingsListProps) {
  const router = useRouter();
  const { id: tripIdFromRoute } = router.query;

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
      {bookings.map((booking) => (
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
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <UserIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {booking.passengers?.[0]?.name || 'راكب'}
                  {booking.passengers?.length > 1 &&
                    ` +${booking.passengers.length - 1}`}
                </p>
                {showTripInfo && booking.trip_info && (
                  <p className="text-xs text-gray-600 mt-1">
                    {booking.trip_info.from_city} ← {booking.trip_info.to_city}
                  </p>
                )}
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
            <div className="text-left">
              <p className="text-sm font-bold text-gray-900">
                {booking.total_fare} ريال
              </p>
              <span
                className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                  booking.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : booking.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {booking.status === 'confirmed'
                  ? 'مؤكد'
                  : booking.status === 'pending'
                  ? 'معلق'
                  : booking.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
