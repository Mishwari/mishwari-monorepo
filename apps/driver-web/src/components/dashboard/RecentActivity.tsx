import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { tripsApi, operatorApi } from '@mishwari/api';
import { ClockIcon, CalendarDaysIcon, TicketIcon } from '@heroicons/react/24/outline';

export default function RecentActivity() {
  const router = useRouter();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const trips = await tripsApi.list();
        const recentTrips = trips.slice(0, 5);

        const activityItems = [];
        for (const trip of recentTrips) {
          let bookingCount = 0;
          try {
            const bookings = await operatorApi.getTripBookings(trip.id);
            bookingCount = bookings.length;
          } catch (err) {
            console.error(`Failed to fetch bookings for trip ${trip.id}`);
          }

          activityItems.push({
            id: `trip-${trip.id}`,
            type: 'trip',
            message: `رحلة ${trip.from_city?.city || trip.from_city_name} → ${trip.to_city?.city || trip.to_city_name}`,
            time: new Date(trip.journey_date).toLocaleDateString('en-GB'),
            status: trip.status,
            tripId: trip.id,
            tripType: trip.trip_type,
            availableSeats: trip.available_seats,
            bookingCount,
          });
        }

        setActivities(activityItems.length > 0 ? activityItems : [
          { id: 1, type: 'info', message: 'مرحباً بك في منصة مشواري للسائقين', time: 'الآن' },
        ]);
      } catch (error) {
        console.error('Failed to fetch activity:', error);
        setActivities([{ id: 1, type: 'info', message: 'مرحباً بك في منصة مشواري للسائقين', time: 'الآن' }]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'published': return 'text-blue-600';
      case 'completed': return 'text-gray-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'نشطة';
      case 'published': return 'منشورة';
      case 'completed': return 'مكتملة';
      case 'cancelled': return 'ملغاة';
      case 'draft': return 'مسودة';
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">النشاط الأخير</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {loading ? (
          <div className="px-6 py-4 text-center text-gray-500">جاري التحميل...</div>
        ) : (
          activities.map((activity) => (
            <div 
              key={activity.id} 
              className={`px-6 py-4 ${activity.type === 'trip' ? 'cursor-pointer hover:bg-gray-50' : ''}`}
              onClick={() => activity.tripId && router.push(`/trips/${activity.tripId}`)}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-900">{activity.message}</p>
                {activity.status && (
                  <span className={`text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {getStatusLabel(activity.status)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-gray-500">{activity.time}</p>
                {activity.tripType && (
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs ${
                    activity.tripType === 'scheduled' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {activity.tripType === 'scheduled' ? (
                      <><CalendarDaysIcon className="h-3 w-3" />مجدولة</>
                    ) : (
                      <><ClockIcon className="h-3 w-3" />مرنة</>
                    )}
                  </span>
                )}
                {activity.availableSeats !== undefined && (
                  <span className="text-xs text-gray-600">
                    {activity.availableSeats} مقعد
                  </span>
                )}
                {activity.bookingCount !== undefined && activity.bookingCount > 0 && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                    <TicketIcon className="h-3 w-3" />
                    {activity.bookingCount}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
