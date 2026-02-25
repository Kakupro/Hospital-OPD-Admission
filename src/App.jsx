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

// --- Theme Utilities ---
const PISTA = "#b8e2b0";
const PISTA_DARK = "#8cb686";

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
    type: "Emergency & Trauma",
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
  {
    id: 3,
    name: "Global Ortho Hospital",
    location: "Koramangala, Bangalore",
    distance: "3.1 km",
    rating: 4.8,
    reviews: 950,
    pricePerDay: 4200,
    type: "Orthopedic",
    image:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
    wards: [
      {
        name: "Recovery Block",
        beds: Array.from({ length: 15 }, (_, i) => ({
          id: `REC-${i + 1}`,
          type: "General",
          status: i < 10 ? "occupied" : "available",
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
  {
    id: 3,
    patient: "Vikas K.",
    hospital: "Medicity",
    bed: "GEN-08",
    time: "1h ago",
    status: "confirmed",
  },
];

// --- Shared Elements ---

const Logo = () => (
  <Link to="/" className="flex items-center gap-2.5 group">
    <div className="bg-[#b8e2b0] p-2.5 rounded-2xl shadow-lg shadow-[#b8e2b0]/20 group-hover:rotate-12 transition-transform duration-500">
      <Cross className="text-emerald-900 w-6 h-6" />
    </div>
    <span className="text-2xl font-black text-slate-900 tracking-tighter italic">
      MedStay
    </span>
  </Link>
);

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  return (
    <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-emerald-50">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <Logo />

        <div className="hidden lg:flex items-center gap-10 font-black text-sm text-slate-500">
          {!user ? (
            <>
              <Link
                to="/auth?mode=login"
                className="hover:text-emerald-900 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/auth?mode=register"
                className="bg-[#b8e2b0] text-emerald-900 px-8 py-3.5 rounded-[20px] shadow-xl shadow-[#b8e2b0]/10 hover:bg-emerald-900 hover:text-white transition-all transform hover:scale-105"
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
                className="px-6 py-2.5 rounded-full border border-emerald-100 hover:bg-emerald-50 transition-colors"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-4 bg-[#b8e2b0]/10 px-5 py-2.5 rounded-[24px] border border-[#b8e2b0]/30 shadow-sm">
                <div className="w-9 h-9 bg-white border border-[#b8e2b0] rounded-xl flex items-center justify-center text-emerald-900 text-xs font-black shadow-inner">
                  {user.name[0]}
                </div>
                <span className="text-slate-800 tracking-tight">
                  {user.name}
                </span>
                <button
                  onClick={() => {
                    setUser(null);
                    navigate("/");
                  }}
                  className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer ml-1"
                >
                  <LogOut className="w-5 h-5" />
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
    <div className="space-y-16">
      {wards.map((ward, wIdx) => (
        <div key={wIdx}>
          <div className="flex items-center gap-5 mb-8">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">
              {ward.name}
            </h4>
            <div className="h-px flex-1 bg-slate-100" />
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-black text-emerald-700">
                {ward.beds.filter((b) => b.status === "available").length} SLOTS
              </span>
            </div>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-5">
            {ward.beds.map((bed, bIdx) => (
              <motion.button
                key={bIdx}
                whileHover={
                  bed.status === "available"
                    ? { scale: 1.1, y: -4, backgroundColor: "#b8e2b0" }
                    : {}
                }
                whileTap={bed.status === "available" ? { scale: 0.9 } : {}}
                onClick={() => bed.status === "available" && onSelect(bed)}
                className={`aspect-square rounded-[24px] flex items-center justify-center text-sm font-black transition-all border-2 ${
                  bed.status === "occupied"
                    ? "bg-slate-50 border-slate-100 text-slate-200 cursor-not-allowed"
                    : bed.type === "ICU"
                      ? "bg-emerald-50 border-[#b8e2b0] text-emerald-900 shadow-sm"
                      : bed.type === "VIP"
                        ? "bg-orange-50 border-orange-100 text-orange-600"
                        : "bg-white border-slate-100 text-emerald-900 hover:text-emerald-950 shadow-xl shadow-emerald-900/[0.03] cursor-pointer"
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

const Landing = () => (
  <div className="min-h-[calc(100vh-96px)] bg-white flex flex-col justify-center items-center px-6 relative overflow-hidden text-center">
    <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-[#b8e2b0]/30 blur-[180px] -z-10 rounded-full opacity-60" />
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-emerald-50 text-emerald-900 px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-12 border border-[#b8e2b0]/50 shadow-sm"
    >
      Standardizing Healthcare Admissions
    </motion.div>
    <h1 className="text-6xl md:text-[9.5rem] font-black text-slate-900 leading-[0.85] mb-14 tracking-tighter">
      Heal Better, <br />
      <span className="text-[#b8e2b0] italic">Register Faster.</span>
    </h1>
    <p className="max-w-2xl text-slate-400 font-bold text-xl mb-20 leading-relaxed tracking-tight">
      Live bed inventory, ICU availability and OPD digital tokens{" "}
      <br className="hidden md:block" /> with absolute transparency. Built for
      speed and care.
    </p>
    <div className="flex flex-col md:flex-row gap-8">
      <Link
        to="/auth?role=patient"
        className="px-16 py-8 bg-[#b8e2b0] text-emerald-900 rounded-[32px] font-black text-2xl shadow-2xl shadow-[#b8e2b0]/30 hover:bg-emerald-900 hover:text-white transform hover:scale-105 transition-all flex items-center gap-4 group"
      >
        Find a Bed{" "}
        <ArrowRight className="group-hover:translate-x-2 transition-transform" />
      </Link>
      <Link
        to="/auth?role=hospital"
        className="px-16 py-8 bg-white text-emerald-950 border-2 border-slate-100 rounded-[32px] font-black text-2xl shadow-xl hover:border-[#b8e2b0] transition-all"
      >
        Partner Portal
      </Link>
    </div>
  </div>
);

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
          ? "System Administrator"
          : role === "hospital"
            ? "Medicity Admin"
            : "Rahul Sharma",
      role: role,
    });
    navigate(
      role === "admin"
        ? "/admin"
        : role === "hospital"
          ? "/hospital"
          : "/patient",
    );
  };

  return (
    <div className="min-h-[calc(100vh-96px)] bg-[#f9fbf9] flex items-center justify-center p-6 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-14 rounded-[72px] shadow-2xl shadow-emerald-900/[0.05] border border-emerald-50"
      >
        <div className="text-center mb-14">
          <div className="w-20 h-20 bg-[#f0fdf4] rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-emerald-100 shadow-inner">
            <Shield className="text-[#b8e2b0] w-10 h-10" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
            {isLogin ? "Welcome Back" : "Join MedStay"}
          </h2>
          <p className="text-emerald-900/60 font-black uppercase text-[11px] tracking-[0.4em]">
            {role} Access Portal
          </p>
        </div>

        <div className="flex p-2 bg-[#f9fbf9] rounded-[32px] mb-12 border border-emerald-50">
          {["patient", "hospital", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-4 rounded-2xl text-[11px] font-black capitalize transition-all cursor-pointer ${role === r ? "bg-white text-emerald-900 shadow-xl border border-emerald-50" : "text-slate-400 hover:text-[#b8e2b0]"}`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">
              Credential ID
            </label>
            <input
              type="email"
              required
              placeholder={`${role}@medstay.com`}
              className="w-full bg-[#f9fbf9] border border-slate-100 rounded-[28px] px-8 py-6 outline-none focus:ring-4 focus:ring-[#b8e2b0]/20 focus:border-[#b8e2b0] font-bold text-lg transition-all"
            />
          </div>
          <div className="space-y-3">
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-[#f9fbf9] border border-slate-100 rounded-[28px] px-8 py-6 outline-none focus:ring-4 focus:ring-[#b8e2b0]/20 focus:border-[#b8e2b0] font-bold text-lg transition-all"
            />
          </div>
          <button className="w-full bg-[#b8e2b0] text-emerald-900 py-6 rounded-[32px] font-black text-xl shadow-xl shadow-[#b8e2b0]/20 hover:bg-emerald-900 hover:text-white transition-all transform active:scale-95 cursor-pointer">
            {isLogin ? "Authenticate Now" : `Create ${role} Account`}
          </button>
        </form>

        <div className="mt-12 p-10 bg-emerald-50/50 rounded-[48px] border border-[#b8e2b0]/30 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#b8e2b0]/20 blur-3xl rounded-full" />
          <p className="text-[11px] font-black text-emerald-900 uppercase tracking-widest mb-4 flex items-center gap-2 italic underline underline-offset-4 decoration-[#b8e2b0]">
            Demo Access Key
          </p>
          <div className="space-y-2 text-[13px] font-black text-slate-600">
            <p className="flex justify-between">
              USER:{" "}
              <span className="text-emerald-900 italic">
                {role}@medstay.com
              </span>
            </p>
            <p className="flex justify-between">
              PASS:{" "}
              <span className="text-emerald-900 italic">any-pass-123</span>
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-black text-slate-400 hover:text-emerald-900 transition-colors cursor-pointer underline underline-offset-8 decoration-emerald-100 decoration-4 hover:decoration-[#b8e2b0]"
          >
            {isLogin
              ? `Don't have an account? Sign Up`
              : "Already registered? Sign In"}
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
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 bg-white">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-20">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] mb-8 w-fit border border-[#b8e2b0]/30 shadow-sm">
            <MapIcon className="w-4 h-4" /> Live Tracking Active
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.05] tracking-tighter">
            Finding hospital beds near <br />
            <span className="bg-gradient-to-r from-emerald-900 to-[#b8e2b0] bg-clip-text text-transparent italic underline decoration-slate-100 decoration-8 underline-offset-10">
              {locationName.split(",")[0]}.
            </span>
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 w-full lg:w-auto">
          <div className="flex items-center bg-[#f9fbf9] border border-slate-100 rounded-[32px] p-2 pl-8 shadow-xl shadow-emerald-900/[0.03] w-full sm:min-w-[400px]">
            <Search className="text-slate-300 w-6 h-6 mr-4" />
            <input
              type="text"
              placeholder="Search Hospital, Area or Specialty..."
              className="bg-transparent border-none outline-none font-bold text-lg flex-1 py-4 text-slate-800"
            />
            <button className="bg-emerald-950 text-white p-5 rounded-[24px] hover:bg-[#b8e2b0] hover:text-emerald-950 transition-all cursor-pointer shadow-lg shadow-emerald-900/10">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-4 mb-16 px-2">
        {[
          "all",
          "Multi-Specialty",
          "Emergency",
          "ICU Priority",
          "Budget Friendly",
        ].map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveFilter(tag)}
            className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border cursor-pointer ${activeFilter === tag ? "bg-emerald-950 text-[#b8e2b0] border-emerald-950 shadow-xl" : "bg-white text-slate-400 border-slate-100 hover:border-[#b8e2b0] hover:text-[#b8e2b0]"}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Hospital Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
        {HOSPITALS.map((h) => (
          <motion.div
            layout
            whileHover={{ y: -12 }}
            key={h.id}
            className="bg-white rounded-[56px] border border-slate-100/60 shadow-2xl shadow-emerald-900/[0.04] overflow-hidden flex flex-col group relative"
          >
            {/* Premium Image Header */}
            <div className="h-80 relative overflow-hidden">
              <img
                src={h.image}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                alt={h.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="absolute top-8 left-8 bg-white/95 backdrop-blur-xl px-5 py-2.5 rounded-[22px] text-[11px] font-black flex items-center gap-2 shadow-2xl border border-white/50">
                <Star className="w-4 h-4 text-[#b8e2b0] fill-[#b8e2b0]" />{" "}
                {h.rating} <span className="text-slate-300">/</span> {h.reviews}{" "}
                Reviews
              </div>
              <div className="absolute bottom-8 right-8 flex items-center gap-3">
                <div className="bg-[#b8e2b0] text-emerald-900 px-5 py-2.5 rounded-[20px] text-[11px] font-black shadow-2xl border border-white/40">
                  {h.distance} Away
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-12 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[#b8e2b0] font-black text-[10px] uppercase tracking-[0.4em] mb-2">
                    {h.type}
                  </p>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none italic">
                    {h.name}
                  </h3>
                </div>
                <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                  <Building2 className="w-6 h-6 text-[#b8e2b0]" />
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-400 mb-10">
                <MapPin className="w-4 h-4" />
                <span className="font-bold text-[13px] tracking-tight">
                  {h.location}
                </span>
              </div>

              {/* Info Matrix */}
              <div className="grid grid-cols-2 gap-5 mb-10">
                <div className="p-6 bg-[#f9fbf9] rounded-[36px] border border-slate-100 group-hover:bg-[#b8e2b0]/5 transition-colors">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Estimate
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">
                      ₹{h.pricePerDay}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      /day
                    </span>
                  </div>
                </div>
                <div className="p-6 bg-emerald-50 rounded-[36px] border border-emerald-100/50">
                  <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mb-2">
                    Inventory
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-emerald-700">
                      {h.wards.reduce(
                        (acc, w) =>
                          acc +
                          w.beds.filter((b) => b.status === "available").length,
                        0,
                      )}
                    </span>
                    <span className="text-[10px] font-black text-emerald-600/60 uppercase">
                      Beds
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedHospital(h)}
                className="mt-auto w-full bg-emerald-950 text-[#b8e2b0] py-6 rounded-[28px] font-black text-lg shadow-xl shadow-emerald-950/20 hover:bg-[#b8e2b0] hover:text-emerald-950 transition-all cursor-pointer flex items-center justify-center gap-4 group"
              >
                Check Live Layout{" "}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>

            {/* Premium Badge */}
            <div className="absolute -right-12 top-20 bg-emerald-950 text-[#b8e2b0] px-14 py-2 transform rotate-45 text-[9px] font-black uppercase tracking-[0.5em] shadow-2xl">
              Verified Node
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Bed Layout Modal */}
      <AnimatePresence>
        {selectedHospital && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-emerald-950/95 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 50 }}
              className="bg-white w-full max-w-6xl rounded-[80px] shadow-2xl relative overflow-hidden flex flex-col md:flex-row max-h-[95vh] border-8 border-white/20"
            >
              {/* Close Icon */}
              <button
                onClick={() => setSelectedHospital(null)}
                className="absolute top-10 right-10 p-5 bg-slate-50 rounded-full hover:bg-emerald-950 hover:text-[#b8e2b0] transition-all cursor-pointer z-[1010] shadow-sm border border-slate-100"
              >
                <X className="w-7 h-7" />
              </button>

              {/* Left Panel: Sidebar Info */}
              <div className="w-full md:w-1/3 bg-[#f9fbf9] p-16 flex flex-col border-r border-slate-100">
                <div className="mb-14">
                  <div className="bg-[#b8e2b0] text-emerald-900 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] w-fit mb-8 shadow-lg shadow-[#b8e2b0]/20">
                    Inventory Node
                  </div>
                  <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter leading-none italic">
                    {selectedHospital.name}
                  </h2>
                  <p className="text-slate-400 font-bold text-lg leading-relaxed">
                    Select your preferred ward category and choose a specific
                    bed slot below.
                  </p>
                </div>

                <div className="space-y-10 mb-16">
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-2xl border-2 border-[#b8e2b0] bg-white shadow-xl" />
                    <div>
                      <p className="text-sm font-black text-slate-800">
                        Available Slot
                      </p>
                      <p className="text-[10px] font-black text-[#b8e2b0] uppercase tracking-widest">
                        Instant Booking
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 border-2 border-slate-200" />
                    <div>
                      <p className="text-sm font-black text-slate-400">
                        Occupied Bed
                      </p>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        Locked
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 border-2 border-[#b8e2b0] border-dashed" />
                    <div>
                      <p className="text-sm font-black text-emerald-700">
                        ICU High Care
                      </p>
                      <p className="text-[10px] font-black text-[#b8e2b0] uppercase tracking-widest">
                        Priority Access
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto p-10 bg-emerald-950 rounded-[48px] text-[#b8e2b0] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-2xl rounded-full" />
                  <h4 className="text-xl font-black mb-3 italic tracking-tight">
                    Need Assistance?
                  </h4>
                  <p className="text-white/40 font-bold text-sm mb-8">
                    Call our floor manager for manual slot allocation.
                  </p>
                  <button className="w-full bg-[#b8e2b0] text-emerald-950 py-4 rounded-2xl font-black shadow-xl hover:bg-white transition-all cursor-pointer text-xs uppercase tracking-widest">
                    Call Admission Desk
                  </button>
                </div>
              </div>

              {/* Right Panel: Grid */}
              <div className="w-full md:w-2/3 p-16 overflow-y-auto no-scrollbar bg-white">
                <BedLayout
                  wards={selectedHospital.wards}
                  onSelect={(bed) => {
                    alert(
                      `Slot ${bed.id} Initialized. Secure your booking now.`,
                    );
                    setSelectedHospital(null);
                    navigate("/auth?mode=register&role=patient");
                  }}
                />

                <div className="mt-20 flex justify-between items-center p-10 bg-[#f9fbf9] rounded-[48px] border border-slate-100">
                  <div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">
                      Admission Protocol
                    </p>
                    <h4 className="text-2xl font-black text-slate-900 italic tracking-tight">
                      Ready to Secure Slot?
                    </h4>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedHospital(null);
                      navigate("/auth?mode=register&role=patient");
                    }}
                    className="bg-emerald-950 text-[#b8e2b0] px-12 py-5 rounded-[28px] font-black text-lg shadow-2xl hover:bg-[#b8e2b0] hover:text-emerald-950 transform hover:scale-105 transition-all cursor-pointer uppercase tracking-widest"
                  >
                    Register Now
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
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="bg-white rounded-[80px] border border-emerald-50 shadow-2xl shadow-emerald-500/[0.05] p-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-14 mb-24">
          <div>
            <div className="flex items-center gap-4 mb-5 group">
              <div className="bg-[#b8e2b0] p-4 rounded-[28px] shadow-xl shadow-[#b8e2b0]/20 transform -rotate-6 group-hover:rotate-0 transition-transform">
                <Stethoscope className="text-emerald-900 w-8 h-8" />
              </div>
              <div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic leading-none">
                  Medicity Hospital
                </h1>
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_15px_#4caf50]" />
                  <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.5em]">
                    Inventory Synchronization Active
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="bg-[#f9fbf9] border border-slate-100 p-10 rounded-[48px] text-center min-w-[220px] shadow-inner">
              <p className="text-[11px] font-black text-emerald-900 tracking-[0.3em] uppercase mb-3">
                Daily Output
              </p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">
                ₹3.42L
              </p>
            </div>
            <div className="bg-emerald-950 p-10 rounded-[48px] text-center text-[#b8e2b0] min-w-[200px] shadow-2xl shadow-emerald-900/20">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 mb-3">
                NPS Rating
              </p>
              <p className="text-4xl font-black flex items-center justify-center gap-3">
                4.9 <Star className="w-8 h-8 fill-[#b8e2b0]" />
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-24">
          <div className="space-y-20">
            <section>
              <h3 className="text-3xl font-black text-slate-900 mb-12 flex items-center gap-4 italic tracking-tight">
                <Settings className="text-[#b8e2b0] w-8 h-8" /> Control Panel
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="p-12 bg-[#f9fbf9] border-2 border-slate-50 rounded-[56px] shadow-inner group hover:border-[#b8e2b0]/30 transition-all">
                  <div className="bg-white w-16 h-16 rounded-3xl flex items-center justify-center shadow-md mb-10 group-hover:scale-110 transition-transform">
                    <IndianRupee className="w-8 h-8 text-[#b8e2b0]" />
                  </div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    Base Floor Rate
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-slate-300">
                      ₹
                    </span>
                    <input
                      type="number"
                      defaultValue={4500}
                      className="bg-transparent border-none text-4xl font-black focus:outline-none w-full text-slate-800"
                    />
                  </div>
                </div>
                <div className="p-12 bg-emerald-50 border-2 border-[#b8e2b0]/20 rounded-[56px] shadow-inner relative overflow-hidden group">
                  <div className="bg-emerald-950 w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg mb-10 group-hover:bg-[#b8e2b0] transition-colors">
                    <Users className="w-8 h-8 text-white group-hover:text-emerald-950" />
                  </div>
                  <label className="block text-[10px] font-black text-emerald-900/60 uppercase tracking-widest mb-4">
                    Live Admissions
                  </label>
                  <p className="text-7xl font-black text-emerald-900 tracking-tighter leading-none">
                    48
                  </p>
                  <div className="absolute top-8 right-8 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm">
                    +12%
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-3xl font-black text-slate-900 italic tracking-tight">
                  Access Log
                </h3>
                <button className="bg-emerald-50 text-emerald-700 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#b8e2b0] hover:text-emerald-950 transition-all cursor-pointer">
                  Export CSV
                </button>
              </div>
              <div className="space-y-6">
                {RECENT_BOOKINGS.map((b) => (
                  <div
                    key={b.id}
                    className="flex justify-between items-center p-10 bg-white border border-slate-100 rounded-[40px] hover:border-[#b8e2b0] hover:shadow-2xl hover:shadow-emerald-900/[0.04] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-8">
                      <div className="w-20 h-20 bg-[#f9fbf9] rounded-[28px] flex items-center justify-center font-black text-slate-300 text-3xl group-hover:bg-[#b8e2b0] group-hover:text-emerald-900 transition-all duration-500 shadow-inner">
                        {b.patient[0]}
                      </div>
                      <div>
                        <p className="font-black text-2xl text-slate-800 tracking-tight">
                          {b.patient}
                        </p>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                          {b.bed} Assigned
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-emerald-950 text-[#b8e2b0] px-6 py-2.5 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] mb-3 inline-block shadow-lg shadow-emerald-950/20">
                        {b.time}
                      </div>
                      <p className="text-[11px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 justify-end">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Panel: Live Manager */}
          <div className="bg-[#f9fbf9] p-16 rounded-[80px] border border-slate-100 shadow-inner flex flex-col">
            <div className="flex justify-between items-start mb-16">
              <div>
                <h3 className="text-4xl font-black text-slate-800 italic tracking-tighter leading-none mb-4">
                  Floor Map
                </h3>
                <p className="text-slate-400 font-bold text-lg">
                  Real-time occupancy visualization
                </p>
              </div>
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-2xl border-4 border-[#f9fbf9] ${i === 1 ? "bg-[#b8e2b0]" : i === 2 ? "bg-emerald-900" : "bg-slate-200"} z-[${10 - i}]`}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <BedLayout
                wards={HOSPITALS[0].wards}
                onSelect={(bed) =>
                  alert(
                    `Master, Slot ${bed.id} Status is being re-calibrated...`,
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MasterAdmin = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col xl:flex-row justify-between items-end gap-20 mb-28">
        <div className="max-w-3xl">
          <div className="bg-emerald-950 px-8 py-3 rounded-full text-[11px] font-black text-[#b8e2b0] uppercase tracking-[0.5em] mb-10 w-fit shadow-2xl shadow-emerald-950/30 border border-[#b8e2b0]/10">
            Super-Node Intelligence
          </div>
          <h1 className="text-7xl md:text-[10rem] font-black text-slate-900 mb-8 tracking-tighter leading-[0.8] italic">
            Master <span className="text-[#b8e2b0]">Control</span>
          </h1>
          <p className="text-2xl text-slate-400 font-bold max-w-2xl tracking-tight leading-relaxed">
            Centralized oversight of 42 partnered hospitals and 1.8k active
            medical transactions across the Bangalore node.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 w-full xl:w-auto">
          <div className="p-12 bg-emerald-950 rounded-[64px] text-[#b8e2b0] shadow-2xl shadow-emerald-950/40 flex flex-col justify-between min-h-[300px] border-4 border-[#b8e2b0]/5">
            <div className="flex justify-between items-start">
              <Users className="w-14 h-14 opacity-20" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-5 h-5 bg-[#b8e2b0] rounded-full shadow-[0_0_20px_#b8e2b0]"
              />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase opacity-40 tracking-[0.4em] mb-4">
                Total Capacity
              </p>
              <p className="text-8xl font-black tracking-tighter leading-none">
                1.4k
              </p>
            </div>
          </div>
          <div className="p-12 bg-white border border-slate-100 rounded-[64px] shadow-2xl shadow-emerald-900/[0.03] flex flex-col justify-between min-h-[300px] group hover:border-[#b8e2b0] transition-colors">
            <div className="flex justify-between items-start text-emerald-500">
              <IndianRupee className="w-14 h-14 opacity-10 group-hover:opacity-40 transition-opacity" />
              <div className="bg-emerald-50 p-3 rounded-2xl">
                <Activity className="w-6 h-6 text-[#b8e2b0]" />
              </div>
            </div>
            <div>
              <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.4em] mb-4">
                Consolidated Vol.
              </p>
              <p className="text-8xl font-black text-slate-900 tracking-tighter leading-none">
                1.2M
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-20">
        <div className="xl:col-span-2 space-y-20">
          {HOSPITALS.map((h) => (
            <div
              key={h.id}
              className="bg-white rounded-[80px] p-16 border border-slate-100/60 shadow-2xl shadow-emerald-900/[0.04] hover:border-[#b8e2b0] transition-all group"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-10">
                <div className="flex items-center gap-10">
                  <div className="bg-emerald-950 w-24 h-24 rounded-[40px] flex items-center justify-center text-[#b8e2b0] shadow-2xl shadow-emerald-950/20 transform -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                    <Building2 className="w-10 h-10" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-[#b8e2b0] uppercase tracking-[0.4em] mb-2">
                      {h.type}
                    </p>
                    <h3 className="text-5xl font-black text-slate-900 tracking-tighter italic leading-none">
                      {h.name}
                    </h3>
                    <p className="text-[13px] font-black text-slate-300 uppercase tracking-widest mt-4 flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-emerald-200" />{" "}
                      {h.location}
                    </p>
                  </div>
                </div>
                <button className="text-emerald-950 font-black text-sm px-12 py-6 bg-[#b8e2b0] rounded-[28px] hover:bg-emerald-950 hover:text-white transition-all shadow-xl shadow-[#b8e2b0]/20 cursor-pointer uppercase tracking-widest">
                  Network Audit
                </button>
              </div>
              <BedLayout
                wards={h.wards}
                onSelect={(bed) =>
                  alert(
                    `Master Override: Re-routing system logic for Slot ${bed.id}`,
                  )
                }
              />
            </div>
          ))}
        </div>

        <div className="space-y-16">
          <div className="bg-white p-16 rounded-[80px] border border-slate-100 shadow-2xl shadow-emerald-900/[0.04] sticky top-32">
            <h3 className="text-3xl font-black mb-14 pb-6 border-b-8 border-emerald-50 flex items-center gap-4 italic tracking-tight">
              <Activity className="text-[#b8e2b0] w-8 h-8" /> Node Health
            </h3>
            <div className="space-y-16">
              <div>
                <div className="flex justify-between text-[11px] font-black uppercase text-slate-400 mb-6 tracking-[0.3em]">
                  <span>Network Saturation</span>{" "}
                  <span className="text-emerald-900 font-black bg-[#b8e2b0] px-3 py-1 rounded-lg">
                    +14% LIVE
                  </span>
                </div>
                <div className="h-6 bg-slate-50 rounded-full overflow-hidden flex border-4 border-white shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "82%" }}
                    transition={{ duration: 2.5, ease: "easeOut" }}
                    className="bg-emerald-950 h-full rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#b8e2b0]/20" />
                  </motion.div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="p-10 bg-[#f9fbf9] rounded-[48px] text-center border border-slate-100 shadow-inner">
                  <p className="text-5xl font-black text-slate-900 tracking-tighter">
                    42
                  </p>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-3">
                    Nodes
                  </p>
                </div>
                <div className="p-10 bg-[#f9fbf9] rounded-[48px] text-center border border-slate-100 shadow-inner">
                  <p className="text-5xl font-black text-slate-900 tracking-tighter">
                    1.8k
                  </p>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-3">
                    Users
                  </p>
                </div>
              </div>
              <button className="w-full bg-emerald-950 text-[#b8e2b0] py-8 rounded-[36px] font-black text-xl hover:bg-[#b8e2b0] hover:text-emerald-950 shadow-2xl shadow-emerald-950/20 transition-all cursor-pointer uppercase tracking-widest">
                Generate Audit
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
      <div className="min-h-screen font-sans bg-white selection:bg-[#b8e2b0] selection:text-emerald-900">
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
          <Route
            path="/hospital"
            element={
              user?.role === "hospital" ? (
                <HospitalPortal />
              ) : (
                <Navigate to="/auth?role=hospital" />
              )
            }
          />
          <Route
            path="/admin"
            element={
              user?.role === "admin" ? (
                <MasterAdmin />
              ) : (
                <Navigate to="/auth?role=admin" />
              )
            }
          />
        </Routes>

        {/* Universal Footer */}
        <footer className="bg-[#f9fbf9] border-t border-emerald-50 py-40 mt-40 rounded-t-[120px]">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-32">
            <div className="col-span-1">
              <div className="mb-12">
                <Logo />
              </div>
              <p className="text-slate-400 font-bold leading-relaxed mb-12 text-xl tracking-tight">
                India's most trusted hospital bed inventory network. Complete
                transparency, 24/7 care.
              </p>
              <div className="flex gap-8">
                <button className="w-16 h-16 bg-white border border-slate-200 rounded-[20px] shadow-sm flex items-center justify-center text-slate-400 hover:text-emerald-900 hover:border-[#b8e2b0] transition-all cursor-pointer">
                  <Phone className="w-7 h-7" />
                </button>
                <button className="w-16 h-16 bg-white border border-slate-200 rounded-[20px] shadow-sm flex items-center justify-center text-slate-400 hover:text-emerald-900 hover:border-[#b8e2b0] transition-all cursor-pointer">
                  <Heart className="w-7 h-7" />
                </button>
                <button className="w-16 h-16 bg-white border border-slate-200 rounded-[20px] shadow-sm flex items-center justify-center text-slate-400 hover:text-emerald-900 hover:border-[#b8e2b0] transition-all cursor-pointer">
                  <MailIcon className="w-7 h-7" />
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-xs uppercase tracking-[0.5em] mb-14">
                Infrastructure
              </h4>
              <ul className="space-y-8 text-slate-500 font-black text-sm uppercase tracking-[0.2em]">
                <li>
                  <button className="hover:text-emerald-900 transition-all cursor-pointer flex items-center gap-3">
                    Live Help Desk <ArrowRight className="w-4 h-4" />
                  </button>
                </li>
                <li>
                  <button className="hover:text-emerald-900 transition-all cursor-pointer flex items-center gap-3">
                    Partner With Us <ArrowRight className="w-4 h-4" />
                  </button>
                </li>
                <li>
                  <button className="hover:text-emerald-900 transition-all cursor-pointer flex items-center gap-3">
                    Regulatory Compliance <ArrowRight className="w-4 h-4" />
                  </button>
                </li>
                <li>
                  <button className="hover:text-emerald-900 transition-all cursor-pointer flex items-center gap-3">
                    System Uptime <ArrowRight className="w-4 h-4" />
                  </button>
                </li>
              </ul>
            </div>
            <div className="bg-emerald-950 rounded-[80px] p-16 text-white relative overflow-hidden shadow-2xl shadow-emerald-900/40">
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#b8e2b0]/20 blur-[120px] rounded-full" />
              <h4 className="text-3xl font-black mb-8 italic tracking-tight italic">
                Emergency Support
              </h4>
              <p className="text-white/40 font-bold mb-14 text-lg leading-relaxed">
                Our clinical admission desk is standing by for manual slot
                allocation.
              </p>
              <button className="w-full bg-[#b8e2b0] text-emerald-950 py-8 rounded-[36px] font-black shadow-2xl active:scale-95 transition-all text-sm uppercase tracking-[0.3em] cursor-pointer hover:bg-white">
                CALL +91 800 MED STAY
              </button>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 pt-24 mt-24 border-t border-emerald-100/50 flex flex-col md:flex-row justify-between items-center gap-10 text-[11px] font-black text-slate-300 uppercase tracking-[0.5em]">
            <span className="italic">
              © 2026 MedStay Technologies Private Limited
            </span>
            <div className="flex gap-14">
              <button className="hover:text-emerald-900 transition-colors cursor-pointer">
                Twitter
              </button>
              <button className="hover:text-emerald-900 transition-colors cursor-pointer">
                Instagram
              </button>
              <button className="hover:text-emerald-900 transition-colors cursor-pointer">
                LinkedIn
              </button>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

// Helper icon not in lucide-react default imports as Mail
const MailIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export default App;
