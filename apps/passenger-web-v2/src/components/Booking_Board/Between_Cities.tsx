import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { addDays, format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useRouter } from 'next/router';
import InputField from './InputField';
import FromToInputComponent from '../FromToInputComponent';
import axios from 'axios';


const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


function Between_Cities() {
  const [Countrystate, setCountrystate] = useState<any>([]);
  const [selectfromCity, setselectfromCity] = useState<any>(null);
  const [selecttoCity, setselecttoCity] = useState<string>('');
  const [selectedMethods, setselectedMethods] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [togglecalenderbutton, settogglecalenderbutton] = useState<any>(false);

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

  // const list = Testdata.map((item) => ({
  //   id: item.country_id,
  //   name: item.country_name,
  // }));
  // const dateString = selectedDate ? selectedDate.toDateString() : 'No date selected';


  // const Toggle_Selected_City = (e: any) => {
  //   const getCountryName = e.target.value;
  //   const selectedcity: any = Testdata?.find(
  //     (x) => x.country_name === getCountryName
  //   );
  //   setCountrystate(selectedcity);
  // };

  const OnTarvelModeSelected = (e: any) => {
    const selectedvalue = e.target.value;
    if (e.target.checked) {
      setselectedMethods((prevValue: any) => [...prevValue, selectedvalue]);
    } else {
      setselectedMethods((prevValue) =>
        prevValue.filter((item) => item !== selectedvalue)
      );
    }
  };

  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push({
      pathname: '/bus_list',
      query: {
        tripType: 2,
        city: '',
        pickup: selectfromCity,
        destination: selecttoCity,
      },
    });
  };

  const containerRef = useRef<HTMLInputElement>(null);
  // Close calendar on date selection
  const handleDayClick = (day: any, { selected }: any) => {
    setSelectedDate(selected ? undefined : day);
    settogglecalenderbutton(false);
  };

  // Add an event listener to close the calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        settogglecalenderbutton(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const rendercalender = () => {
    settogglecalenderbutton(!togglecalenderbutton);
  };

  const handleTodayDateButton = (e: any) => {
    e.preventDefault();
    const todaysDate = new Date();
    setSelectedDate(todaysDate);
  };

  const handleTomwrowDateButton = (e: any) => {
    e.preventDefault();
    const tomwrowsDate = addDays(new Date(), 1);

    setSelectedDate(tomwrowsDate);
  };

  return (
    <div className='text-[#101010] mt-4 md:text-xl'>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col justify-center items-center'>
        <div className='umd:max-w-7xl pl-3 pr-2 md:pl-3 md:pr-2 py-4 h-fit rounded-3xl border bg-white border-slate-400 w-auto'>
          <FromToInputComponent
            list={list}
            selectFrom={selectfromCity}
            selectTo={selecttoCity}
            setSelectFrom={setselectfromCity}
            setSelectTo={setselecttoCity}
            isEditFromTo={false}
          />

          <div className='px-2'>
            <div>
              {' '}
              <h1 className='text-right font-semibold text-md text-[#676767] pt-4 pb-2'>
                تاريخ المغادرة
              </h1>
              <div
                ref={containerRef}
                className='flex items-center justify-between'>
                <div>
                  <button
                    onClick={handleTomwrowDateButton}
                    className='h-fit w-fit px-4 py-1 border border-[#005587d7] rounded-lg text-[#676767] text-sm md:text-large'>
                    غداً
                  </button>
                  <button
                    onClick={handleTodayDateButton}
                    className='h-fit w-fit px-4 py-1 mx-1.5 border border-[#005587d7] rounded-lg text-[#676767] text-sm md:text-large bg-slate-100'>
                    اليوم
                  </button>
                </div>
                <div className='flex justify-center items-center'>
                  {togglecalenderbutton && (
                    <div className='bg-slate-300 text-[#005687] rounded-xl absolute'>
                      <DayPicker
                        className='w-72 h-72'
                        mode='single'
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        onDayClick={handleDayClick}
                      />
                    </div>
                  )}
                  <p className='pl-2 md:pl-4 font-medium text-sm md:text-large text-[#676767]'>
                    {selectedDate
                      ? format(selectedDate, 'dd/MM/yyyy')
                      : 'حدد التاريخ'}
                  </p>
                      <Image
                        onClick={rendercalender}
                        alt='calender'
                        src='icons\calender.svg'
                        height={35}
                        width={35}
                        className='cursor-pointer'
                      />
                </div>

              </div>
            </div>

        
          </div>
        </div>
        <button
          type='submit'
          className='w-40 md:w-72 mt-4 py-2 border-2 border-slate-700 text-white bg-[#005687] rounded-lg'>
          ابحث عن الرحلات
        </button>
      </form>
    </div>
  );
}
export default Between_Cities;
