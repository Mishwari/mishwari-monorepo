import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { reviewsApi } from '@mishwari/api';
import type { Booking } from '@mishwari/types';

interface ReviewModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({ booking, isOpen, onClose, onSuccess }: ReviewModalProps) {
  const [ratings, setRatings] = useState({
    overall: 0,
    bus: 0,
    driver: 0,
  });
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const RatingStars = ({ value, onChange, label }: any) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none"
          >
            {star <= value ? (
              <StarIcon className="w-8 h-8 text-yellow-400" />
            ) : (
              <StarOutline className="w-8 h-8 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const handleSubmit = async () => {
    if (ratings.overall === 0 || ratings.bus === 0 || ratings.driver === 0) {
      alert('يرجى تقييم جميع الجوانب');
      return;
    }

    setLoading(true);
    try {
      await reviewsApi.create({
        booking: booking.id,
        overall_rating: ratings.overall,
        bus_condition_rating: ratings.bus,
        driver_rating: ratings.driver,
        comment,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('فشل إرسال التقييم');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6">
        <h2 className="text-xl font-bold text-center">تقييم الرحلة</h2>
        
        <div className="space-y-4">
          <RatingStars
            value={ratings.overall}
            onChange={(v: number) => setRatings({ ...ratings, overall: v })}
            label="التقييم العام"
          />
          
          <RatingStars
            value={ratings.bus}
            onChange={(v: number) => setRatings({ ...ratings, bus: v })}
            label="حالة الحافلة"
          />
          
          <RatingStars
            value={ratings.driver}
            onChange={(v: number) => setRatings({ ...ratings, driver: v })}
            label="السائق"
          />

          <div>
            <label className="text-sm font-medium">تعليق (اختياري)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full mt-2 p-3 border rounded-lg"
              rows={3}
              placeholder="شارك تجربتك..."
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border rounded-lg"
            disabled={loading}
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'جاري الإرسال...' : 'إرسال التقييم'}
          </button>
        </div>
      </div>
    </div>
  );
}
