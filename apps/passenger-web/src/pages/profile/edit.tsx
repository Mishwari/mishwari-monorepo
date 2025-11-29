import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { performRegister } from '@/store/actions/mobileAuthActions';
import { useRouter } from 'next/router';
import { AppState } from '../../store/store';
import ProfileForm from '@/components/ProfileForm';
import PageHeader from '@/layouts/PageHeader';
import { Profile } from '@/types/profileDetails';

interface UserDataObject {
  username: string;
  full_name: string;
  email: string;
  age: string;
  gender: string;
}

function CompleteProfile() {
  const profile = useSelector((state: AppState) => state.profile);
  const authState = useSelector((state: AppState) => state.auth);

  const router = useRouter();
  const mobileNumber = useSelector(
    (state: AppState) => state.mobileAuth.number
  );
  const [otpCode, setOtpCode] = useState<string>('');

  const [profileData, setProfileData] = useState<Profile>({
    user: {
      id: null,
      email: '',
      username: '', // Auto-populated from backend
      first_name: '',
      last_name: '',
    },
    gender: 'male',
    full_name: '',
    birth_date: '',
    address: '',
  });

  useEffect(() => {
    if (profile && profile.user) {
      setProfileData({
        user: {
          id: profile.user.id,
          email: profile.user.email,
          username: profile.user.username, // Already set from backend
          first_name: profile.user.first_name,
          last_name: profile.user.last_name,
        },
        gender: profile.gender,
        full_name: profile.full_name,
        birth_date: profile.birth_date,
        address: profile.address,
      });
    }
  }, [profile]);

  // useEffect(() => {
  //     if (authState.status !== 'partial', !authState.isAuthenticated ) {
  //         router.push('/login');
  //     }
  // }, [authState.isAuthenticated, router]);

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

  //   useEffect(() => {
  //     if (!mobileNumber) {
  //       router.push('/login'); // Redirect to the home page
  //     }
  //   }, [mobileNumber, router]);

  const dispatch = useDispatch();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // if(mobileNumber && otpCode) {

    dispatch(performRegister(profileData, router) as any);
    // }
  };

  return (
    <div className='flex  flex-col  h-screen sm:h-auto sm:border border-blue-200 sm:rounded-xl bg-slate-50 '>
      <PageHeader title='تعديل معلوماتك' />
      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <ProfileForm
          profileData={profileData}
          updateProfileData={updateProfileData}
          handleSubmit={handleSubmit}
        />
      </div>
      <div className='flex-shrink-0 mb-10 flex underline justify-center'>
        الغاء
      </div>
    </div>
  );
}

export default CompleteProfile;
