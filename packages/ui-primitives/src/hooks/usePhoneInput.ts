import { useState, useEffect } from 'react';
import { Country } from '../PhoneInput.types';

export const usePhoneInput = (
  onChange: (value: string) => void,
  defaultCountry: Country
) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

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
