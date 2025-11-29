import React from 'react';
import { Input, Button, ToggleSwitch } from '@mishwari/ui-web';
import { Profile } from '@/types/profileDetails';
import { CheckIcon } from '@heroicons/react/24/outline';
import DateInput from './DateInput';

interface ProfileDataProps {
  profileData: Profile;
  updateProfileData: (name: string, value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isDisabled?: boolean;
}

const ProfileForm: React.FC<ProfileDataProps> = ({
  profileData,
  isDisabled = false,
  updateProfileData,
  handleSubmit,
}) => {

  return (
    <form
      className='space-y-6'
      onSubmit={handleSubmit}>
      <div className='space-y-5'>
        <div>
          <label className='text-sm font-medium text-gray-700 block mb-2'>الاسم الكامل</label>
          <Input
            value={profileData.full_name}
            onChange={(e) => updateProfileData('full_name', e.target.value)}
            placeholder={isDisabled ? '(لا يوجد)' : 'ادخل الاسم الكامل'}
            readOnly={isDisabled}
            className='w-full'
          />
        </div>

        <div>
          <label className='text-sm font-medium text-gray-700 block mb-2'>البريد الإلكتروني</label>
          <Input
            type='email'
            value={profileData.user.email}
            onChange={(e) => updateProfileData('user.email', e.target.value)}
            placeholder={isDisabled ? '(لا يوجد)' : 'ادخل البريد الإلكتروني'}
            readOnly={isDisabled}
            className='w-full'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='text-sm font-medium text-gray-700 block mb-2'>تاريخ الميلاد</label>
            <DateInput
              value={profileData.birth_date}
              onChange={(value) => updateProfileData('birth_date', value)}
              disabled={isDisabled}
              placeholder='DD/MM/YYYY'
            />
          </div>
          <div>
            <label className='text-sm font-medium text-gray-700 block mb-2'>الجنس</label>
            <ToggleSwitch
              value={profileData.gender}
              onChange={(value: string) => updateProfileData('gender', value)}
              options={[
                { value: 'male', label: 'ذكر' },
                { value: 'female', label: 'أنثى' },
              ]}
              disabled={isDisabled}
            />
          </div>
        </div>
      </div>

      {!isDisabled && (
        <div className='flex justify-end gap-3 pt-6 border-t border-gray-200'>
          <Button
            type='submit'
            variant='default'
            size='default'
            className='flex gap-2 items-center'>
            <CheckIcon className='w-4 h-4' />
            حفظ التغييرات
          </Button>
        </div>
      )}
    </form>
  );
};

export default ProfileForm;
