// Brand colors - shared across both apps
export const brandColors = {
  primary: '#005687',
  'primary-dark': '#004a73',
  'primary-light': '#e6f2f7',
  'text-dark': '#042f40',
  secondary: '#F5F5F5',
};

// NextUI theme colors - derived from brandColors
export const nextuiTheme = {
  light: {
    colors: {
      background: '#FFFFFF',
      foreground: '#11181C',
      primary: {
        foreground: '#FFFFFF',
        DEFAULT: brandColors.primary,
      },
      secondary: {
        foreground: '#FFFFFF',
        DEFAULT: '#006FEE',
      },
    },
  },
  dark: {
    colors: {
      background: '#000000',
      foreground: '#ECEDEE',
      primary: {
        foreground: '#000',
        DEFAULT: '#FFF',
      },
    },
  },
};

// Gray scale - from passenger-web
export const grayScale = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  900: '#111827',
};

// Shadcn HSL variables - for UI components
export const shadcnColors = {
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
  },
  secondary: {
    DEFAULT: 'hsl(var(--secondary))',
    foreground: 'hsl(var(--secondary-foreground))',
  },
  destructive: {
    DEFAULT: 'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))',
  },
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))',
  },
  accent: {
    DEFAULT: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))',
  },
  popover: {
    DEFAULT: 'hsl(var(--popover))',
    foreground: 'hsl(var(--popover-foreground))',
  },
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))',
  },
};

// Typography
export const typography = {
  fontFamily: {
    sans: ['var(--font-cairo)', 'var(--font-noto-emoji)', 'sans-serif'],
  },
};

// Border radius
export const borderRadius = {
  lg: 'var(--radius)',
  md: 'calc(var(--radius) - 2px)',
  sm: 'calc(var(--radius) - 4px)',
};

// Background images
export const backgroundImage = {
  'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
};
