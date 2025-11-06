import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import InputField from './InputField';
import FromToInputComponent from '../FromToInputComponent';
import axios from 'axios';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


function Within_Cities() {
  const [stateName, setStateName] = useState<string>();
  const [Countrystate, setCountrystate] = useState([]);
  const [selectCity, setSelectCity] = useState<any>();
  const [selectFrom, setSelectFrom] = useState<any>();
  const [selectTo, setSelectTo] = useState<any>();
  const [selectedMethods, setselectedMethods] = useState<string[]>([]);
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



  // const Toggle_Selected_City = (e: any) => {
  //   const getCountryName = e.target.value;
  //   const selectedcity: any = Testdata?.find(
  //     (x) => x.country_name === getCountryName
  //   );
  //   setCountrystate(selectedcity);
  //   setStateName(selectedcity.states);
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
        tripType: 1,
        city: selectCity,
        pickup: selectFrom,
        destination: selectTo,
      },
    });
    // alert("Selected Country:" + " " + selectCity + +"," + " From: " + " " + selectFrom + ", " + "To: " + " " + selectTo + " ," + "Travel Method by:" + " " + selectedMethods);
  };

  return (
    <div className='text-[#101010] my-4 md:text-xl'>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col justify-center items-center'>
        <div className='md:max-w-7xl pl-3 pr-2 md:pl-3 md:pr-2 py-4 h-fit rounded-3xl border bg-white border-slate-400 w-auto'>
          <div className='pr-7  pb-[12.5px] relative'>
            <h1 className='text-right font-regular text-sm text-[#676767] pt-3'>
              المدينة
            </h1>
            <InputField
              list={list}
              selected={selectCity}
              setSelected={setSelectCity}
            />
          </div>

          <FromToInputComponent
            list={list}
            selectFrom={selectFrom}
            selectTo={selectTo}
            setSelectFrom={setSelectFrom}
            setSelectTo={setSelectTo}
            isEditFromTo={false}
          />

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

export default Within_Cities;
