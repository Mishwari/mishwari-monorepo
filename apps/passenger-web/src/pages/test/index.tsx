import React, { useState, useEffect, useRef } from 'react';

import countries from '../../../public/countries.json';
import axios from 'axios';

const PhoneNumberInput = () => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // For the search functionality
  const dropdownRef = useRef(null); // Reference for the dropdown

  useEffect(() => {
    const fetchCityList = async () => {
      try {
        const response = await axios.get('/api/next-external/city-list');
        // const response = await axios.get(`${apiBaseUrl}city-list/pickup`);
      } catch (err: any) {
        // setList([]);
        console.error('Error Message: ', err.message);
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

  return (
    <div
      dir='ltr'
      className='relative phone-input-container flex flex-col w-full  justify-center items-center  h-screen '>
      <div className=' flex items-center self-center bg-slate-300  w-[300px]  rounded-md'>
        {/* Country dropdown */}
        <div
          className='pl-1 relative bg-inherit '
          ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className='px-2    w-max flex gap-1.5 justify-between items-center'>
            <span className='font-bold noto-color-emoji  text-[26px] leading-6 '>
              {selectedCountry.symbol}
            </span>{' '}
            {/* Only symbol after selection */}
            <svg
              height='20'
              width='20'
              viewBox='0 0 20 20'
              aria-hidden='true'
              focusable='false'
              className={`${
                dropdownOpen ? 'rotate-180' : ''
              } transform ease-in-out delay-100 css-8mmkcg`}>
              <path d='M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z'></path>
            </svg>
          </button>

          {dropdownOpen && (
            <div className='absolute left-0 mt-2 px-2 w-max bg-white border border-gray-300 z-10'>
              {/* Search input */}
              <input
                type='text'
                dir='rtl'
                value={searchTerm}
                placeholder='ابحث...'
                className='p-2 w-full border-b border-gray-300 focus:outline-none'
              />

              {/* Dropdown list */}
              <ul className='max-h-60 overflow-auto'>
                <li className='p-2 text-gray-500'>لاتوجد نتيجة مطابقة</li>
              </ul>
            </div>
          )}
        </div>

        {/* Phone number input */}
        <div className='relative flex items-center w-full bg-slate-200  text-lg leading-snug tracking-widest rounded-md overflow-hidden '>
          <span
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className=' w-max font-bold px-2'>
            +{selectedCountry.code}
          </span>
          <input
            type='tel'
            inputMode='numeric'
            pattern='[0-9]*'
            value={phoneNumber}
            autoFocus
            placeholder={`ادخل ${selectedCountry.digitLength} ${
              selectedCountry.digitLength <= 10 ? 'ارقام' : 'رقم'
            } `}
            className=' py-2 px-1.5 w-full bg-slate-150  font-bold tracking-widest focus:outline-none '
          />
        </div>
      </div>
      {error && <p className=' my-2 text-red-600'>{error}</p>}
    </div>
  );
};

export default PhoneNumberInput;
