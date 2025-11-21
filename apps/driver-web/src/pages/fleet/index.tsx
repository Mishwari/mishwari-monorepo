import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BusCard from '@/components/fleet/BusCard';
import { Button } from '@mishwari/ui-web';
import { fleetApi } from '@mishwari/api';
import { Bus } from '@mishwari/types';
import { PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function FleetPage() {
  const { isAuthenticated, canManageDrivers, profile } = useSelector((state: AppState) => state.auth);
  const router = useRouter();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const isVerified = profile?.is_verified;
  const isDriver = profile?.role === 'driver';
  const hasReachedBusLimit = isDriver && buses.length >= 1;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let mounted = true;

    const fetchBuses = async () => {
      try {
        const data = await fleetApi.list();
        if (mounted) {
          setBuses(data);
        }
      } catch (error: any) {
        if (mounted) {
          console.log('Fleet fetch error:', error?.response?.status);
          setBuses([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchBuses().catch(() => {});

    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {canManageDrivers ? 'أسطول الحافلات' : 'حافلتي'}
            </h1>
            <p className="text-gray-600 mt-1">إدارة حافلاتك وتوثيقها</p>
          </div>
          <Button 
            onClick={() => {
              if (hasReachedBusLimit) {
                return;
              }
              router.push('/fleet/add');
            }} 
            variant="default" 
            size="lg"
            disabled={hasReachedBusLimit}
            title={hasReachedBusLimit ? 'وصلت للحد الأقصى من الحافلات' : ''}
          >
            <PlusIcon className="h-5 w-5 ml-2" />
            إضافة حافلة
          </Button>
        </div>

        {hasReachedBusLimit && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900">وصلت للحد الأقصى من الحافلات</h3>
              <p className="text-sm text-yellow-800 mt-1">
                السائقون الأفراد يمكنهم تسجيل حافلة واحدة فقط. 
                <button 
                  onClick={() => router.push('/upgrade')} 
                  className="underline font-semibold hover:text-yellow-900"
                >
                  قم بترقية حسابك
                </button>
                {' '}لإضافة المزيد من الحافلات.
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        ) : buses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 mb-4">لا توجد حافلات بعد</p>
            {!isVerified && (
              <p className="text-sm text-gray-500 mb-4">يمكنك إضافة حافلات، وستحتاج لتوثيقها لاحقاً</p>
            )}
            <Button onClick={() => router.push('/fleet/add')} variant="default">
              إضافة أول حافلة
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buses.map((bus) => (
              <BusCard key={bus.id} bus={bus} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
