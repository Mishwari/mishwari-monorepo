import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Booking } from '@/types/booking';
import { bookingsApi } from '@mishwari/api';
import MiniTicket from '@/components/MiniTicket';
import BackButton from '@/components/BackButton';
import HeaderLayout from '@/layouts/HeaderLayout';
import MiniTicketSkeleton from '@/components/Skeletons/MiniTicketSkeleton';
import Navbar from '@/components/Navbar';
import SideNav from '@/layouts/SideNav';
import { useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import { decryptToken } from '@/utils/tokenUtils';

function index() {
  const token = useSelector((state: AppState) => state.auth.token);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingsApi.getAll(decryptToken(token));
        setBookings(response.data);
        setFilteredBookings(response.data);
      } catch (err) {
        console.log(err);
        setError('Error getting bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

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
    { id: 3, label: 'مكتمل', value: 'completed' },
    { id: 4, label: 'ملغي', value: 'cancelled' },
  ];

  return (
    <main className='flex flex-col w-full bg-gray-50'>
      {/* <div className='fixed w-full top-0 z-10'>
        <Navbar />
      </div> */}
      <SideNav>
        <section className='relative bg-inherit '>
          <div className='sticky  z-10 top-16 bg-white px-2  md:px-4 lg:px-6 flex justify-between bg-inherit w-full  text-sm py-4 lg:py-6 h-full shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] '>
            {bookingOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setFilter(option.value)}
                className={`py-1.5 w-20 rounded-full text-center font-bold ${
                  filter == option.value
                    ? 'bg-brand-primary text-white'
                    : 'bg-gray-200'
                }`}>
                {option.label}
              </button>
            ))}
          </div>
          <div className='flex  flex-col gap-4 overflow-y-scroll  scrollbar-hide px-2  md:px-4 lg:px-6 mx-4 bg-inherit mb-24  '>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <MiniTicketSkeleton key={index} />
              ))
            ) : filteredBookings.length > 0 ? (
              filteredBookings.map((booking: Booking, key) => (
                <MiniTicket
                  key={key}
                  booking={booking}
                />
              ))
            ) : (
              <p className='h-full'>ليس لديك رحلات</p>
            )}
          </div>
          {/* <div className="mask h-24 w-32 bg-blue-700">
        <div className="">dgdg</div>
      </div> */}
        </section>
      </SideNav>
    </main>
  );
}

export default index;
