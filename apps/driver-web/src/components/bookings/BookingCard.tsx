import { useRouter } from 'next/router';

interface BookingCardProps {
  booking: any;
}

export default function BookingCard({ booking }: BookingCardProps) {
  const router = useRouter();

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabels: Record<string, string> = {
    pending: 'قيد الانتظار',
    active: 'نشط',
    completed: 'مكتمل',
    cancelled: 'ملغي',
  };

  return (
    <div
      onClick={() => router.push(`/bookings/${booking.id}`)}
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">حجز #{booking.id}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
          {statusLabels[booking.status]}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">الرحلة</span>
          <span className="font-medium">
            {booking.trip?.from_city?.city} → {booking.trip?.to_city?.city}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">التاريخ</span>
          <span className="font-medium">{booking.trip?.journey_date}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">عدد الركاب</span>
          <span className="font-medium">{booking.passengers?.length || 0}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">الأجرة</span>
          <span className="font-bold text-blue-600">{booking.total_fare} ريال</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">الدفع</span>
          <span className="font-medium">{booking.payment_method === 'cash' ? 'نقدي' : 'محفظة'}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          {new Date(booking.booking_time).toLocaleString('ar-SA')}
        </p>
      </div>
    </div>
  );
}
