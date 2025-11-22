import StarIcon from '@mishwari/ui-web/public/icons/common/star.svg';

export interface RatingBadgeProps {
  rating: number | string | null | undefined;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RatingBadge({ rating, size = 'md', className = '' }: RatingBadgeProps) {
  const ratingValue = Number(rating || 0);
  const isNew = ratingValue === 0;

  const sizeClasses = {
    sm: 'px-1.5 py-0.5',
    md: 'px-2 py-0.5 ',
    lg: 'px-2 py-1 h-[30px]',
  };

  const iconSizes = {
    sm: { width: 16, height: 16 },
    md: { width: 20, height: 20 },
    lg: { width: 25, height: 25 },
  };

  const textClasses = {
    sm: 'text-white font-bold text-sm',
    md: 'text-white font-bold pr-1',
    lg: 'text-white font-bold pr-1',
  };

  if (isNew) {
    return (
      <div
        className={`flex justify-center items-center rounded-xl bg-blue-500 ${sizeClasses[size]} ${className}`}>
        <span className={textClasses[size]}>جديد</span>
      </div>
    );
  }

  return (
    <div
      className={`flex justify-center items-center rounded-xl ${
        ratingValue >= 3.5 ? 'bg-green-500' : 'bg-orange-400'
      } ${sizeClasses[size]} ${className}`}>
      <span className={textClasses[size]}>{ratingValue.toFixed(1)}</span>
      <StarIcon {...iconSizes[size]} />
    </div>
  );
}
