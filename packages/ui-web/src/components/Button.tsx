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
    primary: 'bg-[#005687] text-white hover:bg-[#004570]',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    ghost: 'bg-transparent text-[#005687] hover:bg-gray-100'
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