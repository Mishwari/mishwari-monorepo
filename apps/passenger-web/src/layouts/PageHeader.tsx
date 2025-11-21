import BackButton from '@/components/BackButton';
import React from 'react';

interface HeaderLayoutProps {
  children?: React.ReactNode;
  title?: string;
}

const HeaderLayout: React.FC<HeaderLayoutProps> = ({ children, title }) => {
  return (
    <>
      <header className='sticky fds top-0 z-20 py-4 px-2 bg-brand-primary '>
        <div className='  flex gap-2 text-xl text-white '>
          <BackButton />
          <h1 className=''>{title}</h1>
        </div>

        <section className=''>{children}</section>
      </header>
    </>
  );
};

export default HeaderLayout;
