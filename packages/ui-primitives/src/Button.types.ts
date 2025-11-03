export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}