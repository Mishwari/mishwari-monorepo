import {
  UserGroupIcon,
  TicketIcon,
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
      { name: 'قائمة الركاب', href: '/passengers', icon: UserGroupIcon },
    ],
  },
};
