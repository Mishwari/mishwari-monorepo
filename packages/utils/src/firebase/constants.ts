export const FIREBASE_ENABLED_COUNTRY_CODES = ['967', '20', '91', '966', '971', '964', '974', '968', '965', '973', '971'];

export const shouldUseFirebase = (phoneNumber: string): boolean => {
  return FIREBASE_ENABLED_COUNTRY_CODES.some(code => phoneNumber.startsWith(code));
};
