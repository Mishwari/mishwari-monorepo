import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BookingsList from '@/components/bookings/BookingsList';
import { Button } from '@mishwari/ui-web';
import { operatorApi } from '@mishwari/api';
import { Trip } from '@mishwari/types';
import { ArrowRightIcon } from '@heroicons/react/24/outline';


export default function TripBookingsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [bookings, setBookings] = useState<any[]>([]);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      try {
        const [tripData, bookingsData] = await Promise.all([
          operatorApi.getTripById(Number(id)),
          operatorApi.getTripBookings(Number(id))
        ]);
        setTrip(tripData);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">


            <Button onClick={() => router.push(`/trips/${id}`)} variant="outline" size="sm">
            <ArrowRightIcon className="h-5 w-5" />
          </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">حجوزات الرحلة</h1>
              <p className="text-gray-600 mt-1">إجمالي {bookings.length} حجز</p>
            </div>
          </div>
          <Button 
            onClick={() => router.push(`/trips/${id}/bookings/create`)} 
            variant="default"
            disabled={trip?.status !== 'published' && trip?.status !== 'active'}>
            إضافة حجز
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <BookingsList 
            bookings={bookings} 
            loading={loading}
            emptyMessage="لا توجد حجوزات لهذه الرحلة" 
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
