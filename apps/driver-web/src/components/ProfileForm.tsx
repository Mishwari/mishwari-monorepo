import React from 'react';
import { Input, Button, ToggleSwitch, DateInput } from '@mishwari/ui-web';
import { CheckIcon } from '@heroicons/react/24/outline';

interface ProfileDataProps {
  profileData: {
    user: {
      id: any;
      email: string;
      username: string;
      first_name: string;
      last_name: string;
    };
    gender: string;
    full_name: string;
    birth_date: string;
    address?: string;
    operator_name?: string;
    operator_contact?: string;
    driver_license?: string;
    national_id?: string;
  };
  updateProfileData: (name: string, value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isDisabled?: boolean;
  showOperatorFields?: boolean;
  showDriverFields?: boolean;
}

const ProfileForm: React.FC<ProfileDataProps> = ({
  profileData,
  isDisabled = false,
  updateProfileData,
  handleSubmit,
  showOperatorFields = false,
  showDriverFields = false,
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

        {showOperatorFields && (
          <>
            <div className='col-span-2 border-t pt-4 mt-2'>
              <h3 className='text-base font-semibold text-gray-800 mb-3'>معلومات الشركة</h3>
            </div>
            <div>
              <label className='text-sm font-medium text-gray-700 block mb-2'>اسم الشركة</label>
              <Input
                value={profileData.operator_name || ''}
                onChange={(e) => updateProfileData('operator_name', e.target.value)}
                placeholder={isDisabled ? '(لا يوجد)' : 'ادخل اسم الشركة'}
                readOnly={isDisabled}
                className='w-full'
              />
            </div>
            <div>
              <label className='text-sm font-medium text-gray-700 block mb-2'>رقم التواصل</label>
              <Input
                value={profileData.operator_contact || ''}
                onChange={(e) => updateProfileData('operator_contact', e.target.value)}
                placeholder={isDisabled ? '(لا يوجد)' : 'ادخل رقم التواصل'}
                readOnly={isDisabled}
                className='w-full'
              />
            </div>
            {showDriverFields && (
              <>
                <div className='col-span-2 border-t pt-4 mt-2'>
                  <h3 className='text-base font-semibold text-gray-800 mb-3'>معلومات السائق</h3>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-700 block mb-2'>رقم الرخصة</label>
                  <Input
                    value={profileData.driver_license || ''}
                    onChange={(e) => updateProfileData('driver_license', e.target.value)}
                    placeholder={isDisabled ? '(لا يوجد)' : 'ادخل رقم الرخصة'}
                    readOnly={isDisabled}
                    className='w-full'
                  />
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-700 block mb-2'>رقم الهوية</label>
                  <Input
                    value={profileData.national_id || ''}
                    onChange={(e) => updateProfileData('national_id', e.target.value)}
                    placeholder={isDisabled ? '(لا يوجد)' : 'ادخل رقم الهوية'}
                    readOnly={isDisabled}
                    className='w-full'
                  />
                </div>
              </>
            )}
          </>
        )}

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
