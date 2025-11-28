import React from 'react';

interface PageHeaderProps {
  title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  return (
    <div className='p-4 text-xl font-bold text-center border-b bg-white'>
      {title}
    </div>
  );
};

export default PageHeader;
