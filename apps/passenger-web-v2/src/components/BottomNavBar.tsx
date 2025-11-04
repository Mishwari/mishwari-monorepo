import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HomeIcon, TicketIcon, UserIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

const BottomNavBar: React.FC = () => {
  const router = useRouter();
  const { pathname } = router;

  const links = [
    {
      href: '/',
      label: 'الرئيسية',
      icon: <HomeIcon className='h-7 w-7' />,
    },
    {
      href: '/my_trips',
      label: 'رحلاتي',
      icon: <TicketIcon className='h-7 w-7 ' />,
    },
    {
      href: '/profile',
      label: 'بروفايل',
      icon: <UserIcon className='h-7 w-7' />,
    },
  ];

  return (
    <div className='md:hidden fixed z-30 bottom-6 left-0 right-0   w-full '>
      <div className=' flex justify-center items-center w-full '>
        <div className='flex justify-around  w-max bg-[#005687] shadow-lg shadow-[#1e2f399c] rounded-full '>
          {links.map(({ href, label, icon }, key) => (
            <Link
              href={href}
              key={key}>
              <div className='flex relative flex-col items-center py-2 px-1.5 m-1'>
                {pathname === href && (
                  <motion.div
                    layoutId='underline'
                    className='absolute bottom-0 h-full w-full bg-blue-100 rounded-full '
                    transition={{
                      type: 'spring',
                      stiffness: 1500,
                      damping: 30,
                    }}
                  />
                )}

                <div
                  className={`z-10 flex justify-center  items-center text-center ${
                    pathname === href
                      ? `text-[#005687] font-bold ${key === 1 ? '-mx-0.5' : ''}`
                      : `text-slate-300  ${
                          key === 0 ? 'pr-1' : key === 2 ? 'pl-1' : ''
                        }`
                  }`}>
                  {icon}
                  {pathname === href && (
                    <span className='w-[4.5rem]'>{label}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomNavBar;
