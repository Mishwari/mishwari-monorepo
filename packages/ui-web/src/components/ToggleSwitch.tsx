import React from 'react';

interface ToggleSwitchProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  activeColor?: string;
  inactiveColor?: string;
}

export function ToggleSwitch({
  value,
  onChange,
  options,
  disabled = false,
  activeColor = 'bg-brand-primary',
  inactiveColor = 'bg-gray-200',
}: ToggleSwitchProps) {
  const activeIndex = options.findIndex((opt) => opt.value === value);
  const itemWidth = 100 / options.length;

  return (
    <div
      dir="ltr"
      className={`relative inline-flex w-full rounded-lg p-1 ${inactiveColor} ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      }`}>
      <div
        className={`absolute top-1 bottom-1 rounded-md transition-all duration-300 ease-in-out ${activeColor} z-0`}
        style={{
          width: `calc(${itemWidth}% - 0.5rem)`,
          left: `calc(${activeIndex * itemWidth}% + 0.25rem)`,
        }}
      />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => !disabled && onChange(option.value)}
          disabled={disabled}
          className={`relative z-10 flex-1 px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          } ${
            value === option.value ? 'text-white' : 'text-gray-700 hover:text-gray-900'
          }`}>
          {option.label}
        </button>
      ))}
    </div>
  );
}
