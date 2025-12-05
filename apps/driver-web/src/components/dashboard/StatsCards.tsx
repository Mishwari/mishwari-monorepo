import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import { TruckIcon, CalendarIcon, CheckCircleIcon, TicketIcon } from '@heroicons/react/24/outline';
import { tripsApi, operatorApi } from '@mishwari/api';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}

function StatCard({ title, value, icon, color, loading }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {loading ? '...' : value}
          </p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function StatsCards() {
  const { profile } = useSelector((state: AppState) => state.auth);
  const [stats, setStats] = useState({
    active: 0,
    upcoming: 0,
    completed: 0,
    bookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.full_name) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const trips = await tripsApi.list();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const active = trips.filter((t: any) => t.status === 'active').length;
        const upcoming = trips.filter((t: any) => 
          t.status === 'published' && new Date(t.journey_date) >= today
        ).length;
        const completed = trips.filter((t: any) => t.status === 'completed').length;

        let totalBookings = 0;
        for (const trip of trips) {
          try {
            const bookings = await operatorApi.getTripBookings(trip.id);
            totalBookings += bookings.length;
          } catch (err) {
            console.error(`Failed to fetch bookings for trip ${trip.id}`);
          }
        }

        setStats({ active, upcoming, completed, bookings: totalBookings });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [profile]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="الرحلات النشطة"
        value={stats.active}
        icon={<TruckIcon className="h-6 w-6 text-blue-600" />}
        color="bg-blue-100"
        loading={loading}
      />
      <StatCard
        title="الرحلات القادمة"
        value={stats.upcoming}
        icon={<CalendarIcon className="h-6 w-6 text-green-600" />}
        color="bg-green-100"
        loading={loading}
      />
      <StatCard
        title="الرحلات المكتملة"
        value={stats.completed}
        icon={<CheckCircleIcon className="h-6 w-6 text-purple-600" />}
        color="bg-purple-100"
        loading={loading}
      />
      <StatCard
        title="إجمالي الحجوزات"
        value={stats.bookings}
        icon={<TicketIcon className="h-6 w-6 text-yellow-600" />}
        color="bg-yellow-100"
        loading={loading}
      />
    </div>
  );
}
