import React, { useRef, useEffect } from 'react';
import { PhoneInputProps, usePhoneInput, Country } from '@mishwari/ui-primitives';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from '../lib/utils';

interface PhoneInputWithCountriesProps extends PhoneInputProps {
  countries: Country[];
}

export const PhoneInput: React.FC<PhoneInputWithCountriesProps> = ({
  value,
  onChange,
  error: externalError,
  defaultCountry,
  countries,
  className,
}) => {
  const {
    selectedCountry,
    phoneNumber,
    error: internalError,
    dropdownOpen,
    searchTerm,
    setDropdownOpen,
    setSearchTerm,
    handlePhoneNumberChange,
    handleCountryChange,
  } = usePhoneInput(onChange, defaultCountry || countries[0]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setDropdownOpen]);

  const filteredCountries = countries.filter(
    (country) =>
      country.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.includes(searchTerm) ||
      country.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const error = externalError || internalError;

  return (
    <div className={cn('flex flex-col w-full', className)}>
      <div dir="ltr" className="flex items-center gap-2 w-full">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 px-3 h-10 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            <span className="noto-color-emoji text-2xl leading-none">{selectedCountry.symbol}</span>
            <svg
              height="20"
              width="20"
              viewBox="0 0 20 20"
              className={cn(
                'transform transition-transform',
                dropdownOpen && 'rotate-180'
              )}
            >
              <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-popover border border-border rounded-md shadow-md z-50">
              <Input
                type="text"
                dir="rtl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث..."
                className="m-2 w-[calc(100%-1rem)]"
              />
              <ul className="max-h-60 overflow-auto p-1">
                {filteredCountries.map((country) => (
                  <li
                    key={country.value}
                    onClick={() => handleCountryChange(country)}
                    className="flex items-center justify-between gap-4 px-3 py-2 cursor-pointer rounded-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <span className="font-mono">+{country.code}</span>
                    <div className="flex items-center gap-2">
                      <span className="truncate">{country.label}</span>
                      <span className="noto-color-emoji text-xl">{country.symbol}</span>
                    </div>
                  </li>
                ))}
                {filteredCountries.length === 0 && (
                  <li className="px-3 py-2 text-muted-foreground text-center">
                    لا توجد نتيجة مطابقة
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="flex-1 flex items-center gap-2">
          <span
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="font-bold text-sm cursor-pointer px-2"
          >
            +{selectedCountry.code}
          </span>
          <Input
            type="tel"
            inputMode="numeric"
            dir="ltr"
            value={phoneNumber}
            onChange={(e) => handlePhoneNumberChange(e.target.value)}
            placeholder={`ادخل ${selectedCountry.digitLength} ${
              selectedCountry.digitLength <= 10 ? 'ارقام' : 'رقم'
            }`}
            className={cn(
              'flex-1 font-bold tracking-widest',
              error && 'border-destructive'
            )}
            autoFocus
          />
        </div>
      </div>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
};
