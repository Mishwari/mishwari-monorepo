import { ReactNode } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';

interface HeaderProps {
  logo: ReactNode;
  actions?: ReactNode;
  onBurgerClick?: () => void;
  showBurger?: boolean;
}

export const Header = ({ logo, actions, onBurgerClick, showBurger = true }: HeaderProps) => (
  <div className="fixed z-20 top-0 bg-brand-primary max-w-[100rem] flex justify-between items-center px-4 h-16 w-full">
    {logo}
    <div className="flex text-white w-full gap-6 justify-end items-center">
      {actions}
      {showBurger && onBurgerClick && (
        <div onClick={onBurgerClick} className="md:hidden cursor-pointer">
          <Bars3Icon className="h-7 w-7 text-white" />
        </div>
      )}
    </div>
  </div>
);
