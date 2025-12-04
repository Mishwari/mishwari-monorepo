import { useState } from 'react';
import { bookingsApi } from '@mishwari/api';
import { toast } from 'react-toastify';

export interface UseCancelBookingOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export function useCancelBooking(options?: UseCancelBookingOptions) {
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingBookingId, setPendingBookingId] = useState<number | null>(null);

  const requestCancel = (bookingId: number) => {
    setPendingBookingId(bookingId);
    setShowConfirm(true);
  };

  const confirmCancel = async () => {
    if (!pendingBookingId) return false;

    setCancelling(true);
    setShowConfirm(false);
    
    try {
      await bookingsApi.cancel(pendingBookingId);
      
      toast.success('تم إلغاء الحجز بنجاح', { autoClose: 2000 });
      
      if (options?.onSuccess) {
        options.onSuccess();
      }
      
      return true;
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'فشل إلغاء الحجز';
      
      toast.error(errorMsg, { autoClose: 3000 });
      
      if (options?.onError) {
        options.onError(error);
      }
      
      return false;
    } finally {
      setCancelling(false);
      setPendingBookingId(null);
    }
  };

  const cancelRequest = () => {
    setShowConfirm(false);
    setPendingBookingId(null);
  };

  return { 
    requestCancel, 
    confirmCancel, 
    cancelRequest,
    cancelling, 
    showConfirm 
  };
}
