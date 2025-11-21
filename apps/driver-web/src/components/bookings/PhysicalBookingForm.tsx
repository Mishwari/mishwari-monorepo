import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Input } from '@mishwari/ui-web';
import { operatorApi } from '@mishwari/api';
import { Trip } from '@mishwari/types';
import PassengerForm from './PassengerForm';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Passenger {
  name: string;
  email: string;
  phone: string;
  age?: number;
  gender?: string;
}

export default function PhysicalBookingForm() {
  const router = useRouter();
  const { id: tripId } = router.query;
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [stops, setStops] = useState<any[]>([]);
  const [fromStop, setFromStop] = useState<number | null>(null);
  const [toStop, setToStop] = useState<number | null>(null);

  const getAvailableToStops = () => {
    if (!fromStop) return [];
    const fromIndex = stops.findIndex(s => s.id === fromStop);
    return stops.slice(fromIndex + 1);
  };

  useEffect(() => {
    setToStop(null);
  }, [fromStop]);
  const [passengers, setPassengers] = useState<Passenger[]>([{ name: '', email: '', phone: '' }]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'wallet'>('cash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!tripId) return;
    
    const fetchTrip = async () => {
      try {
        const trip = await operatorApi.getTripById(Number(tripId));
        setSelectedTrip(trip);
      } catch (error) {
        console.error('Failed to fetch trip:', error);
      }
    };
    fetchTrip();
  }, [tripId]);

  useEffect(() => {
    if (selectedTrip) {
      const fetchStops = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}trip-stops/?trip=${selectedTrip.id}`);
          const data = await response.json();
          setStops(data);
        } catch (error) {
          console.error('Failed to fetch stops:', error);
        }
      };
      fetchStops();
    }
  }, [selectedTrip]);

  const calculateFare = () => {
    if (!fromStop || !toStop || stops.length === 0) return 0;
    const from = stops.find(s => s.id === fromStop);
    const to = stops.find(s => s.id === toStop);
    if (!from || !to) return 0;
    return (to.price_from_start - from.price_from_start) * passengers.length;
  };

  const handleAddPassenger = () => {
    setPassengers([...passengers, { name: '', email: '', phone: '' }]);
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    }
  };

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string | number) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedTrip || !fromStop || !toStop) {
      setError('يرجى اختيار الرحلة ونقاط التوقف');
      return;
    }

    const invalidPassenger = passengers.find(p => !p.name || !p.phone);
    if (invalidPassenger) {
      setError('يرجى إكمال بيانات جميع الركاب');
      return;
    }

    setLoading(true);

    try {
      const totalFare = calculateFare();
      await operatorApi.createPhysicalBooking({
        trip: selectedTrip.id,
        from_stop: fromStop,
        to_stop: toStop,
        passengers: passengers.map(p => ({
          name: p.name,
          email: p.email || '',
          phone: p.phone,
          age: p.age,
          gender: p.gender,
        })),
        payment_method: paymentMethod,
        total_fare: totalFare,
      });

      router.push(`/trips/${tripId}/bookings`);
    } catch (error: any) {
      console.error('Failed to create booking:', error);
      setError(error?.response?.data?.error || 'فشل إنشاء الحجز');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {selectedTrip && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">الرحلة</label>
          <p className="text-lg font-semibold">
            {selectedTrip.from_city.city} → {selectedTrip.to_city.city}
          </p>
          <p className="text-sm text-gray-600">{selectedTrip.journey_date}</p>
        </div>
      )}

      {selectedTrip && stops.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">من</label>
              <select
                value={fromStop || ''}
                onChange={(e) => setFromStop(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">اختر نقطة البداية</option>
                {stops.map((stop) => (
                  <option key={stop.id} value={stop.id}>
                    {stop.city.city}
                  </option>
                ))}
              </select>
            </div>

            {fromStop && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">إلى</label>
                <select
                  value={toStop || ''}
                  onChange={(e) => setToStop(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">اختر نقطة النهاية</option>
                  {getAvailableToStops().map((stop) => (
                    <option key={stop.id} value={stop.id}>
                      {stop.city.city}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {fromStop && toStop && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-lg font-bold text-blue-900">
                الأجرة الإجمالية: {calculateFare()} ريال
              </p>
              <p className="text-sm text-blue-700">
                ({passengers.length} راكب × {calculateFare() / passengers.length} ريال)
              </p>
            </div>
          )}
        </>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">الركاب</label>
          <Button type="button" onClick={handleAddPassenger} variant="outline" size="sm">
            <PlusIcon className="h-4 w-4 ml-1" />
            إضافة راكب
          </Button>
        </div>

        <div className="space-y-4">
          {passengers.map((passenger, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">راكب {index + 1}</h4>
                {passengers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePassenger(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </div>

              <PassengerForm
                passenger={passenger}
                onChange={(field, value) => handlePassengerChange(index, field, value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">طريقة الدفع</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="cash"
              checked={paymentMethod === 'cash'}
              onChange={(e) => setPaymentMethod(e.target.value as 'cash')}
              className="ml-2"
            />
            نقدي
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="wallet"
              checked={paymentMethod === 'wallet'}
              onChange={(e) => setPaymentMethod(e.target.value as 'wallet')}
              className="ml-2"
            />
            محفظة
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" variant="default" size="lg" disabled={loading} className="flex-1">
          {loading ? 'جاري الحجز...' : 'تأكيد الحجز'}
        </Button>
        <Button type="button" onClick={() => router.back()} variant="outline" size="lg">
          إلغاء
        </Button>
      </div>
    </form>
  );
}
