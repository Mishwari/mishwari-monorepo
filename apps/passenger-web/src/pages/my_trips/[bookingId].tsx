import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import { decryptToken } from '@/utils/tokenUtils';
import { convertToReadableTime } from '@mishwari/utils';
import MainLayout from '@/layouts/MainLayout';
import GreenCheckIcon from '@mishwari/ui-web/public/icons/common/greenCheck.svg';
import StarIcon from '@mishwari/ui-web/public/icons/common/star.svg';

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

export default function BookingDetails() {
  const router = useRouter();
  const { bookingId } = router.query;
  const token = useSelector((state: AppState) => state.auth.token);
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId || !token) return;

    const fetchBooking = async () => {
      try {
        const decryptedToken = decryptToken(token);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}booking/${bookingId}/`,
          {
            headers: {
              Authorization: `Bearer ${decryptedToken}`,
            },
          }
        );
        setBooking(response.data);
      } catch (err) {
        console.error('Error fetching booking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, token]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">جاري التحميل...</div>
        </div>
      </MainLayout>
    );
  }

  if (!booking) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">لم يتم العثور على الحجز</div>
        </div>
      </MainLayout>
    );
  }

  const status = statusConfig[booking.status as keyof typeof statusConfig] || statusConfig.pending;
  const fromCity = booking.from_stop?.city?.city || booking.trip?.from_city?.city;
  const toCity = booking.to_stop?.city?.city || booking.trip?.to_city?.city;
  const departureTime = booking.from_stop?.planned_departure || booking.trip?.departure_time;
  const arrivalTime = booking.to_stop?.planned_arrival || booking.trip?.arrival_time;
  const paymentMethod = paymentMethodLabels[booking.payment_method as keyof typeof paymentMethodLabels];

  const calculateDuration = (departure: string, arrival: string): string => {
    const departureDate = new Date(departure);
    const arrivalDate = new Date(arrival);
    const difference = arrivalDate.getTime() - departureDate.getTime();
    const hours = Math.floor(difference / 3600000);
    const minutes = Math.floor((difference % 3600000) / 60000);
    return `${hours}س ${minutes}د`;
  };

  const duration = departureTime && arrivalTime ? calculateDuration(departureTime, arrivalTime) : '---';

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-6 mb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">تفاصيل الحجز</h1>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${status.bg} ${status.text}`}>
            {status.label}
          </span>
        </div>

        <section className="bg-white shadow-lg rounded-xl p-6 mb-4">
          <h2 className="text-lg font-bold mb-4">معلومات الرحلة</h2>
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col text-center gap-1">
              <h3 className="text-xl font-bold">{fromCity}</h3>
              <p className="text-sm text-gray-600">{departureTime ? convertToReadableTime(departureTime) : '---'}</p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <p className="text-xs text-gray-500">{duration}</p>
              <div className="relative arrow h-[0.5px] w-[60px] bg-black mt-2">
                <div className="absolute rotate-45 -left-[1px] top-1 w-[10px] h-[0.5px] bg-black"></div>
                <div className="absolute -rotate-45 -left-[1px] -top-1 w-[10px] h-[0.5px] bg-black"></div>
              </div>
            </div>
            <div className="flex flex-col text-center gap-1">
              <h3 className="text-xl font-bold">{toCity}</h3>
              <p className="text-sm text-gray-600">{arrivalTime ? convertToReadableTime(arrivalTime) : '---'}</p>
            </div>
          </div>
          <div className="h-[1px] w-full my-4 bg-slate-200" />
          <div className="space-y-2">
            <div className="flex gap-2">
              <strong>المسار:</strong>
              <p>{booking.trip?.planned_route_name || 'غير محدد'}</p>
            </div>
            <div className="flex gap-2">
              <strong>تاريخ الرحلة:</strong>
              <p>{booking.trip?.journey_date || 'غير محدد'}</p>
            </div>
            <div className="flex gap-2">
              <strong>نوع الرحلة:</strong>
              <p>{booking.trip?.trip_type === 'scheduled' ? 'مجدولة' : 'مرنة'}</p>
            </div>
          </div>
        </section>

        {booking.trip?.bus && (
          <section className="bg-white shadow-lg rounded-xl p-6 mb-4">
            <h2 className="text-lg font-bold mb-4">معلومات الباص</h2>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">باص: {booking.trip.driver?.operator?.name || 'غير محدد'}</h3>
              {booking.trip.driver?.driver_rating && (
                <div className={`flex justify-center items-center rounded-xl px-2 py-1 ${
                  Number(booking.trip.driver.driver_rating) >= 3.5 ? 'bg-green-500' : 'bg-orange-400'
                }`}>
                  <span className="text-white font-black pr-1">
                    {Number(booking.trip.driver.driver_rating).toFixed(1)}
                  </span>
                  <StarIcon width={20} height={20} />
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {booking.trip.bus.amenities && Object.entries(booking.trip.bus.amenities).map(([key, value]: [string, any]) => (
                value === 'true' && (
                  <div key={key} className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                    <span>{key === 'ac' ? 'مكيف' : key === 'wifi' ? 'واي فاي' : key === 'charging' ? 'شحن' : key}</span>
                    <GreenCheckIcon width={15} height={15} />
                  </div>
                )
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <strong>نوع الباص:</strong>
                <p>{booking.trip.bus.bus_type === 'general' ? 'عام' : booking.trip.bus.bus_type}</p>
              </div>
              <div className="flex gap-2">
                <strong>رقم الباص:</strong>
                <p>{booking.trip.bus.bus_number}</p>
              </div>
              <div className="flex gap-2">
                <strong>السعة:</strong>
                <p>{booking.trip.bus.capacity} مقعد</p>
              </div>
              <div className="flex gap-2">
                <strong>السائق:</strong>
                <p>{booking.trip.driver?.driver_name || 'غير محدد'}</p>
              </div>
            </div>
          </section>
        )}

        {booking.passengers && booking.passengers.length > 0 && (
          <section className="bg-white shadow-lg rounded-xl p-6 mb-4">
            <h2 className="text-lg font-bold mb-4">الركاب ({booking.passengers.length})</h2>
            <div className="space-y-3">
              {booking.passengers.map((passenger: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{passenger.name}</p>
                    <p className="text-sm text-gray-600">{passenger.email}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>{passenger.age ? `${passenger.age} سنة` : ''}</p>
                    <p>{passenger.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">معلومات الدفع</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">طريقة الدفع:</span>
              <span className="font-semibold">{paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">حالة الدفع:</span>
              <span className={`font-semibold ${booking.is_paid ? 'text-green-600' : 'text-orange-600'}`}>
                {booking.is_paid ? 'مدفوع' : 'غير مدفوع'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">وقت الحجز:</span>
              <span className="font-semibold">
                {new Date(booking.booking_time).toLocaleString('en-US')}
              </span>
            </div>
            <div className="h-[1px] w-full my-3 bg-slate-200" />
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">الإجمالي:</span>
              <span className="text-2xl font-bold text-brand-primary">{booking.total_fare} ريال</span>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
