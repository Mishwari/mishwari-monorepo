import { CalendarDaysIcon, CreditCardIcon, UsersIcon, ClockIcon, XCircleIcon, StarIcon } from '@heroicons/react/24/outline';
import { Booking } from '@/types/booking';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { convertToReadableTime } from '@mishwari/utils';
import { useCancelBooking } from '@mishwari/ui-primitives';
import { ConfirmDialog } from '@mishwari/ui-web';
import ReviewModal from './ReviewModal';

interface MiniTicketProps {
  booking: Booking;
  onReviewSuccess?: () => void;
}

const statusConfig = {
  active: { label: 'نشط', bg: 'bg-green-100', text: 'text-green-700' },
  confirmed: { label: 'مؤكد', bg: 'bg-blue-100', text: 'text-blue-700' },
  completed: { label: 'مكتمل', bg: 'bg-gray-100', text: 'text-gray-700' },
  cancelled: { label: 'ملغي', bg: 'bg-red-100', text: 'text-red-700' },
  pending: { label: 'قيد الانتظار', bg: 'bg-orange-100', text: 'text-orange-700' },
};

const paymentMethodLabels = {
  cash: 'نقدي',
  wallet: 'محفظة',
  stripe: 'بطاقة',
};

function MiniTicket({ booking, onReviewSuccess }: MiniTicketProps) {
  const router = useRouter();
  const [localBooking, setLocalBooking] = useState(booking);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const { requestCancel, confirmCancel, cancelRequest, cancelling, showConfirm } = useCancelBooking({
    onSuccess: () => setLocalBooking({ ...localBooking, status: 'cancelled' })
  });
  const status = statusConfig[localBooking.status as keyof typeof statusConfig] || statusConfig.pending;
  
  // Debug logging
  console.log('Booking status:', localBooking.status);
  console.log('Has review:', !!localBooking.review);
  console.log('Show review button:', localBooking.status === 'completed' && !localBooking.review);
  const fromCity = localBooking.from_stop?.city?.city || localBooking.trip?.from_city?.city;
  const toCity = localBooking.to_stop?.city?.city || localBooking.trip?.to_city?.city;
  const fare = localBooking.total_fare || localBooking.trip?.price;
  const departureTime = localBooking.from_stop?.planned_departure || localBooking.trip?.departure_time;
  const departureDate = departureTime
    ? new Date(departureTime).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'غير محدد';
  const departureTimeFormatted = departureTime ? convertToReadableTime(departureTime) : '';
  const paymentMethod = paymentMethodLabels[localBooking.payment_method as keyof typeof paymentMethodLabels] || localBooking.payment_method;

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    requestCancel(localBooking.id);
  };

  const handleReviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReviewModalOpen(true);
  };

  const handleReviewSuccess = () => {
    setLocalBooking({ ...localBooking, review: { id: 0, booking: localBooking.id, overall_rating: 0, bus_condition_rating: 0, driver_rating: 0, created_at: '' } as any });
    onReviewSuccess?.();
  };

  return (
    <>
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
            <span>{localBooking.passengers?.length || 0} راكب</span>
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
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
              {status.label}
            </span>
            {localBooking.status === 'completed' && localBooking.review && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1">
                <StarIcon className="h-4 w-4" />
                مُقيّم
              </span>
            )}
            {localBooking.status === 'completed' && !localBooking.review && (
              <button
                onClick={handleReviewClick}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 hover:bg-yellow-200 flex items-center gap-1"
              >
                <StarIcon className="h-4 w-4" />
                تقييم
              </button>
            )}
            {localBooking.status !== 'cancelled' && localBooking.status !== 'completed' && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 flex items-center gap-1"
              >
                <XCircleIcon className="h-4 w-4" />
                {cancelling ? 'جاري الإلغاء...' : 'إلغاء'}
              </button>
            )}
          </div>
        </div>
        </div>
      </div>
      
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={cancelRequest}
        onConfirm={confirmCancel}
        title="إلغاء الحجز"
        description="هل أنت متأكد من إلغاء هذا الحجز؟"
        confirmText="إلغاء"
        cancelText="رجوع"
        variant="destructive"
      />

      <ReviewModal
        booking={localBooking}
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSuccess={handleReviewSuccess}
      />
    </>
  );
}

export default MiniTicket;
