import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '@/store/store';
import { Button, Input } from '@mishwari/ui-web';
import { authApi } from '@mishwari/api';
import { setProfile } from '@/store/slices/authSlice';
import { toast } from 'react-toastify';

export default function CompleteInvitedDriverProfile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { profile } = useSelector((state: AppState) => state.auth);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [operatorName, setOperatorName] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    national_id: '',
    driver_license: ''
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Fetch profile to get invitation code
    authApi.getMe()
      .then(response => {
        const profileData = response.data;
        const code = profileData.pending_invitation_code;
        
        if (!code) {
          toast.error('لم يتم العثور على دعوة');
          router.push('/login');
          return;
        }
        
        setInviteCode(code);
        
        // Validate invitation to get operator name
        return authApi.validateInvite(code);
      })
      .then(response => {
        if (response) {
          console.log('[JOIN COMPLETE] Invitation validated:', response.data);
          setOperatorName(response.data.operator_name);
          setPageLoading(false);
        }
      })
      .catch((error) => {
        console.error('[JOIN COMPLETE] Error:', error?.response?.data);
        toast.error('فشل تحميل معلومات الدعوة');
        router.push('/login');
      });
  }, [router]);

  if (pageLoading) {
    return (
      <div className='w-full min-h-screen bg-white flex justify-center items-center'>
        <p className='text-gray-600'>جاري التحميل...</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!inviteCode) {
      toast.error('رمز الدعوة غير موجود');
      return;
    }
    
    try {
      console.log('[JOIN COMPLETE] Accepting invitation:', { inviteCode, formData });
      const acceptResponse = await authApi.acceptInvite({
        invite_code: inviteCode,
        ...formData
      });
      console.log('[JOIN COMPLETE] Invitation accepted:', acceptResponse.data);
      
      // Fetch updated profile
      const profileResponse = await authApi.getMe();
      console.log('[JOIN COMPLETE] Profile fetched:', profileResponse.data);
      dispatch(setProfile(profileResponse.data));
      
      toast.success('تم الانضمام بنجاح!');
      
      // Redirect to dashboard
      await new Promise(resolve => setTimeout(resolve, 500));
      await router.push('/');
    } catch (error: any) {
      console.error('[JOIN COMPLETE] Error:', error?.response?.data || error.message);
      toast.error(error?.response?.data?.error || 'فشل قبول الدعوة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full min-h-screen bg-white flex justify-center items-center'>
      <div className='flex flex-col w-full max-w-md px-6 py-8 border border-gray-200 rounded-xl bg-gray-100'>
        <h1 className='text-2xl font-bold text-center mb-2'>أكمل معلوماتك</h1>
        <p className='text-center text-gray-600 mb-6'>
          انضممت إلى {operatorName || 'الشركة'}
        </p>
        
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              الاسم الكامل *
            </label>
            <Input
              type='text'
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              placeholder='أدخل اسمك الكامل'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              البريد الإلكتروني
            </label>
            <Input
              type='email'
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              dir='ltr'
              placeholder='example@email.com'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              رقم الهوية الوطنية
            </label>
            <Input
              type='text'
              value={formData.national_id}
              onChange={(e) => setFormData({ ...formData, national_id: e.target.value })}
              placeholder='أدخل رقم الهوية'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              رقم رخصة القيادة
            </label>
            <Input
              type='text'
              value={formData.driver_license}
              onChange={(e) => setFormData({ ...formData, driver_license: e.target.value })}
              placeholder='أدخل رقم الرخصة'
            />
          </div>

          <Button 
            type='submit' 
            disabled={loading || !formData.full_name} 
            className='w-full'
          >
            {loading ? 'جاري الحفظ...' : 'حفظ'}
          </Button>
        </form>
      </div>
    </div>
  );
}
