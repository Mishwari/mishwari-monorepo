import { HomeIcon, TruckIcon, MapIcon, UsersIcon, TicketIcon, UserIcon } from '@heroicons/react/24/outline';
import { Profile } from '@mishwari/types';

export const getNavigationItems = (profile: Profile | null) => {
  const role = (profile as any)?.profile?.role || profile?.role;
  console.log('[getNavigationItems] Profile:', profile, 'Role:', role);
  
  const baseItems = [
    { name: 'الرحلات', href: '/trips', icon: MapIcon },
    { name: 'الأسطول', href: '/fleet', icon: TruckIcon },
    { name: 'الملف الشخصي', href: '/profile', icon: UserIcon },
  ];

  // Only operator_admin sees drivers menu
  if (role === 'operator_admin') {
    console.log('[getNavigationItems] Adding drivers menu for operator_admin');
    baseItems.splice(2, 0, { 
      name: 'السائقين', 
      href: '/drivers', 
      icon: UsersIcon 
    });
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
