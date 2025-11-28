import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDownIcon,
  TicketIcon,
  UsersIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  PencilIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

interface UserDropdownProps {
  userName?: string;
  userEmail?: string;
  username?: string;
  phoneNumber?: string;
  onLogout: () => void;
  onLogin: () => void;
  isAuthenticated: boolean;
  isPartial?: boolean;
  onCompleteProfile?: () => void;
}

export default function UserDropdown({
  userName = 'MK',
  userEmail,
  username,
  phoneNumber,
  onLogout,
  onLogin,
  isAuthenticated,
  isPartial = false,
  onCompleteProfile,
}: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const router = useRouter();
  const isHomePage = router.pathname === '/';

  const menuItems = [
    ...(!isHomePage ? [{
      icon: HomeIcon,
      label: 'الصفحة الرئيسية',
      desc: 'العودة للبحث',
      path: '/',
    }] : []),
    {
      icon: TicketIcon,
      label: 'رحلاتي',
      desc: 'القادمة والسابقة',
      path: '/my_trips',
    },
    {
      icon: UsersIcon,
      label: 'الركاب',
      desc: 'إدارة المرافقين',
      path: '/passengers',
    },
    {
      icon: UserCircleIcon,
      label: 'الملف الشخصي',
      desc: 'إعدادات الحساب',
      path: '/profile',
    },
  ];

  if (!isAuthenticated) {
    return (
      <button
        onClick={onLogin}
        className='group flex items-center rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-primary text-sm font-bold shadow-sm transition-all overflow-hidden'>
        <div className='w-9 h-9 flex items-center justify-center shrink-0'>
          <UserIcon className='w-4 h-4' />
        </div>
        <span className='opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto group-hover:px-3 transition-all duration-300 whitespace-nowrap'>
          تسجيل الدخول
        </span>
      </button>
    );
  }

  return (
    <div
      className='relative isolate z-30'
      ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='h-9 w-9 bg-brand-primary rounded-full flex items-center justify-center text-white text-xs font-bold ring-4 ring-white/50 shadow-lg hover:bg-brand-primary-dark transition-all active:scale-95'>
        {userName.substring(0, 2).toUpperCase()}
      </button>

      {isOpen && (
        <div className='absolute left-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[9999]'>
          {isPartial ? (
            <div className='p-4 border-b border-slate-50 bg-brand-primary-light'>
              <div className='text-xs font-bold text-slate-500 mb-1'>
                رقم الهاتف
              </div>
              <div className='text-sm font-black text-[#042f40]'>
                {phoneNumber}+
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onCompleteProfile?.();
                }}
                className='mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary-dark text-white text-xs font-bold rounded-lg transition-all'>
                <PencilIcon className='w-3.5 h-3.5' />
                إكمال الملف الشخصي
              </button>
            </div>
          ) : (
            <>
              <div className='p-4 border-b border-slate-50 bg-slate-50/50'>
                <div className='text-sm font-black'>
                  {userName}
                </div>
                {username && (
                  <div className='text-[10px] text-slate-400 font-medium truncate mt-0.5'>
                    @{username}
                  </div>
                )}
              </div>

              <div className='p-2 space-y-1'>
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setIsOpen(false);
                      router.push(item.path);
                    }}
                    className='w-full flex items-center gap-3 p-3 rounded-xl hover:bg-brand-primary-light group transition-colors'>
                    <div className='flex-1 text-right'>
                      <div className='text-xs font-bold'>
                        {item.label}
                      </div>
                      <div className='text-[10px] text-slate-400'>
                        {item.desc}
                      </div>
                    </div>
                    <div className='w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-colors'>
                      <item.icon className='w-4 h-4' />
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className='p-2 border-t border-slate-50'>
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className='w-full flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors justify-center'>
              <ArrowRightOnRectangleIcon className='w-3.5 h-3.5' />
              تسجيل الخروج
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
