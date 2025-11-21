import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BusForm from '@/components/fleet/BusForm';
import { Button, ConfirmDialog } from '@mishwari/ui-web';
import { fleetApi } from '@mishwari/api';
import { Bus } from '@mishwari/types';
import { CheckCircleIcon, XCircleIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function BusDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [bus, setBus] = useState<Bus | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchBus = async () => {
      try {
        const data = await fleetApi.getById(Number(id));
        setBus(data);
      } catch (error) {
        toast.error('فشل تحميل بيانات الحافلة');
      } finally {
        setLoading(false);
      }
    };

    fetchBus();
  }, [id]);

  const handleSubmit = async (data: { bus_number: string; bus_type: string; capacity: number; amenities: Record<string, string> }) => {
    // Check if bus_number or bus_type changed and bus is verified
    const willLoseVerification = bus?.is_verified && (
      data.bus_number !== bus.bus_number || 
      data.bus_type !== bus.bus_type
    );
    
    if (willLoseVerification) {
      setPendingData(data);
      setShowConfirmDialog(true);
    } else {
      await performUpdate(data);
    }
  };
  
  const performUpdate = async (data: { bus_number: string; bus_type: string; capacity: number; amenities: Record<string, string> }) => {
    setSubmitting(true);
    try {
      const updated = await fleetApi.update(Number(id), data);
      setBus(updated);
      setIsEditing(false);
      toast.success('تم تحديث الحافلة بنجاح');
    } catch (err: any) {
      toast.error('فشل تحديث الحافلة');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!bus) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">الحافلة غير موجودة</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={() => {
          setShowConfirmDialog(false);
          performUpdate(pendingData);
        }}
        title="تحذير: ستفقد التوثيق"
        description="تغيير رقم أو نوع الحافلة سيؤدي إلى إلغاء التوثيق الحالي. ستحتاج إلى إعادة التوثيق مرة أخرى. هل تريد المتابعة؟"
        confirmText="نعم، متابعة"
        cancelText="إلغاء"
        variant="default"
      />
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">تفاصيل الحافلة</h1>
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="flex gap-2 items-center"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                  تعديل
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="flex gap-2 items-center text-gray-600 hover:text-red-500"
                >
                  <XMarkIcon className="w-4 h-4" />
                  إلغاء
                </Button>
              )}
              <div className="flex items-center gap-2">
                {bus.is_verified ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                ) : (
                  <XCircleIcon className="h-6 w-6 text-gray-400" />
                )}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    bus.is_verified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {bus.is_verified ? 'موثق' : 'غير موثق'}
                </span>
              </div>
            </div>
          </div>

          <BusForm
            initialData={{
              bus_number: bus.bus_number,
              bus_type: bus.bus_type,
              capacity: bus.capacity,
              amenities: bus.amenities || {},
            }}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/fleet')}
            loading={submitting}
            isDisabled={!isEditing}
          />

          {!isEditing && (
            <div className="mt-6">
              <Button
                onClick={() => router.push('/fleet')}
                variant="outline"
                size="lg"
                className="w-full"
              >
                العودة
              </Button>
            </div>
          )}

          {!bus.is_verified && (
            <div className="mt-4">
              <Button
                onClick={() => router.push(`/fleet/${bus.id}/verify`)}
                variant="outline"
                size="lg"
                className="w-full"
              >
                توثيق الحافلة
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
