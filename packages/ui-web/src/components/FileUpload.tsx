import { useState } from 'react';
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { validateFileSize, validateFileType, ALLOWED_DOCUMENT_TYPES } from '@mishwari/utils';
import { cn } from '../lib/utils';

interface FileUploadProps {
  label: string;
  accept?: string;
  maxFiles?: number;
  onChange: (files: File[] | File | null) => void;
  className?: string;
  required?: boolean;
}

export const FileUpload = ({ label, accept = '.pdf,.jpg,.jpeg,.png', maxFiles = 5, onChange, className, required }: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setError('');

    if (files.length + selectedFiles.length > maxFiles) {
      setError(`الحد الأقصى ${maxFiles} ملفات`);
      return;
    }

    const invalidFiles = selectedFiles.filter(file => {
      if (!validateFileSize(file)) {
        setError('حجم الملف يجب أن يكون أقل من 10 ميجابايت');
        return true;
      }
      if (!validateFileType(file, ALLOWED_DOCUMENT_TYPES)) {
        setError('نوع الملف غير مدعوم. استخدم PDF أو JPG أو PNG');
        return true;
      }
      return false;
    });

    if (invalidFiles.length > 0) return;

    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);
    onChange(maxFiles === 1 ? newFiles[0] || null : newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange(maxFiles === 1 ? null : newFiles);
  };

  return (
    <div className={cn('w-full', className)}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
        <input
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={handleFileChange}
          className="hidden"
          id={`file-upload-${label}`}
          required={required}
        />
        <label htmlFor={`file-upload-${label}`} className="cursor-pointer">
          <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">اضغط لرفع الملفات</p>
          <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (حد أقصى 10MB)</p>
        </label>
      </div>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-700 truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-600 hover:text-red-800"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
