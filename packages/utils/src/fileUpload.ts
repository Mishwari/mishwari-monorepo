export const createFormData = (data: File[] | Record<string, File | null>, fieldName: string = 'documents'): FormData => {
  const formData = new FormData();
  
  if (Array.isArray(data)) {
    data.forEach((file) => {
      formData.append(fieldName, file);
    });
  } else {
    Object.entries(data).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
      }
    });
  }
  
  return formData;
};

export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];
