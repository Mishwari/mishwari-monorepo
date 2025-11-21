import { useRouter } from 'next/router';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface TripLimitBannerProps {
  currentTrips: number;
  limit: number;
}

export default function TripLimitBanner({ currentTrips, limit }: TripLimitBannerProps) {
  const router = useRouter();
  const isAtLimit = currentTrips >= limit;
  const isNearLimit = currentTrips >= limit - 1 && !isAtLimit;

  if (!isNearLimit && !isAtLimit) return null;

  return (
    <div className={`border rounded-lg p-4 flex items-start gap-3 ${
      isAtLimit 
        ? 'bg-red-50 border-red-200' 
        : 'bg-yellow-50 border-yellow-200'
    }`}>
      <ExclamationTriangleIcon className={`h-6 w-6 flex-shrink-0 mt-0.5 ${
        isAtLimit ? 'text-red-600' : 'text-yellow-600'
      }`} />
      <div>
        <h3 className={`font-semibold ${
          isAtLimit ? 'text-red-900' : 'text-yellow-900'
        }`}>
          {isAtLimit ? 'وصلت للحد الأقصى من الرحلات' : 'اقتربت من الحد الأقصى للرحلات'}
        </h3>
        <p className={`text-sm mt-1 ${
          isAtLimit ? 'text-red-800' : 'text-yellow-800'
        }`}>
          {isAtLimit ? (
            <>
              لديك {currentTrips} رحلات نشطة من أصل {limit}. أكمل أو ألغِ رحلة موجودة لإنشاء رحلة جديدة، أو{' '}
              <button 
                onClick={() => router.push('/upgrade')} 
                className="underline font-semibold hover:opacity-80"
              >
                قم بترقية حسابك
              </button>
              {' '}لزيادة الحد.
            </>
          ) : (
            <>
              لديك {currentTrips} رحلات نشطة من أصل {limit}. 
              <button 
                onClick={() => router.push('/upgrade')} 
                className="underline font-semibold hover:opacity-80"
              >
                {' '}قم بترقية حسابك
              </button>
              {' '}لإدارة المزيد من الرحلات.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
