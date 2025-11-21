import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@mishwari/ui-web';
import { driversApi } from '@mishwari/api';
import { Driver } from '@mishwari/types';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function DriverDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDriver = async () => {
      try {
        const data = await driversApi.getById(Number(id));
        setDriver(data);
      } catch (error) {
        console.error('Failed to fetch driver:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!driver) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">السائق غير موجود</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{driver.driver_name}</h1>
            {driver.is_verified ? (
              <div className="flex items-center gap-1 text-green-600 mt-2">
                <CheckCircleIcon className="h-5 w-5" />
                <span className="text-sm font-medium">موثق</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-amber-600 mt-2">
                <ClockIcon className="h-5 w-5" />
                <span className="text-sm font-medium">قيد المراجعة</span>
              </div>
            )}
          </div>
          {!driver.is_verified && (
            <Button
              onClick={() => router.push(`/drivers/${driver.id}/verify`)}
              variant="default"
            >
              رفع المستندات
            </Button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">معلومات السائق</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">رقم الجوال</p>
              <p className="font-medium">{driver.mobile_number || 'غير محدد'}</p>
            </div>

            {driver.email && (
              <div>
                <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                <p className="font-medium">{driver.email}</p>
              </div>
            )}

            {driver.national_id && (
              <div>
                <p className="text-sm text-gray-500">رقم الهوية</p>
                <p className="font-medium">{driver.national_id}</p>
              </div>
            )}

            {driver.driver_license && (
              <div>
                <p className="text-sm text-gray-500">رقم رخصة القيادة</p>
                <p className="font-medium">{driver.driver_license}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500">التقييم</p>
              <p className="font-medium text-lg">{driver.driver_rating} ⭐</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">الشركة</p>
              <p className="font-medium">{driver.operator?.name}</p>
            </div>
          </div>
        </div>

        {driver.buses && driver.buses.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">الحافلات المرتبطة</h2>
            <div className="space-y-3">
              {driver.buses.map((bus: any) => (
                <div key={bus.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{bus.bus_number}</p>
                      <p className="text-sm text-gray-600">{bus.bus_type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">السعة: {bus.capacity} مقعد</p>
                      {bus.is_verified && (
                        <span className="text-xs text-green-600">✓ موثق</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!driver.is_verified && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800">
              💡 يجب رفع مستندات السائق وانتظار الموافقة لتتمكن من تعيينه للرحلات
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
