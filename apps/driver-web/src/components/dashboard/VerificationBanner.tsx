import { useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import { useRouter } from 'next/router';
import { CheckCircleIcon, ExclamationTriangleIcon, ClockIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@mishwari/ui-web';
import { useState, useEffect } from 'react';

export default function VerificationBanner() {
  const { profile, canPublish } = useSelector((state: AppState) => state.auth);
  const router = useRouter();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('kycBannerDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  if (!profile || isDismissed) return null;

  const getVerificationStatus = () => {
    if (profile.is_verified) return 'verified';
    return 'unverified';
  };

  const status = getVerificationStatus();

  const banners = {
    unverified: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />,
      message: 'أكمل التوثيق لنشر رحلاتك',
      action: { text: 'ابدأ التوثيق', href: '/kyc/operator' },
    },
    pending: {
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-800',
      icon: <ClockIcon className="h-6 w-6 text-yellow-600" />,
      message: 'مستنداتك قيد المراجعة',
      action: { text: 'تتبع الحالة', href: '/kyc/status' },
    },
    verified: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: <CheckCircleIcon className="h-6 w-6 text-green-600" />,
      message: 'حساب موثق ✓',
      action: null,
    },
    suspended: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: <XCircleIcon className="h-6 w-6 text-red-600" />,
      message: 'تم تعليق حسابك',
      action: { text: 'تواصل معنا', href: '/support' },
    },
  };

  const banner = banners[status];

  const handleDismiss = () => {
    sessionStorage.setItem('kycBannerDismissed', 'true');
    setIsDismissed(true);
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 border-b ${banner.bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {banner.icon}
            <span className={`font-semibold ${banner.text}`}>{banner.message}</span>
          </div>
          <div className="flex items-center gap-2">
            {banner.action && (
              <Button
                onClick={() => router.push(banner.action!.href)}
                variant="ghost"
                className={banner.text}
              >
                {banner.action.text}
              </Button>
            )}
            <button
              onClick={handleDismiss}
              className={`p-1 rounded-md hover:bg-black/5 ${banner.text}`}
              aria-label="إغلاق"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
