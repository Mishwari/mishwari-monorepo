import React, { useEffect, useRef } from 'react'
import InputField from './Booking_Board/InputField'
import Image from 'next/image'

interface FromToProps {
    list:any;
    selectFrom:string;
    selectTo:string;
    setSelectFrom: any;
    setSelectTo: any;
    isEditFromTo:boolean

}

function FromToInputComponent({list,selectFrom,selectTo,setSelectFrom,setSelectTo,isEditFromTo}:FromToProps) {

    const handleSwitchFromTo =() => {

        setSelectFrom(selectTo)
        setSelectTo(selectFrom)
    }

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (isEditFromTo) { // Assuming isEditFromTo is a prop to indicate if the modal is open
        const timer = setTimeout(() => {
          inputRef.current?.blur();
        }, 100); // Adjust delay as needed
    
        return () => clearTimeout(timer);
      }
    }, [isEditFromTo, inputRef]);

    

  return (
    <div className='flex justify-center items-center'> {/* From and To should be in a component */}
              <div className='mt-[3rem] pr-1 '>
                <img alt='fromtosvg' src='\icons\fromToIcon.svg' className='h-28 w-4 object-contain' />
              </div>

              <div className='pr-2 pl-0'>
                <div className=' relative'>
                  <h1 className='text-right font-regular text-sm text-[#676767] pt-3'>من</h1>
                  <InputField list={list} selected={selectFrom} setSelected={setSelectFrom} />

                </div>

                <div className='relative'> 
                  <h1 className='text-right font-regular text-sm text-[#676767] pt-7 '>إلى</h1>
                  <InputField list={list} selected={selectTo} setSelected={setSelectTo} />
                </div>
              </div>

              <div onClick={handleSwitchFromTo} className='h-7 w-7 mt-[4.3rem] overflow-hidden rounded-full bg-grey-200 '>
              <Image
                className='hover:bg-[#00558711] active:bg-[#00558734] cursor-pointer rounded-full'
                      src='/icons/SwitchArrows.svg'
                      alt='switchArrows'
                      height={35}
                      width={35}
                />
              </div>
              
            </div>
  )
}

export default FromToInputComponent