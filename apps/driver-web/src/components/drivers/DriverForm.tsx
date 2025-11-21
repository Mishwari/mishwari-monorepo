import { useState } from 'react';
import { Button, Input } from '@mishwari/ui-web';

interface DriverFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
  initialData?: any;
}

export default function DriverForm({ onSubmit, onCancel, loading, initialData }: DriverFormProps) {
  const [formData, setFormData] = useState({
    mobile_number: initialData?.mobile_number || '',
    full_name: initialData?.full_name || '',
    national_id: initialData?.national_id || '',
    driver_license: initialData?.driver_license || '',
    email: initialData?.email || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          رقم الجوال *
        </label>
        <Input
          type="tel"
          name="mobile_number"
          value={formData.mobile_number}
          onChange={handleChange}
          placeholder="966xxxxxxxxx"
          required
          dir="ltr"
        />
        <p className="text-xs text-gray-500 mt-1">مثال: 966501234567</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          الاسم الكامل *
        </label>
        <Input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="أدخل الاسم الكامل"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          رقم الهوية الوطنية
        </label>
        <Input
          type="text"
          name="national_id"
          value={formData.national_id}
          onChange={handleChange}
          placeholder="أدخل رقم الهوية"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          رقم رخصة القيادة
        </label>
        <Input
          type="text"
          name="driver_license"
          value={formData.driver_license}
          onChange={handleChange}
          placeholder="أدخل رقم الرخصة"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          البريد الإلكتروني
        </label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@email.com"
          dir="ltr"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" variant="default" disabled={loading} className="flex-1">
          {loading ? 'جاري الإضافة...' : 'إضافة السائق'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="flex-1">
          إلغاء
        </Button>
      </div>
    </form>
  );
}
