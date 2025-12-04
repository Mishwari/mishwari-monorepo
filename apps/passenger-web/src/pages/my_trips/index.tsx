import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Booking } from '@/types/booking';
import { AppState } from '@/store/store';
import { decryptToken } from '@/utils/tokenUtils';
import MiniTicket from '@/components/MiniTicket';
import MiniTicketSkeleton from '@/components/Skeletons/MiniTicketSkeleton';
import MainLayout from '@/layouts/MainLayout';

function index() {
  const token = useSelector((state: AppState) => state.auth.token);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
    { id: 2, label: 'قيد الانتظار', value: 'pending' },
    { id: 3, label: 'نشط', value: 'active' },
    { id: 4, label: 'مكتمل', value: 'completed' },
    { id: 5, label: 'ملغي', value: 'cancelled' },
  ];

  return (
    <main className="min-h-screen bg-light">
      <MainLayout>
        <section className="relative">
          <div className="sticky z-10 top-16 bg-white/90 backdrop-blur-md px-4 md:px-6 flex justify-between gap-1.5 md:gap-2 w-full py-4 border-b border-slate-200/60">
            {bookingOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setFilter(option.value)}
                className={`py-2 px-1.5 md:px-2 flex-1 rounded-lg text-center font-bold transition-all text-xs md:text-sm whitespace-nowrap ${
                  filter === option.value
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-hover'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="max-w-4xl mx-auto flex flex-col gap-4 px-4 md:px-6 py-6 mb-24">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <MiniTicketSkeleton key={index} />
              ))
            ) : filteredBookings.length > 0 ? (
              filteredBookings.sort((a, b) => new Date(b.booking_time).getTime() - new Date(a.booking_time).getTime()).map((booking) => (
                <MiniTicket key={booking.id} booking={booking} onReviewSuccess={fetchBookings} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">ليس لديك رحلات</p>
              </div>
            )}
          </div>
        </section>
      </MainLayout>
    </main>
  );
}

export default index;
