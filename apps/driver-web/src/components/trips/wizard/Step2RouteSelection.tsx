import { Button } from '@mishwari/ui-web';
import type { RouteAlternative } from '@mishwari/api';

interface Step2Props {
  routes: RouteAlternative[];
  loading: boolean;
  selected: number | null;
  onSelect: (index: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function Step2RouteSelection({ routes, loading, selected, onSelect, onBack, onNext }: Step2Props) {
  if (loading) {
    return <div className="text-center py-8">جاري تحميل المسارات...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">اختر المسار</h2>

      <div className="space-y-3">
        {routes.map((route) => (
          <div
            key={route.route_index}
            onClick={() => onSelect(route.route_index)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition ${
              selected === route.route_index ? 'border-primary bg-primary-light' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{route.summary}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  المسافة: {route.distance_km.toFixed(1)} كم • المدة: {Math.round(route.duration_min)} دقيقة
                </p>
              </div>
              {selected === route.route_index && (
                <span className="text-primary">✓</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1"
        >
          رجوع
        </Button>
        <Button
          onClick={onNext}
          disabled={selected === null}
          className="flex-1"
        >
          التالي
        </Button>
      </div>
    </div>
  );
}
