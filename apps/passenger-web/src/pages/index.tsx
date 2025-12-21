import TripSearchForm from '../components/home/TripSearchForm';
import MainHeader from '@/components/MainHeader';
import useAuth from '@/hooks/useAuth';
import { ShieldCheckIcon, TruckIcon } from '@heroicons/react/24/outline';
import { BoltIcon as ZapIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useGPSLocation } from '@mishwari/ui-primitives';
import { SEO } from '@mishwari/ui-web';
import { GetServerSideProps } from 'next';

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

interface RecentTrip {
  id: number;
  from_city: { name: string };
  to_city: { name: string };
  journey_date: string;
  departure_time: string;
  price: number;
  available_seats: number;
  operator: { name: string };
  planned_route_name: string;
}

export default function Home({ recentTrips = [] }: { recentTrips: RecentTrip[] }) {
  const { isAuthenticated } = useAuth();
  const { location, loading: gpsLoading } = useGPSLocation(true);

  return (
    <>
      <SEO
        title="حجز تذاكر الباص في اليمن"
        description="احجز تذاكر الباص بسهولة من صنعاء، عدن، تعز، مأرب وجميع المدن اليمنية. أسعار منافسة، حجز فوري، دفع آمن."
        keywords="حجز باص اليمن, تذاكر باص, صنعاء عدن, تعز مأرب, يلا باص"
        canonical="/"
        structuredData={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'يلا باص',
            url: 'https://yallabus.app',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://yallabus.app/bus_list/search?q={search_term_string}'
              },
              'query-input': 'required name=search_term_string'
            }
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'كيف أحجز تذكرة باص في اليمن؟',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'اختر مدينة المغادرة والوصول، حدد التاريخ، اختر الرحلة المناسبة، ثم أكمل عملية الحجز والدفع الآمن عبر الموقع.'
                }
              },
              {
                '@type': 'Question',
                name: 'ما هي طرق الدفع المتاحة؟',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'نوفر طرق دفع متعددة تشمل الدفع الإلكتروني الآمن، الدفع النقدي عند الصعود، والتحويل البنكي.'
                }
              },
              {
                '@type': 'Question',
                name: 'هل يمكنني إلغاء أو تعديل الحجز؟',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'نعم، يمكنك إلغاء أو تعديل حجزك من خلال حسابك على الموقع قبل موعد الرحلة بوقت كافٍ حسب سياسة الإلغاء.'
                }
              },
              {
                '@type': 'Question',
                name: 'ما هي المدن المتاحة للحجز؟',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'نغطي جميع المدن الرئيسية في اليمن بما في ذلك صنعاء، عدن، تعز، مأرب، الحديدة، إب، ذمار، المكلا، وسيئون.'
                }
              },
              {
                '@type': 'Question',
                name: 'كيف أعرف أن الحجز تم بنجاح؟',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'ستصلك رسالة تأكيد فورية عبر الواتساب والبريد الإلكتروني تحتوي على تفاصيل الرحلة ورقم الحجز.'
                }
              },
              {
                '@type': 'Question',
                name: 'هل الأسعار شاملة جميع الرسوم؟',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'نعم، الأسعار المعروضة نهائية وشاملة جميع الرسوم دون أي تكاليف إضافية مخفية.'
                }
              }
            ]
          }
        ]}
      />
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

          {/* Recent Trips */}
          {recentTrips.length > 0 && (
            <section>
              <div className='mb-6'>
                <h2 className='text-2xl md:text-3xl font-black'>أحدث الرحلات</h2>
                <p className='text-sm font-medium text-slate-500 mt-1'>رحلات متاحة للحجز الآن</p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {recentTrips.map((trip) => {
                  const date = new Date(trip.journey_date);
                  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
                  const formattedDate = `${days[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}`;
                  const time = trip.departure_time ? new Date(trip.departure_time).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : '--:--';

                  return (
                    <Link key={trip.id} href={`/bus_list/${trip.id}`}>
                      <div className='bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-primary transition-all cursor-pointer group'>
                        <div className='flex items-center justify-between mb-3'>
                          <div className='flex items-center gap-2 text-brand font-black text-lg'>
                            <span>{trip.from_city.name}</span>
                            <ArrowRightIcon className='w-4 h-4 text-slate-400 rotate-180' />
                            <span>{trip.to_city.name}</span>
                          </div>
                        </div>
                        
                        <div className='space-y-2 text-sm'>
                          <div className='flex items-center gap-2 text-slate-600'>
                            <CalendarIcon className='w-4 h-4 text-slate-400' />
                            <span className='font-bold'>{formattedDate}</span>
                          </div>
                          <div className='flex items-center gap-2 text-slate-600'>
                            <ClockIcon className='w-4 h-4 text-slate-400' />
                            <span className='font-bold'>{time}</span>
                          </div>
                        </div>

                        <div className='mt-4 pt-3 border-t border-slate-100 flex items-center justify-between'>
                          <div>
                            <div className='text-xs text-slate-500'>السعر من</div>
                            <div className='text-lg font-black text-primary'>{trip.price.toLocaleString()} ر.ي</div>
                          </div>
                          <div className='text-xs text-slate-500'>
                            {trip.available_seats} مقعد متاح
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

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
    </>
  );
}


export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.yallabus.app';
    const response = await fetch(`${apiUrl}/api/trips/recent/`);
    
    if (!response.ok) {
      return { props: { recentTrips: [] } };
    }
    
    const recentTrips = await response.json();
    return { props: { recentTrips } };
  } catch (error) {
    console.error('Failed to fetch recent trips:', error);
    return { props: { recentTrips: [] } };
  }
};
