import React, { useState } from 'react';

interface SwitchSlideProp {
  initial?: string;
  setInitial?: any;
  isDisabled?: boolean;
}
function SwitchSlide({
  initial,
  setInitial,
  isDisabled = false,
}: SwitchSlideProp) {
  // const [female, setFemale] = useState:(false)c

  return (
    <div
      onClick={
        !isDisabled
          ? () => setInitial(initial === 'male' ? 'female' : 'male')
          : undefined
      }
      className={`relative flex w-full rounded-[17px] cursor-pointer mb-1 border-2 ${
        initial === 'male' ? 'border-[#005687]' : 'border-[#cf357d]'
      } text-lg font-bold text-center  items-center overflow-hidden `}>
      <div
        className={`py-1 sm:py-2 px-4 z-10  w-1/2 bg-transparent  duration-150 ${
          initial === 'male' ? 'text-white ' : ''
        }  `}>
        ذكر
      </div>
      <div
        className={`py-1 sm:py-2 px-4 z-10 w-1/2 bg-transparent duration-150 ${
          initial === 'female' ? ' text-white' : ''
        }`}>
        انثى
      </div>
      <div
        className={`absolute w-1/2 h-full   rounded-[14px] scale-x-125 scale-y-105  transition-transform duration-300 ease-in-out ${
          initial === 'female'
            ? '-translate-x-full bg-[#cf357d]'
            : 'bg-[#005687] '
        }  `}></div>
    </div>
  );
}

export default SwitchSlide;
