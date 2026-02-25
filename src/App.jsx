import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  Search, MapPin, Bed, Phone, Star, Shield, Filter, Cross, Activity,
  User, Heart, ChevronRight, Menu, LogIn, UserPlus, Building2,
  LayoutDashboard, LogOut, Settings, Clock, CheckCircle2, AlertCircle,
  Stethoscope, Users, IndianRupee, Map as MapIcon, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Theme Utilities ---
const cardClasses = "bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-emerald-900/5 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500";

// --- Mock Data ---
const HOSPITALS = [
  {
    id: 1,
    name: "City General Hospital",
    location: "Indiranagar, Bangalore",
    distance: "0.8 km",
    rating: 4.8,
    reviews: 1240,
    pricePerDay: 4500,
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=800",
    wards: [
      { name: "ICU Ward", beds: Array.from({ length: 10 }, (_, i) => ({ id: `ICU-${i + 1}`, type: 'ICU', status: i < 8 ? 'occupied' : 'available' })) },
      { name: "General Ward", beds: Array.from({ length: 30 }, (_, i) => ({ id: `GEN-${i + 1}`, type: 'General', status: i < 20 ? 'occupied' : 'available' })) }
    ]
  },
  {
    id: 2,
    name: "Astra Care & Research",
    location: "HSR Layout, Bangalore",
    distance: "2.4 km",
    rating: 4.6,
    reviews: 890,
    pricePerDay: 5800,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
    wards: [
      { name: "Cardiac ICU", beds: Array.from({ length: 8 }, (_, i) => ({ id: `CICU-${i + 1}`, type: 'ICU', status: i < 5 ? 'occupied' : 'available' })) },
      { name: "Premium Suites", beds: Array.from({ length: 12 }, (_, i) => ({ id: `VIP-${i + 1}`, type: 'VIP', status: i < 8 ? 'occupied' : 'available' })) }
    ]
  }
];

const RECENT_BOOKINGS = [
  { id: 1, patient: "Rahul S.", hospital: "City General", bed: "ICU-12", time: "2m ago", status: "confirmed" },
  { id: 2, patient: "Anjali M.", hospital: "Astra Care", bed: "VIP-04", time: "15m ago", status: "pending" },
  { id: 3, patient: "Vikas K.", hospital: "City General", bed: "GEN-08", time: "1h ago", status: "confirmed" }
];

// --- Components ---

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-emerald-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <Cross className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter italic">MedStay</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-black text-sm text-slate-500">
          {!user ? (
            <>
              <Link to="/auth?mode=login" className="hover:text-primary transition-colors">Login</Link>
              <Link to="/auth?mode=register" className="bg-primary text-white px-8 py-3 rounded-2xl shadow-xl shadow-primary/10 hover:bg-primary-dark transition-all transform hover:scale-105">Join Us</Link>
            </>
          ) : (
            <>
              <Link to={user.role === 'hospital' ? '/hospital' : user.role === 'admin' ? '/admin' : '/patient'} className="hover:text-primary transition-colors">Dashboard</Link>
              <div className="h-6 w-px bg-slate-100" />
              <div className="flex items-center gap-3 bg-emerald-50/50 px-4 py-2 rounded-2xl border border-emerald-100">
                <div className="w-8 h-8 bg-white border border-emerald-200 rounded-full flex items-center justify-center text-primary text-xs font-black">{user.name[0]}</div>
                <span className="text-slate-800">{user.name}</span>
                <button onClick={() => { setUser(null); navigate('/'); }} className="text-slate-300 hover:text-red-500 transition-colors ml-2 cursor-pointer">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const BedLayout = ({ wards, onSelect }) => {
  return (
    <div className="space-y-12">
      {wards.map((ward, wIdx) => (
        <div key={wIdx}>
          <div className="flex items-center gap-4 mb-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{ward.name}</h4>
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-xs font-black text-primary bg-primary-light px-4 py-1.5 rounded-full">{ward.beds.filter(b => b.status === 'available').length} FREE</span>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
            {ward.beds.map((bed, bIdx) => (
              <motion.button
                key={bIdx}
                whileHover={bed.status === 'available' ? { scale: 1.1, y: -2 } : {}}
                whileTap={bed.status === 'available' ? { scale: 0.95 } : {}}
                onClick={() => bed.status === 'available' && onSelect(bed)}
                className={`aspect-square rounded-2xl flex items-center justify-center text-xs font-black transition-all border-2 ${bed.status === 'occupied'
                  ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                  : bed.type === 'ICU'
                    ? 'bg-emerald-50 border-emerald-100 text-primary shadow-sm hover:border-primary'
                    : bed.type === 'VIP'
                      ? 'bg-orange-50 border-orange-100 text-orange-600'
                      : 'bg-white border-emerald-200 text-primary hover:bg-primary-light hover:border-primary shadow-lg shadow-emerald-900/5 cursor-pointer'
                  }`}
              >
                {bed.id.split('-')[1]}
              </motion.button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Pages ---

const Landing = () => (
  <div className="min-h-[calc(100vh-80px)] bg-white flex flex-col justify-center items-center px-4 relative overflow-hidden text-center">
    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-light/50 blur-[150px] -z-10 rounded-full opacity-50" />
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-100/50 text-primary-dark px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-10 border border-emerald-100">
      #1 Choice for Patient Care
    </motion.div>
    <h1 className="text-6xl md:text-[8rem] font-black text-slate-900 leading-[0.9] mb-12 tracking-tighter">
      Healthcare <br />
      <span className="text-primary">Simplified.</span>
    </h1>
    <p className="max-w-xl text-slate-500 font-bold text-lg mb-16 leading-relaxed">
      Search hospital beds, ICU availability and OPD slots with absolute ease. Built for speed, trust and care.
    </p>
    <div className="flex flex-col md:flex-row gap-6">
      <Link to="/auth?role=patient" className="px-14 py-7 bg-primary text-white rounded-[32px] font-black text-xl shadow-2xl shadow-primary/30 hover:bg-primary-dark transform hover:scale-105 transition-all">
        Book for Patient
      </Link>
      <Link to="/auth?role=hospital" className="px-14 py-7 bg-white text-primary border-2 border-primary/20 rounded-[32px] font-black text-xl shadow-xl hover:bg-primary-light transition-all">
        Register Hospital
      </Link>
    </div>
  </div>
);

const AuthPage = ({ setUser }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialRole = searchParams.get('role') || 'patient';
  const mode = searchParams.get('mode') || 'login';

  const [role, setRole] = useState(initialRole);
  const [isLogin, setIsLogin] = useState(mode === 'login');

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({
      name: role === 'admin' ? "Super Admin" : role === 'hospital' ? "Pista Care Admin" : "Rahul Sharma",
      role: role
    });
    navigate(role === 'admin' ? '/admin' : role === 'hospital' ? '/hospital' : '/patient');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-primary-light flex items-center justify-center p-4 py-20">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white p-12 rounded-[56px] shadow-2xl shadow-emerald-900/10 border border-emerald-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-slate-900 mb-2">{isLogin ? "Welcome Back" : "Register Now"}</h2>
          <p className="text-primary font-black uppercase text-[10px] tracking-[0.3em]">{role} ACCESS CARD</p>
        </div>

        <div className="flex p-1.5 bg-emerald-50 rounded-3xl mb-10 border border-emerald-100">
          {['patient', 'hospital', 'admin'].map(r => (
            <button key={r} onClick={() => setRole(r)} className={`flex-1 py-4 rounded-2xl text-xs font-black capitalize transition-all cursor-pointer ${role === r ? 'bg-white text-primary shadow-xl border border-emerald-50' : 'text-slate-400 hover:text-primary'}`}>
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-2">Registered Email</label>
            <input type="email" required placeholder={`${role}@medstay.com`} className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-5 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary font-black transition-all" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-2">Secure Pin</label>
            <input type="password" required placeholder="••••••••" className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-5 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary font-black transition-all" />
          </div>
          <button className="w-full bg-primary text-white py-6 rounded-[32px] font-black text-xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-95 cursor-pointer">
            {isLogin ? "Confirm Login" : `Join as ${role}`}
          </button>
        </form>

        <div className="mt-10 p-8 bg-primary-light/50 rounded-[40px] border border-emerald-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 blur-2xl rounded-full" />
          <p className="text-[10px] font-black text-primary-dark uppercase tracking-widest mb-4">Quick Access Mode</p>
          <div className="space-y-2 text-sm font-black text-slate-700">
            <p className="flex justify-between"><span>ID:</span> <span className="text-primary italic">{role}@medstay.com</span></p>
            <p className="flex justify-between"><span>KEY:</span> <span className="text-primary italic">demo123</span></p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-black text-slate-400 hover:text-primary transition-colors cursor-pointer underline underline-offset-8">
            {isLogin ? `New to MedStay? Create ${role} account` : "Already registered? Sign In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const PatientPortal = () => {
  const navigate = useNavigate();
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [locationName, setLocationName] = useState("Indiranagar, Bangalore");
  const [isChangingLocation, setIsChangingLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Simplified: In a real app, we'd use reverse geocoding here
        setLocationName("Detected: Bangalore Central");
        alert("Location updated based on your browser coordinates!");
      }, () => {
        alert("Location permission denied. Please enter manually.");
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-24">
        <div className="max-w-2xl">
          <div className="bg-primary-light text-primary-dark px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] mb-6 w-fit border border-emerald-100">
            <MapIcon className="w-4 h-4 inline mr-2" /> Live Location Tracking
          </div>
          <h2 className="text-6xl font-black text-slate-900 leading-[1.1]">Showing <span className="text-primary">available beds</span> <br /> in {locationName.split(',')[0]}.</h2>
        </div>

        <div className="flex flex-col items-end gap-4 w-full md:w-auto">
          <div className="flex bg-slate-50 p-2 rounded-[32px] border border-slate-100 shadow-2xl w-full">
            <div className="flex items-center gap-5 px-8 py-4 border-r border-slate-200">
              <MapPin className="text-primary w-6 h-6" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Radius</p>
                <p className="font-black text-slate-900 text-lg">{locationName}</p>
              </div>
            </div>
            <button
              onClick={() => setIsChangingLocation(true)}
              className="px-10 font-black text-primary hover:bg-white rounded-[24px] transition-all cursor-pointer whitespace-nowrap"
            >
              Change
            </button>
          </div>
          <button onClick={detectLocation} className="text-[10px] font-black text-primary-dark uppercase tracking-widest hover:underline cursor-pointer">
            ⚡ Use My Current Location
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isChangingLocation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-10 rounded-[48px] shadow-2xl w-full max-w-md">
              <h3 className="text-2xl font-black mb-6">Enter Your Area</h3>
              <input
                autoFocus
                type="text"
                placeholder="e.g. HSR Layout, Mumbai..."
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 text-xl font-bold outline-none focus:border-primary mb-6"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setLocationName(e.target.value);
                    setIsChangingLocation(false);
                  }
                }}
              />
              <div className="flex gap-4">
                <button onClick={() => setIsChangingLocation(false)} className="flex-1 py-4 font-black text-slate-400 hover:text-slate-600">Cancel</button>
                <button onClick={() => {
                  const val = document.querySelector('input').value;
                  if (val) setLocationName(val);
                  setIsChangingLocation(false);
                }} className="flex-1 bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/20">Update</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {HOSPITALS.map(h => (
          <motion.div whileHover={{ y: -10 }} key={h.id} className="bg-white rounded-[56px] border border-emerald-50 shadow-2xl shadow-emerald-900/5 overflow-hidden flex flex-col group hover:border-primary/20">
            <div className="h-72 relative overflow-hidden">
              <img src={h.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={h.name} />
              <div className="absolute top-8 left-8 bg-white/95 backdrop-blur-xl px-4 py-2 rounded-2xl text-[10px] font-black flex items-center gap-2 shadow-2xl">
                <Star className="w-4 h-4 text-orange-400 fill-orange-400" /> {h.rating} ({h.reviews})
              </div>
              <div className="absolute bottom-8 right-8 bg-primary text-white px-6 py-2 rounded-2xl text-xs font-black shadow-xl">
                {h.distance}
              </div>
            </div>
            <div className="p-10 flex-1 flex flex-col">
              <h3 className="text-3xl font-black text-slate-900 mb-2">{h.name}</h3>
              <div className="flex items-center gap-2 text-slate-400 mb-8">
                <MapPin className="w-4 h-4" />
                <span className="font-bold text-sm">{h.location}</span>
              </div>
              <div className="grid grid-cols-2 gap-5 mb-10">
                <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Price Estimate</p>
                  <p className="text-xl font-black text-slate-900">₹{h.pricePerDay}<span className="text-xs text-slate-400">/d</span></p>
                </div>
                <div className="p-6 bg-emerald-50 rounded-[32px] border border-emerald-100">
                  <p className="text-[10px] font-black text-primary-dark uppercase tracking-widest mb-2">Inventory</p>
                  <p className="text-xl font-black text-primary">{h.wards.reduce((acc, w) => acc + w.beds.filter(b => b.status === "available").length, 0)} Open</p>
                </div>
              </div>
              <button onClick={() => setSelectedHospital(h)} className="mt-auto w-full bg-slate-900 text-white py-5 rounded-[24px] font-black shadow-xl shadow-slate-900/10 hover:bg-primary transition-all cursor-pointer">
                Select My Bed
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedHospital && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} className="bg-white w-full max-w-5xl rounded-[64px] shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh]">
              <button onClick={() => setSelectedHospital(null)} className="absolute top-10 right-10 p-4 bg-slate-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer z-10 shadow-sm border border-slate-100">
                <X className="w-6 h-6" />
              </button>
              <div className="p-16 overflow-y-auto no-scrollbar">
                <div className="mb-16">
                  <div className="bg-primary-light text-primary-dark px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-6">Interactive Ward Map</div>
                  <h2 className="text-5xl font-black text-slate-900 mb-4">{selectedHospital.name}</h2>
                  <div className="flex gap-8 text-slate-400 font-bold">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-white border-2 border-primary rounded-full" /> Regular Bed</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-50 border-2 border-emerald-200 rounded-full" /> ICU High Care</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-100 border-2 border-slate-200 rounded-full" /> Occupied</div>
                  </div>
                </div>
                <BedLayout wards={selectedHospital.wards} onSelect={(bed) => { alert(`Selected ${bed.id}. Redirecting to final check...`); setSelectedHospital(null); navigate('/auth?mode=register&role=patient'); }} />

                <div className="mt-16 bg-primary p-12 rounded-[56px] text-white flex flex-col md:flex-row justify-between items-center gap-10 shadow-2xl shadow-primary/20">
                  <div className="text-center md:text-left">
                    <h4 className="text-4xl font-black mb-4 tracking-tighter italic">Found your bed?</h4>
                    <p className="text-primary-light font-bold text-lg">Registration is 100% free. No advance needed for booking.</p>
                  </div>
                  <button
                    onClick={() => { setSelectedHospital(null); navigate('/auth?mode=register&role=patient'); }}
                    className="bg-white text-primary px-16 py-6 rounded-[32px] font-black text-xl shadow-2xl hover:bg-primary-light transform hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
                  >
                    REGISTER NOW
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HospitalPortal = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="bg-white rounded-[72px] border border-emerald-50 shadow-2xl shadow-emerald-500/5 p-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Stethoscope className="text-primary w-8 h-8" />
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">City General Hospital</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#4caf50]" />
              <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.4em]">LIVE INVENTORY FEED</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[40px] text-center min-w-[200px]">
              <p className="text-[10px] font-black text-primary tracking-[0.3em] uppercase mb-2">Today's Revenue</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">₹2,84,200</p>
            </div>
            <div className="bg-primary p-8 rounded-[40px] text-center text-white min-w-[180px] shadow-2xl shadow-primary/20">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Patient Rating</p>
              <p className="text-4xl font-black flex items-center justify-center gap-2">4.8 <Star className="w-6 h-6 fill-white" /></p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-20">
          <div className="space-y-16">
            <section>
              <h3 className="text-2xl font-black text-slate-900 mb-10 border-l-8 border-primary pl-6">Operations Panel</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-10 bg-slate-50 border border-slate-100 rounded-[48px] shadow-inner group">
                  <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-md mb-8 group-hover:bg-primary transition-colors">
                    <IndianRupee className="w-7 h-7 text-primary group-hover:text-white" />
                  </div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Base Bed Rate</label>
                  <input type="number" defaultValue={4500} className="w-full bg-white border-2 border-slate-100 rounded-[24px] px-8 py-5 text-3xl font-black focus:border-primary outline-none transition-all" />
                </div>
                <div className="p-10 bg-primary-light border border-emerald-100 rounded-[48px] shadow-inner">
                  <div className="bg-primary w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-8">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <label className="block text-[10px] font-black text-primary-dark uppercase tracking-widest mb-4">Active Patients</label>
                  <p className="text-6xl font-black text-primary tracking-tighter">32</p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-slate-900">Recent Arrivals</h3>
                <button className="text-xs font-black text-primary uppercase underline underline-offset-4 cursor-pointer">View All</button>
              </div>
              <div className="space-y-6">
                {RECENT_BOOKINGS.map(b => (
                  <div key={b.id} className="flex justify-between items-center p-8 bg-white border-2 border-slate-50 rounded-[32px] hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-900/5 transition-all cursor-pointer group">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-50 rounded-[20px] flex items-center justify-center font-black text-slate-300 text-2xl group-hover:bg-primary-light group-hover:text-primary transition-colors">{b.patient[0]}</div>
                      <div>
                        <p className="font-black text-xl text-slate-800">{b.patient}</p>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Reserved Bed {b.bed}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="bg-primary text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest block mb-2">{b.time}</span>
                      <p className="text-[10px] font-black text-emerald-500 uppercase">Confirmed</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="bg-slate-50 p-12 rounded-[72px] border border-slate-100 shadow-inner">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-3xl font-black text-slate-800 italic tracking-tight">Main Ward Manager</h3>
              <div className="flex gap-3">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <div className="w-3 h-3 bg-emerald-200 rounded-full" />
              </div>
            </div>
            <BedLayout wards={HOSPITALS[0].wards} onSelect={(bed) => alert(`Master, Bed ${bed.id} Status is being modified...`)} />
          </div>
        </div>
      </div>
    </div>
  );
};

const MasterAdmin = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="flex flex-col xl:flex-row justify-between items-end gap-16 mb-24">
        <div className="max-w-3xl">
          <div className="bg-primary px-5 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-[0.5em] mb-8 w-fit shadow-xl shadow-primary/20">System Intelligence Live</div>
          <h1 className="text-7xl md:text-9xl font-black text-slate-900 mb-6 tracking-tighter leading-[0.9]">Master <br /> Control <span className="text-primary italic">Node</span></h1>
          <p className="text-xl text-slate-400 font-bold max-w-xl">Deep monitoring across 42 hospitals and 1.8k active medical transactions across Bangalore region.</p>
        </div>
        <div className="grid grid-cols-2 gap-8 w-full xl:w-auto">
          <div className="p-10 bg-primary rounded-[48px] text-white shadow-2xl shadow-primary/30 flex flex-col justify-between min-h-[220px]">
            <div className="flex justify-between items-start">
              <Users className="w-10 h-10 opacity-30" />
              <Activity className="w-6 h-6 text-primary-light" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-2">Total Managed Beds</p>
              <p className="text-6xl font-black tracking-tighter">1,420</p>
            </div>
          </div>
          <div className="p-10 bg-white border border-slate-100 rounded-[48px] shadow-2xl shadow-emerald-900/5 flex flex-col justify-between min-h-[220px]">
            <div className="flex justify-between items-start text-emerald-500">
              <IndianRupee className="w-10 h-10 opacity-20" />
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Active Gross Vol.</p>
              <p className="text-6xl font-black text-slate-900 tracking-tighter">1.2M</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
        <div className="xl:col-span-2 space-y-16">
          {HOSPITALS.map(h => (
            <div key={h.id} className="bg-white rounded-[72px] p-12 border border-slate-100 shadow-2xl shadow-emerald-500/5 hover:border-primary/20 transition-all">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                <div className="flex items-center gap-6">
                  <div className="bg-slate-900 w-20 h-20 rounded-[32px] flex items-center justify-center text-white shadow-xl shadow-slate-900/20 transform rotate-6 hover:rotate-0 transition-transform"><Building2 className="w-10 h-10" /></div>
                  <div>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight italic">{h.name}</h3>
                    <p className="text-sm font-black text-slate-300 uppercase tracking-widest mt-1 flex items-center gap-2"><MapPin className="w-3 h-3" /> {h.location}</p>
                  </div>
                </div>
                <button className="text-primary font-black text-sm px-10 py-5 bg-primary-light rounded-[24px] hover:bg-primary hover:text-white transition-all shadow-md cursor-pointer border border-emerald-50">AUDIT LIVE GRID</button>
              </div>
              <BedLayout wards={h.wards} onSelect={(bed) => alert(`Master Override Triggered for Bed ${bed.id}`)} />
            </div>
          ))}
        </div>

        <div className="space-y-12">
          <div className="bg-white p-12 rounded-[64px] border border-slate-100 shadow-2xl shadow-emerald-900/5 sticky top-28">
            <h3 className="text-2xl font-black mb-10 border-b-4 border-primary-light pb-4 flex items-center gap-3 italic"><Users className="w-7 h-7 text-primary" /> Network Pulse</h3>
            <div className="space-y-12">
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-5 tracking-widest"><span>Real-time Admissions</span> <span className="text-primary font-black">+14% Growth</span></div>
                <div className="h-4 bg-slate-50 rounded-full overflow-hidden flex border border-slate-100 p-0.5">
                  <motion.div initial={{ width: 0 }} animate={{ width: "82%" }} transition={{ duration: 2, ease: "easeOut" }} className="bg-primary h-full rounded-full shadow-[0_0_15px_#4caf50]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-8 bg-slate-50 rounded-[40px] text-center border border-slate-100">
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">42</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Active Nodes</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-[40px] text-center border border-slate-100">
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">1.8k+</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Active Users</p>
                </div>
              </div>
              <button className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-lg hover:bg-primary shadow-xl shadow-slate-900/10 transition-all cursor-pointer">
                System Health Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- App Root ---

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [user]);

  return (
    <Router>
      <div className="min-h-screen font-sans bg-white selection:bg-primary-light selection:text-primary-dark">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<AuthPage setUser={setUser} />} />
          <Route path="/patient" element={user?.role === 'patient' ? <PatientPortal /> : <Navigate to="/auth?role=patient" />} />
          <Route path="/hospital" element={user?.role === 'hospital' ? <HospitalPortal /> : <Navigate to="/auth?role=hospital" />} />
          <Route path="/admin" element={user?.role === 'admin' ? <MasterAdmin /> : <Navigate to="/auth?role=admin" />} />
        </Routes>

        {/* Footer */}
        <footer className="bg-slate-50 border-t border-slate-100 py-32 mt-40 rounded-t-[100px]">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-24">
            <div className="col-span-1">
              <div className="flex items-center gap-3 mb-10 group">
                <div className="bg-primary p-2.5 rounded-2xl shadow-xl shadow-primary/20 group-hover:rotate-12 transition-transform">
                  <Cross className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-slate-900 tracking-tighter italic">MedStay</span>
              </div>
              <p className="text-slate-400 font-bold leading-relaxed mb-10 text-lg">India's premium hospital inventory network. 100% Transparency. 0% Hidden Charges.</p>
              <div className="flex gap-6">
                <button className="p-4 bg-white border border-slate-100 rounded-2xl hover:text-primary transition-colors cursor-pointer shadow-sm"><Phone className="w-6 h-6" /></button>
                <button className="p-4 bg-white border border-slate-100 rounded-2xl hover:text-primary transition-colors cursor-pointer shadow-sm"><Heart className="w-6 h-6" /></button>
              </div>
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-xs uppercase tracking-[0.4em] mb-12">System Quicklinks</h4>
              <ul className="space-y-6 text-slate-500 font-black text-sm uppercase tracking-widest">
                <li><button className="hover:text-primary transition-colors cursor-pointer">Live Help 24/7</button></li>
                <li><button className="hover:text-primary transition-colors cursor-pointer">Vercel Auto-Sync</button></li>
                <li><button className="hover:text-primary transition-colors cursor-pointer">Partner With Us</button></li>
                <li><button className="hover:text-primary transition-colors cursor-pointer">Legal Documentation</button></li>
              </ul>
            </div>
            <div className="bg-slate-900 rounded-[64px] p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-[100px] rounded-full" />
              <h4 className="text-2xl font-black mb-6 italic tracking-tight">Need Urgent Help?</h4>
              <p className="text-slate-400 font-bold mb-10 text-sm leading-relaxed">Our dedicated patient support desk is available 24/7 for manual bed assistance.</p>
              <button className="w-full bg-primary py-6 rounded-3xl font-black shadow-xl shadow-primary/20 active:scale-95 transition-all text-sm uppercase tracking-[0.2em] cursor-pointer hover:bg-primary-dark">
                CALL +91 800 MED STAY
              </button>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 pt-20 mt-20 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
            <span>© 2026 MedStay Technologies Private Limited</span>
            <div className="flex gap-12">
              <button className="hover:text-primary transition-colors cursor-pointer">Twitter</button>
              <button className="hover:text-primary transition-colors cursor-pointer">Instagram</button>
              <button className="hover:text-primary transition-colors cursor-pointer">LinkedIn</button>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
