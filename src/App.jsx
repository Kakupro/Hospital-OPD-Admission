import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import {
  Search, MapPin, Bed, Phone, Star, Shield, Filter, Cross, Activity,
  User, Heart, ChevronRight, Menu, LogIn, UserPlus, Building2,
  LayoutDashboard, LogOut, Settings, Clock, CheckCircle2, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Global Theme & Utilities ---
const glassClasses = "bg-white/80 backdrop-blur-xl border border-white/20";
const cardClasses = "bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500";

// --- Mock Data ---
const HOSPITALS = [
  {
    id: 1,
    name: "City General Hospital",
    location: "Indiranagar, Bangalore",
    coords: { lat: 12.9716, lng: 77.5946 },
    totalBeds: 60,
    availableBeds: 12,
    type: "Multi-Specialty",
    rating: 4.8,
    pricePerDay: 4500,
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=800",
    features: ["Oxygen", "ICU", "Pharmacy"],
    beds: Array.from({ length: 60 }, (_, i) => ({ id: `B-${i + 1}`, status: i < 48 ? 'occupied' : 'available', type: i < 10 ? 'ICU' : 'General' }))
  },
  {
    id: 2,
    name: "Astra Specialty Care",
    location: "HSR Layout, Bangalore",
    coords: { lat: 12.9141, lng: 77.6411 },
    totalBeds: 40,
    availableBeds: 5,
    type: "Cardiology",
    rating: 4.6,
    pricePerDay: 6200,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
    features: ["Adv Labs", "ER", "Suites"],
    beds: Array.from({ length: 40 }, (_, i) => ({ id: `A-${i + 1}`, status: i < 35 ? 'occupied' : 'available', type: i < 5 ? 'ICU' : 'General' }))
  }
];

// --- Components ---

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-200">
              <Cross className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">MedStay</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <Link to={user.role === 'hospital' ? '/hospital-dash' : '/patient-dash'} className="text-sm font-bold text-slate-500 hover:text-blue-600">Dashboard</Link>
                {user.role === 'admin' && <Link to="/admin" className="text-sm font-bold text-slate-500 hover:text-blue-600">Master Admin</Link>}
                <div className="h-6 w-px bg-slate-200" />
                <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{user.name}</span>
                  <button onClick={() => { setUser(null); navigate('/'); }} className="p-1 hover:text-red-500 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/auth?mode=login" className="text-sm font-bold text-slate-600 hover:text-blue-600">Login</Link>
                <Link to="/auth?mode=register" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- Pages ---

const AuthPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState('patient'); // patient, hospital, admin
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = (e) => {
    e.preventDefault();
    if (role === 'admin') {
      setUser({ name: 'Super Admin', role: 'admin' });
      navigate('/admin');
    } else if (role === 'hospital') {
      setUser({ name: 'City Hospital Admin', role: 'hospital', hospitalId: 1 });
      navigate('/hospital-dash');
    } else {
      setUser({ name: 'Rahul Sharma', role: 'patient' });
      navigate('/patient-dash');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-20 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100/50 blur-[100px] rounded-full" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 mb-2">{isLogin ? 'Welcome Back' : 'Join MedStay'}</h2>
          <p className="text-slate-500 font-medium">{isLogin ? 'Select your role to continue' : 'Create an account to browse beds'}</p>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
          {['patient', 'hospital'].map(r => (
            <button key={r} onClick={() => setRole(r)} className={`flex-1 py-3 rounded-xl text-sm font-bold capitalize transition-all ${role === r ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
            <input type="email" required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white transition-all outline-none font-bold" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Password</label>
            <input type="password" required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white transition-all outline-none font-bold" />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all">
            {isLogin ? 'Login Now' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={() => setRole('admin')} className="text-xs font-bold text-slate-400 hover:text-blue-600">Login as Master Admin</button>
        </div>
      </motion.div>
    </div>
  );
};

// BookMyShow Style Grid Component
const BedGrid = ({ beds, title, onSelect }) => {
  return (
    <div className="bg-white p-8 rounded-[40px] border border-slate-100">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-black text-slate-900">{title}</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <div className="w-3 h-3 bg-emerald-500 rounded-sm" /> Available
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <div className="w-3 h-3 bg-slate-200 rounded-sm" /> Occupied
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <div className="w-3 h-3 bg-blue-600 rounded-sm" /> ICU
          </div>
        </div>
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-10 gap-3">
        {beds.map((bed, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.1 }}
            className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${bed.status === 'occupied'
                ? 'bg-slate-100 text-slate-400 ring-1 ring-slate-200'
                : bed.type === 'ICU'
                  ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-600'
                  : 'bg-emerald-50 text-emerald-600 ring-2 ring-emerald-500 cursor-pointer shadow-lg shadow-emerald-100'
              }`}
          >
            {idx + 1}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const PatientDashboard = () => {
  const [userLocation, setUserLocation] = useState({ lat: 12.9716, lng: 77.5946 }); // Bangalore center
  const [nearby, setNearby] = useState(HOSPITALS);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black text-slate-900 mb-2">Hospitals Near You</h2>
          <div className="flex items-center gap-2 text-blue-600 font-bold bg-blue-50 px-4 py-1.5 rounded-full w-fit">
            <MapPin className="w-4 h-4" /> Indiranagar, Bangalore (Real-time)
          </div>
        </div>
        <div className="flex gap-4">
          <button className="bg-white px-6 py-3 rounded-2xl border border-slate-100 font-bold text-slate-600 shadow-sm flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-blue-100">
            Search in Map
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {nearby.map(h => (
          <div key={h.id} className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-lg flex gap-8 items-center group">
            <img src={h.image} className="w-40 h-48 object-cover rounded-[32px] group-hover:scale-105 transition-transform" />
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-black text-slate-900">{h.name}</h3>
                <div className="flex items-center gap-1 text-orange-400 font-black"><Star className="w-4 h-4 fill-orange-400" /> {h.rating}</div>
              </div>
              <p className="text-slate-500 font-bold text-sm mb-4 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> 1.2 km away from you</p>
              <div className="flex gap-2 mb-6">
                <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-xs font-black">₹{h.pricePerDay}/day</span>
                <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-xs font-black">{h.availableBeds} Beds Left</span>
              </div>
              <button onClick={() => alert(`Redirecting to ${h.name} bed layout`)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-100">
                View Beds (OYO style)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MasterAdmin = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-5xl font-black text-slate-900 mb-4">Master Control Centre</h2>
          <p className="text-slate-500 font-bold bg-white px-4 py-2 border border-slate-100 rounded-2xl w-fit">Monitoring {HOSPITALS.length} Active Hospitals | 2.4k Patients</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2 space-y-10">
            {HOSPITALS.map(h => (
              <div key={h.id} className="relative">
                <div className="flex justify-between items-center mb-6 pl-4">
                  <h3 className="text-2xl font-black text-slate-800">{h.name} Status</h3>
                  <div className="flex items-center gap-4 text-sm font-bold">
                    <span className="text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg">Operational</span>
                    <span className="text-blue-600">{h.availableBeds}/{h.totalBeds} Live Beds</span>
                  </div>
                </div>
                <BedGrid beds={h.beds} title={`Bed Layout - ${h.name}`} />
              </div>
            ))}
          </div>
          <div>
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 sticky top-24">
              <h3 className="text-xl font-black mb-8 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" /> Recent Bookings
              </h3>
              <div className="space-y-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex gap-4 items-start p-4 hover:bg-slate-50 rounded-2xl transition-all">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-black text-slate-900">Patient #{i * 120}</div>
                      <div className="text-xs font-bold text-slate-400">Booked City Gen. (ICU Bed 12)</div>
                      <div className="mt-2 text-[10px] font-black uppercase text-emerald-500">2 mins ago</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-black text-sm">Download Master Report</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HospitalDash = ({ hospitalId }) => {
  const hospital = HOSPITALS.find(h => h.id === hospitalId) || HOSPITALS[0];
  const [price, setPrice] = useState(hospital.pricePerDay);
  const [beds, setBeds] = useState(hospital.beds);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-2xl mb-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-2">{hospital.name}</h2>
            <p className="text-slate-500 font-bold flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-600" /> {hospital.location}</p>
          </div>
          <div className="bg-blue-600 text-white px-8 py-4 rounded-3xl flex gap-10">
            <div className="text-center">
              <div className="text-[10px] font-black uppercase opacity-60">Revenue Today</div>
              <div className="text-2xl font-black">₹84.2k</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] font-black uppercase opacity-60">Avg Rating</div>
              <div className="text-2xl font-black">4.8</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-black text-slate-900 mb-8">Edit Rates & Metadata</h3>
            <div className="space-y-6">
              <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">General Bed Price (Per Day)</label>
                <div className="flex gap-4">
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-2xl font-black outline-none focus:ring-2 focus:ring-blue-600" />
                  <button className="bg-slate-900 text-white px-8 rounded-2xl font-black hover:bg-blue-600 transition-all">Update</button>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-1 p-8 bg-emerald-50 rounded-[40px] border border-emerald-100">
                  <div className="text-4xl font-black text-emerald-600 mb-1">12</div>
                  <div className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Active Patients</div>
                </div>
                <div className="flex-1 p-8 bg-blue-50 rounded-[40px] border border-blue-100">
                  <div className="text-4xl font-black text-blue-600 mb-1">48</div>
                  <div className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Beds Available</div>
                </div>
              </div>
            </div>
          </div>
          <BedGrid beds={beds} title="Your Live Inventory" />
        </div>
      </div>
    </div>
  );
};

const Landing = () => (
  <div className="min-h-screen py-32 flex items-center justify-center bg-slate-50 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/30 blur-[150px] rounded-full" />
    <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-blue-50 text-blue-700 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 w-fit mx-auto">
        The Future of Healthcare Admissions
      </motion.div>
      <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-12 leading-tight">
        Quality Healthcare, <br />
        <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">Instantly Booked.</span>
      </h1>
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <Link to="/auth?mode=register" className="bg-blue-600 text-white px-12 py-6 rounded-[32px] text-xl font-black shadow-2xl shadow-blue-200 hover:scale-[1.05] transition-all">
          I am a Patient
        </Link>
        <Link to="/auth?mode=register" className="bg-white text-slate-900 px-12 py-6 rounded-[32px] text-xl font-black border-2 border-slate-100 shadow-xl hover:bg-slate-50 transition-all">
          I am a Hospital
        </Link>
      </div>
    </div>
  </div>
);

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="min-h-screen font-sans antialiased text-slate-900">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<AuthPage setUser={setUser} />} />
          <Route path="/patient-dash" element={user?.role === 'patient' ? <PatientDashboard /> : <Navigate to="/auth" />} />
          <Route path="/hospital-dash" element={user?.role === 'hospital' ? <HospitalDash hospitalId={user.hospitalId} /> : <Navigate to="/auth" />} />
          <Route path="/admin" element={user?.role === 'admin' ? <MasterAdmin /> : <Navigate to="/auth" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
