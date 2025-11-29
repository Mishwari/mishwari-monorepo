import React, { useState, useEffect } from 'react';
import { Passenger } from '@mishwari/types';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ToggleSwitch } from '../ToggleSwitch';

interface PassengerFormProps {
  passenger?: Passenger | null;
  onSubmit: (data: Omit<Passenger, 'id'>) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export const PassengerForm: React.FC<PassengerFormProps> = ({
  passenger,
  onSubmit,
  onCancel,
  submitLabel = 'حفظ',
}) => {
  const [formData, setFormData] = useState<Omit<Passenger, 'id'>>({
    name: '',
    age: null,
    gender: 'male',
    is_checked: true,
  });

  useEffect(() => {
    if (passenger) {
      setFormData({
        name: passenger.name,
        age: passenger.age,
        gender: passenger.gender || 'male',
        is_checked: passenger.is_checked ?? true,
      });
    }
  }, [passenger]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">الاسم</label>
        <Input
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="اسم الراكب"
          className="text-right"
          required
        />
      </div>
      <div className="flex justify-start gap-4 items-end">
        <div className="w-1/3">
          <label className="block text-sm font-medium mb-1">العمر</label>
          <Input
            value={formData.age || ''}
            onChange={(e) => handleChange('age', e.target.value ? Number(e.target.value) : null)}
            placeholder="العمر"
            type="number"
            className="text-right"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">الجنس</label>
          <ToggleSwitch
            value={formData.gender}
            onChange={(value) => handleChange('gender', value)}
            options={[
              { value: 'male', label: 'ذكر' },
              { value: 'female', label: 'انثى' },
            ]}
            activeColor="bg-[#005687]"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1 bg-[#005687] hover:bg-[#005687]/90">
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
            إلغاء
          </Button>
        )}
      </div>
    </form>
  );
};
