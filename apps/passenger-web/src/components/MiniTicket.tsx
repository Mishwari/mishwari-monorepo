import { Booking } from '@/types/booking';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { convertToReadableTime } from '@mishwari/utils';
import { useCancelBooking } from '@mishwari/ui-primitives';
import { ConfirmDialog } from '@mishwari/ui-web';
import ReviewModal from './ReviewModal';
import { User, Bus, ArrowRight, CheckCircle2, XCircle, Clock3, AlertCircle, Star } from 'lucide-react';

interface MiniTicketProps {
  booking: Booking;
  onReviewSuccess?: () => void;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'confirmed':
    case 'active':
      return {
        label: 'نشط',
        bg: 'bg-green-50',
        border: 'border-green-100',
        text: 'text-green-700',
        icon: CheckCircle2,
        stripColor: 'bg-green-500',
      };
    case 'completed':
      return {
        label: 'مكتمل',
        bg: 'bg-slate-100',
        border: 'border-slate-200',
        text: 'text-slate-600',
        icon: CheckCircle2,
        stripColor: 'bg-slate-500',
      };
    case 'cancelled':
      return {
        label: 'ملغي',
        bg: 'bg-red-50',
        border: 'border-red-100',
        text: 'text-red-700',
        icon: XCircle,
        stripColor: 'bg-red-500',
      };
    case 'pending':
      return {
        label: 'قيد الانتظار',
        bg: 'bg-orange-50',
        border: 'border-orange-100',
        text: 'text-orange-700',
        icon: Clock3,
        stripColor: 'bg-orange-500',
      };
    default:
      return {
        label: status,
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        text: 'text-slate-600',
        icon: AlertCircle,
        stripColor: 'bg-slate-500',
      };
  }
};



function MiniTicket({ booking, onReviewSuccess }: MiniTicketProps) {
  const router = useRouter();
  const [localBooking, setLocalBooking] = useState(booking);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const { requestCancel, confirmCancel, cancelRequest, cancelling, showConfirm } = useCancelBooking({
    onSuccess: () => setLocalBooking({ ...localBooking, status: 'cancelled' })
  });
  const status = getStatusConfig(localBooking.status);
  const StatusIcon = status.icon;
  

  const fromCity = localBooking.from_stop?.city?.city || localBooking.trip?.from_city?.city;
  const toCity = localBooking.to_stop?.city?.city || localBooking.trip?.to_city?.city;
  const fare = localBooking.total_fare || localBooking.trip?.price;
  const departureTime = localBooking.from_stop?.planned_departure || localBooking.trip?.departure_time;
  const arrivalTime = localBooking.to_stop?.planned_arrival || localBooking.trip?.arrival_time;
  const journeyDate = localBooking.trip?.journey_date;
  const routeName = localBooking.trip?.planned_route_name;
  const formatTime = (isoString: string) => new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

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
      <div className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 relative cursor-pointer">
        <div className={`absolute right-0 top-0 bottom-0 w-1.5 ${status.stripColor}`} />

        <div className="p-5" onClick={() => router.push(`/my_trips/${booking.id}`)}>
          <div className="flex justify-between items-start mb-5 pl-2">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">رقم الحجز</span>
              <span className="font-mono font-bold text-brand text-lg tracking-tight">#{localBooking.id}</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${status.bg} ${status.border} ${status.text}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">{status.label}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6 pl-2">
            <div className="text-right">
              <div className="text-lg font-black text-brand">{fromCity}</div>
              <div className="text-xs font-bold text-slate-400">{departureTime ? formatTime(departureTime) : '---'}</div>
            </div>

            <div className="flex-1 px-4 flex flex-col items-center">
              <div className="text-[10px] font-bold text-brand-primary bg-brand-primary-light px-2 py-0.5 rounded-full mb-1">
                {journeyDate ? formatDate(journeyDate) : '---'}
              </div>
              <div className="w-full flex items-center gap-1 dir-ltr">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 opacity-30" />
                <div className="flex-1 h-0.5 bg-slate-400 opacity-30" />
                <ArrowRight className="w-3 h-3 text-slate-400 opacity-30" />
              </div>
              {routeName && (
                <div className="text-[10px] font-medium text-slate-500 mt-1">
                  {routeName}
                </div>
              )}
            </div>

            <div className="text-left">
              <div className="text-lg font-black text-brand">{toCity}</div>
              <div className="text-xs font-bold text-slate-400">{arrivalTime ? formatTime(arrivalTime) : '---'}</div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 pl-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-bold text-slate-600">{localBooking.passengers?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                  <Bus className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-bold text-slate-600">{localBooking.trip?.bus?.bus_number || 'N/A'}</span>
                </div>
              </div>
              
              <div className="text-lg font-black text-brand-primary">
                {fare?.toLocaleString()} <span className="text-xs font-bold text-slate-400">ريال</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-3 flex gap-2">
          <button
            onClick={() => router.push(`/my_trips/${booking.id}`)}
            className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-brand-primary hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all shadow-sm"
          >
            التفاصيل
          </button>
          {localBooking.status === 'completed' && !localBooking.review && (
            <button
              onClick={handleReviewClick}
              className="flex-1 py-2.5 rounded-xl bg-brand-primary-light text-brand-primary text-xs font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
            >
              <Star className="w-3.5 h-3.5" /> قيّم الرحلة
            </button>
          )}
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
