import React, { useEffect, useState } from 'react'
import Image from 'next/image';


function FlipButton({flip, setFlip}:any) {

    const [localFlip, setLocalFlip]= useState<boolean>(false)

    useEffect(() => {
        if(flip !== undefined) {
            setFlip(localFlip)
        }
    },[localFlip])

    return (
        <div 
        className={`cursor-pointer  mr-2 flex gap-x-[0.55rem]  ${localFlip ? "opacity-50" : "rotate-180"} transition duration-200 `}
        onClick={localFlip? () => setLocalFlip(false): () => setLocalFlip(true)}>
            <div className='h-4 w-[0.05rem] bg-black -rotate-[37deg]'></div>
            <div className='h-4 w-[0.05rem] bg-black rotate-[37deg]'></div>





            {/* <Image
        onClick={flipArrow? () => setFlipArrow(false): () => setFlipArrow(true)}
        src='/icons/downArrow.svg'
        alt='downArrow'
        height={30}
        width={30}
        className={`cursor-pointer   ${flipArrow ? "" : "rotate-180"}  duration-200 `}
    /> */}
    </div>
    )
    }

export default FlipButton