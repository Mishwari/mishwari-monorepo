import { useState } from 'react';
import { Button, Input } from '@mishwari/ui-web';
import { BUS_AMENITIES } from '@mishwari/utils';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface BusFormProps {
  initialData?: {
    bus_number: string;
    bus_type: string;
    capacity: number;
    has_wifi?: boolean;
    has_ac?: boolean;
    has_usb_charging?: boolean;
  };
  onSubmit: (data: {
    bus_number: string;
    bus_type: string;
    capacity: number;
    has_wifi: boolean;
    has_ac: boolean;
    has_usb_charging: boolean;
  }) => void;
  onCancel: () => void;
  loading?: boolean;
  isDisabled?: boolean;
}

export default function BusForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
  isDisabled = false,
}: BusFormProps) {
  const [formData, setFormData] = useState({
    bus_number: initialData?.bus_number || '',
    bus_type: initialData?.bus_type || '',
    capacity: initialData?.capacity || 30,
    has_wifi: initialData?.has_wifi || false,
    has_ac: initialData?.has_ac || false  ,
    has_usb_charging: initialData?.has_usb_charging || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6'>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          رقم الحافلة
        </label>
        <Input
          type='text'
          value={formData.bus_number}
          onChange={(e) =>
            setFormData({ ...formData, bus_number: e.target.value })
          }
          placeholder={isDisabled ? '(لا يوجد)' : 'مثال: ABC-1234'}
          required={!isDisabled}
          readOnly={isDisabled}
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          نوع الحافلة
        </label>
        <Input
          type='text'
          value={formData.bus_type}
          onChange={(e) =>
            setFormData({ ...formData, bus_type: e.target.value })
          }
          placeholder={isDisabled ? '(لا يوجد)' : 'مثال: حافلة سياحية'}
          required={!isDisabled}
          readOnly={isDisabled}
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          عدد المقاعد
        </label>
        <Input
          type='number'
          value={formData.capacity}
          onChange={(e) =>
            setFormData({ ...formData, capacity: parseInt(e.target.value) })
          }
          min={10}
          max={60}
          required={!isDisabled}
          readOnly={isDisabled}
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          المرافق
        </label>
        <div className='flex flex-wrap gap-3'>
          <label className='flex items-center gap-2 cursor-pointer'>
            <input
              type='checkbox'
              checked={formData.has_wifi}
              onChange={(e) =>
                setFormData({ ...formData, has_wifi: e.target.checked })
              }
              className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500'
              disabled={isDisabled}
            />
            <span className='text-sm text-gray-700'>واي فاي</span>
          </label>
          <label className='flex items-center gap-2 cursor-pointer'>
            <input
              type='checkbox'
              checked={formData.has_ac}
              onChange={(e) =>
                setFormData({ ...formData, has_ac: e.target.checked })
              }
              className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500'
              disabled={isDisabled}
            />
            <span className='text-sm text-gray-700'>مكيف</span>
          </label>
          <label className='flex items-center gap-2 cursor-pointer'>
            <input
              type='checkbox'
              checked={formData.has_usb_charging}
              onChange={(e) =>
                setFormData({ ...formData, has_usb_charging: e.target.checked })
              }
              className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500'
              disabled={isDisabled}
            />
            <span className='text-sm text-gray-700'>شحن USB</span>
          </label>
        </div>
      </div>

      {!isDisabled && (
        <div className='flex gap-4'>
          <Button
            type='submit'
            variant='default'
            size='lg'
            className='flex-1'
            disabled={loading}>
            {loading ? 'جاري الحفظ...' : 'حفظ'}
          </Button>
          <Button
            type='button'
            onClick={onCancel}
            variant='outline'
            size='lg'>
            إلغاء
          </Button>
        </div>
      )}
    </form>
  );
}
