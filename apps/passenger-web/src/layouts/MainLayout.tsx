import React, { useState } from 'react';
import { AppShellWithNavbar, Sidebar, LogoutButton } from '@mishwari/ui-web';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import useLogout from '@/hooks/useLogout';
import { passengerNavConfig } from '@/config/navigation';
import MainHeader from '@/components/MainHeader';

interface HeaderLayoutProps {
  children?: React.ReactNode;
  title?: string;
}

const HeaderLayout: React.FC<HeaderLayoutProps> = ({ children, title }) => {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();
  const profile = useSelector((state: AppState) => state.profile);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <AppShellWithNavbar
      navbar={<MainHeader backTo='/' />}
      sidebar={
        <Sidebar
          items={passengerNavConfig.desktop.items}
          currentPath={pathname || ''}
          position="right"
          fixed={true}
          topOffset={64}
          footer={
            <div className="space-y-2">
              <button
                onClick={() => router.push('/')}
                className="flex h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-slate-50 p-3 text-sm font-bold hover:bg-hover hover:text-primary transition-all md:flex-none md:justify-start md:p-2 md:px-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <p className="hidden md:block">الرئيسية</p>
              </button>
              <LogoutButton onLogout={logout} variant="sidebar" />
            </div>
          }
        />
      }
    >
      {children}
    </AppShellWithNavbar>
  );
};

export default HeaderLayout;
