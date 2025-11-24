import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface CollapsibleSectionProps {
  title: string;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
  showBottomToggle?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  count,
  children,
  defaultOpen = false,
  showBottomToggle = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const variants = {
    hidden: { height: 0, opacity: 0, transition: { duration: 0.3 } },
    visible: { height: 'auto', opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full p-4 hover:bg-gray-50 transition-colors rounded-lg"
        type="button"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">{title}</h2>
          {count !== undefined && (
            <span className="bg-brand-primary text-white text-sm font-semibold px-2.5 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        <ChevronDownIcon
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
            {showBottomToggle && count && count > 5 && (
              <button
                onClick={() => setIsOpen(false)}
                className="flex justify-center items-center w-full p-3 hover:bg-gray-50 transition-colors border-t"
                type="button"
              >
                <ChevronDownIcon className="w-5 h-5 rotate-180" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
