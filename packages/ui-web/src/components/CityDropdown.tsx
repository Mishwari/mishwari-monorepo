import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { filterByArabicSearch } from '../lib/searchUtils';

export interface CityOption {
  id: number;
  city: string;
  trip_count?: number;
}

export interface CityDropdownProps {
  options: CityOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  disabled?: boolean;
  showTripCount?: boolean;
  label?: string;
  icon?: React.ComponentType<{ className?: string }>;
  hideArrow?: boolean;
}

export default function CityDropdown({
  options,
  value,
  onChange,
  placeholder = 'اختر مدينة',
  emptyMessage = 'لا توجد مدن متاحة',
  loading = false,
  disabled = false,
  showTripCount = false,
  label,
  icon: Icon,
  hideArrow = false,
}: CityDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobile]);

  const filteredOptions = filterByArabicSearch(options, searchQuery);

  const handleSelect = (city: string) => {
    onChange(city);
    setIsOpen(false);
    setSearchQuery('');
  };

  const dropdownContent = (
    <>
      <div className='p-2 border-b border-slate-100 bg-slate-50/50'>
        <div className='relative'>
          <MagnifyingGlassIcon className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='بحث عن مدينة...'
            className='w-full pr-9 pl-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light'
            autoComplete='off'
          />
        </div>
      </div>

      <div className='overflow-y-auto max-h-[280px] md:max-h-[280px] p-1 scrollbar-hide'>
        {loading ? (
          <div className='p-8 text-center text-slate-400 text-sm'>
            جاري التحميل...
          </div>
        ) : filteredOptions.length === 0 ? (
          <div className='p-8 text-center text-slate-400 text-sm'>
            {emptyMessage}
          </div>
        ) : (
          filteredOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handleSelect(option.city)}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                value === option.city ? 'bg-brand-primary-light' : 'hover:bg-slate-50'
              }`}>
              <div className='flex items-center gap-3'>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    value === option.city
                      ? 'bg-white text-brand-primary'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                  <MapPinIcon className='w-4 h-4' />
                </div>
                <div>
                  <div
                    className={`text-sm font-bold ${
                      value === option.city
                        ? 'text-brand-primary'
                        : 'text-brand-text-dark'
                    }`}>
                    {option.city}
                  </div>
                </div>
              </div>
              {value === option.city ? (
                <CheckIcon className='w-4 h-4 text-brand-primary' />
              ) : (
                showTripCount &&
                option.trip_count !== undefined && (
                  <span className='text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md'>
                    {option.trip_count} رحلة
                  </span>
                )
              )}
            </div>
          ))
        )}
      </div>
    </>
  );

  return (
    <div
      ref={containerRef}
      className='w-full sm:w-auto min-w-0'>
      {label && Icon ? (
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`flex items-center gap-2 p-2 sm:p-3 rounded-xl transition-all cursor-pointer border h-full ${
            isOpen
              ? 'bg-white border-brand-primary ring-4 ring-brand-primary-light'
              : 'bg-slate-50 hover:bg-brand-hover border-transparent hover:border-blue-100'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <Icon className='w-5 h-5 shrink-0 text-[#005687]' />
          <div className='flex-1 min-w-0 flex flex-col justify-center text-right'>
            {label && (
              <span className='text-[10px] text-slate-400 font-bold mb-0.5 leading-none'>
                {label}
              </span>
            )}
            <div className='truncate text-sm sm:text-base font-bold text-[#042f40] w-full leading-tight'>
              {value || placeholder}
            </div>
          </div>
          {!hideArrow && (
            <ChevronDownIcon
              className={`w-4 h-4 shrink-0 text-slate-400 hidden sm:block ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          )}
        </div>
      ) : (
        <button
          type='button'
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full text-right bg-transparent border-none outline-none text-base font-bold flex items-center justify-between leading-tight min-w-0 overflow-hidden ${
            disabled
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-brand-text-dark'
          }`}>
          <span
            className={
              value ? 'text-brand-text-dark truncate flex-1 min-w-0' : 'text-gray-400 truncate flex-1 min-w-0'
            }>
            {value || placeholder}
          </span>
          {!hideArrow && (
            <ChevronDownIcon
              className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ml-2 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          )}
        </button>
      )}

      {isMobile ? (
        <DialogPrimitive.Root
          open={isOpen}
          modal={true}>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay
              className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm'
              onClick={() => setIsOpen(false)}
            />
            <DialogPrimitive.Content
              className='fixed left-[50%] top-[50%] z-50 w-[95vw] max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-2xl overflow-hidden py-1 bg-white p-0 shadow-lg'
              onPointerDownOutside={() => setIsOpen(false)}
              onEscapeKeyDown={() => setIsOpen(false)}>
              {dropdownContent}
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      ) : (
        isOpen && (
          <div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-200'>
            {dropdownContent}
          </div>
        )
      )}
    </div>
  );
}
