import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button, Input } from '@mishwari/ui-web';
import { driversApi } from '@mishwari/api';

export default function InviteDriverPage() {
  const router = useRouter();
  const { canManageDrivers } = useSelector((state: AppState) => state.auth);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  if (!canManageDrivers) {
    router.push('/drivers');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await driversApi.invite(phone);
      alert('تم إرسال الدعوة بنجاح');
      router.push('/drivers');
    } catch (error: any) {
      alert(error?.response?.data?.error || 'فشل إرسال الدعوة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">دعوة سائق</h1>
          <p className="text-gray-600 mt-1">أدخل رقم هاتف السائق لإرسال دعوة</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الهاتف *
              </label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="966xxxxxxxxx"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                سيتم إرسال رسالة نصية للسائق تحتوي على رابط التسجيل
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                onClick={() => router.push('/drivers')}
                variant="outline"
                className="flex-1"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={loading}
                className="flex-1"
              >
                إرسال الدعوة
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
