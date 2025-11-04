import React, { useEffect, useState } from 'react';

interface DoubleSliderProps {
  min: number;
  max: number;
  handleMinPriceChange: any;
  handleMaxPriceChange: any;
  modifiedMin: number;
  modifiedMax: number;
}

function DoubleSlider({
  min,
  max,
  handleMinPriceChange,
  handleMaxPriceChange,
  modifiedMin,
  modifiedMax,
}: DoubleSliderProps) {
  const [minPrice, setMinPrice] = useState<number>(Number(0));
  const [maxPrice, setMaxPrice] = useState<number>(Number(0));
  const [inputMinPrice, setInputMinPrice] = useState<number>(Number(0));
  const [inputMaxPrice, setInputMaxPrice] = useState<number>(Number(0));
  useEffect(() => {
    let roundedMin = Math.floor(Number(modifiedMin) / 10) * 10;
    let roundedMax = Math.ceil(Number(modifiedMax) / 10) * 10;
    setMinPrice(Number(roundedMin));
    setMaxPrice(Number(roundedMax));
    setInputMinPrice(Number(roundedMin));
    setInputMaxPrice(Number(roundedMax));
  }, [modifiedMin, modifiedMax]);

  const minThumb = ((minPrice - min) / (max - min)) * 100; //0
  const maxThumb = 100 - ((maxPrice - min) / (max - min)) * 100; //0


  const handleMinChange = (value: number) => {
    let newMinPrice = Math.min(value, maxPrice - 10);
    setMinPrice(newMinPrice);
    handleMinPriceChange(newMinPrice);
  };

  const handleMaxChange = (value: number) => {
    let newMaxPrice = Math.max(value, minPrice + 10);
    setMaxPrice(newMaxPrice);
    handleMaxPriceChange(newMaxPrice);
  };

  const handleInputMinChange = (e: any) => {
    setInputMinPrice(Number(e.target.value));
  };

  const handleInputMaxChange = (e: any) => {
    setInputMaxPrice(Number(e.target.value));
  };

  const handleMinBlur = () => {
    let newMinPrice = Math.max(
      min,
      Math.min(Number(inputMinPrice), maxPrice - 10)
    );
    setMinPrice(newMinPrice);
    handleMinPriceChange(newMinPrice);
  };

  const handleMaxBlur = () => {
    let newMaxPrice = Math.min(
      max,
      Math.max(Number(inputMaxPrice), minPrice + 10)
    );
    setMaxPrice(newMaxPrice);
    handleMaxPriceChange(newMaxPrice);
  };

  return (
    <div className='flex justify-center items-center'>
      <div className='relative max-w-xl w-full mx-2'>
        <div className='flex justify-between items-center mb-6'>
          <div className='text-sm text-gray-700'>
            <span className='font-semibold'>{minPrice}</span>
            <span className='text-xs mr-1'>ريال</span>
          </div>
          <div className='text-sm text-gray-700'>
            <span className='font-semibold'>{maxPrice}</span>
            <span className='text-xs mr-1'>ريال</span>
          </div>
        </div>
        <div className='w-full relative'>
          <input
            type='range'
            step='10'
            min={Math.floor(min / 10) * 10}
            max={Math.ceil(max / 10) * 10}
            value={minPrice}
            onChange={(e) => {
              const value = Number(e.target.value);
              handleMinChange(value);
              setInputMinPrice(value);
            }}
            className='absolute pointer-events-none appearance-none z-20  w-full opacity-0 cursor-pointer'
          />
          <input
            type='range'
            step='10'
            min={Math.floor(min / 10) * 10}
            max={Math.ceil(max / 10) * 10}
            value={maxPrice}
            onChange={(e) => {
              const value = Number(e.target.value);
              handleMaxChange(value);
              setInputMaxPrice(value);
            }}
            className='absolute pointer-events-none appearance-none z-20  w-full opacity-0 cursor-pointer  '
          />
          <div className='relative z-10 h-4 w-full '>
            <div className='absolute z-10 left-0 right-0 bottom-0 top-0 rounded-lg bg-[#ECF3F4] border-1 border-[gray-400]'></div>
            <div
              className='absolute z-20 top-0 h-4 bottom-0 rounded-md bg-[#005687]'
              style={{ left: `${maxThumb}%`, right: `${minThumb}%` }}></div>
            <div
              className='flex items-center justify-center absolute z-30 w-8 h-8 top-0 right-0 bg-[#ECF3F4] border-1 border-[#005687] rounded-full -mt-2 '
              style={{ right: `${minThumb}%` }}>
              <div className='w-4 h-4 bg-[#005687] rounded-full  '></div>
            </div>
            <div
              className='flex items-center justify-center absolute z-30 w-8 h-8 top-0 left-0 bg-[#ECF3F4] border-1 border-[#005687] rounded-full -mt-2  -mr-2 cursor-pinter'
              style={{ left: `${maxThumb}%` }}>
              <div className='w-4 h-4 bg-[#005687] rounded-full  '></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoubleSlider;
