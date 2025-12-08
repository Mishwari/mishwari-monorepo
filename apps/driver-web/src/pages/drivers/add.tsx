import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button, Input, PhoneInput, countries } from '@mishwari/ui-web';
import { driversApi } from '@mishwari/api';
import { toast } from 'react-toastify';


export default function AddDriverPage() {
  const router = useRouter();
  const { profile } = useSelector((state: AppState) => state.auth);
  const nestedProfile = (profile as any)?.profile;
  const operatorName = (profile as any)?.operator_name || nestedProfile?.full_name || 'أسطولنا';
  const [mobileNumber, setMobileNumber] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerateInvite = async () => {
    setLoading(true);
    try {
      const response = await driversApi.generateInvite(mobileNumber);
      const link = `${window.location.origin}/join/${response.invite_code}`;
      setInviteLink(link);
      setShowInviteModal(true);
      toast.success('تم إنشاء دعوة السائق!');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'فشل إنشاء الدعوة');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success('تم نسخ الرابط');
  };

  const handleShareWhatsApp = () => {
    const message = `مرحباً! أنت مدعو للانضمام إلى ${operatorName} كسائق في يلا باص.\n\nللانضمام، اضغط على الرابط أدناه:\n${inviteLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
  };

  const handleShareSMS = () => {
    const message = `مرحباً! أنت مدعو للانضمام إلى ${operatorName} كسائق في يلا باص. ${inviteLink}`;
    window.open(`sms:${mobileNumber}?body=${encodeURIComponent(message)}`);
  };

  return (
    <DashboardLayout>
      <div className='max-w-2xl mx-auto'>
        <div className='bg-white rounded-lg shadow p-6'>
          <h1 className='text-2xl font-bold text-gray-900 mb-6'>
            دعوة سائق جديد
          </h1>
          
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                رقم جوال السائق *
              </label>
              <PhoneInput
                value={mobileNumber}
                onChange={setMobileNumber}
                countries={countries}
              />
            </div>

            <div className='flex gap-4 pt-4'>
              <Button 
                variant='default' 
                onClick={handleGenerateInvite} 
                disabled={!mobileNumber || loading} 
                className='flex-1'
              >
                {loading ? 'جاري الإنشاء...' : 'إنشاء دعوة'}
              </Button>
              <Button variant='outline' onClick={() => router.push('/drivers')} disabled={loading} className='flex-1'>
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showInviteModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <h3 className='text-xl font-bold mb-4'>دعوة السائق</h3>
            <p className='text-gray-600 mb-4'>شارك هذا الرابط مع السائق:</p>
            <Input value={inviteLink} readOnly className='mb-4' dir='ltr' />
            <div className='flex flex-col gap-2'>
              <Button onClick={handleCopyLink} className='w-full'>نسخ الرابط</Button>
              <div className='flex gap-2'>
                <Button onClick={handleShareWhatsApp} variant='default' className='flex-1'>
                  مشاركة عبر واتساب
                </Button>
                <Button onClick={handleShareSMS} variant='outline' className='flex-1 md:hidden'>
                  مشاركة عبر SMS
                </Button>
              </div>
            </div>
            <Button 
              variant='outline' 
              onClick={() => {
                setShowInviteModal(false);
                router.push('/drivers');
              }} 
              className='w-full mt-4'
            >
              إغلاق
            </Button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
