export const FIREBASE_ENABLED_COUNTRY_CODES = ['967', '20'];

export const shouldUseFirebase = (phoneNumber: string): boolean => {
  return FIREBASE_ENABLED_COUNTRY_CODES.some(code => phoneNumber.startsWith(code));
};
