import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TripDetails from './TripDetails/TripDetails';
import ConfirmModal from './TripDetails/ConfirmModal';

function HistoryTripBox() {

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogParams, setConfirmDialogParams] = useState(null);

  const historyTrips = useSelector((state: any) =>
    state.trips?.tripsDetails
      ? state.trips?.tripsDetails.filter(
          (trip: any) =>
            trip?.trip_status === 'cancelled' ||
            trip?.trip_status === 'completed' ||
            trip?.trip_status === 'stopped'
        )
      : null
  );
  const openConfirmDialog = (params:any) => {
    setConfirmDialogParams(params);
    setShowConfirmDialog(true);
  };
  return (
    <div className='flex flex-wrap justify-center gap-x-3 p-2'>
      {historyTrips != 0 ? (
        historyTrips?.map((trip: any) => (
          <SingleTrip key={trip.id} trip={trip} onConfirm={openConfirmDialog}/>
        ))
      ) : (
        <h1 className='m-10 font-semibold text-lg'>
         ليس لديك رحلات سابقة
        </h1>
      )}
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

export default HistoryTripBox;

function SingleTrip({ key, trip, onConfirm }: any) {
  const [isTripDetailOpen, setIsTripDetailsOpen] = useState<boolean>(false);
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
      className={`flex gap-2 border overflow-hidden rounded-md   w-full my-1.5   cursor-pointer hover:brightness-95 ease duration-150  ${
        trip.trip_status === 'cancelled'
          ? 'bg-[#fffbfb] border-[#c4bfbd]'
          : trip.trip_status === 'stopped' ? 'bg-[#fffbfb] border-[#c4bfbd]': 'bg-[#f3faff] border-[#a7dfff]'
      } `}>
        <div className={` relative  w-5 h-full ${
        trip.trip_status === 'cancelled'
          ? 'bg-[#cc6242]'
          : trip.trip_status === 'stopped' ? 'bg-[#cc6242]': 'bg-[#3788b8]'
      } `}>
        <h1 className='text-white -rotate-90 text-sm absolute left-3.5 bottom-3 font-semibold  w-full h-full '>
        {trip?.trip_status == 'pending'
                      ? 'مؤجلة'
                      : trip?.trip_status == 'active'
                      ? 'تمشي'
                      : trip?.trip_status == 'stopped'
                      ? 'توقفت'
                      : trip?.trip_status == 'cancelled'
                      ? 'ملغية'
                      : trip?.trip_status == 'completed'
                      ? 'مكتمل'
                      : ''}
        </h1>
        </div>
      <div className='w-full pl-1' onClick={() => setIsTripDetailsOpen(true)}>
        <div className='flex gap-2'>
          <p className='font-semibold'>{convertToReadableTime(trip.departure_time)}</p>
          <p className='text-[#005687] text-base flex justify-between'>
            <b>
              {trip.pickup} - {trip.destination}
            </b>
          </p>
          <p className='text-[#222222] mr-auto ml-1 font-semibold'>
            {trip.price} ر.ي 
          </p>
         
        </div>
        <div className='flex mt-1 text-slate-500 gap-1'>
          <p className='order-1 flex'> <p> {trip.path_road} </p> - {stopPoints.length} نقاط توقف </p>
          <p className='order-2'> {Math.round(trip.distance) } كم </p>
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
  );
}
