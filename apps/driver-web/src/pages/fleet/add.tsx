import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BusForm from '@/components/fleet/BusForm';
import { fleetApi } from '@mishwari/api';
import { toast } from 'react-toastify';

export default function AddBusPage() {
  const router = useRouter();
  const { profile } = useSelector((state: AppState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [canAdd, setCanAdd] = useState<boolean | null>(null);
  const isDriver = profile?.role === 'driver';

  useEffect(() => {
    // Check if driver can add bus
    if (isDriver) {
      fleetApi.list()
        .then(buses => {
          if (buses.length >= 1) {
            toast.error('وصلت للحد الأقصى. قم بترقية حسابك لإضافة المزيد.');
            router.replace('/fleet');
          } else {
            setCanAdd(true);
          }
        })
        .catch(() => setCanAdd(true));
    } else {
      setCanAdd(true);
    }
  }, [isDriver, router]);

  if (canAdd === null) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">جاري التحقق...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!canAdd) {
    return null;
  }

  const handleSubmit = async (data: { bus_number: string; bus_type: string; capacity: number; amenities: Record<string, string> }) => {
    setLoading(true);
    try {
      await fleetApi.create(data);
      toast.success('تم إضافة الحافلة بنجاح');
      router.push('/fleet');
    } catch (error: any) {
      if (error?.response?.status === 403) {
        toast.error('وصلت للحد الأقصى');
        router.push('/fleet');
      } else {
        toast.error('فشل إضافة الحافلة');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">إضافة حافلة جديدة</h1>
          <BusForm
            onSubmit={handleSubmit}
            onCancel={() => router.push('/fleet')}
            loading={loading}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
