import React, { useState } from 'react';
import SwitchSlide from './SwitchSlide';
import TextInput from './TextInput';
import { Profile } from '@/types/profileDetails';

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
    <div>
      <form
        className='space-y-6'
        onSubmit={handleSubmit}>
        <TextInput
          value={profileData.user.username}
          setValue={(value: string) =>
            updateProfileData('user.username', value)
          }
          title='اسم المستخدم  '
          placeholder='ادخل اسم المستخدم  '
          isDisabled={isDisabled}
        />

        <TextInput
          value={profileData.full_name}
          setValue={(value: string) => updateProfileData('full_name', value)}
          title='اسمك الكامل'
          placeholder='ادخل اسمك الكامل'
          isDisabled={isDisabled}
        />

        <TextInput
          value={profileData.user.email}
          setValue={(value: string) => updateProfileData('user.email', value)}
          title='الايميل'
          placeholder='ادخل الايميل'
          isDisabled={isDisabled}
        />

        <div className='flex py-4 justify-start gap-4 items-center '>
          <div className='w-1/4'>
            <TextInput
              value={profileData?.birth_date}
              setValue={(value: string) =>
                updateProfileData('birth_date', value)
              }
              title='العمر'
              placeholder=''
              type='number'
              isDisabled={isDisabled}
            />
          </div>
          <div className='w-1/2 mx-auto mt-auto '>
            <SwitchSlide
              initial={profileData.gender}
              setInitial={(value: string) => updateProfileData('gender', value)}
              isDisabled={isDisabled}
            />
          </div>
        </div>

        <div
          className={`${
            isDisabled ? ' hidden ' : ' '
          } flex-shrink-0 px-4 mt-auto flex justify-center`}>
          <button
            type='submit'
            className=' inline-flex justify-center py-2 w-1/3 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-[#005687] hover:bg-[#148ace] focus:outline-none '>
            حفظ
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
