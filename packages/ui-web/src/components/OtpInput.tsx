import React from 'react';
import { OtpInputProps, useOtpInput } from '@mishwari/ui-primitives';
import { cn } from '../lib/utils';

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  length = 4,
  error,
  disabled = false,
}) => {
  const { otp, inputRefs, handleChange, handleKeyDown, handlePaste } = useOtpInput(length, onChange);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2 flex-row-reverse">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            dir="ltr"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={cn(
              'w-12 h-12 text-center text-xl font-bold rounded-md border-2',
              'focus:outline-none focus:ring-2 focus:ring-mishwari-primary focus:border-transparent',
              'transition-all',
              error ? 'border-mishwari-error' : 'border-mishwari-gray-300',
              disabled && 'bg-mishwari-gray-100 cursor-not-allowed'
            )}
          />
        ))}
      </div>
      {error && <p className="text-sm text-mishwari-error">{error}</p>}
    </div>
  );
};
