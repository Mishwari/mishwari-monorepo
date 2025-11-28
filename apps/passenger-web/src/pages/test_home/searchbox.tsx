import React from 'react';

function searchbox() {
  return (
    <div>
      {/* 

      <div className='bg-white/70 backdrop-blur-xl p-2 rounded-[2rem] shadow-2xl shadow-blue-900/5 border border-white'>
        <form
          onSubmit={handleSubmit}
          className='bg-white rounded-[1.5rem] p-4 flex flex-col md:flex-row gap-2 border border-slate-100'>
          <div className='w-full lg:w-5/12 relative flex flex-wrap sm:flex-nowrap shadow-lg lg:shadow-none rounded-lg lg:rounded-l-none lg:border-l-0'>
            <div className='flex flex-col w-full'>
              <CityDropdown
                options={departureCities}
                value={fromCity}
                onChange={setFromCity}
                placeholder='اختر مدينة'
                emptyMessage='لا توجد رحلات متاحة'
                loading={loadingFrom}
                showTripCount={true}
                label='من'
                icon={MapPinIcon}
              />
            </div>

            <div
              onClick={handleSwitchCities}
              className='absolute z-10 left-4 bg-inherit flex items-center justify-center self-center h-max w-max sm:w-28 sm:static sm:justify-center sm:items-center rounded-full sm:rotate-90 overflow-hidden'>
              <div className='border-2 border-white hover:bg-brand-primary/10 active:bg-brand-primary/20 cursor-pointer sm:border-0 p-2.5 sm:p-2 rounded-full bg-inherit flex items-center justify-center'>
                <ArrowsRightLeftIcon
                  style={{ width: '20px', height: '20px', display: 'block' }}
                />
              </div>
            </div>

            <div className='sm:hidden w-full h-[2px] bg-white' />

            <div className='flex flex-col w-full'>
              <CityDropdown
                options={destinationCities}
                value={toCity}
                onChange={setToCity}
                placeholder='اختر مدينة'
                emptyMessage='لا توجد وجهات متاحة'
                loading={loadingTo}
                showTripCount={true}
                disabled={!fromCity}
                label='إلى'
                icon={MapPinIcon}
              />
            </div>
          </div>

          <div className='w-full lg:w-7/12 flex flex-wrap gap-4 sm:gap-0 sm:rounded-lg sm:shadow-lg lg:shadow-none overflow-hidden sm:border border-gray-200 lg:rounded-l-lg lg:rounded-r-none lg:border-r-0'>
            <div className='w-full h-14 sm:w-10/12 md:w-9/12 lg:w-8/12 flex justify-start items-center gap-3 px-4  shadow-lg sm:shadow-none rounded-lg sm:rounded-none relative'>
              <div className='flex items-center gap-3 flex-1'>
                <div className='md:flex-none md:w-auto border-t border-slate-100 pt-2 md:border-t-0 md:pt-0'>
                  <div
                    className='flex items-center gap-2 p-2 sm:p-3 rounded-xl transition-all cursor-pointer border bg-slate-50 hover:bg-hover border-transparent hover:border-blue-100 h-full'
                    onClick={() => setShowCalendar(!showCalendar)}>
                    <CalendarIcon className='text-primary w-5 h-5 shrink-0' />
                    <div className='flex-1 min-w-0 flex flex-col justify-center text-right pl-1'>
                      <span className='text-[10px] text-slate-400 font-bold mb-0.5 leading-none'>
                        متى
                      </span>
                      <div className='truncate text-sm sm:text-base font-bold text-[#042f40] w-full leading-tight'>
                        {format(selectedDate, 'd MMMM', { locale: ar })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {showCalendar && (
                <>
                  <div
                    className='fixed inset-0 z-40'
                    onClick={() => setShowCalendar(false)}
                  />
                  <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50'>
                    <DatePicker
                      selectedDate={selectedDate}
                      onDateSelect={(date) => {
                        setSelectedDate(date);
                        setShowCalendar(false);
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            <div className='md:w-auto'>
              <button
                type='submit'
                className='w-full h-full min-h-[56px] px-8 bg-brand-primary hover:bg-brand-primary-dark text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-2 group'>
                <MagnifyingGlassIcon className='w-5 h-5 group-hover:scale-110 transition-transform' />
                <span className='md:hidden'>بحث عن رحلات</span>
              </button>
            </div>
          </div>
        </form>
      </div> */}
    </div>
  );
}

export default searchbox;
