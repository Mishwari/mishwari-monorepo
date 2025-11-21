import { useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FileUpload from '@/components/kyc/FileUpload';
import { operatorApi } from '@mishwari/api';
import { createFormData } from '@mishwari/utils';
import { Button } from '@mishwari/ui-web';
import { toast } from 'react-toastify';

export default function OperatorKYC() {
  const { profile } = useSelector((state: AppState) => state.auth);
  const router = useRouter();
  const [personalDocs, setPersonalDocs] = useState<File[]>([]);
  const [companyDocs, setCompanyDocs] = useState<File[]>([]);
  const [businessInfo, setBusinessInfo] = useState({
    companyName: '',
    taxId: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (personalDocs.length === 0) {
      toast.error('يرجى رفع المستندات الشخصية');
      return;
    }

    if (profile?.role === 'operator_admin' && companyDocs.length === 0) {
      toast.error('يرجى رفع مستندات الشركة');
      return;
    }

    setLoading(true);
    try {
      const formData = createFormData([...personalDocs, ...companyDocs], 'documents');
      
      Object.entries(businessInfo).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      toast.success('تم إرسال المستندات بنجاح. سيتم مراجعتها قريباً');
      router.push('/kyc/status');
    } catch (error) {
      toast.error('فشل رفع المستندات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">توثيق الحساب</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">المستندات الشخصية</h2>
              <FileUpload
                label="الهوية الوطنية / جواز السفر"
                onChange={setPersonalDocs}
              />
              <p className="text-sm text-gray-500 mt-2">
                يرجى رفع صورة واضحة من الهوية الوطنية أو جواز السفر
              </p>
            </div>

            {profile?.role === 'operator_admin' && (
              <>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">مستندات الشركة</h2>
                  <FileUpload
                    label="السجل التجاري / الترخيص"
                    onChange={setCompanyDocs}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    يرجى رفع السجل التجاري أو ترخيص النقل
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">معلومات الشركة</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        اسم الشركة
                      </label>
                      <input
                        type="text"
                        value={businessInfo.companyName}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, companyName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required={profile?.role === 'operator_admin'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الرقم الضريبي
                      </label>
                      <input
                        type="text"
                        value={businessInfo.taxId}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, taxId: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        عنوان الشركة
                      </label>
                      <textarea
                        value={businessInfo.address}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                variant="default"
                size="lg"
                className="flex-1"
              >
                {loading ? 'جاري الإرسال...' : 'إرسال المستندات'}
              </Button>
              <Button
                type="button"
                onClick={() => router.push('/')}
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
