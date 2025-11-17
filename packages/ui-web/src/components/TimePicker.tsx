import React, { useState, useEffect } from 'react';

interface TimePickerProps {
  selectedTime: string; // Format: "HH:MM"
  onTimeSelect: (time: string) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({ selectedTime, onTimeSelect }) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [isPM, setIsPM] = useState(false);
  const [mode, setMode] = useState<'hours' | 'minutes'>('hours');

  useEffect(() => {
    if (selectedTime) {
      const [h, m] = selectedTime.split(':').map(Number);
      setHours(h);
      setMinutes(Math.round(m / 5) * 5);
      setIsPM(h >= 12);
    }
  }, [selectedTime]);

  const handleHourClick = (displayHour: number) => {
    const hour24 = isPM ? (displayHour === 12 ? 12 : displayHour + 12) : (displayHour === 12 ? 0 : displayHour);
    setHours(hour24);
    const timeStr = `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    onTimeSelect(timeStr);
    setMode('minutes');
  };

  const handleMinuteClick = (minute: number) => {
    setMinutes(minute);
    const timeStr = `${hours.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    onTimeSelect(timeStr);
  };

  const hourNumbers = Array.from({ length: 12 }, (_, i) => i + 1);
  const minuteNumbers = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  return (
    <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 w-[calc(100vw-2rem)] sm:w-full max-w-md border border-gray-200" dir="ltr">
      <div className="flex justify-center items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode('hours')}
          className={`text-4xl font-bold px-4 py-2 rounded-lg transition-colors ${
            mode === 'hours' ? 'bg-brand-primary text-white' : 'text-brand-text-dark hover:bg-gray-100'
          }`}
        >
          {displayHour.toString().padStart(2, '0')}
        </button>
        <span className="text-4xl font-bold text-brand-text-dark">:</span>
        <button
          type="button"
          onClick={() => setMode('minutes')}
          className={`text-4xl font-bold px-4 py-2 rounded-lg transition-colors ${
            mode === 'minutes' ? 'bg-brand-primary text-white' : 'text-brand-text-dark hover:bg-gray-100'
          }`}
        >
          {minutes.toString().padStart(2, '0')}
        </button>
      </div>
      <div className="flex justify-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => {
            setIsPM(false);
            const hour24 = displayHour === 12 ? 0 : displayHour;
            setHours(hour24);
            onTimeSelect(`${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
          }}
          className={`px-4 py-1 rounded-lg text-sm font-medium transition-colors ${
            !isPM ? 'bg-brand-primary text-white' : 'bg-gray-100 text-brand-text-dark hover:bg-gray-200'
          }`}
        >
          AM
        </button>
        <button
          type="button"
          onClick={() => {
            setIsPM(true);
            const hour24 = displayHour === 12 ? 12 : displayHour + 12;
            setHours(hour24);
            onTimeSelect(`${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
          }}
          className={`px-4 py-1 rounded-lg text-sm font-medium transition-colors ${
            isPM ? 'bg-brand-primary text-white' : 'bg-gray-100 text-brand-text-dark hover:bg-gray-200'
          }`}
        >
          PM
        </button>
      </div>

      {mode === 'hours' ? (
        <div className="relative w-64 h-64 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
          {hourNumbers.map((hour) => {
            const angle = ((hour % 12) * 30 - 90) * (Math.PI / 180);
            const radius = 90;
            const x = 128 + radius * Math.cos(angle);
            const y = 128 + radius * Math.sin(angle);
            
            return (
              <button
                key={hour}
                type="button"
                onClick={() => handleHourClick(hour)}
                className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all transform -translate-x-1/2 -translate-y-1/2 ${
                  displayHour === hour
                    ? 'bg-brand-primary text-white scale-110 shadow-md'
                    : 'hover:bg-gray-100 text-brand-text-dark'
                }`}
                style={{ left: `${x}px`, top: `${y}px` }}
              >
                {hour}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="relative w-64 h-64 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
          {minuteNumbers.map((minute) => {
            const angle = ((minute / 5) * 30 - 90) * (Math.PI / 180);
            const radius = 90;
            const x = 128 + radius * Math.cos(angle);
            const y = 128 + radius * Math.sin(angle);
            
            return (
              <button
                key={minute}
                type="button"
                onClick={() => handleMinuteClick(minute)}
                className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all transform -translate-x-1/2 -translate-y-1/2 ${
                  minutes === minute
                    ? 'bg-brand-primary text-white scale-110 shadow-md'
                    : 'hover:bg-gray-100 text-brand-text-dark'
                }`}
                style={{ left: `${x}px`, top: `${y}px` }}
              >
                {minute.toString().padStart(2, '0')}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
