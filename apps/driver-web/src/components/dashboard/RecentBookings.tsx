import { useEffect, useState } from 'react';
import { tripsApi, operatorApi } from '@mishwari/api';
import BookingsList from '../bookings/BookingsList';

export default function RecentBookings() {
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
                  from_city: trip.from_city.city,
                  to_city: trip.to_city.city,
                  journey_date: trip.journey_date,
                },
              });
            });
          } catch (err) {
            console.error(`Failed to fetch bookings for trip ${trip.id}`);
          }
        }

        allBookings.sort(
          (a, b) =>
            new Date(b.booking_time).getTime() -
            new Date(a.booking_time).getTime()
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

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">أحدث الحجوزات</h3>
      </div>
      <BookingsList bookings={bookings} loading={loading} showTripInfo={true} />
    </div>
  );
}
