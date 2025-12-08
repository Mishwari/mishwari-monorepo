import React, { useState } from 'react';
import { 
  MapPin, Calendar, Clock, User, Phone, Mail, 
  Check, X, Star, Bus, Wifi, Wind, Zap, Tv, 
  ChevronRight, ArrowRight, Printer, Download,
  CreditCard, AlertTriangle, CheckCircle2, XCircle,
  ShieldCheck, FileText, UserCircle
} from 'lucide-react';

// --- THEME ---
const COLORS = {
  primary: '#005687',
  bg: '#F8FAFC',
  textDark: '#042f40',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
};

// --- MOCK DATA (Based on your provided JSON) ---
const MOCK_BOOKING = {
    "id": 9,
    "user": {
        "id": 16,
        "username": "15656676543",
        "email": "dsfhj@gmail.com",
        "first_name": "",
        "last_name": ""
    },
    "status": "pending",
    "total_fare": 30786,
    "trip": {
        "id": 5,
        "driver": {
            "id": 6,
            "driver_name": "Husni Invited",
            "mobile_number": "19457336323",
            "driver_rating": "5.00",
            "operator": {
                "id": 4,
                "name": "Al-Saeed Transport", // Mocked name for better UI
                "avg_rating": "4.00",
            },
            "is_verified": true
        },
        "planned_route_name": "Road Aden - Mukalla",
        "bus": {
            "id": 2,
            "bus_number": "43453",
            "bus_type": "General",
            "capacity": 30,
            "amenities": { "ac": "true", "wifi": "false" },
            "avg_rating": "3.00"
        },
        "from_city": { "id": 11, "city": "المعلا" },
        "to_city": { "id": 19, "city": "سيئون" },
        "journey_date": "2025-12-06",
        "departure_time": "2025-12-06T00:05:00Z",
        "arrival_time": "2025-12-06T13:38:04Z",
        "trip_type": "scheduled"
    },
    "from_stop": {
        "city": { "name": "المعلا" },
        "planned_departure": "2025-12-06T00:05:00Z"
    },
    "to_stop": {
        "city": { "name": "تاربة" }, // Using nested object logic from previous context if needed
        "planned_arrival": "2025-12-06T12:55:28Z"
    },
    "contact_name": "Ahmed Saleh",
    "contact_phone": "15656676543",
    "contact_email": "dsfhj@gmail.com",
    "is_paid": false,
    "payment_method": "cash",
    "booking_time": "2025-12-06T15:21:11.400125Z",
    "booking_reference": "MSH-8932", // Mocked ref
    "passengers": [
        { "name": "Sarah Ahmed", "age": 27, "gender": "female", "seat_number": "1" },
        { "name": "Khaled Ali", "age": 30, "gender": "male", "seat_number": "2" } // Added one for demo
    ]
};

// --- HELPERS ---
const formatTime = (isoString) => new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const formatDate = (isoString) => new Date(isoString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

const getStatusColor = (status) => {
    switch(status) {
        case 'active': return { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle2, label: 'Active' };
        case 'completed': return { bg: 'bg-slate-100', text: 'text-slate-600', icon: CheckCircle2, label: 'Completed' };
        case 'cancelled': return { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle, label: 'Cancelled' };
        case 'pending': return { bg: 'bg-orange-50', text: 'text-orange-700', icon: AlertTriangle, label: 'Pending Payment' };
        default: return { bg: 'bg-slate-50', text: 'text-slate-600', icon: Info, label: status };
    }
};

// --- COMPONENTS ---

// 1. Status Badge
const StatusBadge = ({ status }) => {
    const style = getStatusColor(status);
    const Icon = style.icon;
    return (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${style.bg} ${style.text} border-opacity-10 border-current`}>
            <Icon className="w-4 h-4" />
            <span className="text-sm font-bold">{style.label}</span>
        </div>
    );
};

// 2. Trip Ticket Card
const TripTicket = ({ booking }) => {
    const trip = booking.trip;
    const duration = "13h 33m"; // Mock calculation

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            {/* Header */}
            <div className="bg-[#005687] p-6 text-white relative">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Operator</div>
                        <div className="text-xl font-black">{trip.driver.operator.name}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Booking Ref</div>
                        <div className="font-mono text-lg font-bold tracking-widest">{MOCK_BOOKING.booking_reference}</div>
                    </div>
                </div>
                
                {/* Dashed Divider */}
                <div className="relative h-8 w-full my-2">
                    <div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-white/20" />
                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#F8FAFC] rounded-full" />
                    <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#F8FAFC] rounded-full" />
                </div>

                {/* Route Info */}
                <div className="flex items-center justify-between">
                    <div className="text-left">
                        <div className="text-3xl font-black">{formatTime(booking.from_stop.planned_departure)}</div>
                        <div className="text-sm font-medium text-blue-100">{booking.from_stop.city.name}</div>
                        <div className="text-xs text-blue-300 mt-1">{formatDate(booking.from_stop.planned_departure)}</div>
                    </div>

                    <div className="flex flex-col items-center px-4">
                        <div className="bg-[#004a73] px-3 py-1 rounded-full text-xs font-bold text-blue-200 mb-2">
                            {duration}
                        </div>
                        <div className="flex items-center gap-2 opacity-60">
                            <div className="w-2 h-2 bg-white rounded-full" />
                            <div className="w-12 h-0.5 bg-white rounded-full" />
                            <ArrowRight className="w-4 h-4 text-white rotate-180" />
                        </div>
                        <div className="text-[10px] text-blue-300 mt-2 uppercase tracking-wide">Direct Trip</div>
                    </div>

                    <div className="text-right">
                        <div className="text-3xl font-black">{formatTime(booking.to_stop?.planned_arrival || trip.arrival_time)}</div>
                        <div className="text-sm font-medium text-blue-100">{booking.to_stop?.city?.name || trip.to_city.city}</div>
                        <div className="text-xs text-blue-300 mt-1">{formatDate(booking.to_stop?.planned_arrival || trip.arrival_time)}</div>
                    </div>
                </div>
            </div>

            {/* Footer Info */}
            <div className="bg-slate-50 p-4 flex justify-between items-center text-sm border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-500">
                    <Bus className="w-4 h-4" />
                    <span>Bus No: <strong className="text-[#042f40]">{trip.bus.bus_number}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                    <FileText className="w-4 h-4" />
                    <span>Route: <strong className="text-[#042f40]">{trip.planned_route_name}</strong></span>
                </div>
            </div>
        </div>
    );
};

// 3. Info Card (Generic Wrapper)
const InfoCard = ({ title, icon: Icon, children, className }) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <div className="w-8 h-8 bg-[#e6f2f7] rounded-lg flex items-center justify-center text-[#005687]">
                <Icon className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#042f40]">{title}</h3>
        </div>
        <div className="p-5">
            {children}
        </div>
    </div>
);

// --- MAIN PAGE ---

export default function BookingDetailsPage() {
  const booking = MOCK_BOOKING; // In real app, use props or context
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = () => {
      if(confirm("Are you sure you want to cancel?")) {
          setIsCancelling(true);
          setTimeout(() => setIsCancelling(false), 2000);
      }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#042f40] pb-12" dir="rtl">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                    <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
                <h1 className="text-xl font-black text-[#042f40]">تفاصيل الحجز</h1>
            </div>
            
            <div className="flex items-center gap-3 self-end md:self-auto">
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" title="Print Ticket">
                    <Printer className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" title="Download PDF">
                    <Download className="w-5 h-5" />
                </button>
                {booking.status !== 'cancelled' && (
                    <button 
                        onClick={handleCancel}
                        disabled={isCancelling}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold text-sm transition-colors"
                    >
                        <XCircle className="w-4 h-4" />
                        {isCancelling ? 'جاري الإلغاء...' : 'إلغاء الحجز'}
                    </button>
                )}
            </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* STATUS BAR */}
        <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
                <span className="text-sm text-slate-500 font-medium">رقم الحجز</span>
                <span className="text-2xl font-black text-[#005687] font-mono">{booking.booking_reference}</span>
            </div>
            <StatusBadge status={booking.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN (Main Details) */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Trip Ticket */}
                <TripTicket booking={booking} />

                {/* 2. Passengers */}
                <InfoCard title={`الركاب (${booking.passengers.length})`} icon={User}>
                    <div className="space-y-3">
                        {booking.passengers.map((p, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                        <UserCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-[#042f40]">{p.name}</div>
                                        <div className="text-xs text-slate-500">{p.age} سنة • {p.gender === 'male' ? 'ذكر' : 'أنثى'}</div>
                                    </div>
                                </div>
                                <div className="text-xs font-bold bg-white px-2 py-1 rounded border border-slate-200 text-slate-500">
                                    مقعد #{p.seat_number}
                                </div>
                            </div>
                        ))}
                    </div>
                </InfoCard>

                {/* 3. Driver & Bus Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard title="السائق" icon={User}>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-3 flex items-center justify-center text-slate-400">
                                <User className="w-8 h-8" />
                            </div>
                            <div className="font-bold text-lg text-[#042f40]">{booking.trip.driver.driver_name}</div>
                            <div className="flex justify-center items-center gap-2 mt-1">
                                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold">
                                    <Star className="w-3 h-3 fill-yellow-700" /> {booking.trip.driver.driver_rating}
                                </div>
                                {booking.trip.driver.is_verified && (
                                    <span className="text-xs text-green-600 flex items-center gap-0.5 font-medium">
                                        <ShieldCheck className="w-3 h-3" /> موثق
                                    </span>
                                )}
                            </div>
                        </div>
                    </InfoCard>

                    <InfoCard title="الباص" icon={Bus}>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">النوع</span>
                                <span className="font-bold">{booking.trip.bus.bus_type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">الرقم</span>
                                <span className="font-mono bg-slate-100 px-2 rounded text-sm">{booking.trip.bus.bus_number}</span>
                            </div>
                            <div className="pt-2 border-t border-slate-100">
                                <span className="text-xs text-slate-400 uppercase font-bold mb-2 block">المميزات</span>
                                <div className="flex gap-2">
                                    {booking.trip.bus.amenities.ac === "true" && (
                                        <span className="text-xs bg-[#e6f2f7] text-[#005687] px-2 py-1 rounded font-bold flex items-center gap-1"><Wind className="w-3 h-3" /> مكيف</span>
                                    )}
                                    {booking.trip.bus.amenities.wifi === "true" && (
                                        <span className="text-xs bg-[#e6f2f7] text-[#005687] px-2 py-1 rounded font-bold flex items-center gap-1"><Wifi className="w-3 h-3" /> واي فاي</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </InfoCard>
                </div>
            </div>

            {/* RIGHT COLUMN (Sidebar Info) */}
            <div className="space-y-6">
                
                {/* Payment Summary */}
                <InfoCard title="تفاصيل الدفع" icon={CreditCard} className="bg-slate-50/50 border-slate-200">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-sm">طريقة الدفع</span>
                            <span className="font-bold text-[#042f40]">
                                {booking.payment_method === 'cash' ? 'دفع نقدي' : booking.payment_method}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-sm">حالة الدفع</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${booking.is_paid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                {booking.is_paid ? 'مدفوع' : 'غير مدفوع'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-sm">وقت الحجز</span>
                            <span className="font-mono text-xs text-slate-600 dir-ltr">
                                {new Date(booking.booking_time).toLocaleDateString()}
                            </span>
                        </div>
                        
                        <div className="h-px w-full bg-slate-200" />
                        
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-[#042f40]">الإجمالي</span>
                            <span className="text-2xl font-black text-[#005687]">{booking.total_fare.toLocaleString()} <span className="text-sm">ريال</span></span>
                        </div>
                    </div>
                </InfoCard>

                {/* Contact Info */}
                <InfoCard title="معلومات التواصل" icon={Phone}>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <User className="w-4 h-4" />
                             </div>
                             <div>
                                 <div className="text-xs text-slate-400">الاسم</div>
                                 <div className="font-bold text-sm">{booking.contact_name}</div>
                             </div>
                        </div>
                        <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <Phone className="w-4 h-4" />
                             </div>
                             <div>
                                 <div className="text-xs text-slate-400">الجوال</div>
                                 <div className="font-bold text-sm font-mono dir-ltr">{booking.contact_phone}</div>
                             </div>
                        </div>
                        <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <Mail className="w-4 h-4" />
                             </div>
                             <div>
                                 <div className="text-xs text-slate-400">البريد</div>
                                 <div className="font-bold text-sm">{booking.contact_email}</div>
                             </div>
                        </div>
                    </div>
                </InfoCard>

            </div>

        </div>
      </div>
    </div>
  );
}