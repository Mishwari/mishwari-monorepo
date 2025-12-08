import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import { decryptToken } from '@/utils/tokenUtils';
import { convertToReadableTime } from '@mishwari/utils';
import MainLayout from '@/layouts/MainLayout';
import { RatingBadge, ConfirmDialog } from '@mishwari/ui-web';
import { useCancelBooking } from '@mishwari/ui-primitives';
import {
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Check,
  X,
  Star,
  Bus,
  Wifi,
  Wind,
  Zap,
  Tv,
  ChevronRight,
  ArrowRight,
  Printer,
  Download,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  FileText,
  UserCircle,
} from 'lucide-react';
import ReviewModal from '@/components/ReviewModal';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
    case 'active':
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        icon: CheckCircle2,
        label: 'مؤكد',
      };
    case 'completed':
      return {
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        icon: CheckCircle2,
        label: 'مكتمل',
      };
    case 'cancelled':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        icon: XCircle,
        label: 'ملغي',
      };
    case 'pending':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        icon: AlertTriangle,
        label: 'قيد الانتظار',
      };
    default:
      return {
        bg: 'bg-slate-50',
        text: 'text-slate-600',
        icon: AlertTriangle,
        label: status,
      };
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const style = getStatusColor(status);
  const Icon = style.icon;
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-full border ${style.bg} ${style.text} border-opacity-10 border-current`}>
      <Icon className='w-4 h-4' />
      <span className='text-sm font-bold'>{style.label}</span>
    </div>
  );
};

const TripTicket = ({ booking }: { booking: any }) => {
  const trip = booking.trip;
  const fromCity = booking.from_stop?.city?.city || trip?.from_city?.city;
  const toCity = booking.to_stop?.city?.city || trip?.to_city?.city;
  const departureTime =
    booking.from_stop?.planned_departure || trip?.departure_time;
  const arrivalTime = booking.to_stop?.planned_arrival || trip?.arrival_time;

  const formatTime = (isoString: string) =>
    new Date(isoString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  const formatDate = (isoString: string) =>
    new Date(isoString).toLocaleDateString('ar-SA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const calculateDuration = (departure: string, arrival: string): string => {
    const departureDate = new Date(departure);
    const arrivalDate = new Date(arrival);
    const difference = arrivalDate.getTime() - departureDate.getTime();
    const hours = Math.floor(difference / 3600000);
    const minutes = Math.floor((difference % 3600000) / 60000);
    return `${hours}س ${minutes}د`;
  };

  const duration =
    departureTime && arrivalTime
      ? calculateDuration(departureTime, arrivalTime)
      : '---';

  return (
    <div className='bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-6'>
      <div className='bg-brand-primary p-6 text-white relative'>
        <div className='flex justify-between items-start'>
          <div>
            <div className='text-blue-200 text-xs font-bold uppercase tracking-wider mb-1'>
              المشغل
            </div>
            <div className='text-xl font-black'>
              {trip?.driver?.operator?.name || 'غير محدد'}
            </div>
          </div>
          <div className='text-right'>
            <div className='text-blue-200 text-xs font-bold uppercase tracking-wider mb-1'>
              رقم الحجز
            </div>
            <div className='font-mono text-lg font-bold tracking-widest'>
              #{booking.id}
            </div>
          </div>
        </div>

        <div className='relative h-8 w-full my-2'>
          <div className='absolute top-1/2 left-0 w-full border-t-2 border-dashed border-white/20' />
          <div className='absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-6 bg-light rounded-full' />
          <div className='absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 bg-light rounded-full' />
        </div>

        <div className='flex items-center justify-between'>
          <div className='text-left'>
            <div className='text-3xl font-black'>
              {departureTime ? formatTime(departureTime) : '---'}
            </div>
            <div className='text-sm font-medium text-blue-100'>{fromCity}</div>
            <div className='text-xs text-blue-300 mt-1'>
              {departureTime ? formatDate(departureTime) : '---'}
            </div>
          </div>

          <div className='flex flex-col items-center px-4'>
            <div className='bg-brand-primary-dark px-3 py-1 rounded-full text-xs font-bold text-blue-200 mb-2'>
              {duration}
            </div>
            <div className='flex items-center gap-2 opacity-60'>
              <div className='w-2 h-2 bg-white rounded-full' />
              <div className='w-12 h-0.5 bg-white rounded-full' />
              <ArrowRight className='w-4 h-4 text-white rotate-180' />
            </div>
            <div className='text-[10px] text-blue-300 mt-2 Capitalize tracking-wide'>
              {booking.trip.planned_route_name}
            </div>
          </div>

          <div className='text-right'>
            <div className='text-3xl font-black'>
              {arrivalTime ? formatTime(arrivalTime) : '---'}
            </div>
            <div className='text-sm font-medium text-blue-100'>{toCity}</div>
            <div className='text-xs text-blue-300 mt-1'>
              {arrivalTime ? formatDate(arrivalTime) : '---'}
            </div>
          </div>
        </div>
      </div>

      <div className='bg-slate-50 p-4 flex justify-between items-center text-sm border-t border-slate-100'>
        <div className='flex items-center gap-2 text-slate-500'>
          <Bus className='w-4 h-4' />
          <span>
            رقم الباص:{' '}
            <strong className='text-brand'>{trip?.bus?.bus_number}</strong>
          </span>
        </div>
        <div className='flex items-center gap-2 text-slate-500'>
          <FileText className='w-4 h-4' />
          <span>
            المسار:{' '}
            <strong className='text-brand'>
              {trip?.planned_route_name || 'غير محدد'}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({
  title,
  icon: Icon,
  children,
  className = '',
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className='p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50'>
      <div className='w-8 h-8 bg-brand-primary-light text-brand-primary rounded-lg flex items-center justify-center'>
        <Icon className='w-4 h-4' />
      </div>
      <h3 className='font-bold text-brand'>{title}</h3>
    </div>
    <div className='p-5'>{children}</div>
  </div>
);

export default function BookingDetails() {
  const router = useRouter();
  const { bookingId } = router.query;
  const token = useSelector((state: AppState) => state.auth.token);
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const {
    requestCancel,
    confirmCancel,
    cancelRequest,
    cancelling,
    showConfirm,
  } = useCancelBooking({
    onSuccess: () => setBooking({ ...booking, status: 'cancelled' }),
  });

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

  const handleCancelClick = () => {
    if (booking) requestCancel(booking.id);
  };

  const handleReviewSuccess = () => {
    setBooking({ ...booking, review: { id: 0 } });
    setReviewModalOpen(false);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className='flex justify-center items-center min-h-screen'>
          <div className='text-center'>جاري التحميل...</div>
        </div>
      </MainLayout>
    );
  }

  if (!booking) {
    return (
      <MainLayout>
        <div className='flex justify-center items-center min-h-screen'>
          <div className='text-center'>لم يتم العثور على الحجز</div>
        </div>
      </MainLayout>
    );
  }

  const paymentMethodLabels: Record<string, string> = {
    cash: 'دفع نقدي',
    wallet: 'محفظة',
    stripe: 'بطاقة',
  };

  const paymentMethod =
    paymentMethodLabels[booking.payment_method] || booking.payment_method;

  return (
    <MainLayout>
      <div
        className='min-h-screen bg-light font-sans pb-12'
        dir='rtl'>
        <div className='max-w-5xl mx-auto px-4 pt-6 pb-8'>
          <div className='flex items-center justify-between mb-6'>
            <StatusBadge status={booking.status} />
            <div className='flex items-center gap-3'>
              {booking.status !== 'cancelled' &&
                booking.status !== 'completed' && (
                  <button
                    onClick={handleCancelClick}
                    disabled={cancelling}
                    className='flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold text-sm transition-colors disabled:opacity-50'>
                    <XCircle className='w-4 h-4' />
                    {cancelling ? 'جاري الإلغاء...' : 'إلغاء الحجز'}
                  </button>
                )}
              <button
                className='p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors'
                title='طباعة التذكرة'>
                <Printer className='w-5 h-5' />
              </button>
              <button
                className='p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors'
                title='تحميل PDF'>
                <Download className='w-5 h-5' />
              </button>
            </div>
          </div>

          <ConfirmDialog
            open={showConfirm}
            onOpenChange={cancelRequest}
            onConfirm={confirmCancel}
            title='إلغاء الحجز'
            description='هل أنت متأكد من إلغاء هذا الحجز؟'
            confirmText='إلغاء'
            cancelText='رجوع'
            variant='destructive'
          />

          <div className='space-y-6'>
            <TripTicket booking={booking} />

            <InfoCard
              title={`الركاب (${booking.passengers?.length || 0})`}
              icon={User}>
              <div className='space-y-3'>
                {booking.passengers?.map((p: any, idx: number) => (
                  <div
                    key={idx}
                    className='flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400'>
                        <UserCircle className='w-6 h-6' />
                      </div>
                      <div>
                        <div className='font-bold text-brand'>{p.name}</div>
                        <div className='text-xs text-slate-500'>
                          {p.age} سنة • {p.gender === 'male' ? 'ذكر' : 'أنثى'}
                        </div>
                      </div>
                    </div>
                    <div className='text-xs font-bold bg-white px-2 py-1 rounded border border-slate-200 text-slate-500'>
                      مقعد #{p.seat_number}
                    </div>
                  </div>
                ))}
              </div>
            </InfoCard>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <InfoCard
                title='السائق'
                icon={User}>
                <div className='text-center'>
                  <div className='w-16 h-16 bg-slate-100 rounded-full mx-auto mb-3 flex items-center justify-center text-slate-400'>
                    <User className='w-8 h-8' />
                  </div>
                  <div className='font-bold text-lg text-brand'>
                    {booking.trip?.driver?.driver_name || 'غير محدد'}
                  </div>
                  <div className='flex justify-center items-center gap-2 mt-1'>
                    <div className='flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold'>
                      <Star className='w-3 h-3 fill-yellow-700' />{' '}
                      {booking.trip?.driver?.driver_rating || 'N/A'}
                    </div>
                    {booking.trip?.driver?.is_verified && (
                      <span className='text-xs text-green-600 flex items-center gap-0.5 font-medium'>
                        <ShieldCheck className='w-3 h-3' /> موثق
                      </span>
                    )}
                  </div>
                </div>
              </InfoCard>

              <InfoCard
                title='الباص'
                icon={Bus}>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-sm text-slate-500'>النوع</span>
                    <span className='font-bold'>
                      {booking.trip?.bus?.bus_type === 'general'
                        ? 'عام'
                        : booking.trip?.bus?.bus_type}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-slate-500'>الرقم</span>
                    <span className='font-mono bg-slate-100 px-2 rounded text-sm'>
                      {booking.trip?.bus?.bus_number}
                    </span>
                  </div>
                  <div className='pt-2 border-t border-slate-100'>
                    <span className='text-xs text-slate-400 uppercase font-bold mb-2 block'>
                      المميزات
                    </span>
                    <div className='flex gap-2 flex-wrap'>
                      {booking.trip?.bus?.has_ac && (
                        <span className='text-xs bg-brand-primary-light text-brand-primary px-2 py-1 rounded font-bold flex items-center gap-1'>
                          <Wind className='w-3 h-3' /> مكيف
                        </span>
                      )}
                      {booking.trip?.bus?.has_wifi && (
                        <span className='text-xs bg-brand-primary-light text-brand-primary px-2 py-1 rounded font-bold flex items-center gap-1'>
                          <Wifi className='w-3 h-3' /> واي فاي
                        </span>
                      )}
                      {booking.trip?.bus?.has_usb_charging && (
                        <span className='text-xs bg-brand-primary-light text-brand-primary px-2 py-1 rounded font-bold flex items-center gap-1'>
                          <Zap className='w-3 h-3' /> شحن USB
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>

            <InfoCard
              title='تفاصيل الدفع'
              icon={CreditCard}
              className='bg-slate-50/50 border-slate-200'>
              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-slate-500 text-sm'>طريقة الدفع</span>
                  <span className='font-bold text-brand'>{paymentMethod}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-slate-500 text-sm'>حالة الدفع</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      booking.is_paid
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                    {booking.is_paid ? 'مدفوع' : 'غير مدفوع'}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-slate-500 text-sm'>وقت الحجز</span>
                  <span className='font-mono text-xs text-slate-600 dir-ltr'>
                    {new Date(booking.booking_time).toLocaleDateString()}
                  </span>
                </div>

                <div className='h-px w-full bg-slate-200' />

                <div className='flex justify-between items-center'>
                  <span className='text-lg font-bold text-brand'>الإجمالي</span>
                  <span className='text-2xl font-black text-brand-primary'>
                    {booking.total_fare.toLocaleString()}{' '}
                    <span className='text-sm'>ريال</span>
                  </span>
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title='معلومات التواصل'
              icon={Phone}>
              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400'>
                    <User className='w-4 h-4' />
                  </div>
                  <div>
                    <div className='text-xs text-slate-400'>الاسم</div>
                    <div className='font-bold text-sm'>
                      {booking.contact_name}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400'>
                    <Phone className='w-4 h-4' />
                  </div>
                  <div>
                    <div className='text-xs text-slate-400'>الجوال</div>
                    <div className='font-bold text-sm font-mono dir-ltr'>
                      {booking.contact_phone}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400'>
                    <Mail className='w-4 h-4' />
                  </div>
                  <div>
                    <div className='text-xs text-slate-400'>البريد</div>
                    <div className='font-bold text-sm'>
                      {booking.contact_email}
                    </div>
                  </div>
                </div>
              </div>
            </InfoCard>
          </div>

          {booking.status === 'completed' && !booking.review && (
            <section className='bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6 mt-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='bg-yellow-400 rounded-full p-3'>
                    <Star className='h-6 w-6 text-white' />
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-gray-900'>
                      شارك تجربتك
                    </h3>
                    <p className='text-sm text-gray-600'>
                      ساعدنا في تحسين خدماتنا بتقييم هذه الرحلة
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setReviewModalOpen(true)}
                  className='px-6 py-3 bg-brand-primary text-white rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center gap-2'>
                  <Star className='h-5 w-5' />
                  قيّم الآن
                </button>
              </div>
            </section>
          )}

          <ReviewModal
            booking={booking}
            isOpen={reviewModalOpen}
            onClose={() => setReviewModalOpen(false)}
            onSuccess={handleReviewSuccess}
          />
        </div>
      </div>
    </MainLayout>
  );
}
