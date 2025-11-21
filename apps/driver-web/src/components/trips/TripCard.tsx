import { Trip } from '@mishwari/types';
import { useRouter } from 'next/router';
import { CalendarIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface TripCardProps {
  trip: Trip;
}

export default function TripCard({ trip }: TripCardProps) {
  const router = useRouter();

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

  return (
    <div
      onClick={() => router.push(`/trips/${trip.id}`)}
      className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <MapPinIcon className="h-5 w-5 text-gray-400" />
            <span className="font-semibold text-lg">
              {trip.from_city.city} ← {trip.to_city.city}
            </span>
          </div>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[trip.status]}`}>
            {statusLabels[trip.status]}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span>{new Date(trip.journey_date).toLocaleDateString('en-GB')}</span>
        </div>
        {trip.trip_type === 'scheduled' && trip.planned_departure && (
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4" />
            <span>{new Date(trip.planned_departure).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}
        {trip.trip_type === 'flexible' && trip.departure_window_start && trip.departure_window_end && (
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4" />
            <span>
              {new Date(trip.departure_window_start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              {' - '}
              {new Date(trip.departure_window_end).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-gray-500">النوع: {trip.trip_type === 'scheduled' ? 'مجدولة' : 'مرنة'}</span>
          {trip.price && <span className="font-semibold text-lg">{trip.price} ر.ي</span>}
        </div>
      </div>
    </div>
  );
}
