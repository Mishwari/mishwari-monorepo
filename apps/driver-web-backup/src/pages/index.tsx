import DriverProfile from "@/components/Modals/DriverProfile";
import { useEffect, useState } from 'react';
import ActiveTripBox from "@/components/ActivrTripBox";
import { useSelector } from "react-redux";
import CreateTripModal from "@/components/Modals/CreateTripModal";
import { useRouter } from 'next/router';
import { AppState } from '../store/store';
import Image from "next/image";
export default function Home() {

  const router = useRouter();
  const authState = useSelector((state: AppState) => state.auth);
  const driverDetails = useSelector((state: any) => state.driver.driverDetails );
  const driver =
    driverDetails && driverDetails.length > 0 ? driverDetails[0] : null;


  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.push('/login'); // Redirect to the home page
    }
  }, [authState.isAuthenticated, router]);


  const [ isBurgerOpen, setBurgerIsOpen ] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [anyActiveTrips, setAnyActiveTrips] = useState<boolean>(false)



  return (
    <main className='md:flex md:flex-col md:justify-center  md:w-full mx-auto'>
      <div className='bg-[#005687] h-18 px-4 py-6 flex justify-between '>
        <button onClick={() => setBurgerIsOpen(true)}><Image src="./icons/burger_menu.svg" alt="burger_menu" width={12} height={12} className='h-6 w-6' /></button>
        <DriverProfile isOpen={isBurgerOpen} setIsOpen={setBurgerIsOpen} />
        <div className='flex gap-x-2 text-white'>
          <h1 className='font-semibold text-xl'>الرئيسية</h1>
          <Image src="./icons/home.svg" alt="" width={12} height={12} className='h-6 w-6' />
        </div>
      </div>

      <div className='mx-4'>
        <div className='pt-8  text-right'>
          <h1 className='font-cairo text-[#005687]'>مرحبا بك <b>{driver?.d_name}</b> </h1>
          <p className='text-slate-500'>رحلتك الحالية</p>
        </div>
        <ActiveTripBox 
        setIsOpen={setIsOpen} setAnyActiveTrips={setAnyActiveTrips}
        ongoingTrips ={ useSelector((state:any) =>
          state.trips?.tripsDetails
            ? state.trips?.tripsDetails.filter((trip:any) => trip?.trip_status === 'active')
            : null
        )}/>
        <CreateTripModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
        <div className="h-[1.4px] mx-auto w-11/12 bg-slate-400 mt-8" /> {/*line*/}

        <div className='my-8 md:mt-8'>
          <h1 className='text-[#042F40] text-xl font-bold '>احصائيات الحساب</h1>
          <div className='flex flex-col justify-center gap-y-6 mt-4'>
            <div className='flex justify-center gap-x-32'>
              <div>
                <p className='text-center font-bold text-2xl text-[#1FBF83]'>{driver?.driver_rating}</p>
                <p className='text-[#042F40] font-semibold'>تقييم السائق</p>
              </div>
              <div>
                <p className='text-center font-bold text-2xl text-[#1FBF83]'>123</p>
                <p className='text-[#042F40] font-semibold'>مجموع الرحلات</p>
              </div>
            </div>
            <div>
              <p className='text-center font-bold text-2xl text-[#1FBF83]'>340000 <small>ريال يمني</small> </p>
              <p className='text-[#042F40] font-semibold text-center'>المكسب المحقق</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
