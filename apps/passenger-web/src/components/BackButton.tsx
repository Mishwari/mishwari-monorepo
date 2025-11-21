import React, { FC, ReactNode } from 'react';
import { useHandleBack } from '@/hooks/useHandleBack';
import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface BackButtonProps {
  label?: string;
  className?: string;
  children?: ReactNode; // for nested content like icons or icons with text
  imageSrc?: string;
  imageAlt?: string;
}

const BackButton: FC<BackButtonProps> = ({
  className,
  children,
  imageSrc = '/ui-web/icons/common/leftArrow_white.svg',
  imageAlt = 'Back',
}) => {
  const handleBack = useHandleBack();

  return (
    <button
      className={`focus:outline-none ${className}`}
      onClick={handleBack}>
      {children ? children : <ArrowRightIcon className='w-8 text-white h-8' />}
    </button>
  );
};

export default BackButton;
