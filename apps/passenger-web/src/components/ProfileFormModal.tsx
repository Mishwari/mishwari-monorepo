import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { performRegister } from '@/store/actions/mobileAuthActions';
import { useRouter } from 'next/router';
import { XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import ProfileForm from './ProfileForm';
import { Profile } from '@/types/profileDetails';

interface ProfileFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: { name?: string; phone?: string; email?: string };
}

export default function ProfileFormModal({ isOpen, onClose, initialData }: ProfileFormModalProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [profileData, setProfileData] = useState<Profile>({
    user: {
      id: null,
      email: initialData?.email || '',
      username: '', // Will be auto-set from mobile number
      first_name: '',
      last_name: '',
    },
    gender: 'male',
    full_name: initialData?.name || '',
    birth_date: '',
    address: '',
    phone: initialData?.phone || '',
  });

  React.useEffect(() => {
    if (isOpen && initialData) {
      setProfileData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          email: initialData.email || prev.user.email,
        },
        full_name: initialData.name || prev.full_name,
        phone: initialData.phone || prev.phone,
      }));
    }
  }, [isOpen, initialData]);

  const updateProfileData = (path: string, value: any) => {
    setProfileData((prev) => {
      const keys = path.split('.');
      let updatedData = { ...prev } as any;
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await dispatch(performRegister(profileData, router) as any);
    await new Promise(resolve => setTimeout(resolve, 100));
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className='fixed inset-0 z-[550] flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={onClose} />
      <div className='bg-white w-full max-w-md rounded-3xl p-6 relative shadow-2xl overflow-y-auto' style={{ maxHeight: 'calc(100vh - 2rem)', zIndex: 560 }}>
        <button
          onClick={onClose}
          className='absolute top-4 left-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors'>
          <XMarkIcon className='w-5 h-5 text-slate-500' />
        </button>

        <div className='text-center mb-6'>
          <div className='w-12 h-12 bg-[#e6f2f7] rounded-full flex items-center justify-center mx-auto mb-3 text-[#005687]'>
            <UserCircleIcon className='w-6 h-6' />
          </div>
          <h2 className='text-2xl font-black text-[#042f40]'>أكمل معلوماتك</h2>
          <p className='text-slate-500 text-sm mt-1'>قم بإدخال معلوماتك الشخصية</p>
        </div>

        <ProfileForm
          profileData={profileData}
          updateProfileData={updateProfileData}
          handleSubmit={handleSubmit}
        />

        <div className='mt-4 text-center'>
          <button
            onClick={onClose}
            className='text-sm text-slate-600 hover:text-slate-800 font-medium'>
            تخطي
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
