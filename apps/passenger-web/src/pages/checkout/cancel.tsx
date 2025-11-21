import React from 'react'
import { useRouter } from 'next/router';
import axios from 'axios';
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from 'next/link';


function cancel() {
  return (
    <div className='flex flex-col h-screen bg-white '>
      <div className='flex flex-col justify-center items-center text-center h-full'>

        <div className=' flex justify-center  items-center '>

          <XMarkIcon className="h-24 w-24 text-red-500" />
        </div>

        <h1 className='text-xl font-semibold '> فشلت عملية الدفع</h1>
        {/* <p>شكرا لحجزك التذكرة. حجزك قيد التنفيذ الان.</p> */}
      </div>
      <div className=' flex justify-center items-center p-3/5 mb-6'>
        <Link href='/' className='py-2 px-4 text-white text-lg rounded-lg bg-[#005687]' >
          العودة الى معلومات الرحلة
        </Link>
      </div>
    </div>
  )
}

export default cancel