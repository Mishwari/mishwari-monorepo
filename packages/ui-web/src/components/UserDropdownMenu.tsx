import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  UserCircleIcon,
  ArrowLeftStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

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
}: UserDropdownMenuProps) => (
  <div className='hidden md:flex gap-2 items-center'>
    <UserCircleIcon className='h-6 w-6 text-white' />
    <Menu
      as='div'
      className='relative'>
      <Menu.Button className='inline-flex gap-1.5 items-center font-medium text-white focus:outline-none'>
        الاعدادات
        <ChevronDownIcon className='h-5 w-5' />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'>
        <Menu.Items className='absolute left-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'>
          {items.map((item) => (
            <Menu.Item key={item.href}>
              {({ active }) => (
                <Link
                  href={item.href}
                  className={`${
                    active ? 'bg-gray-100 text-brand-primary' : 'text-gray-900'
                  } group flex w-full items-center gap-2 px-4 py-2 text-sm`}>
                  <item.icon className='w-5 h-5' />
                  {item.name}
                </Link>
              )}
            </Menu.Item>
          ))}
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onLogout}
                className={`${
                  active ? 'bg-gray-100 text-brand-primary' : 'text-gray-900'
                } group flex w-full items-center gap-2 px-4 py-2 text-sm border-t border-gray-100`}>
                <ArrowLeftStartOnRectangleIcon className='w-5 h-5' />
                تسجيل الخروج
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  </div>
);
