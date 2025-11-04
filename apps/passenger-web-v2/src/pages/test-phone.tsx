import { useState } from 'react';
import { PhoneInput, countries } from '@mishwari/ui-web';

export default function TestPhone() {
  const [phone, setPhone] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-primary">
            اختبار مدخل الهاتف
          </h1>
          <p className="mt-2 text-gray-600">
            مكون PhoneInput الجديد مع shadcn
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <PhoneInput
            value={phone}
            onChange={setPhone}
            countries={countries}
          />

          {phone && (
            <div className="mt-4 p-4 bg-gray-200 rounded-md">
              <p className="text-sm text-brand-text-dark">رقم الهاتف المدخل:</p>
              <p className="text-lg font-bold text-brand-primary" dir="ltr">
                +{phone}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-brand-primary">
            الألوان المتاحة
          </h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-primary rounded"></div>
              <span>brand-primary: #005687</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-text-dark rounded"></div>
              <span>brand-text-dark: #042f40</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <span>gray-200: #E5E7EB</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-mishwari-accent rounded"></div>
              <span>mishwari-accent: #FF6B35</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-mishwari-success rounded"></div>
              <span>mishwari-success: #10B981</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-mishwari-error rounded"></div>
              <span>mishwari-error: #EF4444</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
