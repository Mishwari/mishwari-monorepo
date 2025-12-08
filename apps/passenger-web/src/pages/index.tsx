import TripSearchForm from '../components/home/TripSearchForm';
import MainHeader from '@/components/MainHeader';
import useAuth from '@/hooks/useAuth';
import { ShieldCheckIcon, TruckIcon } from '@heroicons/react/24/outline';
import { BoltIcon as ZapIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useGPSLocation } from '@mishwari/ui-primitives';

const POPULAR_DESTINATIONS = [
  {
    name: 'صنعاء',
    image: '/images/destinations/destination-sanaa.png',
    price: 34000,
  },
  {
    name: 'عدن',
    image: '/images/destinations/destination-aden.png',
    price: 12000,
  },
  {
    name: 'تعز',
    image: '/images/destinations/destination-taiz.png',
    price: 17000,
  },
  {
    name: 'مأرب',
    image: '/images/destinations/destination-mareb.png',
    price: 22000,
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { location, loading: gpsLoading } = useGPSLocation(true);

  return (
    <div className='min-h-screen bg-light relative overflow-hidden'>
      <div className='absolute top-0 left-0 w-full h-full overflow-hidden z-0'>
        <div className='absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-primary-light rounded-full blur-3xl opacity-80 mix-blend-multiply' />
        <div className='absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-3xl opacity-80 mix-blend-multiply' />
        <div className='absolute top-[40%] left-[20%] w-[30%] h-[30%] bg-white rounded-full blur-2xl opacity-60' />
      </div>
      <div className='relative min-h-screen flex flex-col'>
        <MainHeader backTo='/' transparent />
        <div className='flex-1 flex flex-col justify-center items-center px-4 py-8 relative z-20'>
          <TripSearchForm />
        </div>

        {/* Landing Page Content */}
        <div className='w-full max-w-7xl mx-auto px-4 pb-20 space-y-12 relative z-10'>
          {/* Popular Destinations */}
          <section>
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h2 className='text-2xl md:text-3xl font-black'>وجهات شائعة</h2>
                <p className='text-sm font-medium text-slate-500 mt-1'>
                  من{' '}
                  {gpsLoading ? (
                    <span className='text-slate-400'>جاري الكشف...</span>
                  ) : location?.cityAr ? (
                    <strong className='text-primary underline decoration-brand-primary-light decoration-2 underline-offset-2'>
                      {location.cityAr}
                    </strong>
                  ) : (
                    <strong className='text-primary underline decoration-brand-primary-light decoration-2 underline-offset-2'>
                      سيئون
                    </strong>
                  )}
                </p>
              </div>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {POPULAR_DESTINATIONS.map((dest, idx) => (
                <div
                  key={idx}
                  className='relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer group hover:shadow-xl transition-all'>
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    sizes='(max-width: 768px) 50vw, 25vw'
                    className='object-cover'
                    priority={idx < 2}
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-brand/80 to-transparent opacity-80 group-hover:opacity-90 transition-opacity' />
                  <div className='absolute bottom-4 right-4 text-white'>
                    <h3 className='font-bold text-lg leading-tight mb-1'>
                      {dest.name}
                    </h3>
                    <div className='flex items-center gap-1 text-xs font-medium bg-white/20 backdrop-blur-md px-2 py-1 rounded-full w-fit'>
                      <span>من {dest.price} ر.ي</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Trust Indicators */}
          <section className='bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 rounded-full bg-brand-primary-light flex items-center justify-center text-primary shrink-0'>
                  <ShieldCheckIcon className='w-6 h-6' />
                </div>
                <div>
                  <h4 className='font-bold'>دفع آمن</h4>
                  <p className='text-sm text-slate-500'>
                    معالجة دفع آمنة 100% مع ضمان استرداد الأموال
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 rounded-full bg-brand-primary-light flex items-center justify-center text-primary shrink-0'>
                  <ZapIcon className='w-6 h-6' />
                </div>
                <div>
                  <h4 className='font-bold'>حجز فوري</h4>
                  <p className='text-sm text-slate-500'>
                    احصل على تذاكرك على هاتفك فوراً
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 rounded-full bg-brand-primary-light flex items-center justify-center text-primary shrink-0'>
                  <TruckIcon className='w-6 h-6' />
                </div>
                <div>
                  <h4 className='font-bold'>شركات موثوقة</h4>
                  <p className='text-sm text-slate-500'>
                    شريك رسمي لأفضل شركات النقل في اليمن
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
