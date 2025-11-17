export const BUS_AMENITIES = [
  { key: 'ac', label: 'مكيف', labelEn: 'Air Conditioning' },
  { key: 'wifi', label: 'واي فاي', labelEn: 'WiFi' },
  { key: 'charging', label: 'شحن الجوال', labelEn: 'Phone Charging' },
  { key: 'tv', label: 'تلفاز', labelEn: 'TV' },
  { key: 'toilet', label: 'دورة مياه', labelEn: 'Toilet' },
] as const;

export type AmenityKey = typeof BUS_AMENITIES[number]['key'];
