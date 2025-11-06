export { Button } from './components/ui/button';
export { PhoneInput } from './components/PhoneInput';
export { OtpInput } from './components/OtpInput';
export { Combobox } from './components/Combobox';
export { DatePicker } from './components/DatePicker';
export { QuickDateButtons } from './components/QuickDateButtons';
export { QuickDaySelector } from './components/QuickDaySelector';
export { Input } from './components/ui/input';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
export { ToggleSwitch } from './components/ToggleSwitch';
export { cn } from './lib/utils';
export { countries } from './data';

// Asset paths
export const ASSETS = {
  icons: {
    common: '/ui-web/icons/common',
    transport: '/ui-web/icons/transport',
    amenities: '/ui-web/icons/amenities',
    navigation: '/ui-web/icons/navigation',
  },
  images: '/ui-web/images',
} as const;