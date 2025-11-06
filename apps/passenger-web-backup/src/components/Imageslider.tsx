"use client";
import React from 'react';
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
function imageslider() {
    return (
        <div className=' relative z-0 h-[18vh] overflow-hidden flex justify-center items-center'>
            <div className='w-full h-full bg-[#005687]'></div>
            {/* <Swiper
                pagination={{
                    dynamicBullets: true,
                }}
                modules={[Pagination]}
                className="mySwiper h-[25vh] flex justify-center items-center"
            >
                <SwiperSlide className='flex justify-center items-center'> <img alt='' src='/img1.jpg'  style={{objectFit:'cover',width:'100%', height:'100%',padding:'0 0', objectPosition : '50% 70%'}}  /> </SwiperSlide>
                <SwiperSlide className='flex justify-center items-center'> <img alt='' src='/img2.jpg'  style={{objectFit:'cover',width:'100%', height:'100%',padding:'0 0', objectPosition : '50% 70%'}}  /> </SwiperSlide>
            </Swiper> */}
        </div>
    )
}

export default imageslider