import Link from 'next/link';
import { motion } from 'framer-motion';
import { BottomNavProps } from './types';

export const BottomNav = ({ items, currentPath }: BottomNavProps) => (
  <div className="md:hidden fixed z-30 bottom-6 left-0 right-0 w-full">
    <div className="flex justify-center items-center w-full">
      <div className="flex justify-around w-max bg-brand-primary shadow-lg rounded-full">
        {items.map((item, index) => {
          const isActive = currentPath === item.href;
          return (
            <Link href={item.href} key={item.href}>
              <div className="flex relative flex-col items-center py-2 px-1.5 m-1">
                {isActive && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 h-full w-full bg-blue-100 rounded-full"
                    transition={{
                      type: 'spring',
                      stiffness: 1500,
                      damping: 30,
                    }}
                  />
                )}
                <div className={`z-10 flex justify-center items-center text-center ${
                  isActive ? 'text-brand-primary font-bold' : 'text-slate-300'
                }`}>
                  <item.icon className="h-7 w-7" />
                  {isActive && <span className="w-[4.5rem]">{item.name}</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  </div>
);
