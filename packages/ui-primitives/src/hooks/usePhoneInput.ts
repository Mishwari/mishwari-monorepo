import { useState, useEffect } from 'react';
import { Country } from '../PhoneInput.types';
import { useIPLocation } from './useIPLocation';

export const usePhoneInput = (
  onChange: (value: string) => void,
  defaultCountry: Country,
  value?: string,
  countries?: Country[],
  autoDetectRegion = true
) => {
  const { location } = useIPLocation();
  const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (autoDetectRegion && location?.country && countries && !initialized) {
      const detectedCountry = countries.find(c => c.nameEn === location.country);
      if (detectedCountry) {
        setSelectedCountry(detectedCountry);
      }
    }
  }, [location, countries, autoDetectRegion, initialized]);

  useEffect(() => {
    if (value && !initialized && countries) {
      const matchedCountry = countries.find(c => value.startsWith(c.code));
      if (matchedCountry) {
        setSelectedCountry(matchedCountry);
        setPhoneNumber(value.slice(matchedCountry.code.length));
        setInitialized(true);
      }
    } else if (value && !initialized) {
      if (value.startsWith(selectedCountry.code)) {
        setPhoneNumber(value.slice(selectedCountry.code.length));
        setInitialized(true);
      }
    }
  }, [value, initialized, countries, selectedCountry.code]);

  useEffect(() => {
    const expectedLength = selectedCountry.code.length + selectedCountry.digitLength;
    const fullNumber = selectedCountry.code + phoneNumber;
    
    if (fullNumber.length === expectedLength) {
      onChange(fullNumber);
    } else {
      onChange('');
    }
  }, [phoneNumber, selectedCountry, onChange]);

  const handlePhoneNumberChange = (value: string) => {
    const digitLimit = selectedCountry.digitLength;
    const regex = /^[0-9]*$/;

    if (regex.test(value)) {
      if (value.length <= digitLimit) {
        setPhoneNumber(value);
        setError('');
      } else {
        setError(`يجب ألا يتجاوز رقم الهاتف ${digitLimit} أرقام`);
      }
    } else {
      setError('تنسيق غير صالح: يسمح بالأرقام فقط');
    }
  };

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setPhoneNumber('');
    setDropdownOpen(false);
    setSearchTerm('');
    setError('');
  };

  return {
    selectedCountry,
    phoneNumber,
    error,
    dropdownOpen,
    searchTerm,
    setDropdownOpen,
    setSearchTerm,
    handlePhoneNumberChange,
    handleCountryChange,
  };
};
