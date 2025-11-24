import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Calendar, MapPin, ArrowRight, ArrowLeftRight, 
  Filter, Star, Clock, Bus, ChevronDown, Check, X,
  SlidersHorizontal, ArrowUpDown, User, Wifi, Wind, Utensils, 
  Smartphone, ChevronLeft, ChevronRight, AlertCircle, 
  History, Tag, ShieldCheck, Zap, LogIn, Mail, Lock,
  MapPin as MapPinIcon, Users, CreditCard, Heart
} from 'lucide-react';

// --- THEME CONFIGURATION ---
const COLORS = {
  primary: '#005687',      // Deep Blue
  primaryDark: '#004a73',  
  primaryLight: '#e6f2f7', // Ice Blue
  textDark: '#042f40',     // Navy Teal
  bg: '#F8FAFC',           // Cool White
  accent: '#F59E0B'        // Amber for CTA/Highlights
};

// --- MOCK DATA ---
const CITIES = [
  { id: 1, name: 'Cairo', trips: 142 },
  { id: 2, name: 'Alexandria', trips: 85 },
  { id: 3, name: 'Dahab', trips: 12 },
  { id: 4, name: 'Hurghada', trips: 24 },
  { id: 5, name: 'Luxor', trips: 18 },
  { id: 6, name: 'Aswan', trips: 10 },
  { id: 7, name: 'Sharm El Sheikh', trips: 30 },
];

const RECENT_SEARCHES = [
  { from: 'Cairo', to: 'Alexandria', date: 'Tomorrow', passengers: 1 },
  { from: 'Cairo', to: 'Dahab', date: '28 Nov', passengers: 2 },
];

const PRICING_MATRIX = {
  'Dahab': { 'Cairo': 250, 'Alexandria': 350, 'Sharm El Sheikh': 80 },
  'Sharm El Sheikh': { 'Cairo': 220, 'Alexandria': 300, 'Dahab': 80 },
  'Hurghada': { 'Cairo': 200, 'Alexandria': 280, 'Luxor': 110 },
  'Luxor': { 'Cairo': 300, 'Alexandria': 380, 'Hurghada': 110 },
};

const POPULAR_DESTINATIONS = [
  { name: 'Dahab', image: 'bg-orange-100' },
  { name: 'Sharm El Sheikh', image: 'bg-blue-100' },
  { name: 'Hurghada', image: 'bg-cyan-100' },
  { name: 'Luxor', image: 'bg-yellow-100' },
];

const MOCK_TRIPS = [
  { id: 101, operator: 'Go Bus', bus_number: 'GB-202', route_name: 'Desert Road', type: 'Deluxe Plus', fromTime: '08:00', toTime: '11:00', duration: '3h', price: 180, rating: 4.5, seats: 12, features: ['WiFi', 'AC'] },
  { id: 102, operator: 'Blue Bus', bus_number: 'BB-99', route_name: 'Agri Road', type: 'Comfort', fromTime: '08:30', toTime: '11:45', duration: '3h 15m', price: 160, rating: 4.2, seats: 4, features: ['AC', 'USB'] },
  { id: 103, operator: 'Go Bus', bus_number: 'GB-Elite', route_name: 'Direct', type: 'Elite', fromTime: '09:00', toTime: '11:50', duration: '2h 50m', price: 250, rating: 4.8, seats: 22, features: ['WiFi', 'Meal', 'Wide Seats'] },
  { id: 104, operator: 'Super Jet', bus_number: 'SJ-101', route_name: 'Desert Road', type: 'Standard', fromTime: '10:00', toTime: '13:30', duration: '3h 30m', price: 110, rating: 3.8, seats: 40, features: ['AC'] },
  { id: 105, operator: 'Blue Bus', bus_number: 'BB-Biz', route_name: 'Direct Express', type: 'Business', fromTime: '11:00', toTime: '14:00', duration: '3h', price: 210, rating: 4.6, seats: 8, features: ['WiFi', 'Tablet'] },
];

const FEATURE_ICONS = {
  'WiFi': <Wifi className="w-3 h-3" />,
  'AC': <Wind className="w-3 h-3" />,
  'Meal': <Utensils className="w-3 h-3" />,
  'USB': <Smartphone className="w-3 h-3" />,
  'Tablet': <Smartphone className="w-3 h-3" />,
  'Wide Seats': <User className="w-3 h-3" />
};

// --- COMPONENTS ---

// 2. Unified Search Header Component
const UnifiedSearchHeader = ({ isResultsMode, onSearch, searchParams, setSearchParams, onReset, detectedCity, isLoggedIn, onLoginClick, onLogoutClick }) => {
  const [localParams, setLocalParams] = useState(searchParams);

  useEffect(() => {
    setLocalParams(searchParams);
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams(localParams);
    onSearch();
  };

  const swapCities = () => {
    setLocalParams(prev => ({ ...prev, from: prev.to, to: prev.from }));
  };

  if (isResultsMode) {
    // COMPACT MODE (Sticky Header)
    return (
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/60 animate-in slide-in-from-top duration-300">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center gap-3">
            
            {/* Route Summary */}
            <div 
              className="flex items-center gap-2 cursor-pointer hover:bg-slate-100/50 p-2 -ml-2 rounded-xl transition-colors group"
              onClick={onReset}
            >
              <div className="h-8 w-8 rounded-full bg-[#e6f2f7] flex items-center justify-center text-[#005687] group-hover:scale-110 transition-transform">
                  <ArrowLeftRight className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-[#042f40] font-bold text-sm leading-tight">
                    <span className="truncate max-w-[80px] sm:max-w-[100px]">{localParams.from}</span>
                    <span className="text-slate-400 mx-1">to</span>
                    <span className="truncate max-w-[80px] sm:max-w-[100px]">{localParams.to}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                      <span>{localParams.passengers} Passenger</span>
                  </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            {/* Compact Day Navigator (Restored) */}
            <div className="flex items-center bg-slate-50 rounded-lg p-0.5 sm:p-1 shrink-0 border border-slate-100 sm:border-transparent">
                <button className="p-1 hover:bg-white hover:shadow-sm rounded-md text-slate-400 hover:text-[#005687] transition-all">
                    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <div className="flex items-center gap-1.5 px-2 text-xs font-bold text-[#042f40] whitespace-nowrap">
                    <Calendar className="w-3 h-3 text-slate-400 hidden sm:block" />
                    <span className="hidden sm:inline">Today,</span>
                    <span>24 Nov</span>
                </div>
                <button className="p-1 hover:bg-white hover:shadow-sm rounded-md text-slate-400 hover:text-[#005687] transition-all">
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
            </div>

            {/* Spacer to push actions to right */}
            <div className="flex-1" />

            {/* Actions */}
            <div className="flex items-center gap-2">
               {isLoggedIn ? (
                   <button onClick={onLogoutClick} className="h-9 w-9 bg-[#005687] rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-md hover:bg-[#004a73] transition-colors">
                     MK
                   </button>
               ) : (
                   <button 
                    onClick={onLoginClick}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#e6f2f7] hover:bg-blue-100 text-[#005687] text-xs font-bold transition-all"
                   >
                       <User className="w-4 h-4" />
                       <span className="hidden sm:inline">Sign In</span>
                   </button>
               )}
            </div>

          </div>
        </div>
      </div>
    );
  }

  // HERO MODE (Home Page)
  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 relative overflow-hidden bg-[#F8FAFC] transition-all duration-500 pt-16 md:pt-0">
        {/* Modern Background Mesh */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
             <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#e6f2f7] rounded-full blur-3xl opacity-80 mix-blend-multiply" />
             <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-3xl opacity-80 mix-blend-multiply" />
             <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] bg-white rounded-full blur-2xl opacity-60" />
        </div>

        {/* Hero Header */}
        <div className="absolute top-0 w-full p-4 flex justify-between items-center z-50 max-w-7xl mx-auto left-0 right-0">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#005687] rounded-lg flex items-center justify-center text-white">
                    <Bus className="w-5 h-5" />
                </div>
                <span className="font-black text-xl tracking-tighter text-[#005687]">Mishwari</span>
            </div>
            <div>
               {isLoggedIn ? (
                   <button onClick={onLogoutClick} className="h-9 w-9 bg-[#005687] rounded-full flex items-center justify-center text-white text-xs font-bold ring-4 ring-white shadow-lg hover:bg-[#004a73] transition-colors">
                     MK
                   </button>
               ) : (
                   <button 
                    onClick={onLoginClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-[#005687] text-sm font-bold shadow-sm border border-slate-100 transition-all"
                   >
                       <User className="w-4 h-4" />
                       <span>Sign In</span>
                   </button>
               )}
            </div>
        </div>

      <div className="w-full max-w-4xl z-10 space-y-8 animate-in fade-in zoom-in duration-500 mt-8">
        <div className="text-center space-y-4">
          {detectedCity && (
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#e6f2f7] shadow-sm px-4 py-1.5 rounded-full text-[#005687] text-xs font-bold mb-2 animate-in fade-in slide-in-from-top-4 duration-700">
                <MapPinIcon className="w-3 h-3" />
                <span>Detected near <span className="underline">{detectedCity}</span></span>
            </div>
          )}
          <h1 className="text-4xl md:text-7xl font-black text-[#042f40] tracking-tight leading-tight">
            Next Stop, <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005687] to-[#0088cc]">Anywhere.</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
            The easiest way to book bus tickets across Egypt. No queues, instant confirmation.
          </p>
        </div>

        {/* SEARCH CARD */}
        <div className="bg-white/70 backdrop-blur-xl p-2 rounded-[2rem] shadow-2xl shadow-blue-900/5 border border-white">
          <form onSubmit={handleSubmit} className="bg-white rounded-[1.5rem] p-4 flex flex-col md:flex-row gap-2 border border-slate-100">
            
            {/* From */}
            <div className="flex-1 relative group bg-slate-50 hover:bg-[#F0F7FA] rounded-xl transition-colors p-3 cursor-pointer">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">From</label>
              <div className="flex items-center gap-3">
                <MapPin className="text-[#005687] w-5 h-5 shrink-0" />
                <select 
                  className="bg-transparent w-full text-base font-bold text-[#042f40] outline-none appearance-none cursor-pointer p-0"
                  value={localParams.from}
                  onChange={(e) => setLocalParams({...localParams, from: e.target.value})}
                >
                  {CITIES.map(city => <option key={city.id} value={city.name}>{city.name}</option>)}
                </select>
              </div>
            </div>

            {/* Swap */}
            <div className="flex items-center justify-center -my-3 md:my-0 z-10">
                <button 
                  type="button" 
                  onClick={swapCities}
                  className="p-2 bg-white border border-slate-100 shadow-sm rounded-full text-slate-400 hover:text-[#005687] hover:border-blue-200 transition-colors rotate-90 md:rotate-0"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
            </div>

            {/* To */}
            <div className="flex-1 relative group bg-slate-50 hover:bg-[#F0F7FA] rounded-xl transition-colors p-3 cursor-pointer">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">To</label>
              <div className="flex items-center gap-3">
                <MapPin className="text-[#005687] w-5 h-5 shrink-0" />
                <select 
                  className="bg-transparent w-full text-base font-bold text-[#042f40] outline-none appearance-none cursor-pointer p-0"
                  value={localParams.to}
                  onChange={(e) => setLocalParams({...localParams, to: e.target.value})}
                >
                  {CITIES.filter(c => c.name !== localParams.from).map(city => <option key={city.id} value={city.name}>{city.name}</option>)}
                </select>
              </div>
            </div>

            {/* Date & Passenger (Split) */}
            <div className="flex-[1.2] flex gap-2">
                <div className="flex-1 bg-slate-50 hover:bg-[#F0F7FA] rounded-xl transition-colors p-3 cursor-pointer">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">When</label>
                    <div className="flex items-center gap-2">
                        <Calendar className="text-[#005687] w-5 h-5 shrink-0" />
                        <span className="text-base font-bold text-[#042f40]">Today</span>
                    </div>
                </div>
                <div className="w-[80px] bg-slate-50 hover:bg-[#F0F7FA] rounded-xl transition-colors p-3 cursor-pointer">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Guests</label>
                     <div className="flex items-center gap-1">
                        <Users className="text-[#005687] w-4 h-4 shrink-0" />
                        <span className="text-base font-bold text-[#042f40]">1</span>
                    </div>
                </div>
            </div>

            {/* Search Button */}
            <div className="md:w-auto">
                <button type="submit" className="w-full h-full min-h-[56px] px-8 bg-[#005687] hover:bg-[#004a73] text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-2 group">
                    <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="md:hidden">Search Trips</span>
                </button>
            </div>
          </form>

          {/* RECENT SEARCHES - PILLS */}
          <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide px-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide shrink-0">Recent:</div>
                {RECENT_SEARCHES.map((search, idx) => (
                    <button key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 hover:bg-white border border-transparent hover:border-blue-100 text-slate-600 hover:text-[#005687] text-xs font-bold whitespace-nowrap transition-colors shadow-sm">
                        <span>{search.from}</span>
                        <ArrowRight className="w-3 h-3 text-slate-300" />
                        <span>{search.to}</span>
                    </button>
                ))}
           </div>
        </div>
      </div>
    </div>
  );
};

// 1.5 Home Page Content
const HomeContent = ({ currentOrigin }) => {
    const getPrice = (destName) => {
        const prices = PRICING_MATRIX[destName];
        if (prices && prices[currentOrigin]) {
            return prices[currentOrigin];
        }
        return '200';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 pb-20 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            {/* POPULAR DESTINATIONS */}
            <section>
                <div className="flex items-center justify-between mb-6">
                   <div>
                     <h2 className="text-2xl font-black text-[#042f40]">Popular Routes</h2>
                     <p className="text-slate-500 text-sm">Best deals from <strong className="text-[#005687]">{currentOrigin}</strong></p>
                   </div>
                   <button className="h-10 w-10 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50 transition-colors">
                      <ArrowRight className="w-5 h-5 text-[#005687]" />
                   </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {POPULAR_DESTINATIONS
                        .filter(dest => dest.name !== currentOrigin) 
                        .map((dest, idx) => (
                       <div key={idx} className={`relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300 ${dest.image}`}>
                          <div className="absolute inset-0 bg-gradient-to-t from-[#042f40] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                          <div className="absolute top-3 right-3 bg-white/30 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20">
                              <Heart className="w-4 h-4 text-white" />
                          </div>
                          <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                             <h3 className="font-bold text-lg leading-tight mb-1">{dest.name}</h3>
                             <div className="flex items-center justify-between mt-2">
                                 <span className="text-xs font-medium text-white/80">Starts from</span>
                                 <span className="font-bold text-lg">{getPrice(dest.name)} <span className="text-xs">EGP</span></span>
                             </div>
                          </div>
                       </div>
                   ))}
                </div>
            </section>

            {/* TRUST INDICATORS */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                   { icon: ShieldCheck, title: "Secure Payment", desc: "Bank-grade security for all transactions" },
                   { icon: Zap, title: "Instant Booking", desc: "Tickets sent directly to your phone" },
                   { icon: Bus, title: "Trusted Partners", desc: "Official partner of major bus lines" }
               ].map((item, idx) => (
                   <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-start gap-4 hover:border-blue-100 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-[#e6f2f7] flex items-center justify-center text-[#005687] shrink-0">
                         <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                         <h4 className="font-bold text-[#042f40] mb-1">{item.title}</h4>
                         <p className="text-sm text-slate-500 leading-snug">{item.desc}</p>
                      </div>
                   </div>
               ))}
            </section>
        </div>
    )
}

// 2. Filter Panel
const FilterPanel = ({ isMobile }) => {
  return (
    <div className={`space-y-8 ${isMobile ? 'pb-24' : ''}`}>
      <div>
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#042f40] text-sm uppercase tracking-wide">Price Range</h3>
            <span className="text-xs font-bold text-[#005687]">50 - 500 EGP</span>
        </div>
        <div className="px-1">
          <input type="range" className="w-full accent-[#005687] h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
        </div>
      </div>
      
      <div>
        <h3 className="font-bold text-[#042f40] mb-3 text-sm uppercase tracking-wide">Class</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Economy', 'Deluxe', 'Elite', 'VIP'].map(type => (
            <label key={type} className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-blue-200 cursor-pointer bg-slate-50 hover:bg-white transition-all">
              <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                {type === 'Deluxe' && <div className="w-2.5 h-2.5 bg-[#005687] rounded-full" />}
              </div>
              <span className="text-xs font-bold text-slate-600">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-[#042f40] mb-3 text-sm uppercase tracking-wide">Departure</h3>
        <div className="space-y-2">
            {[
                { label: 'Morning', time: '06:00 - 12:00' },
                { label: 'Afternoon', time: '12:00 - 18:00' },
                { label: 'Evening', time: '18:00 - 00:00' },
            ].map((slot, i) => (
                <button key={i} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-100 text-xs font-medium text-slate-600 hover:border-blue-200 hover:bg-blue-50 transition-all text-left">
                    <span className="font-bold">{slot.label}</span>
                    <span className="text-slate-400">{slot.time}</span>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

// 3. STREAMLINED TRIP CARD (Integrated Layout)
const TripCard = ({ trip }) => {
  // Helper for dynamic rating colors
  const getRatingColor = (score) => {
      if (score >= 4.0) {
          return {
              bg: 'bg-green-50',
              text: 'text-green-700',
              border: 'border-green-100',
              iconFill: 'fill-green-600',
              iconColor: 'text-green-600'
          };
      }
      return {
          bg: 'bg-[#FFFBEB]',
          text: 'text-[#B45309]',
          border: 'border-[#FEF3C7]',
          iconFill: 'fill-[#B45309]',
          iconColor: 'text-[#B45309]'
      };
  };

  const ratingStyle = getRatingColor(trip.rating);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300 cursor-pointer group relative overflow-hidden p-5">
      
      {/* Side Color Strip */}
      <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-1 bg-[#005687] opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Top Row: Info + Price */}
      <div className="flex justify-between items-start mb-5">
          {/* Operator Info */}
          <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-[#005687] font-bold text-sm border border-slate-100">
                  {trip.operator.substring(0, 2).toUpperCase()}
              </div>
              <div>
                  <h3 className="font-bold text-[#042f40] text-lg leading-tight">{trip.operator}</h3>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-1">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{trip.type}</span>
                      <span className="text-slate-300">•</span>
                      <span>{trip.bus_number}</span>
                  </div>
              </div>
          </div>

          {/* Price (Top Right) */}
          <div className="text-right">
              <div className="text-xl font-black text-[#005687]">{trip.price} <span className="text-xs font-bold text-[#005687]/70">EGP</span></div>
              {trip.seats < 5 ? (
                  <div className="text-[10px] font-bold text-red-600 animate-pulse">Only {trip.seats} left</div>
              ) : (
                  <div className="text-[10px] font-bold text-green-600">Available</div>
              )}
          </div>
      </div>

      {/* Middle Row: Timeline */}
      <div className="flex items-center gap-4 sm:gap-8 mb-6">
          <div className="text-center min-w-[50px]">
              <div className="text-lg font-black text-[#042f40]">{trip.fromTime}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Dep</div>
          </div>

          <div className="flex-1 flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100 mb-1.5">
                  <Clock className="w-3 h-3" />
                  {trip.duration}
              </div>
              <div className="w-full h-px bg-slate-200 relative flex items-center justify-between">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <div className="flex-1 border-t border-dotted border-slate-300 mx-2" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              </div>
              <div className="text-[10px] font-medium text-slate-400 mt-1.5">{trip.route_name}</div>
          </div>

          <div className="text-center min-w-[50px]">
              <div className="text-lg font-black text-[#042f40]">{trip.toTime}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Arr</div>
          </div>
      </div>

      {/* Bottom Row: Amenities + Select Button */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          {/* Amenities & Rating */}
          <div className="flex items-center gap-3">
             <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md border shadow-sm ${ratingStyle.bg} ${ratingStyle.text} ${ratingStyle.border}`}>
                  <Star className={`w-3 h-3 ${ratingStyle.iconFill} ${ratingStyle.iconColor}`} />
                  <span className="text-[10px] font-bold">{trip.rating}</span>
              </div>
             <div className="hidden sm:flex gap-2">
                 {trip.features.slice(0, 3).map(f => (
                     <span key={f} className="text-[10px] font-bold text-slate-400" title={f}>
                         {FEATURE_ICONS[f]}
                     </span>
                 ))}
             </div>
          </div>

          {/* Compact Action Button */}
          <button className="flex items-center gap-2 px-5 py-2 bg-[#005687] hover:bg-[#004a73] text-white font-bold rounded-lg shadow-md shadow-blue-900/10 active:scale-95 transition-all text-xs sm:text-sm">
              <span>Select</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
      </div>

    </div>
  );
};

// 4. TripSkeleton (Same as before)
const TripSkeleton = () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-pulse">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200" />
                    <div className="space-y-2">
                        <div className="h-4 w-24 bg-slate-200 rounded" />
                        <div className="h-3 w-16 bg-slate-100 rounded" />
                    </div>
                </div>
                <div className="flex items-center gap-8 pl-1">
                    <div className="h-8 w-12 bg-slate-200 rounded" />
                    <div className="flex-1 h-2 bg-slate-100 rounded" />
                    <div className="h-8 w-12 bg-slate-200 rounded" />
                </div>
            </div>
            <div className="min-w-[140px] space-y-3 pt-2">
                <div className="h-8 w-20 bg-slate-200 rounded ml-auto" />
                <div className="h-10 w-full bg-slate-200 rounded-xl" />
            </div>
        </div>
    </div>
);

// 5. EmptyState (Same as before)
const EmptyState = ({ onReset }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-24 h-24 bg-[#F3F4F6] rounded-full flex items-center justify-center mb-6 text-slate-400">
            <Bus className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-[#042f40] mb-2">No buses found</h3>
        <p className="text-slate-500 max-w-sm mb-8">
            We couldn't find any trips for this route on the selected date. Try changing the date or filters.
        </p>
        <button 
            onClick={onReset}
            className="px-6 py-3 bg-white border border-slate-200 text-[#042f40] font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors"
        >
            Clear Filters
        </button>
    </div>
);

// 6. Login Modal
const AuthModal = ({ isOpen, onClose, onLogin }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#042f40]/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative animate-in zoom-in-95 duration-200 shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-slate-400" />
                </button>

                <div className="text-center mb-8 mt-2">
                    <div className="w-14 h-14 bg-[#e6f2f7] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#005687] shadow-sm">
                        <LogIn className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-black text-[#042f40]">Welcome Back</h2>
                    <p className="text-slate-500 text-sm mt-1">Log in to access your tickets & offers</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                        <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-[#005687] focus-within:ring-4 focus-within:ring-[#e6f2f7] transition-all">
                            <Mail className="w-5 h-5 text-slate-400" />
                            <input type="email" placeholder="name@example.com" className="bg-transparent w-full text-sm font-bold outline-none text-[#042f40] placeholder:font-normal" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
                        <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-[#005687] focus-within:ring-4 focus-within:ring-[#e6f2f7] transition-all">
                            <Lock className="w-5 h-5 text-slate-400" />
                            <input type="password" placeholder="••••••••" className="bg-transparent w-full text-sm font-bold outline-none text-[#042f40] placeholder:font-normal" />
                        </div>
                    </div>

                    <button 
                        onClick={() => { onLogin(); onClose(); }}
                        className="w-full py-4 bg-[#005687] hover:bg-[#004a73] text-white font-bold rounded-xl shadow-xl shadow-blue-900/20 active:scale-95 transition-all text-base mt-2"
                    >
                        Sign In
                    </button>
                    
                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-wider"><span className="bg-white px-2 text-slate-400 font-bold">Or continue with</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                         <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-sm text-[#042f40] transition-colors">
                             Google
                         </button>
                         <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-sm text-[#042f40] transition-colors">
                             Facebook
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP ---

export default function App() {
  const [viewState, setViewState] = useState('home'); 
  const [searchParams, setSearchParams] = useState({ from: 'Cairo', to: 'Alexandria', date: 'Today', passengers: 1 });
  const [loading, setLoading] = useState(false);
  const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [trips, setTrips] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [detectedCity, setDetectedCity] = useState(null);

  useEffect(() => {
    if (RECENT_SEARCHES.length > 0) {
        setDetectedCity(RECENT_SEARCHES[0].from);
        setSearchParams(prev => ({ ...prev, from: RECENT_SEARCHES[0].from }));
        return;
    }
    const mockIPCheck = setTimeout(() => {
        const simulatedCity = 'Alexandria'; 
        setDetectedCity(simulatedCity);
        setSearchParams(prev => ({ ...prev, from: simulatedCity }));
    }, 1500);
    return () => clearTimeout(mockIPCheck);
  }, []);

  const handleSearch = () => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setViewState('results');
      setTrips(MOCK_TRIPS);
      setLoading(false);
    }, 800); 
  };

  const handleReset = () => {
      setViewState('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const minPrice = trips.length > 0 ? Math.min(...trips.map(t => t.price)) : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#042f40] pb-20 md:pb-0">
      
      <UnifiedSearchHeader 
        isResultsMode={viewState === 'results'} 
        onSearch={handleSearch}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        onReset={handleReset}
        detectedCity={detectedCity}
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setAuthModalOpen(true)}
        onLogoutClick={() => setIsLoggedIn(false)}
      />

      {viewState === 'home' && <HomeContent currentOrigin={searchParams.from} />}

      <main className={`transition-opacity duration-500 ${viewState === 'results' ? 'opacity-100' : 'opacity-0 hidden'}`}>
        {viewState === 'results' && (
          <div className="max-w-6xl mx-auto px-4 py-6">
            
            {/* Info Bar */}
            <div className="flex items-center justify-between mb-4 sticky top-[64px] z-40 bg-[#F8FAFC] py-3 transition-all">
               <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-[#042f40]">{loading ? '...' : trips.length}</span>
                  <span className="text-sm font-medium text-slate-500">trips found</span>
                  {!loading && trips.length > 0 && (
                      <span className="hidden sm:inline-block text-xs font-bold text-[#005687] bg-[#e6f2f7] px-2 py-0.5 rounded-md ml-2 border border-blue-100">
                          Lowest Price: {minPrice} EGP
                      </span>
                  )}
               </div>
               
               <div className="flex gap-2">
                   <button 
                     className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-sm text-[#005687]"
                     onClick={() => setMobileFilterOpen(true)}
                   >
                       <Filter className="w-3 h-3" />
                       Filters
                   </button>

                   <div className="hidden md:flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                       <button className="px-4 py-1.5 bg-[#005687] text-white rounded-lg text-xs font-bold shadow-sm">Recommended</button>
                       <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-[#e6f2f7] transition-colors">Cheapest</button>
                       <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-[#e6f2f7] transition-colors">Fastest</button>
                   </div>
               </div>
            </div>

            <div className="flex gap-8 items-start">
              
              <aside className="hidden md:block w-72 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sticky top-[130px] h-fit">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="font-black text-lg text-[#042f40]">Filters</h2>
                    <button className="text-xs text-[#005687] font-bold hover:underline">Reset All</button>
                 </div>
                 <FilterPanel />
              </aside>

              <div className="flex-1 space-y-4">
                {loading ? (
                    <>
                        <TripSkeleton />
                        <TripSkeleton />
                        <TripSkeleton />
                    </>
                ) : trips.length > 0 ? (
                    trips.map((trip, idx) => (
                        <div key={trip.id} className="animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                            <TripCard trip={trip} />
                        </div>
                    ))
                ) : (
                    <EmptyState onReset={handleReset} />
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Filter Drawer */}
      {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
              <div className="absolute inset-0 bg-[#042f40]/40 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
              <div className="bg-white w-full rounded-t-[2rem] p-6 relative animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto shadow-2xl">
                  <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
                  <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-black text-[#042f40]">Filters</h2>
                      <button onClick={() => setMobileFilterOpen(false)} className="p-2 bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  <FilterPanel isMobile={true} />
                  <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-slate-100 mt-4">
                      <button 
                        onClick={() => setMobileFilterOpen(false)}
                        className="w-full bg-[#005687] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/10 active:scale-95 transition-all"
                      >
                          Show {trips.length} Results
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onLogin={() => setIsLoggedIn(true)}
      />

    </div>
  );
}