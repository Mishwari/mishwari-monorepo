import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TripCreationWizard from '@/components/trips/TripCreationWizard';

export default function CreateTripPage() {
  const router = useRouter();

  const handleSuccess = (tripId: number) => {
    router.push(`/trips/${tripId}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">إنشاء رحلة جديدة</h1>
          <p className="text-gray-600 mt-1">اتبع الخطوات لإنشاء رحلة مع نقاط التوقف</p>
        </div>

        <TripCreationWizard onSuccess={handleSuccess} />
      </div>
    </DashboardLayout>
  );
}
