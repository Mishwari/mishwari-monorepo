import Image from 'next/image';
import Navbar from '../components/Navbar';
import Imageslider from '../components/Imageslider';
import Butt_Selecte_trip from '../components/Booking_Board/Butt_Selecte_trip';
import useAuth from '@/hooks/useAuth';
export default function Home() {
  const { isAuthenticated } = useAuth();
  // useAuth(true);
  return (
    <div className='flex flex-col gap-4  w-full bg-scroll h-screen bg-[#F4FAFE] mx-auto mb-0'>
      <div className='relative w-full'>
        <Navbar />
        <Imageslider />
        <Butt_Selecte_trip />
      </div>
      {/* <div className='bg-[#31324A] flex justify-center text-white py-2 mt-auto'>
        <p>طور بكل ❤️ في اليمن </p> 
      </div> */}
    </div>
  );
}
