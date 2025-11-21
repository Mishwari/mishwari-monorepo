import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@mishwari/ui-web';
import { operatorApi } from '@mishwari/api';
import { ArrowRightIcon } from '@heroicons/react/24/outline';


export default function TripBookingsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchBookings = async () => {
      try {
        const data = await operatorApi.getTripBookings(Number(id));
        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
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
          <Button onClick={() => router.push(`/trips/${id}/bookings/create`)} variant="default">
            إضافة حجز
          </Button>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">لا توجد حجوزات لهذه الرحلة</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">رقم الحجز</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">من - إلى</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الركاب</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المصدر</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr 
                    key={booking.id} 
                    onClick={() => router.push(`/trips/${id}/bookings/${booking.id}`)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {booking.from_stop?.city?.city || 'N/A'} → {booking.to_stop?.city?.city || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {booking.passengers?.length || 0} راكب
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {booking.booking_source === 'physical' ? 'يدوي' : 'أونلاين'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(booking.booking_time).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
