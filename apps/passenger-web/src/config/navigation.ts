import {
  UserGroupIcon,
  TicketIcon,
  BanknotesIcon,
  Cog6ToothIcon,
  HomeIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, TicketIcon as TicketIconSolid, UserIcon as UserIconSolid } from '@heroicons/react/24/solid';

export const passengerNavConfig = {
  desktop: {
    items: [
      { name: 'معلومات المستخدم', href: '/profile', icon: UserIcon },
      { name: 'رحلاتي', href: '/my_trips', icon: TicketIcon },
      { name: 'المحفظة', href: '/profile/wallet', icon: BanknotesIcon },
      { name: 'قائمة الركاب', href: '/passengers', icon: UserGroupIcon },
    ],
  },
  mobile: {
    items: [
      { name: 'الرئيسية', href: '/', icon: HomeIconSolid },
      { name: 'بروفايل', href: '/profile', icon: UserIconSolid },
      { name: 'رحلاتي', href: '/my_trips', icon: TicketIconSolid },
      { name: 'المحفظة', href: '/profile/wallet', icon: BanknotesIcon },
      { name: 'قائمة الركاب', href: '/passengers', icon: UserGroupIcon },
    ],
  },
};
