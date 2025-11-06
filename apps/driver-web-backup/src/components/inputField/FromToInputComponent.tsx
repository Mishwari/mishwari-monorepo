import React from 'react'
import { InputField } from './InputField';
import Image from 'next/image'

interface FromToProps {
    list:any;
    selectFrom:string;
    selectTo:string;
    setSelectFrom: any;
    setSelectTo: any;

}

function FromToInputComponent({list,selectFrom,selectTo,setSelectFrom,setSelectTo}:FromToProps) {

    const handleSwitchFromTo =() => {

        setSelectFrom(selectTo)
        setSelectTo(selectFrom)
    }

  return (
    <div className='flex justify-center items-center'> {/* From and To should be in a component */}
              <div className='mt-[3rem] '>
                <Image alt='fromtosvg' src='\icons\fromToIcon.svg' className='h-28 w-4 object-contain' />
              </div>

              <div className='pl-2 pr-1'>
                <div className=' relative'>
                  <h1 className='font-regular text-sm text-[#676767] pt-3'>من</h1>
                  <InputField list={list} selected={selectFrom} setSelected={setSelectFrom}/>
                </div>

                <div className='relative'> 
                  <h1 className='font-regular text-sm text-[#0c0b0b] pt-7 '>إلى</h1>
                  <InputField list={list} selected={selectTo} setSelected={setSelectTo}/>
                </div>
              </div>

              <div onClick={handleSwitchFromTo} className='h-7 w-7 mt-[4rem] overflow-hidden rounded-full bg-grey-200 '>
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
