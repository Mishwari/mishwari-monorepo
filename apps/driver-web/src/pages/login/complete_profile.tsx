import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { performRegister } from '@/store/actions/mobileAuthActions';
import { useRouter } from 'next/router';
import { Button, DateInput, MultiSelect } from '@mishwari/ui-web';
import { tripsApi } from '@mishwari/api';
import { toast } from 'react-toastify';

export default function CompleteProfile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'driver',
    gender: 'male',
    birth_date: '',
    password: '',
    operator_name: '',
    operational_regions: [] as string[],
    driver_license: '',
    national_id: '',
  });
  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    tripsApi.getCities().then(cityList => {
      setCities(cityList.map(c => ({ value: c.city, label: c.city })));
    }).catch(() => toast.error('فشل تحميل قائمة المدن'));
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    dispatch(performRegister(formData, router) as any);
  };

  return (
    <div className='w-full h-screen bg-white flex justify-center items-center'>
      <div className='flex min-h-full sm:min-h-fit flex-col justify-center sm:h-max sm:msx-auto w-full sm:max-w-md px-12 sm:px-6 py-8 sm:py-4 lg:px-8 sm:border border-gray-200 sm:rounded-xl bg-gray-100'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <h1 className='mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-brand-text-dark'>
            اكمل معلوماتك
          </h1>
          <p className='text-center text-gray-600 mt-2'>معلومات الحساب</p>
        </div>
        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form className='space-y-6' onSubmit={handleSubmit}>
            <div>
              <label className='block text-sm font-medium text-gray-700 text-right mb-2'>
                نوع الحساب
              </label>
              <div className='grid grid-cols-2 gap-4'>
                <button
                  type='button'
                  onClick={() => setFormData({ ...formData, role: 'driver' })}
                  className={`py-3 px-4 rounded-lg border-2 transition ${
                    formData.role === 'driver'
                      ? 'border-brand-primary bg-brand-primary text-white'
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <div className='text-center'>
                    <p className='font-bold'>سائق فردي</p>
                    <p className='text-xs mt-1'>أملك حافلة واحدة</p>
                  </div>
                </button>
                <button
                  type='button'
                  onClick={() => setFormData({ ...formData, role: 'operator_admin' })}
                  className={`py-3 px-4 rounded-lg border-2 transition ${
                    formData.role === 'operator_admin'
                      ? 'border-brand-primary bg-brand-primary text-white'
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <div className='text-center'>
                    <p className='font-bold'>شركة نقل</p>
                    <p className='text-xs mt-1'>أملك عدة حافلات</p>
                  </div>
                </button>
              </div>
            </div>

            {formData.role === 'operator_admin' && (
              <div>
                <label className='block text-sm font-medium text-gray-700 text-right'>
                  اسم الشركة
                </label>
                <input
                  type='text'
                  required
                  value={formData.operator_name}
                  onChange={(e) => setFormData({ ...formData, operator_name: e.target.value })}
                  className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary'
                />
              </div>
            )}

            {formData.role === 'operator_admin' && (
              <div>
                <label className='block text-sm font-medium text-gray-700 text-right'>
                  المناطق التشغيلية
                </label>
                <div className='mt-1'>
                  <MultiSelect
                    options={cities}
                    value={formData.operational_regions}
                    onChange={(value) => setFormData({ ...formData, operational_regions: value })}
                    placeholder="اختر المدن"
                  />
                </div>
              </div>
            )}

            {formData.role === 'driver' && (
              <div>
                <label className='block text-sm font-medium text-gray-700 text-right'>
                  موقعك
                </label>
                <div className='mt-1'>
                  <MultiSelect
                    options={cities}
                    value={formData.operational_regions}
                    onChange={(value) => setFormData({ ...formData, operational_regions: value })}
                    placeholder="اختر المدن"
                  />
                </div>
              </div>
            )}

            <div>
              <label className='block text-sm font-medium text-gray-700 text-right'>
                الاسم الكامل
              </label>
              <input
                type='text'
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 text-right'>
                البريد الإلكتروني
              </label>
              <input
                type='email'
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 text-right'>
                الجنس
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary'
              >
                <option value='male'>ذكر</option>
                <option value='female'>انثى</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 text-right'>
                تاريخ الميلاد
              </label>
              <DateInput
                value={formData.birth_date}
                onChange={(value) => setFormData({ ...formData, birth_date: value })}
                placeholder='DD/MM/YYYY'
              />
            </div>

            {formData.role === 'driver' && (
              <div>
                <label className='block text-sm font-medium text-gray-700 text-right'>
                  رقم رخصة القيادة
                </label>
                <input
                  type='text'
                  required
                  value={formData.driver_license}
                  onChange={(e) => setFormData({ ...formData, driver_license: e.target.value })}
                  className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary'
                />
              </div>
            )}

            {formData.role === 'driver' && (
              <div>
                <label className='block text-sm font-medium text-gray-700 text-right'>
                  رقم الهوية الوطنية
                </label>
                <input
                  type='text'
                  required
                  value={formData.national_id}
                  onChange={(e) => setFormData({ ...formData, national_id: e.target.value })}
                  className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary'
                />
              </div>
            )}

            {formData.role === 'operator_admin' && (
              <div>
                <label className='block text-sm font-medium text-gray-700 text-right'>
                  كلمة المرور
                </label>
                <input
                  type='password'
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder='أدخل كلمة مرور قوية (8 أحرف على الأقل)'
                  className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary'
                />
              </div>
            )}

            <div className='flex justify-center pt-4'>
              <Button type='submit' variant='default' size='lg'>
                اكمال التسجيل
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
