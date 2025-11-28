import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { Button, DatePicker, TimePicker, CityDropdown } from '@mishwari/ui-web';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@mishwari/ui-web';
import type { CityOption } from '@mishwari/ui-web';
import { tripsApi, fleetApi } from '@mishwari/api';
import type { Bus, City } from '@mishwari/types';
import {
  CalendarDaysIcon,
  ClockIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { AppState } from '@/store/store';

interface Step1Props {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
}

export default function Step1BasicInfo({ data, onChange, onNext }: Step1Props) {
  const router = useRouter();
  const { profile, canManageDrivers } = useSelector(
    (state: AppState) => state.auth
  );
  const isDriver = !canManageDrivers;
  const [buses, setBuses] = useState<Bus[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    data.journey_date ? new Date(data.journey_date) : new Date()
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    data.planned_departure
      ? data.planned_departure.split(' ')[1]?.substring(0, 5) || '00:00'
      : '00:00'
  );
  const [windowStartTime, setWindowStartTime] = useState<string>(
    data.departure_window_start
      ? data.departure_window_start.split(' ')[1]?.substring(0, 5) || '00:00'
      : '00:00'
  );
  const [windowEndTime, setWindowEndTime] = useState<string>(
    data.departure_window_end
      ? data.departure_window_end.split(' ')[1]?.substring(0, 5) || '00:00'
      : '00:00'
  );
  const [showWindowStartPicker, setShowWindowStartPicker] = useState(false);
  const [showWindowEndPicker, setShowWindowEndPicker] = useState(false);

  useEffect(() => {
    Promise.all([
      fleetApi.list().catch(() => []),
      tripsApi.getCities().catch(() => []),
      fleetApi.getDrivers().catch(() => []),
    ]).then(([b, c, d]) => {
      setBuses(b);
      setCities(c.map((city: City) => ({ id: city.id, city: city.city })));
      setDrivers(d);

      // Auto-select for individual drivers
      if (
        isDriver &&
        b.length > 0 &&
        d.length > 0 &&
        !data.bus &&
        !data.driver
      ) {
        onChange({
          ...data,
          bus: b[0].id,
          driver: d[0].id,
        });
      }
    });
  }, []);

  const busOptions = buses.map((bus) => ({
    value: bus.id.toString(),
    label: `${bus.bus_number} - ${bus.bus_type}`,
  }));
  const cityOptions = cities.map((city) => ({
    value: city.id.toString(),
    label: city.city,
  }));

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const dateStr = format(date, 'yyyy-MM-dd');
    const updates: any = { journey_date: dateStr };

    if (data.trip_type === 'scheduled' && selectedTime) {
      updates.planned_departure = `${dateStr} ${selectedTime}:00`;
    } else if (data.trip_type === 'flexible') {
      if (windowStartTime)
        updates.departure_window_start = `${dateStr} ${windowStartTime}:00`;
      if (windowEndTime)
        updates.departure_window_end = `${dateStr} ${windowEndTime}:00`;
    }

    onChange({ ...data, ...updates });
    setShowDatePicker(false);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    const datetime = data.journey_date ? `${data.journey_date} ${time}:00` : '';
    onChange({ ...data, planned_departure: datetime });
  };

  const handleWindowStartSelect = (time: string) => {
    setWindowStartTime(time);
    const datetime = data.journey_date ? `${data.journey_date} ${time}:00` : '';
    onChange({ ...data, departure_window_start: datetime });
  };

  const handleWindowEndSelect = (time: string) => {
    setWindowEndTime(time);
    const datetime = data.journey_date ? `${data.journey_date} ${time}:00` : '';
    onChange({ ...data, departure_window_end: datetime });
  };

  const canProceed =
    data.bus > 0 &&
    (isDriver || data.driver > 0) &&
    data.from_city_id > 0 &&
    data.to_city_id > 0 &&
    data.journey_date &&
    data.total_price > 0 &&
    data.from_city_id !== data.to_city_id &&
    (data.trip_type === 'scheduled'
      ? data.planned_departure
      : data.departure_window_start && data.departure_window_end);

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold'>معلومات الرحلة الأساسية</h2>

      {isDriver ? (
        <div>
          <label className='block text-sm font-medium mb-2'>الحافلة *</label>
          {buses.length > 0 ? (
            <div className='px-4 py-2 border rounded-lg bg-gray-50'>
              <p className='text-gray-900'>
                {buses[0].bus_number} - {buses[0].bus_type}
              </p>
            </div>
          ) : (
            <Button
              onClick={() => router.push('/fleet/add')}
              variant='outline'
              className='w-full'>
              <PlusIcon className='h-5 w-5 ml-2' />
              إضافة حافلة
            </Button>
          )}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>الحافلة *</label>
            <div className='space-y-2'>
              <Select
                value={data.bus > 0 ? data.bus.toString() : ''}
                onValueChange={(value) =>
                  onChange({ ...data, bus: Number(value) })
                }>
                <SelectTrigger>
                  <SelectValue placeholder='اختر حافلة' />
                </SelectTrigger>
                <SelectContent>
                  {buses.map((bus) => (
                    <SelectItem
                      key={bus.id}
                      value={bus.id.toString()}>
                      {bus.bus_number} - {bus.bus_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {buses.length === 0 && (
                <Button
                  onClick={() => router.push('/fleet/add')}
                  variant='outline'
                  size='sm'
                  className='w-full'>
                  <PlusIcon className='h-4 w-4 ml-2' />
                  إضافة حافلة
                </Button>
              )}
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium mb-2'>السائق *</label>
            {drivers.length === 0 ? (
              <Button
                onClick={() => router.push('/drivers/add')}
                variant='outline'
                className='w-full'>
                <PlusIcon className='h-5 w-5 ml-2' />
                إضافة سائق
              </Button>
            ) : (
              <Select
                value={data.driver?.toString() || ''}
                onValueChange={(value) =>
                  onChange({ ...data, driver: Number(value) })
                }>
                <SelectTrigger>
                  <SelectValue placeholder='اختر سائق' />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem
                      key={driver.id}
                      value={driver.id.toString()}>
                      {driver.driver_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium mb-2'>من *</label>
          <div className='relative px-4 py-2 border rounded-lg'>
            <CityDropdown
              options={cities}
              value={cities.find((c) => c.id === data.from_city_id)?.city || ''}
              onChange={(cityName) => {
                const city = cities.find((c) => c.city === cityName);
                if (city) onChange({ ...data, from_city_id: city.id });
              }}
              emptyMessage='لا توجد مدن متاحة'
            />
          </div>
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>إلى *</label>
          <div className='relative px-4 py-2 border rounded-lg'>
            <CityDropdown
              options={cities}
              value={cities.find((c) => c.id === data.to_city_id)?.city || ''}
              onChange={(cityName) => {
                const city = cities.find((c) => c.city === cityName);
                if (city) onChange({ ...data, to_city_id: city.id });
              }}
              emptyMessage='لا توجد مدن متاحة'
            />
          </div>
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>نوع الرحلة *</label>
        <Select
          value={data.trip_type || 'scheduled'}
          onValueChange={(value) => onChange({ ...data, trip_type: value })}>
          <SelectTrigger>
            <SelectValue placeholder='اختر نوع الرحلة' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='scheduled'>رحلة محددة الوقت</SelectItem>
            <SelectItem value='flexible'>رحلة مرنة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium mb-2'>
            تاريخ الرحلة *
          </label>
          <div className='relative'>
            <button
              type='button'
              onClick={() => setShowDatePicker(!showDatePicker)}
              className='w-full px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50'>
              <CalendarDaysIcon className='w-5 h-5 text-brand-primary' />
              <span>
                {data.journey_date
                  ? format(new Date(data.journey_date), 'd MMMM yyyy', {
                      locale: require('date-fns/locale/ar').ar,
                    })
                  : 'اختر التاريخ'}
              </span>
            </button>
            {showDatePicker && (
              <>
                <div
                  className='fixed inset-0 z-40'
                  onClick={() => setShowDatePicker(false)}
                />
                <div className='absolute top-full mt-2 left-0 z-50'>
                  <DatePicker
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {data.trip_type === 'scheduled' ? (
          <div>
            <label className='block text-sm font-medium mb-2'>
              وقت المغادرة *
            </label>
            <div className='relative'>
              <button
                type='button'
                onClick={() => setShowTimePicker(!showTimePicker)}
                className='w-full px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50'>
                <ClockIcon className='w-5 h-5 text-brand-primary' />
                <span>{selectedTime || 'اختر الوقت'}</span>
              </button>
              {showTimePicker && (
                <>
                  <div
                    className='fixed inset-0 z-40'
                    onClick={() => setShowTimePicker(false)}
                  />
                  <div className='absolute top-full mt-2 left-0 z-50'>
                    <TimePicker
                      selectedTime={selectedTime}
                      onTimeSelect={handleTimeSelect}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className='col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>
                بداية فترة المغادرة *
              </label>
              <div className='relative'>
                <button
                  type='button'
                  onClick={() =>
                    setShowWindowStartPicker(!showWindowStartPicker)
                  }
                  className='w-full px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50'>
                  <ClockIcon className='w-5 h-5 text-brand-primary' />
                  <span>{windowStartTime || 'اختر الوقت'}</span>
                </button>
                {showWindowStartPicker && (
                  <>
                    <div
                      className='fixed inset-0 z-40'
                      onClick={() => setShowWindowStartPicker(false)}
                    />
                    <div className='absolute top-full mt-2 left-0 z-50'>
                      <TimePicker
                        selectedTime={windowStartTime}
                        onTimeSelect={handleWindowStartSelect}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                نهاية فترة المغادرة *
              </label>
              <div className='relative'>
                <button
                  type='button'
                  onClick={() => setShowWindowEndPicker(!showWindowEndPicker)}
                  className='w-full px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50'>
                  <ClockIcon className='w-5 h-5 text-brand-primary' />
                  <span>{windowEndTime || 'اختر الوقت'}</span>
                </button>
                {showWindowEndPicker && (
                  <>
                    <div
                      className='fixed inset-0 z-40'
                      onClick={() => setShowWindowEndPicker(false)}
                    />
                    <div className='absolute top-full mt-2 left-0 z-50'>
                      <TimePicker
                        selectedTime={windowEndTime}
                        onTimeSelect={handleWindowEndSelect}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>
          سعر الرحلة الكلي (ر.ي) *
        </label>
        <input
          type='number'
          value={data.total_price || ''}
          onChange={(e) =>
            onChange({ ...data, total_price: Number(e.target.value) || 0 })
          }
          className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500'
          placeholder='أدخل سعر الرحلة من نقطة الانطلاق إلى نقطة الوصول'
        />
      </div>

      <Button
        onClick={onNext}
        disabled={!canProceed}
        className='w-full'>
        التالي
      </Button>
    </div>
  );
}
