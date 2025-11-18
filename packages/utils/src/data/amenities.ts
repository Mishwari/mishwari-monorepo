export const BUS_AMENITIES = [
  { key: 'ac', label: 'مكيف', labelEn: 'Air Conditioning', icon: 'airConditionar' },
  { key: 'wifi', label: 'واي فاي', labelEn: 'WiFi', icon: 'wifiIcon' },
  { key: 'charging', label: 'شحن الجوال', labelEn: 'Phone Charging', icon: 'mobileIcon' },
  { key: 'tv', label: 'تلفاز', labelEn: 'TV', icon: null },
  { key: 'toilet', label: 'دورة مياه', labelEn: 'Toilet', icon: null },
] as const;

export type AmenityKey = typeof BUS_AMENITIES[number]['key'];
