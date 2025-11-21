import React from 'react';
import { useRouter } from 'next/router';
import { BottomNav } from '@mishwari/ui-web';
import { passengerNavConfig } from '@/config/navigation';

const BottomNavBar: React.FC = () => {
  const router = useRouter();
  const { pathname } = router;

  return <BottomNav items={passengerNavConfig.mobile.items} currentPath={pathname} />;
};

export default BottomNavBar;
