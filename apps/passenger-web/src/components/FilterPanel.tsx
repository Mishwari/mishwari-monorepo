import React from 'react';
import DoubleSlider from './DoubleSlider';

const DEPARTURE_TIMES = [
  { id: 'morning', label: 'صباحاً', range: [6, 12] },
  { id: 'afternoon', label: 'ظهراً', range: [12, 18] },
  { id: 'evening', label: 'مساءً', range: [18, 24] },
  { id: 'night', label: 'ليلاً', range: [0, 6] },
];

interface FilterPanelProps {
  filterBuses: any;
  setFilterBuses: (filters: any) => void;
  trips?: any[];
  isMobile?: boolean;
}

export default function FilterPanel({ filterBuses, setFilterBuses, trips = [], isMobile = false }: FilterPanelProps) {
  const rawMinPrice = trips.length > 0 ? Math.min(...trips.map(t => t.price)) : 0;
  const rawMaxPrice = trips.length > 0 ? Math.max(...trips.map(t => t.price)) : 6000;
  
  // Dynamic step based on price range magnitude using Math
  const priceRange_raw = rawMaxPrice - rawMinPrice;
  const step = priceRange_raw > 0 ? Math.pow(10, Math.floor(Math.log10(priceRange_raw)) - 1) : 1;
  
  const actualMinPrice = Math.floor(rawMinPrice / step) * step;
  const actualMaxPrice = Math.ceil(rawMaxPrice / step) * step;
  const priceRange = { 
    min: (filterBuses.Min === 0 || !filterBuses.Min) ? actualMinPrice : filterBuses.Min, 
    max: (filterBuses.Max === Infinity || filterBuses.Max === 0) ? actualMaxPrice : filterBuses.Max 
  };

  const toggleBusType = (type: string) => {
    setFilterBuses({
      ...filterBuses,
      BusType: filterBuses.BusType.includes(type)
        ? filterBuses.BusType.filter((t: string) => t !== type)
        : [...filterBuses.BusType, type],
    });
  };

  const toggleDeparture = (timeId: string) => {
    setFilterBuses({
      ...filterBuses,
      Departure: filterBuses.Departure.includes(timeId)
        ? filterBuses.Departure.filter((t: string) => t !== timeId)
        : [...filterBuses.Departure, timeId],
    });
  };

  const handlePriceChange = (value: { min: number; max: number }) => {
    setFilterBuses({
      ...filterBuses,
      Min: value.min,
      Max: value.max,
    });
  };

  return (
    <div className={`space-y-8 ${isMobile ? 'pb-24' : ''}`}>
      <div>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='font-bold text-sm uppercase tracking-wide'>
            نطاق السعر
          </h3>
          <span className='text-xs font-bold text-primary'>
            {priceRange.min} - {priceRange.max} ر.ي
          </span>
        </div>
        <div className='px-1'>
          <DoubleSlider
            min={actualMinPrice}
            max={actualMaxPrice}
            value={priceRange}
            onChange={handlePriceChange}
            step={step}
          />
        </div>
      </div>

      <div>
        <h3 className='font-bold mb-3 text-sm uppercase tracking-wide'>
          نوع الحافلة
        </h3>
        <div className='grid grid-cols-2 gap-2'>
          {['VIP Plus', 'VIP', 'عادي'].map((type) => (
            <label
              key={type}
              className='flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-blue-200 cursor-pointer bg-slate-50 hover:bg-white transition-all'>
              <div className='w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center'>
                {filterBuses.BusType.includes(type) && (
                  <div className='w-2.5 h-2.5 bg-brand-primary rounded-full' />
                )}
              </div>
              <span className='text-xs font-bold text-slate-600'>{type}</span>
              <input
                type='checkbox'
                checked={filterBuses.BusType.includes(type)}
                onChange={() => toggleBusType(type)}
                className='hidden'
              />
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className='font-bold mb-3 text-sm uppercase tracking-wide'>
          وقت المغادرة
        </h3>
        <div className='space-y-2'>
          {DEPARTURE_TIMES.map((time) => (
            <button
              key={time.id}
              onClick={() => toggleDeparture(time.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                filterBuses.Departure.includes(time.id)
                  ? 'border-brand-primary bg-brand-primary-light text-brand-primary'
                  : 'border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-blue-50'
              }`}>
              <span className='font-bold'>{time.label}</span>
              <span className='text-slate-400 text-[10px]'>
                {time.range[0]}:00 - {time.range[1]}:00
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
