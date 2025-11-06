import React, {useEffect} from 'react';
import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import FromToInputComponent from '../inputField/FromToInputComponent';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import testdata from './testdata.json';

import { createTrip } from '@/actions/tripsActions';
import { useDispatch, useSelector } from 'react-redux';
import SimpleListBox from '@/components/inputField/SimpleListBox';
import axios from 'axios';
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


// const list = testdata.map((item) => ({
//   id: item.country_id,
//   name: item.country_name,
// }));

dayjs.extend(utc);
dayjs.extend(timezone);
function CreateTripModal({ isOpen, setIsOpen }: any) {

  const [list, setList] = useState<any>([]);

  useEffect(() => {
    const fetchCityList = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}city-list`)
        setList(response.data)
      } catch (err:any) {
        setList([])
        console.log('Error Message: ', err.message);
        if (err.response) {
          console.error('Error response:', err.response.data);
          console.error('Error response status:', err.response.status);
          console.error('Error response headers:', err.response.headers);
        } else if (err.request) {
          console.error('Error request:', err.request);
        } else {
          console.error('Error message:', err.message);
        }
      }
    }
    fetchCityList();
  },[])


  const dispatch = useDispatch();
  const { token } = useSelector((state: any) => state.auth);
  const driverDetails = useSelector((state: any) => state.driver.driverDetails);
  const driverId =
    driverDetails && driverDetails.length > 0 ? driverDetails[0].id : null;
  const [selectedFrom, setSelectedFrom] = useState<any>(null);
  const [selectedTo, setSelectedTo] = useState<any>(null);
  const [selectedDepartureTime, setSelectedDepartureTime] =
    React.useState<Dayjs | null>(dayjs.tz());
  const [selectedArrivalTime, setSelectedArrivalTime] =
    React.useState<Dayjs | null>(dayjs.tz());
  const [tripPrice, SetTripPrice] = useState<number>();
  const [routeList, setRouteList] = useState<any>([]);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [routePointList, setRoutePointList] = useState<any | null>(null);

  const cancelButtonRef = useRef(null);
  const tripData = {
    driver_id: driverId,
    pickup: selectedFrom,
    destination: selectedTo,
    departure_time: selectedDepartureTime,
    price: tripPrice,
  };

  const detail = () => {
    dispatch(createTrip(tripData, token) as any);
    setIsOpen(false);
  };

  useEffect(() => {
    setSelectedRoute(null)
    if (selectedFrom && selectedTo && token) {
      // request
      const fetchrouteList = async () => {
        try{
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          //request
          const response = await axios.get(`${apiBaseUrl}route/?start=${selectedFrom}&end=${selectedTo}`, config)
          setRouteList(response.data);
        } catch (err:any) {
          setRouteList([]);
          console.log('Error Message: ', err.message);
        if (err.response) {
          console.error('Error response:', err.response.data);
          console.error('Error response status:', err.response.status);
          console.error('Error response headers:', err.response.headers);
        } else if (err.request) {
          console.error('Error request:', err.request);
        } else {
          console.error('Error message:', err.message);
        }
        }
        
      }
      fetchrouteList();
    }
  },[selectedFrom,selectedTo])

  
  useEffect(() => {
    if (routeList.length !== 0 && selectedRoute !== null && token) { 
      const fetchRoutePoints = async () => {
        try{
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await axios.get(`${apiBaseUrl}route/${selectedRoute}/waypoints/`, config);
          setRoutePointList(response.data);
        } catch (err:any) {
          setSelectedRoute(null)
          setRoutePointList(null)
          console.log('Error Message: ', err.message);
        if (err.response) {
          console.error('Error response:', err.response.data);
          console.error('Error response status:', err.response.status);
          console.error('Error response headers:', err.response.headers);
        } else if (err.request) {
          console.error('Error request:', err.request);
        } else {
          console.error('Error message:', err.message);
        }
      }
    } 
      fetchRoutePoints();
      
    }
  }, [selectedRoute])
  
  return (
    <>
      <Transition
        show={isOpen} // isOpen
        as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-10 overflow-y-auto '
          initialFocus={cancelButtonRef}
          onClose={setIsOpen}>
          <Dialog.Overlay className='fixed inset-0 bg-black opacity-30' />
          <Transition.Child
            as={Fragment}
            enter='transition ease-in duration-300 transform'
            enterFrom='translate-y-full'
            enterTo='translate-y-0'
            leave='transition ease-in duration-300 transform'
            leaveFrom='translate-y-0'
            leaveTo='translate-y-full'>
              
            <div className='flex-col justify-center items-center bg-slate-100 pb-2 w-full max-h-[95%] md:max-h-max overflow-y-auto md:w-max md:min-w-[500px] h-max  rounded-t-3xl md:rounded-xl fixed bottom-0 md:left-1/2 md:top-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 shadow-2xl'>
              <div
              onClick={() => setIsOpen(false)}
              className='md:hidden sticky top-1 h-[3px] w-1/2 mx-auto mt-[5px] rounded-full bg-gray-400'></div>
              <h1 className='text-center mt-6 text-2xl font-bold  text-[#005687]'>
                إبدأ رحلة جديدة
              </h1>
              <FromToInputComponent
                list={list}
                selectFrom={selectedFrom}
                setSelectFrom={setSelectedFrom}
                selectTo={selectedTo}
                setSelectTo={setSelectedTo}
              />

              <div className='flex flex-col items-center justify-center pl-4'>
                
                <div className='relative flex flex-col '>
                  <p className='mt-8  w-max text-[#676767]'>حدد المسار</p>
                  <SimpleListBox options={routeList} setSelectedRoute={setSelectedRoute} />
                </div>
            
                <div className='flex flex-col'>
                  <p className='mt-8 w-max text-[#676767] '>
                    نقاط التوقف
                  </p>
                  <div className='w-64 mt-2 md:w-96 h-max  bg-gray-200 rounded-lg'>
                    {selectedRoute !=null ? (
                    <div className='flex flex-wrap gap-2 px-2 py-1 text-xs text-balance '>
                      <h1 className=' text-black font-bold'>{routePointList?.start_city} - </h1>
                      {
                        routePointList?.waypoints.map((item:any, index:number) => (
                          <h1 key={index}>{item?.waypoint_name} - </h1>
                          
                        ))
                      }
                      
                      <h1 className='text-black font-bold'> {routePointList?.end_city} </h1>
                    </div>
                    ) 
                    :
                    (
                      <h1 className='px-2 pt-1 pb-6 text-xs'>
                        لم يتم تحديد المسار
                      </h1>
                    )}
                  </div>
                </div>

                <div className='flex flex-col'>
                  <p className='mt-8 mb-2 w-full text-[#676767] text-right '>
                    تاريخ ووقت الانطلاق
                  </p>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      value={selectedDepartureTime}
                      onChange={setSelectedDepartureTime}
                      className='w-64 md:w-96 font-bold text-gray-700'
                      sx={{
                        fontWeight: '100px',
                        fontSize: '10rem',
                        borderBottom: '2px solid #005687',
                        '& .MuiInputBase-input': {
                          paddingY: '2px',
                          paddingLeft: '2px',
                          // fontSize:"19px",
                          fontWeight: '800',
                          color: '#616161',
                        },
                      }}
                      viewRenderers={{
                        hours: renderTimeViewClock,
                        minutes: renderTimeViewClock,
                        seconds: renderTimeViewClock,
                      }}
                    />
                  </LocalizationProvider>
                </div>
    
                <div className='relative flex flex-col'>
                  <p className='mt-8  w-max text-[#676767]'>السعر</p>
                  <input
                    type='number'
                    value={tripPrice}
                    onChange={(e: any) => {
                      SetTripPrice(e.target.value);
                    }}
                    className='bg-transparent w-64 md:w-96 text-lg font-extrabold text-[#676767] border-b-2 border-[#005687] overflow-hidden focus:outline-none'
                  />
                  <p className='absolute font-semibold left-0 pt-3 top-1/2'>
                    ريال يمني
                  </p>
                </div>
              </div>

              <button
                type='button'
                onClick={detail}
                className='py-3 px-10 mx-auto  mt-12   bg-[#005687] rounded-md text-white flex gap-x-3'>
                انشاء الرحلة
              </button>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

export default CreateTripModal;
