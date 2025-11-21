import { Driver } from '@mishwari/types';
import { useRouter } from 'next/router';
import { CheckCircleIcon, ClockIcon, StarIcon } from '@heroicons/react/24/solid';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface DriverCardProps {
  driver: Driver;
}

export default function DriverCard({ driver }: DriverCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/drivers/${driver.id}`)}
      className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {driver.driver_name}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <StarIcon className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-gray-700">{driver.driver_rating}</span>
            </div>
          </div>
          {driver.is_verified ? (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircleIcon className="h-4 w-4" />
              <span className="text-xs font-medium">موثق</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-amber-600">
              <ClockIcon className="h-4 w-4" />
              <span className="text-xs font-medium">قيد المراجعة</span>
            </div>
          )}
        </div>
      </div>

      {driver.operator && (
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BuildingOfficeIcon className="h-4 w-4" />
            <span>{driver.operator.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}
