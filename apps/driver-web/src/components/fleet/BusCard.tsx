import { Bus } from '@mishwari/types';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

interface BusCardProps {
  bus: Bus;
}

export default function BusCard({ bus }: BusCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/fleet/${bus.id}`)}
      className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900">{bus.bus_number}</h3>
            {bus.is_verified ? (
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
            ) : (
              <XCircleIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{bus.bus_type}</p>
          <p className="text-sm text-gray-500 mt-1">السعة: {bus.capacity} مقعد</p>
        </div>
        <div className="text-left">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              bus.is_verified
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {bus.is_verified ? 'موثق' : 'غير موثق'}
          </span>
        </div>
      </div>
    </div>
  );
}
