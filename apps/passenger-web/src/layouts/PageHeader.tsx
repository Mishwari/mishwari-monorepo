import React from 'react';
import { useRouter } from 'next/router';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface HeaderLayoutProps {
  children?: React.ReactNode;
  title?: string;
}

const HeaderLayout: React.FC<HeaderLayoutProps> = ({ children, title }) => {
  const router = useRouter();

  return (
    <>
      <header className='sticky fds top-0 z-20 py-4 px-2 bg-brand-primary '>
        <div className='  flex gap-2 text-xl text-white '>
          <button
            onClick={() => router.back()}
            className='text-white hover:bg-white/10 rounded-full p-2 transition-colors'>
            <ChevronRightIcon className='w-6 h-6' />
          </button>
          <h1 className=''>{title}</h1>
        </div>

        <section className=''>{children}</section>
      </header>
    </>
  );
};

export default HeaderLayout;
