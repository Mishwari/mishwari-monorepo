import React, { useEffect, useState } from 'react';
import Within_Cities from './Within_Cities';
import Between_Cities from './Between_Cities';
import { Tab, Tabs } from '@nextui-org/react';
import Image from 'next/image';
import {
  CalendarDaysIcon,
  CreditCardIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import InputField from './InputField';
import DatePicker from '../DatePicker';
import ClientOnly from '../ClientOnly';
import axios from 'axios';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

function Butt_Selecte_trip() {
  const [selectfromCity, setselectfromCity] = useState<any>(null);
  const [selecttoCity, setselecttoCity] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);

  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectfromCity && selecttoCity) {
      router.push({
        pathname: '/bus_list',
        query: {
          tripType: 2,
          city: '',
          pickup: selectfromCity,
          destination: selecttoCity,
          date: format(selectedDate, 'yyyy-MM-dd'),
        },
      });
    } else {
      alert('Please select both cities');
    }
  };

  useEffect(() => {
    const fetchCityList = async () => {
      try {
        const response = await axios.get('/api/next-external/citylist');
        setList(response.data);
      } catch (err: any) {
        setList([]);
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
    };
    fetchCityList();
  }, []);

  const handleSwitchFromTo = () => {
    setselectfromCity(selecttoCity);
    setselecttoCity(selectfromCity);
  };

  const [togglebtn, settogglebtn] = useState('1');

  const Togglebtn = (index: string) => {
    settogglebtn(index);
  };

  function renderButton() {
    if (togglebtn === '1') {
      return (
        <form
          onSubmit={handleSubmit}
          className='mt-8 group w-full flex flex-wrap  gap-4 lg:gap-0  lg:rounded-md lg:bg-color-canvas-primary lg:shadow-md'>
          <div className='w-full lg:w-5/12 relative z-2 flex flex-wrap sm:flex-nowrap sm:justify-between lg:flex-nowrap shadow-lg lg:shadow-none bsorder border-[#b7e4ff] bg-slate-200 rounded-lg lg:rounded-l-none lg:border-l-0 '>
            {/* <div className='sm:hidden absolute inset-2 px-2'>
          <Image
            src='\icons\fromToIcon.svg'
            width={12}
            height={20}
            alt='fromtosvg'
            className='  object-contain'
          />
        </div> */}

            <div className='flex justify-start items-center px-3 gap-4 w-full h-14  '>
              <Image
                src='\icons\pickIcon.svg'
                width={18}
                height={8}
                alt='fromtosvg'
                className='sm:hidden inset-3  object-contain'
              />
              <div className='flex flex-col w-full '>
                <h1 className='text-[8px] font-bold '>الانطلاق</h1>
                <InputField
                  list={list}
                  selected={selectfromCity}
                  setSelected={setselectfromCity}
                />
              </div>
            </div>
            <div
              onClick={handleSwitchFromTo}
              className=' absolute z-10 left-4  bg-inherit  flex items-center justify-center self-center h-max w-max sm:w-28  sm:static  sm:justify-center sm:items-center rounded-full sm:rotate-90 overflow-hidden '>
              <div className='  border-2 border-[#f4fafe]   hover:bg-[#00558711] active:bg-[#00558734]  cursor-pointer sm:border-0 p-2.5 sm:p-0 rounded-full bg-inherit  '>
                <Image
                  className=' '
                  src='/icons/SwitchArrows.svg'
                  alt='switchArrows'
                  height={25}
                  width={25}
                />
              </div>
            </div>

            <div className='sm:hidden  w-full h-[2px] bg-[#f4fafe] ' />

            <div className='relative flex justify-start items-center px-3 gap-4 w-full h-14 bsg-stone-200 '>
              <Image
                src='\icons\destIcon.svg'
                width={15}
                height={8}
                alt='fromtosvg'
                className='sm:hidden inset-3  object-contain'
              />
              <div className='flex flex-col w-full'>
                <h1 className='text-[8px] font-bold '>الوجهة</h1>
                <InputField
                  list={list}
                  selected={selecttoCity}
                  setSelected={setselecttoCity}
                />
              </div>
            </div>
          </div>

          <div className='w-full lg:w-7/12  flex flex-wrap gap-4 sm:gap-0 sm:rounded-lg sm:shadow-lg lg:shadow-none overflow-hidden sm:border bodrder-[#b7e4ff] lg:rounded-l-lg lg:rounded-r-none lg:border-r-0 '>
            <div className='w-full h-14 sm:w-10/12 md:w-9/12 lg:w-8/12 flex flex-wrap justify-start items-center gap-4 px-4 bg-slate-200 shadow-lg sm:shadow-none sm:flex-nowrap  rounded-lg sm:rounded-none relative'>
              <CalendarDaysIcon 
                className='w-max h-full py-2 text-[#005687] cursor-pointer' 
                onClick={() => setShowCalendar(!showCalendar)}
              />
              <h1 className='text-sm'>{format(selectedDate, 'EEEE, d MMMM', { locale: ar })}</h1>
              {showCalendar && (
                <>
                  <div className='fixed inset-0 z-40' onClick={() => setShowCalendar(false)} />
                  <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50'>
                    <DatePicker 
                      selectedDate={selectedDate}
                      onDateSelect={(date) => {
                        setSelectedDate(date);
                        setShowCalendar(false);
                      }}
                    />
                  </div>
                </>
              )}
            </div>
            <button
              type='submit'
              className='flex text-center text-white text-xl font-bold justify-center items-center w-full h-12 sm:h-14 sm:w-2/12 md:w-3/12 lg:w-4/12  max-sm:mb-100 max-sm:rounded-md bg-[#005687]'>
              بحث
            </button>
          </div>
        </form>
      );
      // <Between_Cities />
    } else if (togglebtn === '2') {
      return <Within_Cities />;
    }
  }
  return (
    <div className='pt-6 pb-0 mb-0 px-2 w-full flex flex-col justify-center items-center'>
      <Tabs
        style={{ margin: '' }}
        aria-label='Options'
        classNames={{ tabContent: 'text-primary ' }}
        color='primary'
        onSelectionChange={settogglebtn as any}
        fullWidth
        className='w-full max-w-xl '
        disabledKeys={['3', '2']}>
        <Tab
          key='1'
          title='بين المدن'></Tab>
        <Tab
          key='2'
          title='داخل المدينة'></Tab>
        <Tab
          key='3'
          title='دولي'></Tab>
      </Tabs>
      <div className='w-full'>{renderButton()}</div>
    </div>
  );
}

export default Butt_Selecte_trip;
