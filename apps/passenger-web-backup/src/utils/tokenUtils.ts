export const encryptToken = (token: string) => {
    try {
      return btoa(unescape(encodeURIComponent(token)));
    } catch (error: any) {
      console.error('Error encrypting token:', error);
      return token;
    }
  };
  
  export const decryptToken = (encryptedToken: string) => {
    try {
      return decodeURIComponent(escape(atob(encryptedToken)));
    } catch (error: any) {
      console.error('Error decrypting token:', error);
      return encryptedToken;
    }
  };