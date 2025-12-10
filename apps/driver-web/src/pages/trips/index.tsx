import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TripCard from '@/components/trips/TripCard';
import TripLimitBanner from '@/components/trips/TripLimitBanner';
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@mishwari/ui-web';
import { tripsApi } from '@mishwari/api';
import { Trip } from '@mishwari/types';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function TripsPage() {
  const { isAuthenticated, profile } = useSelector((state: AppState) => state.auth);
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const isVerified = profile?.is_verified;
  const role = (profile as any)?.profile?.role || profile?.role;
  const canCreateTrips = role === 'operator_admin' || role === 'standalone_driver';
  
  // Calculate active trips for limit warning
  const activeTripsCount = useMemo(() => {
    return trips.filter(t => ['draft', 'published', 'active'].includes(t.status)).length;
  }, [trips]);
  
  const tripLimit = 2; // Default limit for individual drivers

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let mounted = true;

    const fetchTrips = async () => {
      try {
        const params = filter !== 'all' ? { status: filter } : undefined;
        const data = await tripsApi.list(params);
        if (mounted) {
          setTrips(data);
        }
      } catch (error: any) {
        if (mounted) {
          console.log('Trips fetch error:', error?.response?.status);
          setTrips([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchTrips().catch(() => {});

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, filter]);

  if (!isAuthenticated) return null;

  const filters = [
    { value: 'all', label: 'الكل' },
    { value: 'draft', label: 'مسودات' },
    { value: 'published', label: 'منشورة' },
    { value: 'active', label: 'نشطة' },
    { value: 'completed', label: 'مكتملة' },
    { value: 'cancelled', label: 'ملغاة' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">الرحلات</h1>
            <p className="text-gray-600 mt-1">إدارة رحلاتك</p>
          </div>
          {canCreateTrips && (
            <Button 
              onClick={() => router.push('/trips/create')} 
              variant="default" 
              size="lg"
            >
              <PlusIcon className="h-5 w-5 ml-2" />
              إنشاء رحلة
            </Button>
          )}
        </div>



        {/* Mobile: Dropdown */}
        <div className="md:hidden">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filters.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop: Buttons */}
        <div className="hidden md:flex gap-2 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                filter === f.value
                  ? 'bg-brand-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 mb-4">لا توجد رحلات</p>
            {!isVerified && (
              <p className="text-sm text-gray-500 mb-4">يمكنك إنشاء رحلات كمسودات، وستتمكن من نشرها بعد إكمال التوثيق</p>
            )}
            {canCreateTrips && (
              <Button onClick={() => router.push('/trips/create')} variant="default">
              إنشاء أول رحلة
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
