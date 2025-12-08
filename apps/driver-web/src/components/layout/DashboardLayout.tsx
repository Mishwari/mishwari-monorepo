import { ReactNode, useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '@/store/store';
import {
  AppShell,
  Sidebar,
  Header,
  MobileMenu,
  LogoutButton,
  UserDropdownMenu,
} from '@mishwari/ui-web';
import Link from 'next/link';
import VerificationBanner from '../dashboard/VerificationBanner';
import { getNavigationItems } from '@/config/navigation';
import useLogout from '@/hooks/useLogout';
import { authApi } from '@mishwari/api';
import { setProfile } from '@/store/slices/authSlice';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const logout = useLogout();
  const dispatch = useDispatch();
  const { profile, isAuthenticated } = useSelector(
    (state: AppState) => state.auth
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load profile if not loaded
  useEffect(() => {
    if (isAuthenticated && !profile) {
      authApi
        .getMe()
        .then((response) => dispatch(setProfile(response.data)))
        .catch(() => {});
    }
  }, [isAuthenticated, profile, dispatch]);

  // Get role-based navigation items
  const navItems = useMemo(() => {
    console.log('[DashboardLayout] Full auth state:', {
      profile,
      isAuthenticated,
    });
    const items = getNavigationItems(profile);
    console.log('[DashboardLayout] NavItems:', items);
    return items;
  }, [profile, isAuthenticated]);

  return (
    <>
      <VerificationBanner />
      <AppShell
        topBar={
          <Header
            logo={
              <Link
                href='/'
                className='flex gap-1'>
                <h1 className='text-white font-bold text-xl text-nowrap'>
                  يلا باص
                </h1>
                <h1 className='text-white text-[10px] font-normal self-end'>
                  (مشغل)
                </h1>
              </Link>
            }
            actions={
              <UserDropdownMenu
                items={navItems}
                onLogout={logout}
              />
            }
            onBurgerClick={() => setIsMobileMenuOpen(true)}
          />
        }
        sidebar={
          <Sidebar
            items={navItems}
            currentPath={router.pathname}
            position='left'
            topOffset={64}
            footer={
              <div className='space-y-2'>
                <button
                  onClick={() => router.push('/')}
                  className='flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-gray-100 hover:text-brand-primary md:flex-none md:justify-start md:p-2 md:px-3'>
                  <svg
                    className='w-6 h-6'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                    />
                  </svg>
                  <p className='hidden md:block'>الرئيسية</p>
                </button>
                <LogoutButton
                  onLogout={logout}
                  variant='sidebar'
                />
              </div>
            }
          />
        }
        mobileMenu={
          <MobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            userName={profile?.full_name || profile?.user?.username}
            items={navItems}
            footer={
              <button
                onClick={logout}
                className='w-full text-lg font-semibold border rounded-md p-2 bg-brand-primary text-white'>
                تسجيل الخروج
              </button>
            }
          />
        }>
        {children}
      </AppShell>
    </>
  );
}
