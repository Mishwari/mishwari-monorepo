import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface CityOption {
  id: number;
  city: string;
  trip_count: number;
}

interface CityComboboxProps {
  cities?: CityOption[];
  options?: CityOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  emptyMessage?: string;
  loading?: boolean;
  disabled?: boolean;
}

export default function CityCombobox({
  cities,
  options,
  value,
  onChange,
  placeholder,
  emptyMessage = 'لا توجد مدن متاحة',
  loading = false,
  disabled = false,
}: CityComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const cityOptions = cities || options || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = cityOptions.filter((option) =>
    option.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (city: string) => {
    onChange(city);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full text-right bg-transparent border-none outline-none text-sm font-medium flex items-center justify-between ${
          disabled ? 'text-gray-400 cursor-not-allowed' : 'text-brand-text-dark'
        }`}
      >
        <span className={value ? 'text-brand-text-dark' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مدينة..."
                className="w-full pr-10 pl-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-64">
            {loading ? (
              <div className="p-4 text-center text-sm text-gray-500">جاري التحميل...</div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">{emptyMessage}</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option.city)}
                  className={`w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                    value === option.city ? 'bg-brand-primary/5' : ''
                  }`}
                >
                  <span className="text-sm font-medium text-brand-text-dark">
                    {option.city}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {option.trip_count} {option.trip_count === 1 ? 'رحلة' : 'رحلات'}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
