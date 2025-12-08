interface LogoProps {
  variant?: 'default' | 'demo';
}

export const Logo = ({ variant = 'default' }: LogoProps) => (
  <div className="flex gap-1 items-center">
    <h1 className="text-xl font-bold text-blue-600">يلا باص</h1>
    {variant === 'demo' && <span className="text-[10px] text-gray-500">(Demo)</span>}
  </div>
);
