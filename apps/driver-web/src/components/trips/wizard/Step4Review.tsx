import { Button } from '@mishwari/ui-web';

interface Step4Props {
  formData: any;
  routeSummary?: string;
  waypoints: number[];
  onBack: () => void;
  onCreate: () => void;
  loading: boolean;
  canPublish: boolean;
}

export default function Step4Review({ formData, routeSummary, waypoints, onBack, onCreate, loading, canPublish }: Step4Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">مراجعة الرحلة</h2>

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">المسار:</span>
          <span className="font-medium">{routeSummary || 'غير محدد'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">التاريخ:</span>
          <span className="font-medium">{formData.journey_date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">وقت المغادرة:</span>
          <span className="font-medium">{formData.planned_departure}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">السعر الكلي:</span>
          <span className="font-medium">{formData.total_price} ر.ي</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">عدد نقاط التوقف:</span>
          <span className="font-medium">{waypoints.length}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={onBack}
          disabled={loading}
          variant="outline"
          className="flex-1"
        >
          رجوع
        </Button>
        <Button
          onClick={onCreate}
          disabled={loading}
          className="flex-1"
        >
          {loading ? 'جاري الإنشاء...' : canPublish ? 'نشر الرحلة' : 'حفظ كمسودة'}
        </Button>
      </div>
    </div>
  );
}
