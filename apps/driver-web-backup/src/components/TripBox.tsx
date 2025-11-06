import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { useSelector } from 'react-redux';
import TripDetails from './TripDetails/TripDetails';
import ConfirmModal from './TripDetails/ConfirmModal';

function TripBox({ setIsOpen }:any) {

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogParams, setConfirmDialogParams] = useState(null);

  const ongoingTrips = useSelector((state:any) =>
    state.trips?.tripsDetails
      ? state.trips?.tripsDetails.filter(
          (trip:any) => trip?.trip_status === 'pending'
        )
      : null
  );
   const openConfirmDialog = (params:any) => {
    setConfirmDialogParams(params);
    setShowConfirmDialog(true);
  };



  return (
    <div className='md:flex md:flex-col md:justify-center items-center md:gap-x-4'>
  
      {ongoingTrips != 0 && (
        <div className='my-6 ml-auto '>
            <h1 className='text-xl font-bold text-[#005687]'>الرحلات القادمة</h1>
        </div>
      )}
      <div className='grid w-full  grid-cols-1 md:grid-cols-2 xl:grid-cols-3  gap-6  place-content-between '>

      {ongoingTrips?.map((trip: any) => (
        
        <SingleTrip key={trip.id} trip={trip} onConfirm={openConfirmDialog}/>
        
        
      ))}
  
      </div>
  
      {showConfirmDialog && (
        <ConfirmModal
          showConfirmDialog={showConfirmDialog}
          setShowConfirmDialog={setShowConfirmDialog}
          params={confirmDialogParams}
        />
      )}
  
    </div>
  );
  
}

export default TripBox;


function SingleTrip ({key, trip, onConfirm }:any) {
  
  const [isTripDetailOpen, setIsTripDetailsOpen] = useState<boolean>(false)

  const [stopPoints, setStopPoints] = useState<any>([])
  useEffect(() => {

    let subtrip_conter = 0 
    let stopPoints_conter = []
    for (let i = 0; i < trip?.sub_trips.length; i++) {
      if (trip.sub_trips[i].pickup === trip.pickup){
        subtrip_conter++;
        stopPoints_conter.push({
          t_id: trip?.sub_trips[i].id,
          point_no: subtrip_conter,
          point_name: trip?.sub_trips[i].destination,
          point_arrival : trip?.sub_trips[i].arrival_time
        })
      }
        }
        setStopPoints(stopPoints_conter)
  },[])

  
  function calculateDuration(departure:any, arrival:any,hh="", mm="") {
    const departureDate:any = new Date(departure);
    const arrivalDate:any = new Date(arrival);
  
    const difference = arrivalDate - departureDate; // difference in milliseconds
    const hours = Math.floor(difference / 3600000); // convert milliseconds to hours
    const minutes = Math.floor((difference % 3600000) / 60000); // convert remaining milliseconds to minutes
  
    return `${hours} ${hh} ${minutes} ${mm}`;
  }

  function convertToReadableTime(isoString:string) {
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'مساءاً' : 'صباحاً';
  
    hours = hours % 12;
    hours = hours || 12; // the hour '0' should be '12'
  
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  
    return `${hours}:${minutesStr} ${ampm}`;
  }

  return (
    <div 
          
    key={trip.id}
    className='mt-4 border rounded-md border-slate-400 opacity-50 bg-[#E7F0F6] md:w-96 shadow-xl cursor-pointer hover:brightness-95  ease duration-150'
    >
      <div className='p-4 '
          onClick={() =>  setIsTripDetailsOpen(true)}
          >
        <div className='flex justify-between items-center'>
          <p className='text-[#005687] text-lg'>
            <b>{trip.pickup} - {trip.destination}</b>
          </p>
          <p className='text-slate-500'>{Math.round(trip.distance) } كم - {calculateDuration(trip.departure_time, trip.arrival_time,"ساعة","دقيقة")} </p>
        </div>
        <p className='text-slate-500 flex'><p>{trip.path_road}</p> - {stopPoints.length} نقاط توقف</p>
        <div className='mt-4 flex justify-between items-center'>
          <div className='flex items-center'>
            <Image
              src='./icons/from_to_3dots.svg'
              alt='from_to_3dots'
              className='h-20 w-3'
            />
            <div className='pr-2 flex flex-col gap-y-2'>
              <div className='flex gap-x-2'>
                <p>{trip.pickup}</p>
                <p>
                  <b>{convertToReadableTime(trip.departure_time)}</b>
                </p>
              </div>
              <p className='text-slate-500'>{stopPoints.length} نقاط توقف</p>
              <div className='flex gap-x-2 mt-1'>
                <p>{trip.destination}</p>
                <p>
                  <b>{convertToReadableTime(trip.arrival_time)}</b>
                </p>
              </div>
            </div>
          </div>
          <div className='text-[#005687] flex flex-col items-center'>
            {((calculateDuration( (new Date(Date.now())).toISOString(),trip.arrival_time,' ',' ')).slice(0,1)) != "-" &&
            <>
            <p className='text-5xl font-bold'>
           { ((calculateDuration( (new Date(Date.now())).toISOString(),trip.arrival_time,' ',' ')).slice(0,3))}
            </p>
            <p>
              <b>ساعات بقيت</b>
            </p>
            </>
            }
          </div>
        </div>
      </div>
    <TripDetails 
    isTripDetailOpen={isTripDetailOpen} 
    setIsTripDetailsOpen={setIsTripDetailsOpen} 
    trip={trip} 
    onConfirm={onConfirm}
    stopPoints={stopPoints}
    calculateDuration={calculateDuration}
    convertToReadableTime={convertToReadableTime}
/>

  </div>
  
  )

}
