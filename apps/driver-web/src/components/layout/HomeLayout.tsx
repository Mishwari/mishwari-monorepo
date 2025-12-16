import { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import { Header, MobileMenu, UserDropdownMenu } from '@mishwari/ui-web';
import Link from 'next/link';
import VerificationBanner from '../dashboard/VerificationBanner';
import { getNavigationItems } from '@/config/navigation';
import useLogout from '@/hooks/useLogout';

interface HomeLayoutProps {
  children: ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  const router = useRouter();
  const logout = useLogout();
  const authState = useSelector((state: AppState) => state.auth);
  const { profile } = authState;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = getNavigationItems(profile);

  return (
    <>
      <VerificationBanner />
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
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        userName={profile?.company_name || profile?.user?.username}
        items={navItems}
        footer={
          <button
            onClick={logout}
            className='w-full text-lg font-semibold border rounded-md p-2 bg-brand-primary text-white'>
            تسجيل الخروج
          </button>
        }
      />
      <div className='min-h-screen bg-gray-50 pt-16'>{children}</div>
    </>
  );
}
