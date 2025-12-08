import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Booking } from '@/types/booking';
import { AppState } from '@/store/store';
import { decryptToken } from '@/utils/tokenUtils';
import MiniTicket from '@/components/MiniTicket';
import MiniTicketSkeleton from '@/components/Skeletons/MiniTicketSkeleton';
import MainLayout from '@/layouts/MainLayout';
import { Ticket } from 'lucide-react';

function index() {
  const token = useSelector((state: AppState) => state.auth.token);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('all');

  const fetchBookings = useCallback(async () => {
    if (!token) {
      console.log('No token available');
      setLoading(false);
      return;
    }
    
    try {
      const decryptedToken = decryptToken(token);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}booking/`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setBookings(response.data);
      setFilteredBookings(response.data);
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError('Error getting bookings');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(
        bookings.filter((booking) => booking.status === filter)
      );
    }
  }, [filter, bookings]);

  const bookingOptions = [
    { id: 1, label: 'الكل', value: 'all' },
    { id: 2, label: 'نشط', value: 'active' },
    { id: 3, label: 'قيد الانتظار', value: 'pending' },
    { id: 4, label: 'مكتمل', value: 'completed' },
    { id: 5, label: 'ملغي', value: 'cancelled' },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-light">
        <div className="sticky top-16 z-10 bg-light pb-4 pt-6">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
              {bookingOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setFilter(option.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                    filter === option.value
                      ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-blue-900/20'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 mb-20">
          {loading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <MiniTicketSkeleton key={index} />
              ))}
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredBookings
                .sort((a, b) => new Date(b.booking_time).getTime() - new Date(a.booking_time).getTime())
                .map((booking) => (
                  <MiniTicket key={booking.id} booking={booking} onReviewSuccess={fetchBookings} />
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <Ticket className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-brand">لا توجد حجوزات</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                لم نتمكن من العثور على أي حجوزات في هذه القائمة. جرب تغيير الفلتر أو احجز رحلة جديدة.
              </p>
              <a href="/" className="mt-6 inline-block">
                <button className="px-6 py-3 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 active:scale-95 transition-all">
                  احجز رحلة الآن
                </button>
              </a>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default index;
