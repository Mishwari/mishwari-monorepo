import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ArrowLeftIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userAvatar?: string;
  items: Array<{ name: string; href: string; icon: any }>;
  footer?: React.ReactNode;
}

export const MobileMenu = ({ isOpen, onClose, userName, userAvatar, items, footer }: MobileMenuProps) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-30 overflow-y-auto opacity-100 md:hidden"
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-70" />
        <Transition.Child
          as={Fragment}
          enter="transition ease-out duration-700 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <div className="bg-gray-50 w-[70%] h-full flex flex-col absolute left-0 top-0">
            <div className="bg-brand-primary p-4 w-full h-max">
              <div
                className="absolute left-0 ml-2 cursor-pointer"
                onClick={onClose}
                ref={cancelButtonRef}
              >
                <ArrowLeftIcon className="w-6 h-6 text-white" />
              </div>
              <div className="mx-auto mt-8 rounded-full w-max h-max overflow-hidden">
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="h-12 w-12 rounded-full" />
                ) : (
                  <UserCircleIcon className="h-12 w-12 text-white" />
                )}
              </div>
              <p className="text-center text-white text-lg truncate mx-4 mt-2">
                {userName || 'مستخدم'}
              </p>
            </div>
            <div className="p-3 mt-4 h-full flex flex-col gap-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 text-lg font-semibold border rounded-md p-2 bg-brand-primary text-white"
                >
                  <item.icon className="w-6 h-6" />
                  {item.name}
                </Link>
              ))}
              {footer && <div className="mt-auto mb-4">{footer}</div>}
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};
