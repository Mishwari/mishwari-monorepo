import { useState, useEffect } from 'react';
import { Button, Input } from '@mishwari/ui-web';
import { tripsApi, fleetApi, CreateTripPayload } from '@mishwari/api';
import { Bus, Driver, City } from '@mishwari/types';
import { useCanPublishTrip } from '@/hooks/useCanPublishTrip';

interface TripFormProps {
  onSubmit: (data: CreateTripPayload, publish: boolean) => void;
  initialData?: Partial<CreateTripPayload>;
  loading?: boolean;
}

export default function TripForm({ onSubmit, initialData, loading }: TripFormProps) {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [formData, setFormData] = useState<CreateTripPayload>({
    bus: initialData?.bus || null,
    driver: initialData?.driver || null,
    from_city: initialData?.from_city || 0,
    to_city: initialData?.to_city || 0,
    trip_type: initialData?.trip_type || 'scheduled',
    journey_date: initialData?.journey_date || '',
    planned_departure: initialData?.planned_departure || '',
    departure_window_start: initialData?.departure_window_start || '',
    departure_window_end: initialData?.departure_window_end || '',
    price: initialData?.price || 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [busesData, citiesData] = await Promise.all([
          fleetApi.list().catch(() => []),
          tripsApi.getCities().catch(() => []),
        ]);
        setBuses(busesData);
        setCities(citiesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  const selectedBus = buses.find(b => b.id === formData.bus);
  const { canPublish: canPublishTrip, message } = useCanPublishTrip(selectedBus);

  const handleSubmit = (publish: boolean) => {
    onSubmit(formData, publish);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">الحافلة *</label>
        <select
          value={formData.bus || ''}
          onChange={(e) => setFormData({ ...formData, bus: Number(e.target.value) })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">اختر حافلة</option>
          {buses.map((bus) => (
            <option key={bus.id} value={bus.id}>
              {bus.bus_number} - {bus.bus_type} {bus.is_verified ? '✓' : '(غير موثقة)'}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">من *</label>
          <select
            value={formData.from_city}
            onChange={(e) => setFormData({ ...formData, from_city: Number(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value={0}>اختر مدينة</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>{city.city}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">إلى *</label>
          <select
            value={formData.to_city}
            onChange={(e) => setFormData({ ...formData, to_city: Number(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value={0}>اختر مدينة</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>{city.city}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">نوع الرحلة</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="scheduled"
              checked={formData.trip_type === 'scheduled'}
              onChange={(e) => setFormData({ ...formData, trip_type: e.target.value as 'scheduled' })}
              className="ml-2"
            />
            مجدولة
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="flexible"
              checked={formData.trip_type === 'flexible'}
              onChange={(e) => setFormData({ ...formData, trip_type: e.target.value as 'flexible' })}
              className="ml-2"
            />
            مرنة
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الرحلة *</label>
        <Input
          type="date"
          value={formData.journey_date}
          onChange={(e) => setFormData({ ...formData, journey_date: e.target.value })}
          required
        />
      </div>

      {formData.trip_type === 'scheduled' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">وقت المغادرة *</label>
          <Input
            type="time"
            value={formData.planned_departure}
            onChange={(e) => setFormData({ ...formData, planned_departure: e.target.value })}
            required
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">بداية النافذة *</label>
            <Input
              type="time"
              value={formData.departure_window_start}
              onChange={(e) => setFormData({ ...formData, departure_window_start: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نهاية النافذة *</label>
            <Input
              type="time"
              value={formData.departure_window_end}
              onChange={(e) => setFormData({ ...formData, departure_window_end: e.target.value })}
              required
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">السعر (ر.ي) *</label>
        <Input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          required
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          onClick={() => handleSubmit(false)}
          variant="outline"
          disabled={loading}
          className="flex-1"
        >
          حفظ كمسودة
        </Button>
        <Button
          onClick={() => handleSubmit(true)}
          variant="default"
          disabled={loading || !canPublishTrip}
          className="flex-1"
          title={message}
        >
          نشر الرحلة
        </Button>
      </div>

      {!canPublishTrip && (
        <p className="text-sm text-amber-600 text-center">
          💡 يمكنك حفظ الرحلة كمسودة. للنشر، يجب توثيق حسابك والحافلة أولاً.
        </p>
      )}
    </div>
  );
}
