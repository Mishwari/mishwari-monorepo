import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@mishwari/ui-web';
import { operatorApi } from '@mishwari/api';
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function UpgradeStatusPage() {
  const { isAuthenticated } = useSelector((state: AppState) => state.auth);
  const router = useRouter();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchStatus = async () => {
      try {
        const response = await operatorApi.getUpgradeStatus();
        setStatus(response.data);
      } catch (error) {
        console.error('Failed to fetch upgrade status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const statusConfig: Record<string, { icon: any; color: string; title: string; message: string }> = {
    none: {
      icon: ClockIcon,
      color: 'gray',
      title: 'لم يتم تقديم طلب',
      message: 'لم تقم بتقديم طلب ترقية بعد',
    },
    pending: {
      icon: ClockIcon,
      color: 'yellow',
      title: 'قيد المراجعة',
      message: 'طلبك قيد المراجعة من قبل الفريق. سيتم الرد خلال 24-48 ساعة',
    },
    approved: {
      icon: CheckCircleIcon,
      color: 'green',
      title: 'تمت الموافقة',
      message: 'تمت الموافقة على طلبك! تم ترقية حسابك إلى حساب شركة',
    },
    rejected: {
      icon: XCircleIcon,
      color: 'red',
      title: 'تم الرفض',
      message: 'تم رفض طلبك. يرجى مراجعة السبب وإعادة المحاولة',
    },
  };

  const currentStatus = statusConfig[status?.status || 'none'];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">حالة طلب الترقية</h1>
          <p className="text-gray-600 mt-1">تتبع حالة طلب الترقية الخاص بك</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <currentStatus.icon
                className={`h-20 w-20 text-${currentStatus.color}-600`}
              />
              <h2 className="text-2xl font-bold text-gray-900">{currentStatus.title}</h2>
              <p className="text-gray-600 max-w-md">{currentStatus.message}</p>
            </div>

            {status?.status !== 'none' && (
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">اسم الشركة</p>
                    <p className="font-medium">{status.company_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">تاريخ التقديم</p>
                    <p className="font-medium">
                      {new Date(status.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  {status.reviewed_at && (
                    <div>
                      <p className="text-sm text-gray-500">تاريخ المراجعة</p>
                      <p className="font-medium">
                        {new Date(status.reviewed_at).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  )}
                </div>

                {status.rejection_reason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-red-900 mb-2">سبب الرفض:</p>
                    <p className="text-red-700">{status.rejection_reason}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 justify-center">
              {status?.status === 'none' && (
                <Button onClick={() => router.push('/upgrade')} variant="default" size="lg">
                  تقديم طلب ترقية
                </Button>
              )}
              {status?.status === 'rejected' && (
                <Button onClick={() => router.push('/upgrade')} variant="default" size="lg">
                  إعادة المحاولة
                </Button>
              )}
              {status?.status === 'approved' && (
                <Button onClick={() => router.push('/')} variant="default" size="lg">
                  العودة إلى لوحة التحكم
                </Button>
              )}
              <Button onClick={() => router.back()} variant="outline" size="lg">
                رجوع
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
