import React, { useEffect, useState } from 'react';
import {
  PencilSquareIcon,
  UserIcon,
  XMarkIcon,
  CheckIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import useAuth from '@/hooks/useAuth';
import MainLayout from '@/layouts/MainLayout';
import { AppState } from '@/store/store';
import ProfileForm from '@/components/ProfileForm';
import { performRegister } from '@/store/actions/mobileAuthActions';
import { Profile } from '@/types/profileDetails';
import { Button, ChangeMobileModal } from '@mishwari/ui-web';
import { useProfileManager } from '@/hooks/useProfileManager';
import { authApi } from '@mishwari/api';
import { toast } from 'react-toastify';

function index() {
  useAuth(true);
  const profile = useSelector((state: AppState) => state.profile);
  const { fetchProfile, loading } = useProfileManager();
  const router = useRouter();
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showChangeMobileModal, setShowChangeMobileModal] = useState(false);
  const [profileData, setProfileData] = useState<Profile>({
    user: {
      id: null,
      email: '',
      username: '',
      first_name: '',
      last_name: '',
    },
    gender: 'male',
    full_name: '',
    birth_date: '',
    address: '',
  });

  useEffect(() => {
    // Only fetch if user is authenticated
    if (profile?.user?.id) {
      return; // Profile already loaded
    }
    fetchProfile().catch(err => {
      // Silently handle errors - user might not be logged in
      console.log('Profile not loaded:', err.message);
    });
  }, [fetchProfile]);

  useEffect(() => {
    if (profile && profile.user) {
      setProfileData({
        user: {
          id: profile.user.id,
          email: profile.user.email || '',
          username: profile.user.username,
          first_name: profile.user.first_name,
          last_name: profile.user.last_name,
        },
        gender: profile.gender,
        full_name: profile.full_name,
        birth_date: profile.birth_date || ' ',
        address: profile.address,
      });
    }
  }, [profile]);
  const updateProfileData = (path: string, value: any) => {
    setProfileData((prev) => {
      const keys = path.split('.');
      let updatedData = { ...prev } as any; // Allow dynamic indexing

      let current = updatedData;
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = value;
        } else {
          current[key] = { ...current[key] };
          current = current[key];
        }
      });

      return updatedData;
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // if(mobileNumber && otpCode) {

    await dispatch(performRegister(profileData, router) as any);
    setIsEditing(false);

    // }
  };

  if (loading && !profile?.user) {
    return (
      <main className='h-full flex flex-col'>
        <MainLayout>
          <div className='flex justify-center items-center h-64'>
            <div className='text-gray-600'>جاري التحميل...</div>
          </div>
        </MainLayout>
      </main>
    );
  }

  if (!profile?.user) {
    return (
      <main className='h-full flex flex-col'>
        <MainLayout>
          <div className='flex justify-center items-center h-64'>
            <div className='text-gray-600'>لم يتم تحميل الملف الشخصي</div>
          </div>
        </MainLayout>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-light'>
      <MainLayout>
        <section className='max-w-2xl mx-auto px-4 md:px-6 py-6'>
          <div className='flex justify-between items-center mb-6'>
            <div className='flex gap-3 items-center'>
              <UserIcon className='w-6 h-6 text-primary' />
              <h1 className='text-xl font-bold'>
                المعلومات الشخصية
              </h1>
            </div>
            {!isEditing ? (
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setIsEditing(true)}
                className='flex gap-2 items-center'>
                <PencilSquareIcon className='w-4 h-4' />
                تعديل
              </Button>
            ) : (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => setIsEditing(false)}
                className='flex gap-2 items-center text-gray-600 hover:text-red-500'>
                <XMarkIcon className='w-4 h-4' />
                إلغاء
              </Button>
            )}
          </div>
          <ProfileForm
            profileData={profileData}
            updateProfileData={updateProfileData}
            handleSubmit={handleSubmit}
            isDisabled={!isEditing}
          />

          <div className='pt-4 mt-6 border-t border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <span className='text-gray-600'>رقم الجوال:</span>
                <span className='font-medium mr-2' dir='ltr'>+{profile.mobile_number}</span>
              </div>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => setShowChangeMobileModal(true)}
                className='flex gap-2 items-center text-[#005687] hover:text-[#004a73]'>
                <DevicePhoneMobileIcon className='w-4 h-4' />
                تغيير
              </Button>
            </div>
          </div>
        </section>

        <ChangeMobileModal
          isOpen={showChangeMobileModal}
          onClose={() => setShowChangeMobileModal(false)}
          currentMobile={profile.mobile_number}
          requirePassword={false}
          onRequestOtp={async (mobile) => {
            try {
              await authApi.requestOtp({ phone: mobile });
              toast.success('تم إرسال رمز التحقق');
            } catch (error: any) {
              toast.error(error.response?.data?.error || 'فشل إرسال رمز التحقق');
              throw error;
            }
          }}
          onSubmit={async (data) => {
            try {
              await authApi.changeMobile({
                new_mobile: data.newMobile,
                otp_code: data.otpCode,
                ...(data.firebaseToken && { firebase_token: data.firebaseToken })
              });
              toast.success('تم تحديث رقم الجوال بنجاح');
              await fetchProfile();
            } catch (error: any) {
              toast.error(error.response?.data?.error || 'فشل تحديث رقم الجوال');
              throw error;
            }
          }}
        />
      </MainLayout>
    </main>
  );
}

export default index;
