import { CalendarDaysIcon, CreditCardIcon, UsersIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Booking } from '@/types/booking';
import { useRouter } from 'next/router';
import { convertToReadableTime } from '@mishwari/utils';

interface MiniTicketProps {
  booking: Booking;
}

const statusConfig = {
  active: { label: 'نشط', bg: 'bg-green-100', text: 'text-green-700' },
  completed: { label: 'مكتمل', bg: 'bg-gray-100', text: 'text-gray-700' },
  cancelled: { label: 'ملغي', bg: 'bg-red-100', text: 'text-red-700' },
  pending: { label: 'قيد الانتظار', bg: 'bg-orange-100', text: 'text-orange-700' },
};

const paymentMethodLabels = {
  cash: 'نقدي',
  wallet: 'محفظة',
  stripe: 'بطاقة',
};

function MiniTicket({ booking }: MiniTicketProps) {
  const router = useRouter();
  const status = statusConfig[booking.status as keyof typeof statusConfig] || statusConfig.pending;
  const fromCity = booking.from_stop?.city?.city || booking.trip?.from_city?.city;
  const toCity = booking.to_stop?.city?.city || booking.trip?.to_city?.city;
  const fare = booking.total_fare || booking.trip?.price;
  const departureTime = booking.from_stop?.planned_departure || booking.trip?.departure_time;
  const departureDate = departureTime
    ? new Date(departureTime).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'غير محدد';
  const departureTimeFormatted = departureTime ? convertToReadableTime(departureTime) : '';
  const paymentMethod = paymentMethodLabels[booking.payment_method as keyof typeof paymentMethodLabels] || booking.payment_method;

  return (
    <div 
      onClick={() => router.push(`/my_trips/${booking.id}`)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
    >
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

        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div className="flex items-center gap-1.5 text-gray-600">
            <CalendarDaysIcon className="h-5 w-5" />
            <span>{departureDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <ClockIcon className="h-5 w-5" />
            <span>{departureTimeFormatted}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <UsersIcon className="h-5 w-5" />
            <span>{booking.passengers?.length || 0} راكب</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <CreditCardIcon className="h-5 w-5" />
            <span>{paymentMethod}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-brand-primary font-bold text-lg">
            {fare} ريال
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
            {status.label}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MiniTicket;
