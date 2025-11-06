import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { CheckIcon } from "@heroicons/react/24/outline";
import Link from 'next/link';


function success() {
  const router = useRouter();
  const { session_id } = router.query;

  return (
    <div className='flex flex-col h-screen bg-white '>
      <div className='flex flex-col justify-center items-center text-center h-full'>

        <div className=' flex justify-center  items-center '>

          <CheckIcon className="h-24 w-24 text-green-400" />
        </div>

        <h1 className='text-xl font-semibold '>تم الدفع بنجاح !</h1>
        <p>شكرا لحجزك التذكرة. حجزك قيد التنفيذ الان.</p>
      </div>
      <div className=' flex justify-center items-center p-3/5 mb-6'>
        <Link href='/' className='py-2 px-4 text-white text-lg rounded-lg bg-[#005687]' >
          عرض معلومات التذكرة
        </Link>
      </div>
    </div>
  )
}

export default success