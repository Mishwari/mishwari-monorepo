import React, { useEffect, useState } from 'react';
import { PencilSquareIcon, UserIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import useAuth from '@/hooks/useAuth';
import SideNav from '@/layouts/SideNav';
import { AppState } from '@/store/store';
import ProfileForm from '@/components/ProfileForm';
import { performRegister } from '@/store/actions/mobileAuthActions';
import { Profile } from '@/types/profileDetails';
import { Button } from '@mishwari/ui-web';

function index() {
  useAuth(true);
  const profile = useSelector((state: AppState) => state.profile);
  const router = useRouter();
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState<boolean>(false);
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
    if (profile) {
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



  return (
    <main className='h-full flex flex-col'>
      <SideNav>
        <section className='max-w-2xl px-4 md:px-6 py-6'>
          <div className='flex justify-between items-center mb-6'>
            <div className='flex gap-3 items-center'>
              <UserIcon className='w-6 h-6 text-brand-primary' />
              <h1 className='text-xl font-bold text-brand-text-dark'>المعلومات الشخصية</h1>
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
        </section>
      </SideNav>
    </main>
  );
}

export default index;
