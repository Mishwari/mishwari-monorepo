import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { AppState } from '@/store/store';
import { ArrowUpCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@mishwari/ui-web';

export default function UpgradeBanner() {
  const router = useRouter();
  const { profile } = useSelector((state: AppState) => state.auth);

  if (profile?.role !== 'driver') return null;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ArrowUpCircleIcon className="h-12 w-12" />
          <div>
            <h3 className="text-xl font-bold">ارتقِ إلى حساب شركة</h3>
            <p className="text-blue-100 mt-1">أضف سائقين متعددين وأدر أسطولك بسهولة</p>
          </div>
        </div>
        <Button onClick={() => router.push('/upgrade')} variant="secondary" size="lg">
          ترقية الحساب
        </Button>
      </div>
    </div>
  );
}
