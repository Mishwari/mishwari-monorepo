import { Fragment, ReactNode } from 'react';
import { Menu, Transition } from '@headlessui/react';

export interface DropdownMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
}

interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownMenuItem[];
  align?: 'left' | 'right';
}

export const DropdownMenu = ({ trigger, items, align = 'right' }: DropdownMenuProps) => (
  <Menu as='div' className='relative inline-block text-left'>
    <Menu.Button as='div'>{trigger}</Menu.Button>
    <Transition
      as={Fragment}
      enter='transition ease-out duration-100'
      enterFrom='transform opacity-0 scale-95'
      enterTo='transform opacity-100 scale-100'
      leave='transition ease-in duration-75'
      leaveFrom='transform opacity-100 scale-100'
      leaveTo='transform opacity-0 scale-95'>
      <Menu.Items className={`absolute ${align === 'left' ? 'left-0' : 'right-0'} mt-2 w-48 origin-top-${align} rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-10`}>
        {items.map((item, index) => (
          <Menu.Item key={index} disabled={item.disabled}>
            {({ active }) => (
              <button
                onClick={item.onClick}
                disabled={item.disabled}
                className={`${
                  active ? 'bg-gray-100' : ''
                } ${
                  item.variant === 'destructive' ? 'text-red-600' : 'text-gray-900'
                } ${
                  item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                } group flex w-full items-center gap-2 px-4 py-2 text-sm`}>
                {item.icon && <item.icon className='w-5 h-5' />}
                {item.label}
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Transition>
  </Menu>
);
