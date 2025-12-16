import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BusCard from '@/components/fleet/BusCard';
import { Button } from '@mishwari/ui-web';
import { fleetApi } from '@mishwari/api';
import { Bus } from '@mishwari/types';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function FleetPage() {
  const { isAuthenticated, canManageDrivers, profile } = useSelector((state: AppState) => state.auth);
  const router = useRouter();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const role = (profile as any)?.profile?.role || profile?.role;
  const shouldRedirectToBus = role === 'standalone_driver';

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
          // Redirect standalone driver to their bus detail page
          if (shouldRedirectToBus && data.length > 0) {
            router.push(`/fleet/${data[0].id}`);
            return;
          }
        }
      } catch (error: any) {
        if (mounted) {
          console.error('Fleet fetch error:', error?.response?.status);
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
  }, [isAuthenticated, shouldRedirectToBus, router]);

  if (!isAuthenticated) return null;

  // Show loading while redirecting standalone driver to their bus
  if (loading && shouldRedirectToBus) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Standalone driver with no bus - show add button
  if (shouldRedirectToBus && buses.length === 0) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 mb-4">لا توجد حافلة بعد</p>
          <Button onClick={() => router.push('/fleet/add')} variant="default">
            إضافة حافلة
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Operator view - full fleet management
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">أسطول الحافلات</h1>
            <p className="text-gray-600 mt-1">إدارة حافلاتك وتوثيقها</p>
          </div>
          <Button 
            onClick={() => router.push('/fleet/add')} 
            variant="default" 
            size="lg"
          >
            <PlusIcon className="h-5 w-5 ml-2" />
            إضافة حافلة
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        ) : buses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 mb-4">لا توجد حافلات بعد</p>
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
