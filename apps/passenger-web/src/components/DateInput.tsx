import React, { useState, useEffect } from 'react';
import { Input } from '@mishwari/ui-web';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function DateInput({ value, onChange, disabled = false, placeholder = 'DD/MM/YYYY' }: DateInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        setDisplayValue(`${day}/${month}/${year}`);
      }
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '');
    
    if (input.length > 8) input = input.slice(0, 8);
    
    let formatted = '';
    if (input.length > 0) {
      formatted = input.slice(0, 2);
      if (input.length > 2) {
        formatted += '/' + input.slice(2, 4);
        if (input.length > 4) {
          formatted += '/' + input.slice(4, 8);
        }
      }
    }
    
    setDisplayValue(formatted);
    
    if (input.length === 8) {
      const day = input.slice(0, 2);
      const month = input.slice(2, 4);
      const year = input.slice(4, 8);
      const isoDate = `${year}-${month}-${day}`;
      const date = new Date(isoDate);
      
      if (!isNaN(date.getTime())) {
        onChange(isoDate);
      }
    }
  };

  return (
    <Input
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      className='w-full'
      dir='ltr'
    />
  );
}
