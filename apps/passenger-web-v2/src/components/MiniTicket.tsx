import { CalendarDaysIcon, CreditCardIcon, UsersIcon } from '@heroicons/react/24/outline';
import { Booking } from '@/types/booking';

interface MiniTicketProps {
  booking: Booking;
}

const statusConfig = {
  active: { label: 'نشط', bg: 'bg-green-100', text: 'text-green-700' },
  completed: { label: 'مكتمل', bg: 'bg-gray-100', text: 'text-gray-700' },
  cancelled: { label: 'ملغي', bg: 'bg-red-100', text: 'text-red-700' },
  pending: { label: 'قيد الانتظار', bg: 'bg-orange-100', text: 'text-orange-700' },
};

function MiniTicket({ booking }: MiniTicketProps) {
  const status = statusConfig[booking.status as keyof typeof statusConfig] || statusConfig.pending;
  const fromCity = booking.from_city?.city || booking.trip?.from_city?.city;
  const toCity = booking.to_city?.city || booking.trip?.to_city?.city;
  const fare = booking.total_fare || booking.trip?.price;
  const departureDate = booking.trip?.departure_time
    ? new Date(booking.trip.departure_time).toLocaleDateString('ar-SA', {
        day: 'numeric',
        month: 'long',
      })
    : 'غير محدد';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-brand-text-dark">{fromCity}</h3>
          </div>
          <div className="flex-shrink-0 mx-4">
            <div className="text-center">
              <div className="w-12 h-0.5 bg-gray-300 mb-1"></div>
              <p className="text-xs text-gray-500">رحلة</p>
            </div>
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-lg font-bold text-brand-text-dark">{toCity}</h3>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-300 my-3"></div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1.5 text-gray-600">
            <CalendarDaysIcon className="h-5 w-5" />
            <span>{departureDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <UsersIcon className="h-5 w-5" />
            <span>{booking.passengers.length}</span>
          </div>
          <div className="flex items-center gap-1.5 text-brand-primary font-semibold">
            <CreditCardIcon className="h-5 w-5" />
            <span>{fare} ريال</span>
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
            {status.label}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MiniTicket;
