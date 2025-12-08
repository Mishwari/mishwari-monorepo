import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button, Input } from '@mishwari/ui-web';
import { operatorApi } from '@mishwari/api';
import FileUpload from '@/components/kyc/FileUpload';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function UpgradePage() {
  const { isAuthenticated, profile, canUpgrade } = useSelector((state: AppState) => state.auth);
  const router = useRouter();
  const [formData, setFormData] = useState({
    company_name: '',
    commercial_registration: '',
    tax_number: '',
  });
  const [documents, setDocuments] = useState<Record<string, string>>({});

  const handleFileChange = (key: string) => (files: File | File[] | null) => {
    // In a real implementation, you would upload the file and get a URL
    // For now, we'll just store a placeholder
    if (files) {
      const file = Array.isArray(files) ? files[0] : files;
      if (file) {
        setDocuments({ ...documents, [key]: file.name });
      }
    }
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!canUpgrade) {
      router.push('/');
    }
  }, [isAuthenticated, canUpgrade, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.company_name || !formData.commercial_registration) {
      setError('يرجى إكمال جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);

    try {
      await operatorApi.submitUpgradeRequest({
        ...formData,
        documents,
      });
      router.push('/upgrade/status');
    } catch (error: any) {
      setError(error?.response?.data?.error || 'فشل إرسال الطلب');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !canUpgrade) return null;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الترقية إلى حساب شركة</h1>
          <p className="text-gray-600 mt-1">قم بترقية حسابك لإدارة عدة سائقين</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold text-blue-900">مميزات حساب الشركة</h2>
          <ul className="space-y-2">
            {[
              'إضافة وإدارة عدة سائقين',
              'إدارة أسطول من الحافلات',
              'جدولة رحلات متعددة في نفس الوقت',
              'تقارير وإحصائيات متقدمة',
              'إدارة الحجوزات اليدوية',
            ].map((benefit, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                <span className="text-blue-900">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">اسم الشركة *</label>
            <Input
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              placeholder="شركة النقل السريع"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">رقم السجل التجاري *</label>
            <Input
              type="text"
              value={formData.commercial_registration}
              onChange={(e) => setFormData({ ...formData, commercial_registration: e.target.value })}
              placeholder="1234567890"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الرقم الضريبي</label>
            <Input
              type="text"
              value={formData.tax_number}
              onChange={(e) => setFormData({ ...formData, tax_number: e.target.value })}
              placeholder="300000000000003"
            />
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">المستندات المطلوبة</h3>
            <div className="space-y-4">
              <FileUpload
                label="السجل التجاري"
                maxFiles={1}
                onChange={handleFileChange('commercial_registration')}
              />
              <FileUpload
                label="الشهادة الضريبية"
                maxFiles={1}
                onChange={handleFileChange('tax_certificate')}
              />
              <FileUpload
                label="رخصة النقل"
                maxFiles={1}
                onChange={handleFileChange('transport_license')}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" variant="default" size="lg" disabled={loading} className="flex-1">
              {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </Button>
            <Button type="button" onClick={() => router.back()} variant="outline" size="lg">
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
