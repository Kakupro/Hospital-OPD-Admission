import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link,
  useSearchParams,
} from "react-router-dom";
import {
  Search,
  MapPin,
  Bed,
  Phone,
  Star,
  Shield,
  Filter,
  Cross,
  Activity,
  User,
  Heart,
  ChevronRight,
  Menu,
  LogIn,
  UserPlus,
  Building2,
  LayoutDashboard,
  LogOut,
  Settings,
  Clock,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Users,
  IndianRupee,
  Map as MapIcon,
  X,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Mock Data ---
const HOSPITALS = [
  {
    id: 1,
    name: "Medicity Super Specialty",
    location: "Indiranagar, Bangalore",
    distance: "0.8 km",
    rating: 4.9,
    reviews: 2400,
    pricePerDay: 4500,
    type: "Multi-Specialty",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
    wards: [
      {
        name: "Executive ICU",
        beds: Array.from({ length: 10 }, (_, i) => ({
          id: `ICU-${i + 1}`,
          type: "ICU",
          status: i < 8 ? "occupied" : "available",
        })),
      },
      {
        name: "Premium Ward",
        beds: Array.from({ length: 20 }, (_, i) => ({
          id: `GEN-${i + 1}`,
          type: "General",
          status: i < 15 ? "occupied" : "available",
        })),
      },
    ],
  },
  {
    id: 2,
    name: "Astra Care & Research",
    location: "HSR Layout, Bangalore",
    distance: "2.4 km",
    rating: 4.7,
    reviews: 1890,
    pricePerDay: 5800,
    type: "Trauma Center",
    image:
      "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=800",
    wards: [
      {
        name: "Cardiac Unit",
        beds: Array.from({ length: 8 }, (_, i) => ({
          id: `CICU-${i + 1}`,
          type: "ICU",
          status: i < 5 ? "occupied" : "available",
        })),
      },
      {
        name: "Special Suites",
        beds: Array.from({ length: 12 }, (_, i) => ({
          id: `VIP-${i + 1}`,
          type: "VIP",
          status: i < 8 ? "occupied" : "available",
        })),
      },
    ],
  },
];

const RECENT_BOOKINGS = [
  {
    id: 1,
    patient: "Rahul S.",
    hospital: "Medicity",
    bed: "ICU-12",
    time: "2m ago",
    status: "confirmed",
  },
  {
    id: 2,
    patient: "Anjali M.",
    hospital: "Astra Care",
    bed: "VIP-04",
    time: "15m ago",
    status: "pending",
  },
];

// --- Shared Elements ---

const Logo = () => (
  <Link to="/" className="flex items-center gap-3 group">
    <div className="bg-[#b8e2b0] p-2 rounded-xl shadow-lg shadow-[#b8e2b0]/20 group-hover:rotate-12 transition-transform duration-500">
      <Cross className="text-emerald-900 w-5 h-5" />
    </div>
    <span className="text-xl font-black text-slate-900 tracking-tighter">
      MedStay
    </span>
  </Link>
);

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  return (
    <nav className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Logo />

        <div className="flex items-center gap-8 font-black text-sm">
          {!user ? (
            <>
              <Link to="/auth?mode=login" className="text-slate-500 hover:text-emerald-900 transition-colors">
                Login
              </Link>
              <Link
                to="/auth?mode=register"
                className="bg-[#b8e2b0] text-emerald-900 px-6 py-2.5 rounded-xl shadow-md shadow-[#b8e2b0]/10 hover:bg-emerald-900 hover:text-white transition-all"
              >
                Join Us Free
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                to={
                  user.role === "hospital"
                    ? "/hospital"
                    : user.role === "admin"
                      ? "/admin"
                      : "/patient"
                }
                className="text-slate-500 hover:text-emerald-900"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                <span className="text-slate-800 font-bold">{user.name}</span>
                <button
                  onClick={() => {
                    setUser(null);
                    navigate("/");
                  }}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
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
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {ward.name}
            </h4>
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase">
              {ward.beds.filter((b) => b.status === "available").length} Slots
            </span>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
            {ward.beds.map((bed, bIdx) => (
              <motion.button
                key={bIdx}
                whileHover={
                  bed.status === "available" ? { scale: 1.1, y: -2 } : {}
                }
                whileTap={bed.status === "available" ? { scale: 0.95 } : {}}
                onClick={() => bed.status === "available" && onSelect(bed)}
                className={`aspect-square rounded-xl flex items-center justify-center text-[10px] font-black transition-all border-2 ${bed.status === "occupied"
                  ? "bg-slate-50 border-slate-100 text-slate-200 cursor-not-allowed"
                  : bed.type === "ICU"
                    ? "bg-emerald-50 border-emerald-100 text-emerald-900"
                    : bed.type === "VIP"
                      ? "bg-orange-50 border-orange-100 text-orange-600"
                      : "bg-white border-slate-100 text-emerald-900 cursor-pointer hover:border-emerald-200"
                  }`}
              >
                {bed.id.split("-")[1]}
              </motion.button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Main Pages ---

const Landing = () => {
  const mouseX = motion.useMotionValue(0);
  const mouseY = motion.useMotionValue(0);

  const rotateX = motion.useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = motion.useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <div
      className="min-h-[calc(100vh-80px)] bg-white relative overflow-hidden flex flex-col items-center justify-center p-6"
      onMouseMove={handleMouseMove}
    >
      {/* 3D Depth Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-[#b8e2b0]/10 blur-[180px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[800px] h-[800px] bg-emerald-100/30 blur-[150px] rounded-full -z-10" />

      {/* Floating 3D Decorative Orbs */}
      <motion.div
        animate={{ y: [-20, 20, -20], x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute top-40 left-[15%] w-16 h-16 bg-[#b8e2b0]/40 rounded-full blur-xl -z-5"
      />
      <motion.div
        animate={{ y: [0, -30, 0], scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        className="absolute bottom-40 right-[15%] w-24 h-24 bg-emerald-200/30 rounded-full blur-2xl -z-5"
      />

      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative">
          {/* Left Side: Text Content */}
          <div className="flex-1 text-center lg:text-left z-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-emerald-50 text-emerald-900 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-10 w-fit mx-auto lg:mx-0 border border-emerald-100 shadow-sm pista-glow"
            >
              Standardizing Health Tech
            </motion.div>

            <h1 className="text-6xl md:text-8xl xl:text-9xl font-black text-slate-900 leading-[0.9] mb-10 tracking-tighter">
              Heal <br />
              <span className="text-[#b8e2b0] italic drop-shadow-sm">Directly.</span>
            </h1>

            <p className="max-w-xl text-slate-500 font-bold text-xl mb-14 leading-relaxed tracking-tight mx-auto lg:mx-0">
              India's first 3D-enabled hospital inventory network. Check live
              ICU availability and secure admissions with futuristic transparency.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Link
                to="/auth?role=patient"
                className="px-12 py-6 bg-[#b8e2b0] text-emerald-900 rounded-[24px] font-black text-xl shadow-2xl shadow-primary/30 hover:bg-emerald-900 hover:text-white transition-all transform hover:-translate-y-2 flex items-center justify-center gap-4 group pista-glow"
              >
                Find Bed <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                to="/auth?role=hospital"
                className="px-12 py-6 bg-white text-slate-900 border-2 border-slate-100 rounded-[24px] font-black text-xl hover:border-primary hover:bg-primary/5 transition-all transform hover:-translate-y-2 shadow-xl shadow-slate-900/5"
              >
                Register Clinic
              </Link>
            </div>

            <div className="mt-20 flex flex-wrap gap-10 justify-center lg:justify-start items-center">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 shadow-md">
                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} className="w-full h-full rounded-full" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-lg font-black text-slate-900 leading-none">24.5k+</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Patients</p>
              </div>
            </div>
          </div>

          {/* Right Side: 3D Interactive Visual */}
          <div className="flex-1 w-full max-w-2xl perspective-1000">
            <motion.div
              style={{
                rotateX: rotateX,
                rotateY: rotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative cursor-none group"
            >
              {/* Main Image with Depth */}
              <div className="rounded-[64px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.15)] border-[12px] border-white relative group-hover:shadow-[0_80px_120px_rgba(184,226,176,0.3)] transition-all duration-700">
                <img
                  src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200"
                  className="w-full aspect-[4/5] object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                  alt="3D Interactive Medical Facility"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent opacity-60" />

                {/* Floating 3D Elements inside the frame (Z-translated) */}
                <motion.div
                  initial={{ translateZ: 50 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-full h-full bg-primary/10 backdrop-blur-[2px] pointer-events-none" />
                </motion.div>
              </div>

              {/* Float Card 1: Live Pulse */}
              <motion.div
                style={{ translateZ: 100 }}
                className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[32px] shadow-2xl border border-emerald-50 flex items-center gap-6"
              >
                <div className="relative">
                  <Activity className="w-10 h-10 text-[#b8e2b0]" />
                  <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</p>
                  <p className="text-2xl font-black text-slate-900 tracking-tight">Active Node</p>
                </div>
              </motion.div>

              {/* Float Card 2: Interactive Badge */}
              <motion.div
                style={{ translateZ: 150 }}
                className="absolute top-20 -left-16 bg-emerald-950 text-[#b8e2b0] p-8 rounded-[32px] shadow-2xl max-w-[200px]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 fill-[#b8e2b0]" />
                  <p className="text-xs font-black uppercase tracking-widest">3D Secured</p>
                </div>
                <p className="text-sm font-bold text-white/60 leading-relaxed italic">Immutable inventory ledger tracking every bed in real-time.</p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Premium Feature Matrix */}
        <div className="mt-40 grid grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            { label: "Partner Reach", value: "480+", icon: Building2 },
            { label: "Beds Unified", value: "1.2k", icon: Bed },
            { label: "ICU Pulse", value: "320", icon: Activity },
            { label: "Deployment", value: "Live", icon: CheckCircle2 },
          ].map((stat, i) => (
            <motion.div
              whileHover={{ y: -15, scale: 1.05 }}
              key={i}
              className="p-10 bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-900/[0.02] hover:shadow-primary/20 hover:border-primary/30 transition-all duration-500"
            >
              <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <stat.icon className="w-7 h-7 text-[#b8e2b0]" />
              </div>
              <p className="text-4xl font-black text-slate-900 mb-2 tracking-tighter italic">{stat.value}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AuthPage = ({ setUser }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialRole = searchParams.get("role") || "patient";
  const mode = searchParams.get("mode") || "login";

  const [role, setRole] = useState(initialRole);
  const [isLogin, setIsLogin] = useState(mode === "login");

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({
      name:
        role === "admin"
          ? "Admin"
          : role === "hospital"
            ? "Medicity"
            : "Rahul Sharma",
      role: role,
    });
    navigate(
      role === "admin" ? "/admin" : role === "hospital" ? "/hospital" : "/patient"
    );
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-12 rounded-[40px] shadow-2xl shadow-slate-900/[0.04] border border-slate-100"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-100">
            <Shield className="text-[#b8e2b0] w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
            {isLogin ? "Welcome Back" : "Register Now"}
          </h2>
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">
            {role} Portal
          </p>
        </div>

        <div className="flex p-1.5 bg-slate-50 rounded-2xl mb-10 border border-slate-100">
          {["patient", "hospital", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black capitalize transition-all cursor-pointer ${role === r
                ? "bg-white text-emerald-900 shadow-sm border border-slate-50"
                : "text-slate-400 hover:text-emerald-900"
                }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
              Email ID
            </label>
            <input
              type="email"
              required
              placeholder={`${role}@medstay.com`}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-[#b8e2b0]/10 transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-[#b8e2b0]/10 transition-all font-bold"
            />
          </div>
          <button className="w-full bg-[#b8e2b0] text-emerald-900 py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-emerald-900 hover:text-white transition-all cursor-pointer">
            {isLogin ? "Login Now" : "Register Account"}
          </button>
        </form>

        <div className="mt-10 p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-[12px] font-bold text-slate-600">
          <p className="flex justify-between mb-1">USER: <span className="text-emerald-900">{role}@medstay.com</span></p>
          <p className="flex justify-between">PASS: <span className="text-emerald-900">demo123</span></p>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-black text-slate-400 hover:text-emerald-900 transition-colors cursor-pointer underline underline-offset-4"
          >
            {isLogin ? "New user? Create account" : "Already have access? Sign In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const PatientPortal = () => {
  const [selectedHospital, setSelectedHospital] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-16">
        <div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 w-fit border border-emerald-100">
            <MapPin className="w-3 h-3" /> Live in Bangalore
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Inventory near <span className="text-[#b8e2b0] italic">Indiranagar.</span>
          </h2>
        </div>

        <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl p-2 w-full lg:w-[400px]">
          <Search className="text-slate-300 w-5 h-5 mx-4" />
          <input
            type="text"
            placeholder="Search hospitals..."
            className="bg-transparent border-none outline-none font-bold text-sm flex-1 py-3"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {HOSPITALS.map((h) => (
          <motion.div
            key={h.id}
            whileHover={{ y: -8 }}
            className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-900/[0.02] overflow-hidden group hover:shadow-2xl hover:shadow-[#b8e2b0]/10 hover:border-[#b8e2b0]/30 transition-all duration-500"
          >
            <div className="h-64 relative">
              <img
                src={h.image}
                className="w-full h-full object-cover group-hover:rotate-1 transition-transform duration-1000"
                alt={h.name}
              />
              <div className="absolute top-6 left-6 bg-white/95 px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 shadow-xl border border-white/50">
                <Star className="w-3 h-3 text-[#b8e2b0] fill-[#b8e2b0]" /> {h.rating} ({h.reviews})
              </div>
            </div>
            <div className="p-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    {h.type}
                  </p>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none italic">
                    {h.name}
                  </h3>
                </div>
              </div>
              <p className="text-slate-400 font-bold text-sm mb-10 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {h.location}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Price/day
                  </p>
                  <p className="text-xl font-black text-slate-900">₹{h.pricePerDay}</p>
                </div>
                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">
                    Available
                  </p>
                  <p className="text-xl font-black text-emerald-700">
                    {h.wards.reduce(
                      (acc, w) => acc + w.beds.filter((b) => b.status === "available").length,
                      0
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedHospital(h)}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black shadow-lg hover:bg-[#b8e2b0] hover:text-emerald-900 transition-all cursor-pointer group flex items-center justify-center gap-3"
              >
                Check Layout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedHospital && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedHospital(null)}
                className="absolute top-8 right-8 p-3 bg-slate-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer z-[1010]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-1/3 bg-slate-50 p-12 border-r border-slate-100 overflow-y-auto no-scrollbar">
                <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight italic">
                  {selectedHospital.name}
                </h2>
                <p className="text-slate-400 font-bold mb-10 leading-relaxed">
                  Select your ward category and choose a specific bed slot for immediate reservation.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-white border-2 border-[#b8e2b0] shadow-sm" />
                    <span className="text-sm font-black text-slate-700 uppercase tracking-widest">Regular Slot</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 border-2 border-emerald-100" />
                    <span className="text-sm font-black text-emerald-900 uppercase tracking-widest">ICU Unit</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 border-2 border-slate-200" />
                    <span className="text-sm font-black text-slate-300 uppercase tracking-widest">Occupied</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-2/3 p-12 overflow-y-auto no-scrollbar bg-white">
                <BedLayout
                  wards={selectedHospital.wards}
                  onSelect={(bed) => {
                    alert(`Slot ${bed.id} Initialized. Redirecting to check-in...`);
                    setSelectedHospital(null);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
      <div className="min-h-screen font-sans bg-white">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<AuthPage setUser={setUser} />} />
          <Route
            path="/patient"
            element={
              user?.role === "patient" ? (
                <PatientPortal />
              ) : (
                <Navigate to="/auth?role=patient" />
              )
            }
          />
          <Route path="/hospital" element={<Navigate to="/" />} />
          <Route path="/admin" element={<Navigate to="/" />} />
        </Routes>

        <footer className="bg-slate-50 border-t border-slate-100 py-24 mt-40">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="col-span-1">
              <Logo />
              <p className="text-slate-400 font-bold leading-relaxed mb-8 mt-6">
                India's premium hospital inventory network. 24/7 care, 100% transparency.
              </p>
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-8">
                Quick Links
              </h4>
              <ul className="space-y-4 text-slate-500 font-bold text-sm">
                <li className="cursor-pointer hover:text-emerald-900">Help Center</li>
                <li className="cursor-pointer hover:text-emerald-900">Partner Clinics</li>
                <li className="cursor-pointer hover:text-emerald-900">Safety Protocols</li>
              </ul>
            </div>
            <div className="bg-slate-900 p-10 rounded-[40px] text-white">
              <h4 className="text-xl font-black mb-4 italic">Need Help?</h4>
              <p className="text-slate-400 font-bold mb-8 text-sm">
                Call our manual support line for help with bed allocation.
              </p>
              <button className="w-full bg-[#b8e2b0] py-4 rounded-2xl font-black text-emerald-900 uppercase tracking-widest text-[10px] hover:bg-white transition-all cursor-pointer">
                Call Now
              </button>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
