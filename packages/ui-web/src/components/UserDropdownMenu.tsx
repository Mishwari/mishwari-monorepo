import {
  ChevronDownIcon,
  UserCircleIcon,
  ArrowLeftStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { DropdownMenu, DropdownMenuItem } from './DropdownMenu';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface UserDropdownMenuProps {
  items: MenuItem[];
  onLogout: () => void;
}

export const UserDropdownMenu = ({
  items,
  onLogout,
}: UserDropdownMenuProps) => {
  const router = useRouter();

  const dropdownItems: DropdownMenuItem[] = [
    ...items.map((item) => ({
      label: item.name,
      onClick: () => router.push(item.href),
      icon: item.icon,
    })),
    {
      label: 'تسجيل الخروج',
      onClick: onLogout,
      icon: ArrowLeftStartOnRectangleIcon,
    },
  ];

  return (
    <div className='hidden md:flex gap-2 items-center'>
      <UserCircleIcon className='h-6 w-6 text-white' />
      <DropdownMenu
        trigger={
          <button className='inline-flex gap-1.5 items-center font-medium text-white focus:outline-none'>
            الاعدادات
            <ChevronDownIcon className='h-5 w-5' />
          </button>
        }
        items={dropdownItems}
        align='left'
      />
    </div>
  );
};
