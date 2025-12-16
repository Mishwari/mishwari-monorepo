import { useEffect, useState } from 'react';
import { UserIcon, PencilSquareIcon, XMarkIcon, DevicePhoneMobileIcon, BuildingOfficeIcon, IdentificationIcon, KeyIcon } from '@heroicons/react/24/outline';
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';
import { useProfileManager } from '@/hooks/useProfileManager';
import { Button, ChangeMobileModal, Input, ToggleSwitch, DateInput, MultiSelect } from '@mishwari/ui-web';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { authApi, tripsApi } from '@mishwari/api';
import { toast } from 'react-toastify';
import { CheckIcon } from '@heroicons/react/24/outline';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import { useRouter } from 'next/router';

export default function Profile() {
  const router = useRouter();
  const { profile, loading, fetchProfile, updateProfile, canEditAll } = useProfileManager();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showChangeMobileModal, setShowChangeMobileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [profileData, setProfileData] = useState<any>({});
  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  useEffect(() => {
    if (!profile?.id) {
      fetchProfile().catch(err => console.error('Profile not loaded:', err?.message));
    }
  }, []);

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        email: profile.user?.email || '',
        birth_date: profile.birth_date || '',
        gender: profile.gender || 'male',
        operator_name: profile.operator_name || '',
        operator_contact: profile.operator_contact || '',
        driver_license: profile.driver_license || '',
        national_id: profile.national_id || '',
      });
      setSelectedRegions(profile.operational_regions || []);
    }
  }, [profile]);

  useEffect(() => {
    tripsApi.getCities().then(cityList => {
      setCities(cityList.map(c => ({ value: c.city, label: c.city })));
    }).catch(() => toast.error('فشل تحميل قائمة المدن'));
  }, []);

  const handleUpdate = async (section: string, data: any) => {
    try {
      await updateProfile(data);
      await fetchProfile();
      setEditingSection(null);
      toast.success('تم التحديث بنجاح');
    } catch (err: any) {
      toast.error(err?.message || 'فشل التحديث');
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

  const isEditing = (section: string) => editingSection === section;

  return (
    <DashboardLayout>
      <div className="max-w-2xl px-4 md:px-6 py-6 space-y-6">
        {/* Account Info */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-brand-text-dark mb-4">معلومات الحساب</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">الدور:</span>
              <span className="font-medium">
                {profile.role === 'operator_admin' ? 'مشغل' : 
                 profile.role === 'standalone_driver' ? 'سائق مستقل' :
                 profile.role === 'invited_driver' ? 'سائق مدعو' : 'راكب'}
              </span>
            </div>
            {profile.role === 'invited_driver' && profile.operator_name && (
              <div className="flex justify-between">
                <span className="text-gray-600">الشركة:</span>
                <span className="font-medium">{profile.operator_name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">حالة التحقق:</span>
              <span className={`font-medium ${profile.is_verified ? 'text-green-600' : 'text-yellow-600'}`}>
                {profile.is_verified ? 'موثق' : 'غير موثق'}
              </span>
            </div>
          </div>
        </section>

        {/* Personal Info Section */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2 items-center">
              <UserIcon className="w-5 h-5 text-brand-primary" />
              <h2 className="text-lg font-bold text-brand-text-dark">المعلومات الشخصية</h2>
            </div>
            {canEditAll && (
              !isEditing('personal') ? (
                <Button variant="outline" size="sm" onClick={() => setEditingSection('personal')}>
                  <PencilSquareIcon className="w-4 h-4" />
                  تعديل
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}>
                  <XMarkIcon className="w-4 h-4" />
                  إلغاء
                </Button>
              )
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">الاسم الكامل</label>
              <Input
                value={profileData.full_name}
                onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                readOnly={!isEditing('personal')}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">البريد الإلكتروني</label>
              <Input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                readOnly={!isEditing('personal')}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">تاريخ الميلاد</label>
                {isEditing('personal') ? (
                  <DateInput
                    value={profileData.birth_date}
                    onChange={(value) => setProfileData({...profileData, birth_date: value})}
                  />
                ) : (
                  <div className="text-sm text-gray-900 py-2">
                    {profileData.birth_date ? new Date(profileData.birth_date).toLocaleDateString('en-US') : '-'}
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">الجنس</label>
                {isEditing('personal') ? (
                  <ToggleSwitch
                    value={profileData.gender}
                    onChange={(value) => setProfileData({...profileData, gender: value})}
                    options={[{value: 'male', label: 'ذكر'}, {value: 'female', label: 'أنثى'}]}
                  />
                ) : (
                  <div className="text-sm text-gray-900 py-2">
                    {profileData.gender === 'male' ? 'ذكر' : 'أنثى'}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">رقم الجوال: </span>
                  <span className="font-medium" dir="ltr">+{profile.mobile_number}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowChangeMobileModal(true)}>
                  <DevicePhoneMobileIcon className="w-4 h-4" />
                  تغيير
                </Button>
              </div>
              {profile.role === 'operator_admin' && (
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-600">كلمة المرور</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowChangePasswordModal(true)}>
                    <KeyIcon className="w-4 h-4" />
                    تغيير
                  </Button>
                </div>
              )}
            </div>
          </div>

          {isEditing('personal') && (
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <Button
                onClick={() => handleUpdate('personal', {
                  full_name: profileData.full_name,
                  email: profileData.email,
                  birth_date: profileData.birth_date,
                  gender: profileData.gender,
                })}
              >
                <CheckIcon className="w-4 h-4" />
                حفظ
              </Button>
            </div>
          )}
        </section>

        {/* Company Info Section - Only for operator_admin */}
        {profile.role === 'operator_admin' && (
          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2 items-center">
                <BuildingOfficeIcon className="w-5 h-5 text-brand-primary" />
                <h2 className="text-lg font-bold text-brand-text-dark">معلومات الشركة</h2>
              </div>
              {!isEditing('company') ? (
                <Button variant="outline" size="sm" onClick={() => setEditingSection('company')}>
                  <PencilSquareIcon className="w-4 h-4" />
                  تعديل
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}>
                  <XMarkIcon className="w-4 h-4" />
                  إلغاء
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">اسم الشركة</label>
                <Input
                  value={profileData.operator_name}
                  onChange={(e) => setProfileData({...profileData, operator_name: e.target.value})}
                  readOnly={!isEditing('company')}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">رقم التواصل</label>
                <Input
                  value={profileData.operator_contact}
                  onChange={(e) => setProfileData({...profileData, operator_contact: e.target.value})}
                  readOnly={!isEditing('company')}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">المناطق التشغيلية</label>
                {isEditing('company') ? (
                  <MultiSelect
                    options={cities}
                    value={selectedRegions}
                    onChange={setSelectedRegions}
                    placeholder="اختر المدن"
                  />
                ) : (
                  <div className="text-sm text-gray-900">
                    {selectedRegions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedRegions.map((region: string) => (
                          <span key={region} className="px-3 py-1 bg-brand-primary-light text-brand-primary rounded-full text-xs font-semibold">
                            {region}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">لم يتم تحديد مناطق تشغيلية</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {isEditing('company') && (
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button
                  onClick={() => handleUpdate('company', {
                    operator_name: profileData.operator_name,
                    operator_contact: profileData.operator_contact,
                    operational_regions: selectedRegions,
                  })}
                >
                  <CheckIcon className="w-4 h-4" />
                  حفظ
                </Button>
              </div>
            )}
          </section>
        )}

        {/* Driver Info Section */}
        {(profile.role === 'standalone_driver' || profile.role === 'invited_driver') && (
          <section className="bg-white rounded-lg border border-gray-200 p-6">
            {profile.role === 'standalone_driver' && (
              <div className="mb-4 p-4 bg-gradient-to-r from-brand-primary to-blue-600 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-1">قم بترقية حسابك إلى شركة نقل</h3>
                    <p className="text-sm opacity-90">أضف المزيد من الحافلات والسائقين وقم بإدارة أسطولك بسهولة</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => router.push('/upgrade')}
                    className="bg-white text-brand-primary hover:bg-gray-50 border-white"
                  >
                    <ArrowUpCircleIcon className="w-4 h-4" />
                    ترقية الآن
                  </Button>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2 items-center">
                <IdentificationIcon className="w-5 h-5 text-brand-primary" />
                <h2 className="text-lg font-bold text-brand-text-dark">معلومات السائق</h2>
              </div>
              {!isEditing('driver') ? (
                <Button variant="outline" size="sm" onClick={() => setEditingSection('driver')}>
                  <PencilSquareIcon className="w-4 h-4" />
                  تعديل
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}>
                  <XMarkIcon className="w-4 h-4" />
                  إلغاء
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {profile.role === 'standalone_driver' && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">الاسم المعروض</label>
                    <Input
                      value={profileData.operator_name}
                      onChange={(e) => setProfileData({...profileData, operator_name: e.target.value})}
                      readOnly={!isEditing('driver')}
                      placeholder="الاسم الذي يظهر للركاب"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">رقم التواصل</label>
                    <Input
                      value={profileData.operator_contact}
                      onChange={(e) => setProfileData({...profileData, operator_contact: e.target.value})}
                      readOnly={!isEditing('driver')}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">المناطق التشغيلية</label>
                    {isEditing('driver') ? (
                      <MultiSelect
                        options={cities}
                        value={selectedRegions}
                        onChange={setSelectedRegions}
                        placeholder="اختر المدن"
                      />
                    ) : (
                      <div className="text-sm text-gray-900">
                        {selectedRegions.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedRegions.map((region: string) => (
                              <span key={region} className="px-3 py-1 bg-brand-primary-light text-brand-primary rounded-full text-xs font-semibold">
                                {region}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">لم يتم تحديد مناطق تشغيلية</span>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">رقم الرخصة</label>
                <Input
                  value={profileData.driver_license}
                  onChange={(e) => setProfileData({...profileData, driver_license: e.target.value})}
                  readOnly={!isEditing('driver')}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">رقم الهوية</label>
                <Input
                  value={profileData.national_id}
                  onChange={(e) => setProfileData({...profileData, national_id: e.target.value})}
                  readOnly={!isEditing('driver')}
                />
              </div>
            </div>

            {isEditing('driver') && (
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button
                  onClick={() => handleUpdate('driver', {
                    ...(profile.role === 'standalone_driver' && {
                      operator_name: profileData.operator_name,
                      operator_contact: profileData.operator_contact,
                      operational_regions: selectedRegions,
                    }),
                    driver_license: profileData.driver_license,
                    national_id: profileData.national_id,
                  })}
                >
                  <CheckIcon className="w-4 h-4" />
                  حفظ
                </Button>
              </div>
            )}
          </section>
        )}


      </div>

      <ChangeMobileModal
        isOpen={showChangeMobileModal}
        onClose={() => setShowChangeMobileModal(false)}
        currentMobile={profile.mobile_number}
        requirePassword={profile.role === 'operator_admin'}
        onCheckPasswordRequired={async (mobile) => {
          try {
            const response = await authApi.checkPasswordRequired(mobile);
            return response.data.requires_password;
          } catch (error) {
            return profile.role === 'operator_admin';
          }
        }}
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
              ...(data.password && { password: data.password }),
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

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSubmit={async (data) => {
          try {
            await authApi.changePassword({
              current_password: data.currentPassword,
              new_password: data.newPassword,
            });
            toast.success('تم تحديث كلمة المرور بنجاح');
          } catch (error: any) {
            toast.error(error.response?.data?.error || 'فشل تحديث كلمة المرور');
            throw error;
          }
        }}
      />
    </DashboardLayout>
  );
}
