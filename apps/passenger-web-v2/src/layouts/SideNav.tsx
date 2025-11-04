import BackButton from '@/components/BackButton';
import Navbar from '@/components/Navbar';
import SideNav from '@/components/side_nav/SideNav';
import React from 'react';
// import '../styles/globals.css';

interface HeaderLayoutProps {
  children?: React.ReactNode;
  title?: string;
}

const HeaderLayout: React.FC<HeaderLayoutProps> = ({ children, title }) => {
  return (
    <div className='h-screen flex flex-col bg-white sw-full'>
      <Navbar />
      <div className='flex-1 flex mt-16  '>
        <aside className='hidden fixed  top-0 md:block h-full tw-0 md:ml-[70%] md:w-[30%] max-w-[450px] '>
          <SideNav />
        </aside>
        <div className='flex-grow rw-full   top-16 h-max md:mr-[30%] md:w-[70%]'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default HeaderLayout;
