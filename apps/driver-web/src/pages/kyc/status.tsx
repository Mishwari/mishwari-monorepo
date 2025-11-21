import { useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@mishwari/ui-web';
import { useRouter } from 'next/router';

export default function KYCStatus() {
  const { profile } = useSelector((state: AppState) => state.auth);
  const router = useRouter();

  const steps = [
    {
      id: 1,
      title: 'التوثيق الشخصي',
      status: profile?.is_verified ? 'completed' : 'pending',
      description: 'التحقق من الهوية الشخصية',
    },
    {
      id: 2,
      title: 'توثيق الحافلة',
      status: 'pending',
      description: 'التحقق من مستندات الحافلة',
    },
    {
      id: 3,
      title: 'توثيق السائق',
      status: 'pending',
      description: 'التحقق من رخصة القيادة',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-8 w-8 text-green-600" />;
      case 'pending':
        return <ClockIcon className="h-8 w-8 text-yellow-600" />;
      case 'rejected':
        return <XCircleIcon className="h-8 w-8 text-red-600" />;
      default:
        return <ClockIcon className="h-8 w-8 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'pending':
        return 'قيد المراجعة';
      case 'rejected':
        return 'مرفوض';
      default:
        return 'لم يبدأ';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">حالة التوثيق</h1>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getStatusIcon(step.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                    <span className={`text-sm font-medium ${
                      step.status === 'completed' ? 'text-green-600' :
                      step.status === 'pending' ? 'text-yellow-600' :
                      'text-gray-500'
                    }`}>
                      {getStatusText(step.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              سيتم مراجعة مستنداتك خلال 24-48 ساعة. سنرسل لك إشعاراً عند اكتمال المراجعة.
            </p>
          </div>

          <div className="mt-6 flex gap-4">
            <Button
              onClick={() => router.push('/')}
              variant="default"
              size="lg"
              className="flex-1"
            >
              العودة للوحة التحكم
            </Button>
            <Button
              onClick={() => router.push('/kyc/operator')}
              variant="outline"
              size="lg"
            >
              تحديث المستندات
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
