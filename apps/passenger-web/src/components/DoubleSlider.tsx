import React, { useRef, useState, useEffect } from 'react';

interface DoubleSliderProps {
  min: number;
  max: number;
  value: { min: number; max: number };
  onChange: (value: { min: number; max: number }) => void;
  step?: number;
}

export default function DoubleSlider({ min, max, value, onChange, step = 100 }: DoubleSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const calculateValue = (clientX: number): number => {
    if (!trackRef.current) return min;
    
    const rect = trackRef.current.getBoundingClientRect();
    // Invert: left = max, right = min
    const percentage = Math.max(0, Math.min(1, 1 - (clientX - rect.left) / rect.width));
    const rawValue = min + percentage * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.max(min, Math.min(max, steppedValue));
  };

  const handleMouseDown = (thumb: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(thumb);
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newValue = calculateValue(e.clientX);
      
      if (isDragging === 'min') {
        const constrainedMin = Math.min(newValue, tempValue.max - step);
        setTempValue({ min: constrainedMin, max: tempValue.max });
      } else {
        const constrainedMax = Math.max(newValue, tempValue.min + step);
        setTempValue({ min: tempValue.min, max: constrainedMax });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
      document.body.style.userSelect = '';
      onChange(tempValue);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, tempValue, min, max, step, onChange]);

  const getPosition = (val: number) => {
    // Invert: higher values on left
    return 100 - ((val - min) / (max - min)) * 100;
  };
  const minPosition = getPosition(tempValue.min);
  const maxPosition = getPosition(tempValue.max);

  return (
    <div className="px-2 select-none" dir="ltr">
      <div ref={trackRef} className="relative h-8" style={{ touchAction: 'none' }}>
        <div className="absolute w-full h-1 bg-slate-200 rounded-full top-1/2 -translate-y-1/2" />
        <div
          className="absolute h-1 bg-brand-primary rounded-full top-1/2 -translate-y-1/2"
          style={{ left: `${maxPosition}%`, width: `${minPosition - maxPosition}%` }}
        />
        <div
          className={`absolute w-4 h-4 bg-brand-primary rounded-full top-1/2 shadow-md z-10 ${isDragging === 'min' ? 'scale-125 cursor-grabbing' : 'cursor-grab hover:scale-110'} transition-transform`}
          style={{ left: `${minPosition}%`, transform: 'translate(-50%, -50%)' }}
          onMouseDown={handleMouseDown('min')}
        />
        <div
          className={`absolute w-4 h-4 bg-brand-primary rounded-full top-1/2 shadow-md z-10 ${isDragging === 'max' ? 'scale-125 cursor-grabbing' : 'cursor-grab hover:scale-110'} transition-transform`}
          style={{ left: `${maxPosition}%`, transform: 'translate(-50%, -50%)' }}
          onMouseDown={handleMouseDown('max')}
        />
      </div>
      <div className="flex justify-between text-xs font-medium text-slate-500 mt-2">
        <span>{tempValue.max.toLocaleString()} ر.ي</span>
        <span>{tempValue.min.toLocaleString()} ر.ي</span>
      </div>
    </div>
  );
}
