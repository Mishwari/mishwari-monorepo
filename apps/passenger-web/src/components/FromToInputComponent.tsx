import React, { useEffect, useState } from 'react'
import FromToIcon from '@mishwari/ui-web/public/icons/navigation/fromToIcon.svg';
import SwitchArrowsIcon from '@mishwari/ui-web/public/icons/common/SwitchArrows.svg';
import CityCombobox from './home/CityCombobox';
import { tripsApi } from '@mishwari/api';
import { useRouter } from 'next/router';

interface FromToProps {
    list:any;
    selectFrom:string;
    selectTo:string;
    setSelectFrom: any;
    setSelectTo: any;
    isEditFromTo:boolean
}

function FromToInputComponent({list,selectFrom,selectTo,setSelectFrom,setSelectTo}:FromToProps) {
    const router = useRouter();
    const [departureCities, setDepartureCities] = useState<any[]>([]);
    const [destinationCities, setDestinationCities] = useState<any[]>([]);
    const [loadingDeparture, setLoadingDeparture] = useState(false);
    const [loadingDestination, setLoadingDestination] = useState(false);

    const selectedDate = (router.query.date as string) || new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchDepartureCities = async () => {
            setLoadingDeparture(true);
            try {
                const cities = await tripsApi.getDepartureCities(selectedDate);
                setDepartureCities(cities);
            } catch (err) {
                console.error('Error fetching departure cities:', err);
                setDepartureCities([]);
            } finally {
                setLoadingDeparture(false);
            }
        };
        fetchDepartureCities();
    }, [selectedDate]);

    useEffect(() => {
        if (!selectFrom) {
            setDestinationCities([]);
            return;
        }
        const fetchDestinationCities = async () => {
            setLoadingDestination(true);
            try {
                const cities = await tripsApi.getDestinationCities(selectFrom, selectedDate);
                setDestinationCities(cities);
            } catch (err) {
                console.error('Error fetching destination cities:', err);
                setDestinationCities([]);
            } finally {
                setLoadingDestination(false);
            }
        };
        fetchDestinationCities();
    }, [selectFrom, selectedDate]);

    const handleSwitchFromTo =() => {
        setSelectFrom(selectTo)
        setSelectTo(selectFrom)
    }

  return (
    <div className='flex items-center gap-2 px-4'>
      <div className='flex-shrink-0'>
        <FromToIcon style={{ width: '16px', height: '112px' }} />
      </div>

      <div className='flex-1'>
        <div className='mb-6'>
          <h1 className='text-right text-sm text-gray-600 mb-1'>من</h1>
          <CityCombobox
            cities={departureCities}
            value={selectFrom}
            onChange={setSelectFrom}
            placeholder="حدد اليوم واختر مدينة الانطلاق"
            loading={loadingDeparture}
          />
        </div>

        <div>
          <h1 className='text-right text-sm text-gray-600 mb-1'>إلى</h1>
          <CityCombobox
            cities={destinationCities}
            value={selectTo}
            onChange={setSelectTo}
            placeholder="اختر مدينة الوجهة"
            loading={loadingDestination}
            disabled={!selectFrom}
          />
        </div>
      </div>

      <div onClick={handleSwitchFromTo} className='flex-shrink-0 h-[35px] w-[35px] rounded-full hover:bg-brand-primary/10 active:bg-brand-primary/20 cursor-pointer flex items-center justify-center'>
        <SwitchArrowsIcon style={{ width: '20px', height: '20px' }} />
      </div>
    </div>
  )
}

export default FromToInputComponent