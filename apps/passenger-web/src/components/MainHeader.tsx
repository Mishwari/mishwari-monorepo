import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import UserDropdown from './UserDropdown';
import useAuth from '@/hooks/useAuth';
import useLogout from '@/hooks/useLogout';
import { useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import LoginModal from './LoginModal';
import ProfileFormModal from './ProfileFormModal';
import { jwtDecode } from 'jwt-decode';
import { decryptToken } from '@/utils/tokenUtils';

// to start test  start fix gap

interface MainHeaderProps {
  children?: React.ReactNode;
  showBackButton?: boolean;
  title?: string;
  backTo: string;
  transparent?: boolean;
}

export default function MainHeader({
  children,
  showBackButton = false,
  title,
  backTo,
  transparent = false,
}: MainHeaderProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const logout = useLogout();
  const profile = useSelector((state: AppState) => state.profile);
  const auth = useSelector((state: AppState) => state.auth);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const phoneNumber = useMemo(() => {
    if (auth?.token) {
      try {
        const decoded: any = jwtDecode(decryptToken(auth.token));
        return decoded?.mobile_number || decoded?.phone || decoded?.phone_number;
      } catch (error) {
        return undefined;
      }
    }
    return undefined;
  }, [auth?.token]);

  const handleBack = () => {
    router.push(backTo);
  };

  return (
    <header
      className={`sticky top-0 z-50 p-2 ${
        transparent
          ? 'bg-transparent'
          : 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/60'
      }`}>
      <div className='w-full px-0 sm:px-2 py-2'>
        <div className='flex items-center gap-3 sm:gap-4'>
          {/* 1. FIXED LEFT SIDE (Back Button / Logo) */}
          <div className='shrink-0 flex items-center gap-2'>
            {showBackButton && (
              <button
                onClick={handleBack}
                className='p-1.5 bg-slate-50 hover:bg-hover rounded-full text-primary transition-all active:scale-95 shrink-0'>
                <ChevronRightIcon className='w-4 h-4' />
              </button>
            )}
            {title && <h1 className='text-lg font-bold'>{title}</h1>}
            {!showBackButton && !children && (
              <div className='flex items-center gap-2'>
                <svg
                  className='w-6 h-6 text-primary'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 10V3L4 14h7v7l9-11h-7z'
                  />
                </svg>
                <span className='text-lg font-bold text-primary'>مشواري</span>
              </div>
            )}
          </div>

          {/* 2. DYNAMIC MIDDLE - Items align to start (right in RTL) */}
          <div className='flex-1 min-w-0 flex items-center gap-4'>
            {children}
          </div>

          {/* 3. FIXED RIGHT SIDE (User Dropdown) - Pushed to end */}
          <div className='shrink-0 mr-auto'>
            <UserDropdown
              userName={profile?.full_name}
              username={profile?.user?.username}
              phoneNumber={phoneNumber}
              onLogout={logout}
              onLogin={() => setShowLoginModal(true)}
              isAuthenticated={isAuthenticated}
              isPartial={auth?.status === 'partial'}
              onCompleteProfile={() => setShowProfileModal(true)}
            />
          </div>
        </div>
      </div>
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onOpenProfileModal={() => setShowProfileModal(true)}
      />
      <ProfileFormModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </header>
  );
}
