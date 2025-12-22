import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Wallet, Banknote, MapPin, Calendar, 
  Clock, Users, ChevronDown, ChevronUp, Lock, 
  ShieldCheck, AlertCircle, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '@/store/store';
import {
  setPaymentMethod,
  setTrip,
  addPassenger,
} from '@/store/slices/bookingCreationSlice';
import { createBooking } from '@/store/actions/bookingActions';
import { Elements } from '@stripe/react-stripe-js';
import { useStripe } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import { useRouter } from 'next/router';
import MainHeader from '@/components/MainHeader';
import { createLogger } from '@/utils/logger';

const log = createLogger('payment');



const TripReceipt = ({ trip, passengers }: any) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!trip) return null;

  const fromCity = typeof trip.from_city === 'string' ? trip.from_city : (trip.from_city?.name || trip.from_city?.city || trip.pickup?.city || 'N/A');
  const toCity = typeof trip.to_city === 'string' ? trip.to_city : (trip.to_city?.name || trip.to_city?.city || trip.destination?.city || 'N/A');
  const operatorName = typeof trip.operator === 'string' ? trip.operator : (trip.operator?.name || 'N/A');

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h2 className="font-black text-lg text-DEFAULT">ملخص الرحلة</h2>
        <span className="text-xs font-bold text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded-lg">
          {passengers.length} ركاب
        </span>
      </div>

      <div className="p-5 space-y-6">
        <div className="relative flex flex-col gap-6">
           <div className="absolute top-2 bottom-2 right-[19px] w-0.5 bg-slate-100" />
           
           <div className="relative flex items-start gap-4 z-10">
               <div className="w-10 h-10 rounded-full border-4 border-white bg-primary shadow-md flex items-center justify-center shrink-0">
                   <MapPin className="w-4 h-4 text-white" />
               </div>
               <div>
                   <div className="text-xs font-bold text-slate-400 uppercase">المغادرة</div>
                   <div className="font-black text-DEFAULT text-lg">{fromCity}</div>
                   <div className="text-sm font-medium text-primary bg-primary-light px-2 py-0.5 rounded inline-block mt-1">
                       {trip.departure_time && new Date(trip.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                   </div>
               </div>
           </div>

           <div className="relative flex items-start gap-4 z-10">
               <div className="w-10 h-10 rounded-full border-4 border-white bg-white border-slate-200 flex items-center justify-center shrink-0">
                   <MapPin className="w-4 h-4 text-slate-400" />
               </div>
               <div>
                   <div className="text-xs font-bold text-slate-400 uppercase">الوصول</div>
                   <div className="font-black text-DEFAULT text-lg">{toCity}</div>
               </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
            <div>
                <div className="text-xs text-slate-400 font-bold mb-1">التاريخ</div>
                <div className="font-bold text-DEFAULT flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" />
                    {trip.journey_date || 'N/A'}
                </div>
            </div>
            <div>
                <div className="text-xs text-slate-400 font-bold mb-1">الشركة</div>
                <div className="font-bold text-DEFAULT truncate">{operatorName}</div>
            </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full text-xs font-bold text-slate-500 hover:text-primary transition-colors"
            >
                <span>تفاصيل الركاب ({passengers.length})</span>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {isExpanded && (
                <div className="mt-3 space-y-2 animate-in slide-in-from-top-1">
                    {passengers.map((p: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg text-sm">
                            <span className="font-bold text-DEFAULT">{p.name}</span>
                            <span className="text-xs text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-100">
                                {p.age} سنة
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <div className="bg-primary-light p-4 rounded-2xl flex justify-between items-center">
            <span className="font-bold text-primary">الإجمالي</span>
            <span className="font-black text-xl text-primary">{(passengers.length * trip.price).toLocaleString()} <span className="text-xs">ريال</span></span>
        </div>
      </div>
    </div>
  );
};

const PaymentMethodCard = ({ id, label, icon: Icon, description, isSelected, onClick, disabled }: any) => (
    <div 
        onClick={() => !disabled && onClick(id)}
        className={`
            relative p-5 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden group
            ${isSelected 
                ? 'border-primary bg-hover' 
                : disabled 
                    ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed' 
                    : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-md'}
        `}
    >
        {isSelected && (
            <div className="absolute top-0 right-0 bg-primary text-white p-1 rounded-bl-xl">
                <CheckCircle2 className="w-4 h-4" />
            </div>
        )}

        <div className="flex items-start gap-4">
            <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                ${isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400 group-hover:text-primary'}
            `}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <h3 className={`font-bold text-lg ${isSelected ? 'text-primary' : 'text-DEFAULT'}`}>{label}</h3>
                    {disabled && <span className="text-[10px] font-bold bg-slate-200 text-slate-500 px-2 py-1 rounded">قريباً</span>}
                </div>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{description}</p>
            </div>
        </div>
    </div>
);

export default function Payment() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentContent />
    </Elements>
  );
}

function PaymentContent() {
  const router = useRouter();
  const stripe = useStripe();
  const dispatch = useDispatch();
  const booking_details = useSelector((state: AppState) => state.bookingCreation);
  const selectedMethod = booking_details?.paymentMethod || 'cash';
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!booking_details?.trip?.id) {
      const draft = sessionStorage.getItem('bookingDraft');
      if (draft) {
        const data = JSON.parse(draft);
        dispatch(setTrip(data.tripDetails));
        data.passengers.forEach((p: any) => dispatch(addPassenger(p)));
      } else {
        router.push('/bus_list');
      }
    }
  }, [booking_details?.trip?.id, dispatch, router]);

  useEffect(() => {
    if (!selectedMethod) {
      dispatch(setPaymentMethod('cash'));
    }
  }, []);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem('bookingDraft');
    };
  }, []);

  const handlePayment = () => {
      log.info('Payment initiated', { method: selectedMethod, amount: totalAmount });
      setIsProcessing(true);
      const draft = sessionStorage.getItem('bookingDraft');
      let fromStopId, toStopId;
      if (draft) {
        const data = JSON.parse(draft);
        fromStopId = data.fromStopId;
        toStopId = data.toStopId;
        log.debug('Booking draft loaded', { fromStopId, toStopId });
      }
      dispatch(createBooking(stripe, fromStopId, toStopId) as any);
  };

  const trip = booking_details?.trip;
  const passengers = booking_details?.passengers?.filter((p: any) => p.is_checked) || [];
  const totalAmount = passengers.length * (trip?.price || 0);
  const isLoading = booking_details.status === 'loading';

  const { tripId, from_stop_id, to_stop_id, pickup, destination, date } = router.query;
  const backTo = tripId && from_stop_id && to_stop_id
    ? `/bus_list/${tripId}?from_stop_id=${from_stop_id}&to_stop_id=${to_stop_id}${
        pickup ? `&pickup=${pickup}` : ''
      }${destination ? `&destination=${destination}` : ''}${
        date ? `&date=${date}` : ''
      }`
    : '/';

  return (
    <div className="min-h-screen bg-light font-sans text-DEFAULT pb-24 md:pb-0" dir="rtl">
      
      <MainHeader showBackButton title="الدفع وتأكيد الحجز" backTo={backTo} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 space-y-8">
             
             <div>
                <h2 className="text-2xl font-black mb-2">اختر طريقة الدفع</h2>
                <p className="text-slate-500 mb-6">جميع المعاملات آمنة ومشفرة</p>
                
                <div className="space-y-4">
                    <PaymentMethodCard 
                        id="cash"
                        label="الدفع نقداً"
                        icon={Banknote}
                        description="ادفع عند الوصول إلى المحطة أو عند الصعود إلى الباص."
                        isSelected={selectedMethod === 'cash'}
                        onClick={(id: string) => dispatch(setPaymentMethod(id))}
                    />

                    <div className="relative">
                        <PaymentMethodCard 
                            id="card"
                            label="بطاقة ائتمان"
                            icon={CreditCard}
                            description="ادفع بأمان باستخدام فيزا أو ماستركارد."
                            isSelected={selectedMethod === 'card'}
                            onClick={(id: string) => dispatch(setPaymentMethod(id))}
                            disabled
                        />
                    </div>

                    <PaymentMethodCard 
                        id="wallet"
                        label="المحفظة الالكترونية"
                        icon={Wallet}
                        description="استخدم رصيدك في يلا باص للدفع المباشر."
                        isSelected={selectedMethod === 'wallet'}
                        onClick={(id: string) => dispatch(setPaymentMethod(id))}
                        disabled
                    />
                </div>
             </div>

             <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold text-green-800 text-sm">حجزك آمن 100%</h4>
                    <p className="text-xs text-green-700 mt-1">نحن نستخدم أحدث تقنيات التشفير لحماية بياناتك الشخصية.</p>
                </div>
             </div>

          </div>

          <div className="lg:col-span-5">
             <div className="sticky top-24 space-y-6">
               <TripReceipt trip={trip} passengers={passengers} />
               
               <div className="hidden lg:block relative z-20">
                  <button 
                      onClick={handlePayment}
                      disabled={isProcessing || isLoading}
                      className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-xl shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                      {isProcessing || isLoading ? (
                          <>جاري المعالجة...</>
                      ) : (
                          <>
                             <span>تأكيد الحجز</span>
                             <ArrowRight className="w-5 h-5 rotate-180" />
                          </>
                      )}
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-3">
                      بالنقر على تأكيد، أنت توافق على الشروط والأحكام
                  </p>
               </div>
             </div>
          </div>

        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] lg:hidden z-50">
         <div className="flex items-center justify-between gap-4">
            <div>
               <div className="text-xs text-slate-400 font-bold uppercase">الإجمالي للدفع</div>
               <div className="text-xl font-black text-primary">{totalAmount.toLocaleString()} <span className="text-xs">ريال</span></div>
            </div>
            <button 
                 onClick={handlePayment}
                 disabled={isProcessing || isLoading}
                 className="flex-1 py-3 bg-primary hover:bg-primary-dark disabled:opacity-70 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
               >
                  {isProcessing || isLoading ? 'جاري...' : 'تأكيد الحجز'}
                  {!isProcessing && !isLoading && <ArrowRight className="w-4 h-4 rotate-180" />}
            </button>
         </div>
      </div>

    </div>
  );
}
