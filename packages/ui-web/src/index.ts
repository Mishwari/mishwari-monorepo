export { Button } from './components/ui/button';
export { Badge } from './components/ui/badge';
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './components/ui/card';
export { PhoneInput } from './components/PhoneInput';
export { OtpInput } from './components/OtpInput';
export { Combobox } from './components/Combobox';
export { DatePicker } from './components/DatePicker';
export { QuickDateButtons } from './components/QuickDateButtons';
export { QuickDaySelector } from './components/QuickDaySelector';
export { FileUpload } from './components/FileUpload';
export { Input } from './components/ui/input';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
export { ToggleSwitch } from './components/ToggleSwitch';
export { UserDropdownMenu } from './components/UserDropdownMenu';
export { TripCardBase } from './components/TripCardBase';
export { BookingCardBase } from './components/BookingCardBase';
export { cn } from './lib/utils';
export { countries } from './data';

// Layout components
export * from './layouts';

// Utility components
export { Logo } from './components/Logo';
export { LogoutButton } from './components/LogoutButton';

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