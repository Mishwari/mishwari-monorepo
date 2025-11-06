import React, { useState } from 'react';

interface TextInputProps {
  title?: string;
  type?: string;
  placeholder?: string;
  value?: any;
  setValue?: any;
  isDisabled?: boolean;
}

function TextInput({
  title = 'المعلومات',
  placeholder = 'مثال',
  type = 'text',
  value,
  setValue,
  isDisabled = false,
}: TextInputProps) {
  // const [value, setValue] = useState<string | number | undefined>()
  return (
    <div className='px-4 py-2 w-full'>
      <h1 className='text-sm'>{title}</h1>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={isDisabled ? '(لا يوجد)' : placeholder}
        className={`${
          isDisabled
            ? 'bg-slate-100 rounded-lg'
            : ' border-b-1.5  border-[#005687]'
        } w-full px-2 py-1  text-lg font-bold focus:outline-none`}
        disabled={isDisabled}
      />
    </div>
  );
}

export default TextInput;
