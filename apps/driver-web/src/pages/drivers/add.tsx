import { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DriverForm from '@/components/drivers/DriverForm';
import { driversApi } from '@mishwari/api';
import { toast } from 'react-toastify';

export default function AddDriverPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await driversApi.create(data);
      toast.success('تم إضافة السائق بنجاح!');

      router.push('/drivers');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'فشل إضافة السائق');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className='max-w-2xl mx-auto'>
        <div className='bg-white rounded-lg shadow p-6'>
          <h1 className='text-2xl font-bold text-gray-900 mb-6'>
            إضافة سائق جديد
          </h1>
          <DriverForm
            onSubmit={handleSubmit}
            onCancel={() => router.push('/drivers')}
            loading={loading}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
