import HomeLayout from '@/components/layout/HomeLayout';
import StatsCards from '@/components/dashboard/StatsCards';
import UpgradeBanner from '@/components/dashboard/UpgradeBanner';
import RecentActivity from '@/components/dashboard/RecentActivity';
import BookingsList from '@/components/bookings/BookingsList';
import { Button } from '@mishwari/ui-web';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '@/store/store';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { authApi, tripsApi, operatorApi, fleetApi } from '@mishwari/api';
import { setProfile } from '@/store/slices/authSlice';
import { TruckIcon, UserIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const { isAuthenticated, profile, canManageDrivers } = useSelector(
    (state: AppState) => state.auth
  );
  const role = (profile as any)?.profile?.role || profile?.role;
  const isStandalone = (profile as any)?.is_standalone;
  const isInvitedDriver = role === 'driver' && !isStandalone;
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [busCount, setBusCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);
  const [setupLoading, setSetupLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Always fetch fresh profile data to get operator_name and is_standalone
    authApi
      .getMe()
      .then((response) => {
        console.log('[Dashboard] Profile refreshed:', response.data);
        dispatch(setProfile(response.data));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch profile:', error);
        setLoading(false);
      });
  }, [isAuthenticated, router, dispatch]);

  useEffect(() => {
    if (!isAuthenticated || !profile?.full_name) return;

    const fetchSetupData = async () => {
      try {
        const [buses, drivers] = await Promise.all([
          fleetApi.list().catch(() => []),
          canManageDrivers
            ? fleetApi.getDrivers().catch(() => [])
            : Promise.resolve([{ id: 1 }]),
        ]);
        setBusCount(buses.length);
        setDriverCount(drivers.length);
      } catch (error) {
        console.error('Failed to fetch setup data:', error);
      } finally {
        setSetupLoading(false);
      }
    };

    fetchSetupData();
  }, [isAuthenticated, canManageDrivers]);

  useEffect(() => {
    if (!isAuthenticated || !profile?.full_name) return;

    const fetchBookings = async () => {
      try {
        const trips = await tripsApi.list();
        const allBookings: any[] = [];

        for (const trip of trips.slice(0, 10)) {
          try {
            const tripBookings = await operatorApi.getTripBookings(trip.id);
            tripBookings.forEach((booking: any) => {
              allBookings.push({
                ...booking,
                trip_info: {
                  id: trip.id,
                  from_city: trip.from_city?.city,
                  to_city: trip.to_city?.city,
                  journey_date: trip.journey_date,
                },
              });
            });
          } catch (err) {
            console.error(`Failed to fetch bookings for trip ${trip.id}`);
          }
        }

        allBookings.sort(
          (a, b) =>
            new Date(b.booking_time).getTime() -
            new Date(a.booking_time).getTime()
        );

        setBookings(allBookings.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated]);

  if (!isAuthenticated || loading) return null;

  return (
    <HomeLayout>
      <div className='max-w-7xl mx-auto px-4 py-8 space-y-6'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            مرحباً، {profile.full_name}
          </h1>
          <p className='text-gray-600 mt-1'>إدارة رحلاتك وحجوزاتك</p>
        </div>

        {isStandalone && <UpgradeBanner />}

        {isInvitedDriver && (
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
            <h3 className='text-lg font-semibold text-blue-900 mb-2'>معلومات الشركة</h3>
            <div className='space-y-2 text-sm text-blue-800'>
              <p><span className='font-medium'>الشركة:</span> {(profile as any)?.operator_name || 'غير متوفر'}</p>
              <p><span className='font-medium'>الدور:</span> سائق</p>
            </div>
          </div>
        )}

        {role === 'operator_admin' && <UpgradeBanner />}

        {!setupLoading &&
          (busCount === 0 || (canManageDrivers && driverCount === 0)) && (
            <div className='bg-amber-50 border border-amber-200 rounded-lg p-6 text-center'>
              <h3 className='text-lg font-semibold text-amber-900 mb-2'>
                أكمل إعداد حسابك
              </h3>
              <p className='text-sm text-amber-700 mb-4'>
                {busCount === 0 && canManageDrivers && driverCount === 0
                  ? 'لبدء تقديم الرحلات، يجب إضافة حافلة وسائق'
                  : busCount === 0
                  ? 'لبدء تقديم الرحلات، يجب إضافة حافلة على الأقل'
                  : 'لتشغيل الرحلات، يجب إضافة سائق على الأقل'}
              </p>
              <div className='flex flex-col sm:flex-row justify-center gap-3'>
                {busCount === 0 && (
                  <Button
                    onClick={() => router.push('/fleet/add')}
                    variant='default'>
                    <TruckIcon className='h-5 w-5 ml-2' />
                    إضافة حافلة
                  </Button>
                )}
                {canManageDrivers && driverCount === 0 && (
                  <Button
                    onClick={() => router.push('/drivers/add')}
                    variant='default'>
                    <UserIcon className='h-5 w-5 ml-2' />
                    إضافة سائق
                  </Button>
                )}
              </div>
            </div>
          )}

        <StatsCards />

        <RecentActivity />

        <div className='bg-white rounded-lg shadow'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900'>
              أحدث الحجوزات
            </h3>
          </div>
          <BookingsList
            bookings={bookings}
            loading={bookingsLoading}
            showTripInfo={true}
          />
        </div>
      </div>
    </HomeLayout>
  );
}
