import { Fragment, useState, useRef, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { cn } from '../lib/utils';

interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  emptyMessage?: string;
}

export const Combobox = ({
  options,
  value,
  onChange,
  placeholder = 'اختر...',
  disabled = false,
  error,
  className,
  emptyMessage = 'لا توجد نتائج',
}: ComboboxProps) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = query === ''
    ? options
    : options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (option: ComboboxOption) => {
    onChange(option.value);
    setQuery(option.label);
    setShowDropdown(false);
    setIsFocused(false);
  };

  const handleInputFocus = () => {
    if (disabled) return;
    setIsFocused(true);
    setShowDropdown(true);
    setQuery('');
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setShowDropdown(false);
        setIsFocused(false);
        if (!value) setQuery('');
      }
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setIsFocused(false);
        if (!value) setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value]);

  return (
    <div className={cn('relative w-full', className)} ref={dropdownRef}>
      <input
        ref={inputRef}
        className={cn(
          'w-full pb-1 pr-2 bg-inherit focus:outline-none text-base font-medium text-mishwari-text-dark placeholder:text-mishwari-gray-500',
          error && 'border-mishwari-error',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        value={isFocused ? query : selectedOption?.label || placeholder}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        disabled={disabled}
        required
      />
      <Transition
        as={Fragment}
        show={showDropdown}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <ul className="absolute w-full mt-2 z-20 max-h-60 overflow-auto bg-white border border-mishwari-gray-200 shadow-lg rounded-lg">
          {filteredOptions.length === 0 ? (
            <li className="p-3 text-sm text-mishwari-gray-600">{emptyMessage}</li>
          ) : (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                className={cn(
                  'p-3 text-sm cursor-pointer hover:bg-mishwari-primary hover:text-white transition-colors',
                  value === option.value && 'bg-mishwari-primary text-white font-semibold'
                )}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </li>
            ))
          )}
        </ul>
      </Transition>
      {error && <p className="text-sm text-mishwari-error mt-1">{error}</p>}
    </div>
  );
};
