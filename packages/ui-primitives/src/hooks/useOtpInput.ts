import { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react';

export const useOtpInput = (length: number, onChange: (value: string) => void) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    onChange(newOtp.join(''));

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(Array(length).fill('')).slice(0, length);
    setOtp(newOtp);
    onChange(newOtp.join(''));
    inputRefs.current[Math.min(pastedData.length, length - 1)]?.focus();
  };

  return {
    otp,
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
  };
};
