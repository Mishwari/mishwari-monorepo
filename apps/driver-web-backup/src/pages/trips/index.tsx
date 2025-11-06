import { useEffect, useState } from 'react';
import CreateTripModal from '@/components/Modals/CreateTripModal';
import TripBox from '@/components/TripBox';
import ActiveTripBox from '@/components/ActivrTripBox';
import HistoryTripBox from '@/components/HistoryTripBox';
import DriverProfile from '@/components/Modals/DriverProfile';
import TripDetails from '@/components/TripDetails/TripDetails';
import ConfirmModal from '@/components/TripDetails/ConfirmModal';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { AppState } from '../../store/store';
import Image from 'next/image';




export default function Trips() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isBurgerOpen, setBurgerIsOpen] = useState<boolean>(false);
  const [isTripDetailOpen, setIsTripDetailsOpen] = useState<boolean>(false);
  // console.log("anyActiveTrips ",anyActiveTrips)


  const router = useRouter();
  const authState = useSelector((state: AppState) => state.auth);
  // useEffect(() => {
  //   if (!authState.isAuthenticated) {
  //     router.push('/login'); // Redirect to the home page
  //   }
  // }, [authState.isAuthenticated, router]);

  return (
    <main className=' md:flex md:flex-col md:justify-center md:mx-auto md:w-full'>
      <div className='bg-[#005687] h-18 px-4 py-6 flex justify-between '>
        <button onClick={() => setBurgerIsOpen(true)}>
          <Image
            src='./icons/burger_menu.svg'
            alt='burger_menu'
            className='h-6 w-6'
          />
        </button>
        <div className='flex gap-x-2 text-white'>
          <h1 className=' font-semibold text-xl'>الرحلات</h1>
          <Image
            src='./icons/trips.svg'
            alt=''
            className='h-6 w-6'
          />
        </div>
      </div>


      <div className='m-4'>
        
        <ActiveTripBox setIsOpen={setIsOpen}  header={true}
        ongoingTrips ={ useSelector((state:any) =>
          state.trips?.tripsDetails
            ? state.trips?.tripsDetails.filter((trip:any) => trip?.trip_status === 'active')
            : null
        )}
        />

        <TripBox setIsOpen={setIsOpen} />
        <div className='h-[1.4px] mx-auto w-8/12 bg-slate-400 mt-8' />{' '}
        {/*line*/}
        <div className='mt-8'>
          <h1 className='text-[#005687] text-xl font-bold text-right '>
            الرحلات السابقة
          </h1>
          <HistoryTripBox />
        </div>
      </div>
      <CreateTripModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <DriverProfile
        isOpen={isBurgerOpen}
        setIsOpen={setBurgerIsOpen}
      />

    </main>
  );
}
