import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { resetAuthState } from '@/store/slices/authSlice';

const useLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const performLogout = async () => {
    const waitingLogout = toast.info('جاري تسجيل الخروج...', { autoClose: false });

    try {
      // Clear all auth-related localStorage items
      localStorage.removeItem('jwt');
      localStorage.removeItem('persist:driver-web');
      
      // Clear any other auth-related keys
      Object.keys(localStorage).forEach(key => {
        if (key.includes('auth') || key.includes('token') || key.includes('user')) {
          localStorage.removeItem(key);
        }
      });

      // Reset auth state
      dispatch(resetAuthState());

      // Redirect to the login page
      await router.push('/login');

      // Dismiss the loading toast and show success message
      toast.dismiss(waitingLogout);
      toast.success('تم تسجيل الخروج بنجاح', {
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch (error) {
      // Dismiss loading toast and show error message if any error occurs
      toast.dismiss(waitingLogout);
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  };

  return performLogout;
};

export default useLogout;
