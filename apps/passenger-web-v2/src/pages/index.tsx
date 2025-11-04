import Navbar from '../components/Navbar';
import Imageslider from '../components/Imageslider';
import TripSearchForm from '../components/home/TripSearchForm';
import useAuth from '@/hooks/useAuth';

export default function Home() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className='flex flex-col gap-4 w-full bg-scroll h-screen bg-brand-secondary mx-auto mb-0'>
      <div className='relative w-full'>
        <Navbar />
        <Imageslider />
        <div className='pt-6 pb-0 mb-0 px-2 w-full flex flex-col justify-center items-center'>
          <TripSearchForm />
        </div>
      </div>
    </div>
  );
}
