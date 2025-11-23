import { useEffect, useState } from 'react';
import { UserIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useProfileManager } from '@/hooks/useProfileManager';
import { Button } from '@mishwari/ui-web';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProfileForm from '@/components/ProfileForm';

export default function Profile() {
  const { profile, loading, error, fetchProfile, updateProfile } = useProfileManager();
  const [isEditing, setIsEditing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>({
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
    if (profile?.id) {
      return;
    }
    fetchProfile().catch(err => {
      console.log('Profile not loaded:', err?.message || 'Unknown error');
    });
  }, []);

  useEffect(() => {
    if (profile) {
      setProfileData({
        user: {
          id: profile.user?.id || null,
          email: profile.user?.email || '',
          username: profile.user?.username || '',
          first_name: profile.user?.first_name || '',
          last_name: profile.user?.last_name || '',
        },
        gender: profile.gender || 'male',
        full_name: profile.full_name || '',
        birth_date: profile.birth_date || '',
        address: profile.address || '',
      });
    }
  }, [profile]);

  const updateProfileData = (path: string, value: string) => {
    setProfileData((prev: any) => {
      const keys = path.split('.');
      let updatedData = { ...prev };
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    try {
      const updateData = {
        username: profileData.user.username,
        full_name: profileData.full_name,
        email: profileData.user.email,
        birth_date: profileData.birth_date,
        gender: profileData.gender,
      };
      await updateProfile(updateData);
      await fetchProfile();
      setIsEditing(false);
    } catch (err: any) {
      setSubmitError(err?.message || 'فشل تحديث الملف الشخصي');
      console.log('Failed to update profile:', err?.message);
    }
  };

  if (loading && !profile) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">جاري التحميل...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">لم يتم تحميل الملف الشخصي</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <section className="max-w-2xl px-4 md:px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3 items-center">
            <UserIcon className="w-6 h-6 text-brand-primary" />
            <h1 className="text-xl font-bold text-brand-text-dark">المعلومات الشخصية</h1>
          </div>
          {!isEditing ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex gap-2 items-center"
            >
              <PencilSquareIcon className="w-4 h-4" />
              تعديل
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="flex gap-2 items-center text-gray-600 hover:text-red-500"
            >
              <XMarkIcon className="w-4 h-4" />
              إلغاء
            </Button>
          )}
        </div>

        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}

        <ProfileForm
          profileData={profileData}
          updateProfileData={updateProfileData}
          handleSubmit={handleSubmit}
          isDisabled={!isEditing}
        />

        <div className="pt-4 mt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">رقم الجوال:</span>
              <span className="font-medium mr-2" dir="ltr">+{profile.mobile_number}</span>
            </div>
            <div>
              <span className="text-gray-600">الدور:</span>
              <span className="font-medium mr-2">
                {profile.role === 'operator_admin' ? 'مشغل' : 'سائق'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">حالة التحقق:</span>
              <span className={`font-medium mr-2 ${profile.is_verified ? 'text-green-600' : 'text-yellow-600'}`}>
                {profile.is_verified ? 'موثق' : 'غير موثق'}
              </span>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
