import React from 'react';
import { PhoneInput, countries } from '@mishwari/ui-web';

interface PhoneInputWrapperProps {
  setMobileNumber: (value: string) => void;
}

const PhoneInputWrapper: React.FC<PhoneInputWrapperProps> = ({ setMobileNumber }) => {
  return (
    <div className="flex justify-center items-center w-full">
      <PhoneInput
        value=""
        onChange={setMobileNumber}
        countries={countries}
        className="max-w-[300px]"
      />
    </div>
  );
};

export default PhoneInputWrapper;
