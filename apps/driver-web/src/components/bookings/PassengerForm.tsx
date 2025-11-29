import { Input, ToggleSwitch } from '@mishwari/ui-web';

interface Passenger {
  name: string;
  age?: number;
  gender?: string;
}

interface PassengerFormProps {
  passenger: Passenger;
  onChange: (field: keyof Passenger, value: string | number) => void;
}

export default function PassengerForm({ passenger, onChange }: PassengerFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">الاسم *</label>
        <Input
          type="text"
          value={passenger.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="اسم الراكب"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">العمر</label>
        <Input
          type="number"
          value={passenger.age || ''}
          onChange={(e) => onChange('age', Number(e.target.value))}
          placeholder="العمر"
          min="1"
          max="120"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">الجنس</label>
        <ToggleSwitch
          value={passenger.gender || 'male'}
          onChange={(value) => onChange('gender', value)}
          options={[
            { value: 'male', label: 'ذكر' },
            { value: 'female', label: 'أنثى' },
          ]}
        />
      </div>
    </div>
  );
}
