import HomeLayout from '@/components/layout/HomeLayout';
import StatsCards from '@/components/dashboard/StatsCards';
import UpgradeBanner from '@/components/dashboard/UpgradeBanner';
import RecentActivity from '@/components/dashboard/RecentActivity';
import RecentBookings from '@/components/dashboard/RecentBookings';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '@/store/store';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { authApi } from '@mishwari/api';
import { setProfile } from '@/store/slices/authSlice';

export default function Home() {
  const { isAuthenticated, profile } = useSelector((state: AppState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Fetch profile if not loaded
    if (!profile) {
      authApi.getMe()
        .then(response => {
          dispatch(setProfile(response.data));
          setLoading(false);
        })
        .catch(error => {
          console.error('Failed to fetch profile:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, profile, router, dispatch]);

  if (!isAuthenticated || loading) return null;

  return (
    <HomeLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مرحباً، {profile.full_name}</h1>
          <p className="text-gray-600 mt-1">إدارة رحلاتك وحجوزاتك</p>
        </div>

        <UpgradeBanner />

        <StatsCards />

        <RecentActivity />

        <RecentBookings />
      </div>
    </HomeLayout>
  );
}
