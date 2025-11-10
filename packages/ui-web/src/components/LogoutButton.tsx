import { PowerIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface LogoutButtonProps {
  onLogout: () => void;
  variant?: 'sidebar' | 'menu';
}

export const LogoutButton = ({ onLogout, variant = 'sidebar' }: LogoutButtonProps) => (
  <button
    onClick={onLogout}
    className={clsx(
      'flex items-center gap-2 rounded-md transition-colors',
      variant === 'sidebar' && 'w-full h-12 px-3 bg-gray-50 hover:bg-red-400 hover:text-white text-sm font-medium',
      variant === 'menu' && 'w-full px-6 py-2 text-sm hover:bg-gray-100'
    )}
  >
    <PowerIcon className="w-6 h-6" />
    <span>تسجيل الخروج</span>
  </button>
);
