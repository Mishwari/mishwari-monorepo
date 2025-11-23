import { addTripDetails, setTripsDetails, updateTripStatus as updateTripStatusSlice, setLoading } from '../slices/tripsSlice';
import { tripsApi, operatorApi } from '@mishwari/api';
import { toast } from 'react-toastify';

export const fetchTripsDetails = (token: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const trips = await tripsApi.list();
    dispatch(setTripsDetails(trips));
  } catch (error: any) {
    console.error('Error fetching trips:', error.message);
    dispatch(setLoading(false));
  }
};

export const createTrip = (tripData: object, token: string) => async (dispatch: any) => {
  const waitingCreateTrip = toast.info('جاري انشاء الرحلة...', {
    autoClose: false,
  });

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  try {
    const [trip] = await Promise.all([
      tripsApi.create(tripData as any),
      delay(1000)
    ]);

    dispatch(addTripDetails(trip));
    
    toast.dismiss(waitingCreateTrip);
    toast.success('تم انشاء الرحلة بنجاح', {
      autoClose: 2000,
      hideProgressBar: true,
    });
  } catch (error) {
    toast.dismiss(waitingCreateTrip);
    toast.error('حدث خطأ اثناء انشاء الرحلة يرجى اعادة المحاولة', {
      autoClose: 2000,
      hideProgressBar: true,
    });
    console.error('Error creating trip:', error);
  }
};

export const changeTripStatus = (id: number, newStatus: string, token: string) => async (dispatch: any) => {
  const messages: Record<string, { waiting: string, success: string, failed: string }> = {
    active: { waiting: 'جاري بدء الرحلة', success: 'تم بدء الرحلة بنجاح', failed: 'فشل بدء الرحلة' },
    completed: { waiting: 'جاري اتمام الرحلة', success: 'تم اتمام الرحلة بنجاح', failed: 'فشل اتمام الرحلة' },
    stopped: { waiting: 'جاري ايقاف الرحلة اضطراريا', success: 'تم ايقاف الرحلة اضطراريا', failed: 'فشل ايقاف الرحلة' },
    cancelled: { waiting: 'جاري الغاء الرحلة', success: 'تم الغاء الرحلة بنجاح', failed: 'فشل الغاء الرحلة' },
  };

  const msg = messages[newStatus] || { waiting: 'جاري اتمام الطلب', success: 'تم اتمام الطلب', failed: 'لم يتم اتمام الطلب' };

  const waitingStatusChange = toast.info(msg.waiting + '...', {
    autoClose: false,
  });

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  try {
    await Promise.all([
      tripsApi.update(id, { status: newStatus } as any),
      delay(1000)
    ]);

    toast.dismiss(waitingStatusChange);
    toast.success(msg.success, {
      autoClose: 2000,
      hideProgressBar: true,
    });

    dispatch(updateTripStatusSlice({ id, newStatus }));
  } catch (error) {
    toast.dismiss(waitingStatusChange);
    toast.error(msg.failed, {
      autoClose: 2000,
      hideProgressBar: true,
    });
    console.error('Error updating trip status:', error);
  }
};
