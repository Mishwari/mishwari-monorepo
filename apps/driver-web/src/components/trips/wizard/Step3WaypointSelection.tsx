import { useState, useEffect } from 'react';
import { Button } from '@mishwari/ui-web';
import type { Waypoint } from '@mishwari/api';

interface Step3Props {
  waypoints: Waypoint[];
  totalDistance: number;
  totalPrice: number;
  loading: boolean;
  selected: number[];
  customPrices: Record<number, number>;
  onChange: (ids: number[]) => void;
  onPriceChange: (cityId: number, price: number) => void;
  onResetPrices: () => void;
  onBack: () => void;
  onNext: () => void;
}

export default function Step3WaypointSelection({ waypoints, totalDistance, totalPrice, loading, selected, customPrices, onChange, onPriceChange, onResetPrices, onBack, onNext }: Step3Props) {
  const pricePerKm = totalDistance > 0 ? totalPrice / totalDistance : 0;
  const [errors, setErrors] = useState<Record<number, string>>({});

  const toggleWaypoint = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter(w => w !== id));
    } else {
      const allWaypointIds = waypoints.map(w => w.city_id);
      const newSelected = [...selected, id].sort((a, b) => {
        return allWaypointIds.indexOf(a) - allWaypointIds.indexOf(b);
      });
      onChange(newSelected);
    }
  };

  const validatePrices = () => {
    const newErrors: Record<number, string> = {};
    const waypointMap = new Map(waypoints.map(w => [w.city_id, w]));
    
    for (let i = 0; i < selected.length; i++) {
      const cityId = selected[i];
      const waypoint = waypointMap.get(cityId);
      if (!waypoint) continue;
      
      const currentPrice = customPrices[cityId] || (waypoint.distance_from_start_km * pricePerKm);
      
      if (i > 0) {
        const prevId = selected[i - 1];
        const prevWaypoint = waypointMap.get(prevId);
        if (prevWaypoint) {
          const prevPrice = customPrices[prevId] || (prevWaypoint.distance_from_start_km * pricePerKm);
          if (currentPrice <= prevPrice) {
            newErrors[cityId] = 'السعر يجب أن يكون أكبر من المحطة السابقة';
          }
        }
      }
      
      if (i < selected.length - 1) {
        const nextId = selected[i + 1];
        const nextWaypoint = waypointMap.get(nextId);
        if (nextWaypoint) {
          const nextPrice = customPrices[nextId] || (nextWaypoint.distance_from_start_km * pricePerKm);
          if (currentPrice >= nextPrice) {
            newErrors[cityId] = 'السعر يجب أن يكون أقل من المحطة التالية';
          }
        }
      }
      
      if (currentPrice >= totalPrice) {
        newErrors[cityId] = 'السعر يجب أن يكون أقل من السعر الكلي';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    validatePrices();
  }, [customPrices, selected, waypoints, pricePerKm, totalPrice]);

  const handleNext = () => {
    if (validatePrices()) {
      onNext();
    }
  };

  const hasPriceModifications = () => {
    return Object.keys(customPrices).length > 0;
  };

  if (loading) {
    return <div className="text-center py-8">جاري اكتشاف نقاط التوقف...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">نقاط التوقف</h2>
          <p className="text-gray-600">اختر المدن التي تريد التوقف فيها</p>
        </div>
        {hasPriceModifications() && (
          <Button onClick={onResetPrices} variant="outline" size="sm">
            إعادة تعيين الأسعار
          </Button>
        )}
      </div>

      {waypoints.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          لا توجد مدن على هذا المسار
        </div>
      ) : (
        <div className="space-y-2">
          {waypoints.map((waypoint) => {
            const isSelected = selected.includes(waypoint.city_id);
            return (
              <div
                key={waypoint.city_id}
                className={`flex items-center p-3 border rounded-lg hover:bg-gray-50 ${
                  isSelected ? 'bg-blue-50' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleWaypoint(waypoint.city_id)}
                  className="mx-3"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <span className="font-medium">{waypoint.city_name}</span>
                      <span className="text-sm text-gray-500 mr-2">
                        ({waypoint.distance_from_start_km.toFixed(1)} كم)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={customPrices[waypoint.city_id] || (waypoint.distance_from_start_km * pricePerKm).toFixed(2)}
                        onChange={(e) => onPriceChange(waypoint.city_id, Number(e.target.value))}
                        onClick={(e) => e.stopPropagation()}
                        className={`w-24 px-2 py-1 text-sm border rounded ${errors[waypoint.city_id] ? 'border-red-500' : 'border-gray-300'}`}
                        disabled={!isSelected}
                      />
                      <span className="text-sm">ر.ي</span>
                    </div>
                  </div>
                  {errors[waypoint.city_id] && (
                    <div className="text-xs text-red-500 mt-1">{errors[waypoint.city_id]}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1"
        >
          رجوع
        </Button>
        <Button
          onClick={handleNext}
          disabled={Object.keys(errors).length > 0}
          className="flex-1"
        >
          التالي
        </Button>
      </div>
    </div>
  );
}
