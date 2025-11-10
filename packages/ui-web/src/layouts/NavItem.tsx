import Link from 'next/link';
import clsx from 'clsx';
import { NavItemProps } from './types';

export const NavItem = ({ item, isActive, onClick }: NavItemProps) => {
  const content = (
    <>
      <item.icon className="w-6" />
      <p className="hidden md:block">{item.name}</p>
    </>
  );

  const className = clsx(
    'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-gray-100 hover:text-brand-primary md:flex-none md:justify-start md:p-2 md:px-3',
    isActive
      ? 'bg-gray-100 text-brand-primary font-bold'
      : ''
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={clsx(className, 'w-full')}>
        {content}
      </button>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {content}
    </Link>
  );
};
