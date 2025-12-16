import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DriverCard from '@/components/drivers/DriverCard';
import { Button } from '@mishwari/ui-web';
import { driversApi } from '@mishwari/api';
import { Driver } from '@mishwari/types';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function DriversPage() {
  const authState = useSelector((state: AppState) => state.auth);
  const { isAuthenticated, profile } = authState;
  const role = (profile as any)?.profile?.role || profile?.role;
  const canManageDrivers = role === 'operator_admin';
  const router = useRouter();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated || !canManageDrivers) {
      setLoading(false);
      return;
    }

    const fetchDrivers = async () => {
      try {
        const data = await driversApi.list();
        setDrivers(data);
      } catch (error: any) {
        console.error('Drivers fetch error:', error?.response?.status);
        setDrivers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers().catch(() => {});
  }, [isAuthenticated, canManageDrivers]);

  if (!isAuthenticated) return null;

  if (!canManageDrivers) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">إدارة السائقين</h2>
          <p className="text-gray-600 mb-6">
            هذه الميزة متاحة فقط لحسابات الشركات
          </p>
          <Button onClick={() => router.push('/kyc/operator')} variant="default">
            ترقية الحساب
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">السائقين</h1>
            <p className="text-gray-600 mt-1">إدارة سائقيك</p>
          </div>
          <Button onClick={() => router.push('/drivers/add')} variant="default" size="lg">
            <PlusIcon className="h-5 w-5 ml-2" />
            دعوة سائق
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        ) : drivers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 mb-4">لا يوجد سائقين بعد</p>
            <Button onClick={() => router.push('/drivers/add')} variant="default">
              دعوة أول سائق
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map((driver) => (
              <DriverCard key={driver.id} driver={driver} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
