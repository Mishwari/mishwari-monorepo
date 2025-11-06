import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

function bookingId() {
  return (
    <main>
      <header className='py-4 px-2 bg-[#005687]'>
        <div className='flex gap-2 text-xl text-white '>
          <Link href={`/my_trips`}>
            <Image
              src='/icons/leftArrow_white.svg'
              alt='leftArrow'
              height={30}
              width={30}
              className='rotate-180 white'
            />
          </Link>
          <h1 className=''>رحلتي</h1>
        </div>
      </header>
      <section>
        
      </section>
    </main>
  )
}

export default bookingId