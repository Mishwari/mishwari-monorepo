import React, { useState, useEffect } from 'react';
import { 
  MapPin, Calendar, Clock, User, Phone, Mail, 
  Check, X, Star, Bus, Wifi, Wind, Zap, Tv, 
  ChevronRight, Edit2, Trash2, Plus, CreditCard,
  AlertCircle, ShieldCheck, ArrowRight, Info, Route,
  Navigation, CheckCircle2, Users, Tag, Building2,
  ChevronDown, ChevronUp, Smartphone, Monitor
} from 'lucide-react';

// --- THEME ---
const COLORS = {
  primary: '#005687',
  primaryLight: '#e6f2f7',
  textDark: '#042f40',
  bg: '#F8FAFC',
};

// --- MOCK DATA ---
const MOCK_TRIP_DETAILED = {
    "id": 5,
    "driver": {
        "id": 3,
        "driver_name": "Mohammed Al-Jabri",
        "mobile_number": "966434345351",
        "email": "driver@gmail.com",
        "driver_rating": "5.00",
        "operator": {
            "id": 4,
            "name": "Al-Saeed Transport"
        },
        "is_verified": true
    },
    "planned_route_name": "طريق عتق - مأرب",
    "bus": {
        "id": 2,
        "bus_number": "34345",
        "bus_type": "Mercedes MCV",
        "capacity": 30,
        "amenities": {
            "ac": "true",
            "wifi": "true",
            "charging": "true"
        },
        "is_verified": true
    },
    "from_city": { "id": 2, "city": "أزال" },
    "to_city": { "id": 22, "city": "الشحر" },
    "journey_date": "2025-11-24",
    "departure_time": "2025-11-24T00:05:00Z",
    "arrival_time": "2025-11-24T14:20:44Z",
    "available_seats": 30,
    "price": 30000,
    "status": "published",
    "trip_type": "scheduled",
    "stops": [
        { "id": 26, "city": { "name": "أزال" }, "sequence": 0, "distance_from_start_km": 0.0, "price_from_start": 0, "planned_departure": "00:05" },
        { "id": 28, "city": { "name": "بني الحارث" }, "sequence": 2, "distance_from_start_km": 4.9, "price_from_start": 171, "planned_departure": "00:09" },
        { "id": 32, "city": { "name": "مأرب" }, "sequence": 6, "distance_from_start_km": 207.1, "price_from_start": 7220, "planned_departure": "03:32" },
        { "id": 38, "city": { "name": "عتق" }, "sequence": 12, "distance_from_start_km": 457.9, "price_from_start": 15962, "planned_departure": "07:42" },
        { "id": 43, "city": { "name": "المُكلا" }, "sequence": 17, "distance_from_start_km": 763.1, "price_from_start": 26600, "planned_departure": "12:48" },
        { "id": 44, "city": { "name": "الشحر" }, "sequence": 18, "distance_from_start_km": 860.7, "price_from_start": 30000, "planned_arrival": "14:20" }
    ]
};

const MOCK_PASSENGERS = [
  { id: 1, name: 'Mustafa Khaled', age: 28, phone: '01000000000', is_checked: true },
];

// --- HELPERS ---
const getAmenityIcon = (key) => {
    switch(key) {
        case 'ac': return { icon: Wind, label: 'Air Condition' };
        case 'wifi': return { icon: Wifi, label: 'Wi-Fi' };
        case 'charging': return { icon: Zap, label: 'USB Charging' };
        case 'tv': return { icon: Tv, label: 'TV Screen' };
        default: return { icon: Check, label: key };
    }
};

const formatTime = (isoString) => new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// --- COMPONENTS ---

// 1. Header
const Header = ({ trip, isMobile }) => (
  <div className={`bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 py-4 shadow-sm ${isMobile ? 'absolute w-full' : ''}`}>
    <div className="max-w-6xl mx-auto flex items-center gap-4">
      <button className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-600">
        <ChevronRight className="w-5 h-5" /> 
      </button>
      <div>
        <h1 className="text-lg font-black text-[#042f40] flex items-center gap-2">
            {trip.from_city.city} 
            <ArrowRight className="w-4 h-4 text-slate-400 rotate-180" /> 
            {trip.to_city.city}
        </h1>
        <div className="text-[10px] text-slate-500 font-bold flex items-center gap-2">
            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">#{trip.id}</span>
            <span>{trip.planned_route_name}</span>
        </div>
      </div>
    </div>
  </div>
);

// 2. Collapsible Mobile Trip Summary
const MobileTripSummary = ({ trip }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="lg:hidden mb-6 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div 
                className="p-4 flex items-center justify-between bg-slate-50 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#005687] rounded-xl flex items-center justify-center text-white font-bold text-xs">
                        <Bus className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-500">Trip Summary</div>
                        <div className="font-black text-[#042f40] text-sm">{trip.journey_date} • {formatTime(trip.departure_time)}</div>
                    </div>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
            
            {isOpen && (
                <div className="p-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Operator</span>
                            <div className="text-sm font-bold text-[#042f40]">{trip.driver.operator.name}</div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Bus</span>
                            <div className="text-sm font-bold text-[#042f40]">{trip.bus.bus_number}</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between bg-[#e6f2f7] p-3 rounded-xl">
                        <span className="text-xs font-bold text-[#005687]">Price per Seat</span>
                        <span className="text-lg font-black text-[#005687]">{trip.price.toLocaleString()} YER</span>
                    </div>
                </div>
            )}
        </div>
    );
}

// 3. Trip Summary Card (Desktop Sticky)
const TripSummaryCard = ({ trip }) => {
  const depTime = formatTime(trip.departure_time);
  const arrTime = formatTime(trip.arrival_time);
  const duration = "8h 19m"; 

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-[#005687] p-6 text-white relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        
        <div className="flex justify-between items-start mb-8 relative z-10">
           <div>
               <div className="font-bold text-lg tracking-wide">{trip.driver.operator.name}</div>
               <div className="flex items-center gap-1.5 text-blue-200 text-xs mt-1 bg-[#004a73] px-2 py-0.5 rounded-full w-fit">
                  <ShieldCheck className="w-3 h-3" /> Verified
               </div>
           </div>
           <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-center">
              <div className="text-[10px] text-blue-100 uppercase font-bold">Bus No</div>
              <div className="font-mono font-bold">{trip.bus.bus_number}</div>
           </div>
        </div>
        
        <div className="flex items-center justify-between relative z-10">
           <div>
              <div className="text-3xl font-black tracking-tight">{depTime}</div>
              <div className="text-sm font-medium text-blue-100 mt-1">{trip.from_city.city}</div>
           </div>
           <div className="flex-1 px-4 flex flex-col items-center">
              <div className="text-[10px] font-bold text-blue-200 bg-[#004a73] px-2 py-0.5 rounded-full mb-2">
                  {duration}
              </div>
              <div className="w-full flex items-center gap-1 opacity-50">
                 <div className="h-1 w-1 rounded-full bg-white" />
                 <div className="h-0.5 flex-1 bg-white rounded-full" />
                 <div className="h-1 w-1 rounded-full bg-white" />
                 <ArrowRight className="w-3 h-3 text-white rotate-180" />
              </div>
           </div>
           <div className="text-right">
              <div className="text-3xl font-black tracking-tight">{arrTime}</div>
              <div className="text-sm font-medium text-blue-100 mt-1">{trip.to_city.city}</div>
           </div>
        </div>
      </div>

      <div className="p-6">
         <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-2xl border border-slate-100 mb-4">
            <div className="flex flex-col gap-1">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Journey Date</span>
               <div className="font-bold text-[#042f40] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#005687]" />
                  {trip.journey_date}
               </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex flex-col gap-1 text-right">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Per Seat</span>
               <div className="font-bold text-[#042f40] flex items-center justify-end gap-1">
                  {trip.price.toLocaleString()} <span className="text-xs font-medium text-slate-500">YER</span>
               </div>
            </div>
         </div>
         
         <div className="flex items-center gap-2 text-xs font-bold text-green-700 bg-green-50 p-3 rounded-xl border border-green-100 justify-center">
             <CheckCircle2 className="w-4 h-4" />
             Free Cancellation Available
         </div>
      </div>
    </div>
  );
}

// 4. Trip Experience Card (Fixed Overflow)
const TripExperience = ({ driver, bus, isMobile }) => (
    <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e6f2f7] rounded-xl flex items-center justify-center text-[#005687]">
                <Star className="w-5 h-5" />
            </div>
            <div>
                <h2 className="font-black text-lg text-[#042f40]">Trip Experience</h2>
                <p className="text-xs text-slate-400 font-medium">Bus features & Driver info</p>
            </div>
        </div>

        {/* Layout Logic: Forced 1-col if mobile sim, or standard responsive if desktop mode */}
        <div className={`p-6 grid gap-8 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            {/* Bus Features */}
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <Bus className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-bold text-slate-600 uppercase tracking-wide">Vehicle Amenities</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(bus.amenities).map(([key, val]) => {
                        if (val !== "true") return null;
                        const { icon: Icon, label } = getAmenityIcon(key);
                        return (
                            <div key={key} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-[#042f40]">
                                <Icon className="w-4 h-4 text-[#005687]" />
                                {label}
                            </div>
                        )
                    })}
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-[#042f40]">
                        <span className="font-mono text-slate-500">#{bus.bus_number}</span>
                        {bus.bus_type}
                    </div>
                </div>
            </div>

            {/* Driver Info */}
            <div className={`${isMobile ? '' : 'md:border-r md:border-slate-100 md:pr-8'}`}> 
                <div className="flex items-center gap-3 mb-4">
                    <User className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-bold text-slate-600 uppercase tracking-wide">Captain</span>
                </div>
                <div className="flex items-center gap-4 bg-[#F8FAFC] p-3 rounded-2xl border border-slate-100">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 border-2 border-white shadow-sm">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="font-bold text-[#042f40] text-sm">{driver.driver_name}</div>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-white bg-yellow-400 px-1.5 rounded-md shadow-sm">
                                <Star className="w-2.5 h-2.5 fill-white" /> {driver.driver_rating}
                            </div>
                            {driver.is_verified && (
                                <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5">
                                    <CheckCircle2 className="w-3 h-3" /> Verified
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// 5. Modern Itinerary (Collapsible)
const ItineraryTimeline = ({ stops }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const visibleStops = isExpanded ? stops : stops.slice(0, 3).concat(stops[stops.length - 1]);

    return (
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div 
                className="p-6 border-b border-slate-100 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#e6f2f7] rounded-xl flex items-center justify-center text-[#005687]">
                        <Route className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="font-black text-lg text-[#042f40]">Itinerary</h2>
                        <p className="text-xs text-slate-400 font-medium">{stops.length} Stations</p>
                    </div>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
            
            {isOpen && (
                <div className="p-6 relative animate-in slide-in-from-top-2 duration-300" dir="rtl">
                    <div className="absolute top-8 bottom-8 right-[47px] w-0.5 bg-slate-100" />

                    <div className="space-y-8">
                        {visibleStops.map((stop, idx) => {
                            const timeFormatted = stop.planned_departure ? formatTime(stop.planned_departure) : "--:--";
                            const isMajor = idx === 0 || idx === visibleStops.length - 1;

                            return (
                            <div key={stop.id} className="relative flex items-start justify-between group">
                                <div className="flex-1 pr-6 pt-0.5">
                                    <div className={`font-bold text-[#042f40] ${isMajor ? 'text-base' : 'text-sm'}`}>{stop.city.name}</div>
                                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-2 font-medium">
                                        <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{Math.round(stop.distance_from_start_km)} km</span>
                                        {stop.price_from_start > 0 && (
                                            <span className="text-[#005687] bg-[#e6f2f7] px-2 py-0.5 rounded">{stop.price_from_start.toLocaleString()} YER</span>
                                        )}
                                    </div>
                                </div>

                                <div className="relative z-10 flex flex-col items-center w-10 ml-2">
                                    <div className={`
                                        rounded-full border-4 border-white shadow-sm transition-all
                                        ${isMajor
                                            ? 'bg-[#005687] w-5 h-5 shadow-md ring-4 ring-[#e6f2f7]' 
                                            : 'bg-white border-slate-300 w-3.5 h-3.5 group-hover:border-[#005687]'}
                                    `} />
                                </div>

                                <div className="w-16 text-left pt-0.5">
                                    <div className={`font-bold ${isMajor ? 'text-[#005687] text-base' : 'text-slate-500 text-sm'}`}>{timeFormatted}</div>
                                </div>
                            </div>
                        )})}
                    </div>

                    {stops.length > 4 && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                            className="w-full mt-8 py-3 text-xs font-bold text-[#005687] bg-[#e6f2f7]/50 hover:bg-[#e6f2f7] rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            {isExpanded ? 'Hide Stops' : `Show ${stops.length - 4} More Stops`}
                        </button>
                    )}
                </div>
            )}
        </section>
    )
}

// 6. Passenger Form
const PassengerSection = ({ passengers, setPassengers, onAddPassenger, onEdit, onDelete }) => {
  const toggleCheck = (id) => {
    setPassengers(passengers.map(p => p.id === id ? { ...p, is_checked: !p.is_checked } : p));
  }

  return (
    <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
       <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#e6f2f7] rounded-xl flex items-center justify-center text-[#005687]">
                <Users className="w-5 h-5" />
             </div>
             <div>
                <h2 className="font-black text-lg text-[#042f40]">Passengers</h2>
                <p className="text-xs text-slate-400 font-medium">Select who is traveling</p>
             </div>
          </div>
          <button onClick={onAddPassenger} className="text-sm font-bold text-white bg-[#005687] hover:bg-[#004a73] px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-900/10 active:scale-95 flex items-center gap-2">
             <Plus className="w-4 h-4" /> Add New
          </button>
       </div>

       <div className="p-4 space-y-3">
          {passengers.map(p => (
             <div key={p.id} className={`group flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer border-2 ${p.is_checked ? 'bg-[#e6f2f7]/30 border-[#005687]/20' : 'bg-white border-slate-50 hover:border-slate-200'}`}>
                <div className="flex items-center gap-4 flex-1" onClick={() => toggleCheck(p.id)}>
                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${p.is_checked ? 'bg-[#005687] border-[#005687]' : 'border-slate-300 bg-white'}`}>
                      {p.is_checked && <Check className="w-4 h-4 text-white" />}
                   </div>
                   <div>
                      <div className={`font-bold text-sm ${p.is_checked ? 'text-[#005687]' : 'text-[#042f40]'}`}>{p.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{p.age} years</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="font-mono">{p.phone}</span>
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => onEdit(p)} className="p-2 text-slate-400 hover:text-[#005687] hover:bg-white rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                   <button onClick={() => onDelete(p)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
             </div>
          ))}
          {passengers.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm font-medium">
                  No passengers added yet.
              </div>
          )}
       </div>
    </section>
  );
}

// 7. Contact Section
const ContactSection = ({ details, setDetails }) => (
  <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
     <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#e6f2f7] rounded-xl flex items-center justify-center text-[#005687]">
           <Phone className="w-5 h-5" />
        </div>
        <div>
            <h2 className="font-black text-lg text-[#042f40]">Contact Info</h2>
            <p className="text-xs text-slate-400 font-medium">For booking confirmation</p>
        </div>
     </div>
     <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
           <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
           <div className="flex items-center gap-3 p-3.5 bg-[#F8FAFC] rounded-xl border border-slate-200 focus-within:border-[#005687] focus-within:ring-4 focus-within:ring-[#e6f2f7] transition-all">
              <User className="w-5 h-5 text-slate-400" />
              <input type="text" value={details.name} onChange={e => setDetails({...details, name: e.target.value})} className="bg-transparent w-full text-sm font-bold text-[#042f40] outline-none" placeholder="John Doe" />
           </div>
        </div>
        <div className="space-y-1.5">
           <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone</label>
           <div className="flex items-center gap-3 p-3.5 bg-[#F8FAFC] rounded-xl border border-slate-200 focus-within:border-[#005687] focus-within:ring-4 focus-within:ring-[#e6f2f7] transition-all">
              <Phone className="w-5 h-5 text-slate-400" />
              <input type="tel" value={details.phone} onChange={e => setDetails({...details, phone: e.target.value})} className="bg-transparent w-full text-sm font-bold text-[#042f40] outline-none dir-ltr" placeholder="+967..." />
           </div>
        </div>
        <div className="space-y-1.5 md:col-span-2">
           <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
           <div className="flex items-center gap-3 p-3.5 bg-[#F8FAFC] rounded-xl border border-slate-200 focus-within:border-[#005687] focus-within:ring-4 focus-within:ring-[#e6f2f7] transition-all">
              <Mail className="w-5 h-5 text-slate-400" />
              <input type="email" value={details.email} onChange={e => setDetails({...details, email: e.target.value})} className="bg-transparent w-full text-sm font-bold text-[#042f40] outline-none" placeholder="example@mail.com" />
           </div>
        </div>
     </div>
  </section>
);

// --- LAYOUT WRAPPER ---
const LayoutWrapper = ({ children, isMobileView, toggleView, footer }) => (
    <div className="relative min-h-screen bg-slate-100 flex justify-center items-center p-0 md:p-4">
        <div className={`
            transition-all duration-300 ease-in-out bg-[#F8FAFC] shadow-2xl relative flex flex-col
            ${isMobileView ? 'w-[390px] h-[844px] rounded-[3rem] my-auto border-[8px] border-slate-800 ring-8 ring-slate-200 overflow-hidden' : 'w-full min-h-screen rounded-none md:rounded-2xl'}
        `}>
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto scrollbar-hide w-full relative">
               {children}
            </div>

            {/* Sticky Footer for Mobile View */}
            {isMobileView && (
                <div className="sticky bottom-0 w-full z-50">
                    {footer}
                </div>
            )}
        </div>
        
        <button 
            onClick={toggleView}
            className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-full shadow-2xl hover:scale-105 transition-all font-bold text-xs uppercase tracking-wider"
        >
            {isMobileView ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            {isMobileView ? 'Switch to Desktop' : 'Switch to Mobile'}
        </button>
    </div>
);

// --- MAIN PAGE ---

export default function TripDetailsPage() {
  const [passengers, setPassengers] = useState(MOCK_PASSENGERS);
  const [contact, setContact] = useState({ name: 'Mustafa Khaled', phone: '0106543210', email: 'mustafa@example.com' });
  const [isAuthenticated, setIsAuthenticated] = useState(true); 
  const [isMobileView, setIsMobileView] = useState(false);

  const checkedCount = passengers.filter(p => p.is_checked).length;
  const totalAmount = checkedCount * MOCK_TRIP_DETAILED.price;

  // Footer Component
  const Footer = (
    <div className="bg-white/95 backdrop-blur-xl border-t border-slate-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
         <div className="flex items-center justify-between gap-4">
            <div>
               <div className="text-xs text-slate-400 font-bold uppercase">Total</div>
               <div className="text-xl font-black text-[#005687]">{totalAmount.toLocaleString()} <span className="text-xs">YER</span></div>
            </div>
            <button 
                 disabled={totalAmount === 0}
                 className="flex-1 py-3 bg-[#005687] hover:bg-[#004a73] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
               >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4 rotate-180" /> 
            </button>
         </div>
    </div>
  );

  return (
    <LayoutWrapper 
        isMobileView={isMobileView} 
        toggleView={() => setIsMobileView(!isMobileView)}
        footer={Footer}
    >
        <div className="font-sans text-[#042f40] pb-24 lg:pb-0 min-h-full" dir="rtl">
        <Header trip={MOCK_TRIP_DETAILED} isMobile={isMobileView} />

        <div className={`mx-auto px-4 py-8 ${isMobileView ? '' : 'max-w-6xl'}`}>
            
            <div className={`${isMobileView ? 'block' : 'lg:hidden'}`}>
                <MobileTripSummary trip={MOCK_TRIP_DETAILED} />
            </div>

            <div className={`grid gap-8 ${isMobileView ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'}`}>
            
            <div className={`${isMobileView ? '' : 'lg:col-span-8'} space-y-8`}>
                <TripExperience driver={MOCK_TRIP_DETAILED.driver} bus={MOCK_TRIP_DETAILED.bus} isMobile={isMobileView} />
                <ItineraryTimeline stops={MOCK_TRIP_DETAILED.stops} />
                <PassengerSection 
                    passengers={passengers} 
                    setPassengers={setPassengers}
                    onAddPassenger={() => alert('Open Add Modal')}
                    onEdit={(p) => alert(`Edit ${p.name}`)}
                    onDelete={(p) => alert(`Delete ${p.name}`)}
                />
                <ContactSection details={contact} setDetails={setContact} />
            </div>

            <div className={`${isMobileView ? 'hidden' : 'hidden lg:block lg:col-span-4'}`}>
                <div className="sticky top-24 space-y-6">
                    <TripSummaryCard trip={MOCK_TRIP_DETAILED} />
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                        <span className="text-slate-500 font-bold">Total Amount</span>
                        <span className="text-3xl font-black text-[#005687]">{totalAmount.toLocaleString()} <span className="text-sm">YER</span></span>
                        </div>
                        
                        {isAuthenticated ? (
                        <button 
                            disabled={totalAmount === 0}
                            className="w-full py-4 bg-[#005687] hover:bg-[#004a73] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl shadow-xl shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <CreditCard className="w-5 h-5" />
                            Proceed to Payment
                        </button>
                        ) : (
                        <button className="w-full py-4 bg-white border-2 border-[#005687] text-[#005687] font-bold rounded-xl hover:bg-blue-50 transition-all">
                            Login to Book
                        </button>
                        )}
                    </div>
                </div>
            </div>

            </div>
        </div>

        {/* Real Mobile Sticky Footer (Outside Wrapper for Production) */}
        <div className={`fixed bottom-0 left-0 w-full z-40 lg:hidden ${isMobileView ? 'hidden' : ''}`}>
            {Footer}
        </div>

        </div>
    </LayoutWrapper>
  );
}