import clsx from 'clsx';
import { useRouter } from 'next/router';
import { SidebarProps } from './types';
import { NavItem } from './NavItem';

export const Sidebar = ({ 
  items, 
  currentPath, 
  logo, 
  footer, 
  position = 'left',
  fixed = false,
  topOffset = 0,
  className
}: SidebarProps) => {
  const router = useRouter();
  
  return (
    <aside className={clsx(
      'hidden md:block h-screen md:w-[30%] max-w-[450px] fixed top-0',
      position === 'right' && 'md:ml-[70%]',
      className
    )}>
      <div className={clsx(
        'flex flex-col justify-between w-full h-full bg-white border-gray-200',
        position === 'left' ? 'border-l' : 'border-r'
      )}>
        <nav 
          className="px-3 space-y-2 overflow-y-auto"
          style={{ paddingTop: topOffset ? `${topOffset + 16}px` : '16px' }}
        >
          {logo && <div className="px-4 py-5">{logo}</div>}
          {items.map((item) => {
            const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');
            return (
              <NavItem 
                key={item.href} 
                item={item} 
                isActive={isActive}
                onClick={() => router.push(item.href)}
              />
            );
          })}
        </nav>
        {footer && <div className="px-3 pb-6">{footer}</div>}
      </div>
    </aside>
  );
};
