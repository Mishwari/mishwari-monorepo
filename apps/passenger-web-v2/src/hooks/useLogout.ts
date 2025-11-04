import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { resetAuthState } from '@/store/slices/authSlice'; // Adjust the path

const useLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const performLogout = async () => {
    const waitingLogout = toast.info('جاري تسجيل الخروج...', { autoClose: false });

    try {
      // Clear JWT from localStorage
      localStorage.removeItem('jwt');

      // Reset auth state
      dispatch(resetAuthState());

      // Redirect to the login page
      await router.push('/login');

      // Dismiss the loading toast and show success message
      toast.dismiss(waitingLogout);
      toast.success('تم تسجيل الخروج بنجاح  ', {
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
