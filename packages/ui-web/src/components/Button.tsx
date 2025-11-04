import { ButtonProps } from '@mishwari/ui-primitives';
import { cn } from '../lib/utils';

export const Button = ({ 
  variant = 'primary', 
  size = 'md',
  disabled, 
  loading, 
  onPress, 
  children,
  className 
}: ButtonProps) => {
  const baseStyles = 'rounded-lg font-medium transition-colors';
  
  const variants = {
    primary: 'bg-mishwari-primary text-white hover:opacity-90',
    secondary: 'bg-mishwari-gray-200 text-mishwari-text-dark hover:bg-mishwari-gray-300',
    ghost: 'bg-transparent text-mishwari-primary hover:bg-mishwari-gray-100'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      onClick={onPress}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {loading ? 'جاري التحميل...' : children}
    </button>
  );
};