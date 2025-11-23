import { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FileUpload from '@/components/kyc/FileUpload';
import { Button } from '@mishwari/ui-web';
import { driversApi } from '@mishwari/api';
import { createFormData } from '@mishwari/utils';

export default function VerifyDriverPage() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState({
    national_id_front: null as File | null,
    national_id_back: null as File | null,
    driver_license_front: null as File | null,
    driver_license_back: null as File | null,
    selfie: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = createFormData(documents);
      await driversApi.uploadDocuments(Number(id), formData);
      alert('تم رفع المستندات بنجاح');
      router.push(`/drivers/${id}`);
    } catch (error: any) {
      alert(error?.response?.data?.error || 'فشل رفع المستندات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">توثيق السائق</h1>
          <p className="text-gray-600 mt-1">ارفع مستندات السائق للمراجعة</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FileUpload
              label="الهوية الوطنية (الوجه الأمامي)"
              accept="image/*,.pdf"
              maxFiles={1}
              onChange={(file) => setDocuments({ ...documents, national_id_front: file as File | null })}
              required
            />

            <FileUpload
              label="الهوية الوطنية (الوجه الخلفي)"
              accept="image/*,.pdf"
              maxFiles={1}
              onChange={(file) => setDocuments({ ...documents, national_id_back: file as File | null })}
              required
            />

            <FileUpload
              label="رخصة القيادة (الوجه الأمامي)"
              accept="image/*,.pdf"
              maxFiles={1}
              onChange={(file) => setDocuments({ ...documents, driver_license_front: file as File | null })}
              required
            />

            <FileUpload
              label="رخصة القيادة (الوجه الخلفي)"
              accept="image/*,.pdf"
              maxFiles={1}
              onChange={(file) => setDocuments({ ...documents, driver_license_back: file as File | null })}
              required
            />

            <FileUpload
              label="صورة شخصية مع الهوية"
              accept="image/*"
              maxFiles={1}
              onChange={(file) => setDocuments({ ...documents, selfie: file as File | null })}
              required
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                onClick={() => router.push(`/drivers/${id}`)}
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
                رفع المستندات
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
