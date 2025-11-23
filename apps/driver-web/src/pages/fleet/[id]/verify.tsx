import { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FileUpload from '@/components/kyc/FileUpload';
import { Button } from '@mishwari/ui-web';
import { operatorApi } from '@mishwari/api';
import { createFormData } from '@mishwari/utils';
import { toast } from 'react-toastify';

export default function VerifyBusPage() {
  const router = useRouter();
  const { id } = router.query;
  const [documents, setDocuments] = useState<File[]>([]);

  const handleFileChange = (files: File | File[] | null) => {
    if (Array.isArray(files)) {
      setDocuments(files);
    } else if (files) {
      setDocuments([files]);
    } else {
      setDocuments([]);
    }
  };
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (documents.length === 0) {
      toast.error('يرجى رفع مستندات الحافلة');
      return;
    }

    setLoading(true);
    try {
      const formData = createFormData(documents, 'documents');
      await operatorApi.uploadBusDocuments(Number(id), formData);
      toast.success('تم رفع المستندات بنجاح. سيتم مراجعتها قريباً');
      router.push(`/fleet/${id}`);
    } catch (error) {
      toast.error('فشل رفع المستندات');
      console.error('Failed to upload documents:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">توثيق الحافلة</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <FileUpload
                label="مستندات الحافلة"
                onChange={handleFileChange}
              />
              <p className="text-sm text-gray-500 mt-2">
                يرجى رفع: رخصة السير، شهادة الفحص الفني، تأمين المركبة
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" variant="default" size="lg" className="flex-1" disabled={loading}>
                {loading ? 'جاري الإرسال...' : 'إرسال المستندات'}
              </Button>
              <Button
                type="button"
                onClick={() => router.push(`/fleet/${id}`)}
                variant="outline"
                size="lg"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
