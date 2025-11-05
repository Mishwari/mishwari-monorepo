import Link from 'next/link';
import { PowerIcon } from '@heroicons/react/24/outline';

import {
  UserGroupIcon,
  TicketIcon,
  BanknotesIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { AppState } from '@/store/store';
import { resetAuthState } from '@/store/slices/authSlice';
import useLogout from '@/hooks/useLogout';

const links = [
  { name: 'الاعدادات', href: '/profile', icon: Cog6ToothIcon },
  {
    name: 'رحلاتي',
    href: '/my_trips',
    icon: TicketIcon,
  },
  { name: 'المحفظة', href: '/profile/wallet', icon: BanknotesIcon },
  { name: 'الركاب', href: '/profile/passengers', icon: UserGroupIcon },
];

export default function SideNav() {
  const pathname = usePathname();
  const logout = useLogout();
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <div className='flex h-full w-full flex-col justify-between px-3 pt-20 pb-6'>
      <nav className='flex flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-gray-100 hover:text-brand-primary md:flex-none md:justify-start md:p-2 md:px-3',
                {
                  'bg-gray-100 text-brand-primary [&>p]:font-bold':
                    pathname === link.href,
                }
              )}>
              <LinkIcon className='w-6' />
              <p className='hidden md:block'>{link.name}</p>
            </Link>
          );
        })}
      </nav>
      <button
        onClick={logout}
        className='flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-red-400 hover:text-white md:justify-start md:p-2 md:px-3'>
        <PowerIcon className='w-6' />
        <div className='hidden md:block'>تسجيل الخروج</div>
      </button>
    </div>
  );
}
