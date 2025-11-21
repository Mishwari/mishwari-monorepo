import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { tripsApi, operatorApi } from '@mishwari/api';
import { UserIcon, CreditCardIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

export default function RecentBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const trips = await tripsApi.list();
        const allBookings: any[] = [];

        for (const trip of trips.slice(0, 10)) {
          try {
            const tripBookings = await operatorApi.getTripBookings(trip.id);
            tripBookings.forEach((booking: any) => {
              allBookings.push({
                ...booking,
                trip_info: {
                  id: trip.id,
                  from_city: trip.from_city?.city || trip.from_city_name,
                  to_city: trip.to_city?.city || trip.to_city_name,
                  journey_date: trip.journey_date,
                },
              });
            });
          } catch (err) {
            console.error(`Failed to fetch bookings for trip ${trip.id}`);
          }
        }

        allBookings.sort((a, b) => 
          new Date(b.booking_time).getTime() - new Date(a.booking_time).getTime()
        );

        setBookings(allBookings.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">أحدث الحجوزات</h3>
        </div>
        <div className="px-6 py-4 text-center text-gray-500">جاري التحميل...</div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">أحدث الحجوزات</h3>
        </div>
        <div className="px-6 py-4 text-center text-gray-500">لا توجد حجوزات</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">أحدث الحجوزات</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="px-6 py-4 cursor-pointer hover:bg-gray-50"
            onClick={() => router.push(`/trips/${booking.trip_info.id}/bookings/${booking.id}`)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <UserIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.passengers?.[0]?.name || 'راكب'}
                    {booking.passengers?.length > 1 && ` +${booking.passengers.length - 1}`}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {booking.trip_info.from_city} → {booking.trip_info.to_city}
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
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900">{booking.total_fare} ريال</p>
                <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status === 'confirmed' ? 'مؤكد' : 
                   booking.status === 'pending' ? 'معلق' : booking.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
