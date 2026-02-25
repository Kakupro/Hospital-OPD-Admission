import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  Search, MapPin, Bed, Phone, Star, Shield, Filter, Cross, Activity,
  User, Heart, ChevronRight, Menu, LogIn, UserPlus, Building2,
  LayoutDashboard, LogOut, Settings, Clock, CheckCircle2, AlertCircle,
  Stethoscope, Users, IndianRupee, Map as MapIcon, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Theme Constants ---
const PRIMARY = "#2563eb";
const SECONDARY = "#10b981";
const ACCENT = "#f59e0b";

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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-2xl shadow-lg shadow-blue-200">
            <Cross className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter italic">MedStay</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-bold text-sm text-slate-500">
          {!user ? (
            <>
              <Link to="/auth?mode=login" className="hover:text-blue-600">Login</Link>
              <Link to="/auth?mode=register" className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Partner Registration</Link>
            </>
          ) : (
            <>
              <Link to={user.role === 'hospital' ? '/hospital' : user.role === 'admin' ? '/admin' : '/patient'} className="hover:text-blue-600">My Dashboard</Link>
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 uppercase text-xs font-black">{user.name[0]}</div>
                <span className="text-slate-800">{user.name}</span>
                <button onClick={() => { setUser(null); navigate('/'); }} className="text-red-400 hover:text-red-500"><LogOut className="w-4 h-4" /></button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const BedLayout = ({ wards, onSelect, hospitalName }) => {
  return (
    <div className="space-y-10">
      {wards.map((ward, wIdx) => (
        <div key={wIdx}>
          <div className="flex items-center gap-4 mb-4">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">{ward.name}</h4>
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{ward.beds.filter(b => b.status === 'available').length} Available</span>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
            {ward.beds.map((bed, bIdx) => (
              <motion.button
                key={bIdx}
                whileHover={bed.status === 'available' ? { scale: 1.1, y: -2 } : {}}
                onClick={() => bed.status === 'available' && onSelect(bed)}
                className={`aspect-square rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${bed.status === 'occupied'
                  ? 'bg-slate-100 text-slate-400 ring-1 ring-slate-200 cursor-not-allowed'
                  : bed.type === 'ICU'
                    ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-600 ring-inset shadow-md'
                    : bed.type === 'VIP'
                      ? 'bg-orange-50 text-orange-600 ring-2 ring-orange-400 ring-inset'
                      : 'bg-emerald-50 text-emerald-600 ring-2 ring-emerald-500 ring-inset cursor-pointer shadow-lg shadow-emerald-100 hover:bg-emerald-500 hover:text-white'
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
  <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex flex-col justify-center items-center px-4 relative overflow-hidden text-center">
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 blur-[150px] -z-10 rounded-full" />
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-100 text-emerald-700 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-10">
      Now Localized: 0.2s Booking Latency
    </motion.div>
    <h1 className="text-6xl md:text-9xl font-black text-slate-900 leading-[1] mb-12 tracking-tighter">
      Better Admissions, <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Fast as OYO.</span>
    </h1>
    <div className="flex flex-col md:flex-row gap-6">
      <Link to="/auth?role=patient" className="px-12 py-6 bg-blue-600 text-white rounded-[32px] font-black text-xl shadow-2xl shadow-blue-200 transform hover:scale-105 transition-all">
        Book a Bed (Patient)
      </Link>
      <Link to="/auth?role=hospital" className="px-12 py-6 bg-white text-slate-900 border-2 border-slate-100 rounded-[32px] font-black text-xl shadow-xl hover:bg-slate-50 transition-all">
        List My Hospital
      </Link>
    </div>
    <div className="mt-20 flex gap-12 items-center opacity-40">
      <span className="text-xl font-bold tracking-tighter italic">24/7 Oxygen</span>
      <span className="text-xl font-bold tracking-tighter italic">ICU Slots</span>
      <span className="text-xl font-bold tracking-tighter italic">Verified Staff</span>
    </div>
  </div>
);

const AuthPage = ({ setUser }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialRole = searchParams.get('role') || 'patient';
  const [role, setRole] = useState(initialRole);
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = (e) => {
    e.preventDefault();
    const mockUser = {
      name: role === 'admin' ? "System Admin" : role === 'hospital' ? "Apollo Admin" : "Rahul Sharma",
      role: role
    };
    setUser(mockUser);
    navigate(role === 'admin' ? '/admin' : role === 'hospital' ? '/hospital' : '/patient');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-100 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-white p-12 rounded-[56px] shadow-2xl border border-white">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-slate-900 mb-2">{isLogin ? "Welcome Back" : "Join MedStay"}</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{role} Login Portal</p>
        </div>

        <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8">
          {['patient', 'hospital', 'admin'].map(r => (
            <button key={r} onClick={() => setRole(r)} className={`flex-1 py-3.5 rounded-xl text-sm font-black capitalize transition-all ${role === r ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400'}`}>
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4">Email ID</label>
            <input type="email" required placeholder={`${role}@medstay.com`} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4">Access Password</label>
            <input type="password" required placeholder="••••••••" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all" />
          </div>
          <button className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-blue-100 hover:bg-black transition-all">
            {isLogin ? "Login Now" : "Register as " + role}
          </button>
        </form>

        <div className="mt-8 p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">Demo Credentials</p>
          <div className="space-y-1 text-xs font-bold text-slate-600">
            <p>Email: <span className="text-blue-600 italic">{role}@medstay.com</span></p>
            <p>Password: <span className="text-blue-600 italic">any-password</span></p>
          </div>
        </div>

        <div className="mt-8 text-center flex flex-col gap-4">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-bold text-slate-500 hover:text-blue-600">
            {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const PatientPortal = () => {
  const [selectedHospital, setSelectedHospital] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 w-fit">
            <MapIcon className="w-3 h-3" /> Auto-Localized
          </div>
          <h2 className="text-5xl font-black text-slate-900 leading-tight">Finding beds near <span className="text-blue-600">your current location.</span></h2>
        </div>
        <div className="flex bg-white p-2 rounded-3xl border border-slate-100 shadow-xl w-full md:w-auto">
          <div className="flex items-center gap-4 px-6 py-3 border-r border-slate-100">
            <MapPin className="text-blue-600 w-5 h-5" />
            <div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Pinpoint</p>
              <p className="font-bold text-slate-800">Indiranagar, KA</p>
            </div>
          </div>
          <button className="px-8 font-black text-slate-900 group">
            Change <ChevronRight className="inline w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {HOSPITALS.map(h => (
          <motion.div scroll whileHover={{ scale: 1.02 }} key={h.id} className="bg-white rounded-[48px] border border-slate-100 shadow-2xl shadow-blue-900/5 overflow-hidden flex flex-col group">
            <div className="h-64 relative">
              <img src={h.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={h.name} />
              <div className="absolute top-6 left-6 bg-white/95 backdrop-blur px-3 py-1.5 rounded-2xl text-[10px] font-black flex items-center gap-1.5 shadow-xl">
                <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" /> {h.rating} ({h.reviews})
              </div>
              <div className="absolute top-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-2xl text-xs font-black shadow-lg">
                {h.distance}
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-2xl font-black text-slate-900 mb-2">{h.name}</h3>
              <p className="text-slate-400 font-bold text-sm mb-6 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {h.location}</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Price/Day</p>
                  <p className="text-lg font-black text-slate-900">₹{h.pricePerDay}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Available</p>
                  <p className="text-lg font-black text-emerald-600">{h.wards.reduce((acc, w) => acc + w.beds.filter(b => b.status === "available").length, 0)} Beds</p>
                </div>
              </div>
              <button onClick={() => setSelectedHospital(h)} className="mt-auto w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl shadow-slate-100 group-hover:bg-blue-600 transition-all">
                Check Bed Layout
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* BookMyShow Overlay Modal */}
      <AnimatePresence>
        {selectedHospital && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-end justify-center sm:items-center p-4">
            <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }} className="bg-white w-full max-w-4xl rounded-[56px] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
              <button onClick={() => setSelectedHospital(null)} className="absolute top-8 right-8 p-3 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all">
                <X className="w-6 h-6" />
              </button>
              <div className="p-12 overflow-y-auto no-scrollbar">
                <div className="mb-10 text-center sm:text-left">
                  <h2 className="text-4xl font-black text-slate-900 mb-2">{selectedHospital.name}</h2>
                  <p className="text-slate-500 font-bold">Select your preferred ward and bed (BookMyShow style)</p>
                </div>
                <BedLayout wards={selectedHospital.wards} onSelect={(bed) => { alert(`Selected Bed ${bed.id}. Proceeding to registration...`); setSelectedHospital(null); }} />

                <div className="mt-12 p-8 bg-blue-600 rounded-[40px] text-white flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div>
                    <h4 className="text-xl font-black">Ready to Book?</h4>
                    <p className="text-blue-100 text-sm font-bold">Complete your details for priority admission.</p>
                  </div>
                  <button className="bg-white text-blue-600 px-12 py-4 rounded-2xl font-black shadow-lg hover:px-16 transition-all uppercase text-sm tracking-widest">Register Now</button>
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
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="bg-white rounded-[64px] border border-slate-100 shadow-2xl shadow-blue-900/5 p-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <h1 className="text-5xl font-black text-slate-900 mb-2">City General Hospital</h1>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" /> Partner Dashboard (Live)</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-[32px] text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Revenue</p>
              <p className="text-2xl font-black text-slate-900">₹2.4L</p>
            </div>
            <div className="bg-blue-600 p-6 rounded-[32px] text-center text-white min-w-[150px]">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Rating</p>
              <p className="text-2xl font-black flex items-center justify-center gap-1.5"><Star className="w-5 h-5 fill-white" /> 4.8</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
          <div className="space-y-12">
            <section>
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3"><Settings className="w-5 h-5 text-blue-600" /> Operational Controls</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-8 bg-slate-50 border border-slate-100 rounded-[40px]">
                  <IndianRupee className="w-8 h-8 text-blue-600 mb-6" />
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Today's Bed Rate</label>
                  <input type="number" defaultValue={4500} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xl font-black focus:ring-2 focus:ring-blue-600 outline-none" />
                </div>
                <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[40px]">
                  <Users className="w-8 h-8 text-emerald-600 mb-6" />
                  <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3">Live Admissions</label>
                  <p className="text-4xl font-black text-emerald-600">28</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3"><Users className="w-5 h-5 text-blue-600" /> Today's Patients</h3>
              <div className="space-y-4">
                {RECENT_BOOKINGS.map(b => (
                  <div key={b.id} className="flex justify-between items-center p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-600">{b.patient[0]}</div>
                      <div>
                        <p className="font-black text-slate-800">{b.patient}</p>
                        <p className="text-xs font-bold text-slate-400">Reserved {b.bed}</p>
                      </div>
                    </div>
                    <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">{b.time}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="bg-slate-50 p-10 rounded-[56px] border border-slate-100">
            <h3 className="text-xl font-black text-slate-800 mb-10">Live Ward Manager</h3>
            <BedLayout wards={HOSPITALS[0].wards} onSelect={(bed) => alert(`Modifying Bed ${bed.id} Status`)} />
          </div>
        </div>
      </div>
    </div>
  );
};

const MasterAdmin = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex flex-col sm:flex-row justify-between items-end gap-10 mb-20">
        <div>
          <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter">Master Control</h1>
          <p className="text-slate-500 font-bold bg-white px-5 py-2 rounded-2xl border border-slate-100 w-fit">Monitoring {HOSPITALS.length} Nodes & 8.5L Transactions</p>
        </div>
        <div className="flex gap-4">
          <div className="p-8 bg-blue-600 text-white rounded-[40px] text-center min-w-[200px] shadow-2xl shadow-blue-200">
            <p className="text-[10px] font-black uppercase opacity-60 mb-2">Total Beds Across City</p>
            <p className="text-5xl font-black">1,420</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-2 space-y-12">
          {HOSPITALS.map(h => (
            <div key={h.id} className="bg-white rounded-[56px] p-10 border border-slate-100 shadow-xl">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-900 w-12 h-12 rounded-2xl flex items-center justify-center text-white"><Building2 className="w-6 h-6" /></div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{h.name}</h3>
                    <p className="text-xs font-bold text-slate-400">{h.location}</p>
                  </div>
                </div>
                <button className="text-blue-600 font-black text-sm p-4 bg-blue-50 rounded-2xl hover:bg-blue-600 hover:text-white transition-all">Audit Wards</button>
              </div>
              <BedLayout wards={h.wards} onSelect={(bed) => alert(`Master Override: Bed ${bed.id}`)} />
            </div>
          ))}
        </div>

        <div className="space-y-10">
          <div className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-xl sticky top-24">
            <h3 className="text-xl font-black mb-8 flex items-center gap-2"><Users className="w-6 h-6 text-blue-600" /> Platform Traffic</h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-xs font-black uppercase text-slate-400 mb-4"><span>Patient Registrations</span> <span>82% Boost</span></div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="bg-blue-600 w-[82%] transition-all duration-1000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-10 border-t border-slate-50">
                <div className="p-6 bg-slate-50 rounded-[32px] text-center">
                  <p className="text-2xl font-black text-slate-900">42</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hospitals</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-[32px] text-center">
                  <p className="text-2xl font-black text-slate-900">1.8k</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Users</p>
                </div>
              </div>
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

  return (
    <Router>
      <div className="min-h-screen font-sans bg-slate-50">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<AuthPage setUser={setUser} />} />
          <Route path="/patient" element={user?.role === 'patient' ? <PatientPortal /> : <Navigate to="/auth?role=patient" />} />
          <Route path="/hospital" element={user?.role === 'hospital' ? <HospitalPortal /> : <Navigate to="/auth?role=hospital" />} />
          <Route path="/admin" element={user?.role === 'admin' ? <MasterAdmin /> : <Navigate to="/auth?role=admin" />} />
        </Routes>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-100 py-24 mt-40">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-8">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <Cross className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tighter italic">MedStay</span>
              </div>
              <p className="text-slate-400 font-bold leading-relaxed mb-6">India's first real-time hospital bed inventory system. Transparency for patients, Efficiency for hospitals.</p>
              <div className="flex gap-4">
                <button className="p-3 border border-slate-100 rounded-xl hover:bg-blue-50 transition-colors"><Phone className="w-5 h-5 text-slate-400" /></button>
                <button className="p-3 border border-slate-100 rounded-xl hover:bg-blue-50 transition-colors"><Heart className="w-5 h-5 text-slate-400" /></button>
              </div>
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-10">Quick Access</h4>
              <ul className="space-y-4 text-slate-500 font-bold">
                <li><button className="hover:text-blue-600 transition-colors">Emergency Helplines</button></li>
                <li><button className="hover:text-blue-600 transition-colors">Vercel Deployment Guide</button></li>
                <li><button className="hover:text-blue-600 transition-colors">Partner Hospital List</button></li>
                <li><button className="hover:text-blue-600 transition-colors">Privacy & Safety</button></li>
              </ul>
            </div>
            <div className="bg-slate-900 rounded-[48px] p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full" />
              <h4 className="text-xl font-black mb-4">Emergency?</h4>
              <p className="text-slate-400 font-bold mb-8 text-sm leading-relaxed">Call our 24/7 dedicated medical admission support line.</p>
              <button className="w-full bg-blue-600 py-4 rounded-2xl font-black shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-sm uppercase tracking-widest">
                +91 800 MED STAY
              </button>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 pt-16 mt-16 border-t border-slate-50 flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
            <span>© 2026 MedStay Technologies Private Limited</span>
            <div className="flex gap-8">
              <button>Twitter</button>
              <button>Instagram</button>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
