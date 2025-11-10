import { ReactNode } from 'react';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface AppShellProps {
  topBar?: ReactNode;
  sidebar?: ReactNode;
  bottomNav?: ReactNode;
  banner?: ReactNode;
  mobileMenu?: ReactNode;
  children: ReactNode;
}

export interface SidebarProps {
  items: NavItem[];
  currentPath: string;
  logo?: ReactNode;
  footer?: ReactNode;
  position?: 'left' | 'right';
  fixed?: boolean;
  topOffset?: number;
  className?: string;
}

export interface NavItemProps {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
}

export interface BottomNavProps {
  items: NavItem[];
  currentPath: string;
}
