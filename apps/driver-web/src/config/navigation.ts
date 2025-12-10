import { HomeIcon, TruckIcon, MapIcon, UsersIcon, TicketIcon, UserIcon } from '@heroicons/react/24/outline';
import { Profile } from '@mishwari/types';

export const getNavigationItems = (profile: Profile | null) => {
  const role = (profile as any)?.profile?.role || profile?.role;
  
  const baseItems = [
    { name: 'الرحلات', href: '/trips', icon: MapIcon },
    { name: 'الملف الشخصي', href: '/profile', icon: UserIcon },
  ];

  // operator_admin sees full menu
  if (role === 'operator_admin') {
    baseItems.splice(1, 0, { name: 'الأسطول', href: '/fleet', icon: TruckIcon });
    baseItems.splice(2, 0, { name: 'السائقين', href: '/drivers', icon: UsersIcon });
  }
  
  // standalone driver sees "my bus" menu
  if (role === 'standalone_driver') {
    baseItems.splice(1, 0, { name: 'حافلتي', href: '/fleet', icon: TruckIcon });
  }

  return baseItems;
};

// Legacy config for backward compatibility
export const driverNavConfig = {
  desktop: {
    items: [
      { name: 'الرحلات', href: '/trips', icon: MapIcon },
      { name: 'الأسطول', href: '/fleet', icon: TruckIcon },
      { name: 'السائقين', href: '/drivers', icon: UsersIcon },
      { name: 'الملف الشخصي', href: '/profile', icon: UserIcon },
    ],
  },
  mobile: {
    items: [
      { name: 'الرئيسية', href: '/', icon: HomeIcon },
      { name: 'الرحلات', href: '/trips', icon: MapIcon },
      { name: 'الأسطول', href: '/fleet', icon: TruckIcon },
      { name: 'السائقين', href: '/drivers', icon: UsersIcon },
      { name: 'الملف الشخصي', href: '/profile', icon: UserIcon },
    ],
  },
};
