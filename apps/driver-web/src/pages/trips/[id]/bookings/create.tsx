import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PhysicalBookingForm from '@/components/bookings/PhysicalBookingForm';
import { Button } from '@mishwari/ui-web';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function CreateBookingPage() {
  const { isAuthenticated } = useSelector((state: AppState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.back()} variant="outline" size="sm">
            <ArrowRightIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">حجز يدوي جديد</h1>
            <p className="text-gray-600 mt-1">تسجيل حجز للركاب</p>
          </div>
        </div>

        <PhysicalBookingForm />
      </div>
    </DashboardLayout>
  );
}
