import { Input } from '@mishwari/ui-web';

interface Passenger {
  name: string;
  email: string;
  phone: string;
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
        <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف *</label>
        <Input
          type="tel"
          value={passenger.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="05xxxxxxxx"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
        <Input
          type="email"
          value={passenger.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="example@email.com"
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
        <select
          value={passenger.gender || ''}
          onChange={(e) => onChange('gender', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">اختر</option>
          <option value="male">ذكر</option>
          <option value="female">أنثى</option>
        </select>
      </div>
    </div>
  );
}
