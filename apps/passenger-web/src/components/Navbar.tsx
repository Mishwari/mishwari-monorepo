import React, { useState } from 'react';
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
import SortDropdown from './filters_bar/SortDropdown';
import { Bars3Icon } from '@heroicons/react/24/outline';
import useLogout from '@/hooks/useLogout';
import useAuth from '@/hooks/useAuth';
import { Link } from '@nextui-org/react';
import { UserDropdownMenu, MobileMenu } from '@mishwari/ui-web';
import { passengerNavConfig } from '@/config/navigation';

interface SortItem {
  code: string | null;
  id: number;
  name: string;
}

interface NavbarProps {
  userName?: string;
}

function Navbar({ userName }: NavbarProps) {
  const { isAuthenticated } = useAuth();
  const logout = useLogout();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);



  return (
    <>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        userName={userName || 'مستخدم'}
        items={passengerNavConfig.mobile.items}
        footer={
          <button
            onClick={logout}
            className='w-full text-lg font-semibold border rounded-md p-2 bg-brand-primary text-white'>
            تسجيل الخروج
          </button>
        }
      />
      <div className=' fixed z-20 top-0 bg-brand-primary max-w-[100rem] flex justify-between items-center px-4 h-16 w-full  '>
        <Link
          href='/'
          className='w-max flex gap-1 '>
          <h1 className='text-white font-bold text-xl'>مشواري</h1>
          <h1 className='text-white text-[10px] font-normal self-end'>
            (Demro)
          </h1>
        </Link>

        <div className='flex text-white w-full gap-6 justify-end items-center'>
          <div className='hidden md:block items-center'>مساعدة</div>

          <div className='flex gap-2 px-2 p-1   items-center overflows-hidden'>
            {isAuthenticated ? (
              <>
                {/* for mobile */}
                <div
                  onClick={() => setIsMobileMenuOpen(true)}
                  className=' md:hidden cursor-pointer '>
                  <Bars3Icon className='h-7 w-7 text-white' />
                </div>
                {/* for desktop */}
                <UserDropdownMenu
                  items={passengerNavConfig.desktop.items}
                  onLogout={logout}
                />
              </>
            ) : (
              <Link
                href='/login'
                className='flex gap-2 text-sm md:text-base items-center justify-center text-white border-1 border-white/30 rounded-full px-4 py-1.5 bg-white/10'>
                تسجيل الدخول
                <ArrowLeftStartOnRectangleIcon className='w-5 md:w-6 h-5 md:h-6' />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
