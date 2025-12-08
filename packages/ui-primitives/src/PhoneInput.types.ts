export interface Country {
  value: string;
  label: string;
  nameEn: string;
  symbol: string;
  code: string;
  digitLength: number;
}

export interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  defaultCountry?: Country;
  className?: string;
}
