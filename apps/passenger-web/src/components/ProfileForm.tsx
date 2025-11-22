import React, { useState } from 'react';
import { Input, Button, ToggleSwitch, DatePicker } from '@mishwari/ui-web';
import { Profile } from '@/types/profileDetails';
import { CheckIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (!profileData.birth_date || profileData.birth_date === '') return new Date();
    const date = new Date(profileData.birth_date);
    return isNaN(date.getTime()) ? new Date() : date;
  });

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    updateProfileData('birth_date', format(date, 'yyyy-MM-dd'));
    setShowDatePicker(false);
  };

  return (
    <form
      className='space-y-6'
      onSubmit={handleSubmit}>
      <div className='space-y-5'>
        <div>
          <label className='text-sm font-medium text-gray-700 block mb-2'>اسم المستخدم</label>
          <Input
            value={profileData.user.username}
            onChange={(e) => updateProfileData('user.username', e.target.value)}
            placeholder={isDisabled ? '(لا يوجد)' : 'ادخل اسم المستخدم'}
            readOnly={isDisabled}
            className='w-full'
          />
        </div>

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
            <div className="relative">
              <button
                type="button"
                onClick={() => !isDisabled && setShowDatePicker(!showDatePicker)}
                disabled={isDisabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-right"
              >
                <CalendarDaysIcon className="w-5 h-5 text-brand-primary" />
                <span className="text-sm">
                  {(() => {
                    if (!profileData.birth_date || profileData.birth_date === '') return 'اختر تاريخ الميلاد';
                    const date = new Date(profileData.birth_date);
                    if (isNaN(date.getTime())) return 'اختر تاريخ الميلاد';
                    return format(date, 'd MMMM yyyy', { locale: require('date-fns/locale/ar').ar });
                  })()}
                </span>
              </button>
              {showDatePicker && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowDatePicker(false)} />
                  <div className="absolute top-full mt-2 left-0 z-50">
                    <DatePicker
                      selectedDate={selectedDate}
                      onDateSelect={handleDateSelect}
                      minDate={new Date(1900, 0, 1)}
                      showMonthYearPicker={true}
                    />
                  </div>
                </>
              )}
            </div>
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
