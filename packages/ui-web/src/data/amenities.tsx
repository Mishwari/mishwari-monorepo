import AirConditionarIcon from '@mishwari/ui-web/public/icons/amenities/airConditionar.svg';
import WifiIcon from '@mishwari/ui-web/public/icons/amenities/wifiIcon.svg';
import MobileIcon from '@mishwari/ui-web/public/icons/amenities/mobileIcon.svg';

export const BUS_AMENITIES_WITH_ICONS = [
  { key: 'ac', label: 'مكيف', labelEn: 'Air Conditioning', Icon: AirConditionarIcon },
  { key: 'wifi', label: 'واي فاي', labelEn: 'WiFi', Icon: WifiIcon },
  { key: 'charging', label: 'شحن الجوال', labelEn: 'Phone Charging', Icon: MobileIcon },
  { key: 'tv', label: 'تلفاز', labelEn: 'TV', Icon: null },
  { key: 'toilet', label: 'دورة مياه', labelEn: 'Toilet', Icon: null },
] as const;
