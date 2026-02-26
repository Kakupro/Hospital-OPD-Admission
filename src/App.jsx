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
  Plus,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

// --- Mock Data ---
const INITIAL_HOSPITALS = [
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
                    localStorage.removeItem("medstay_user");
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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <div className="bg-white scroll-smooth" onMouseMove={handleMouseMove}>
      {/* Hero Section */}
      <section className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6 pt-32 lg:pt-0">
        <div className="absolute top-[-20%] right-[-10%] w-[1200px] h-[1200px] bg-[#b8e2b0]/15 blur-[200px] rounded-full -z-10 animate-pulse" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[1000px] h-[1000px] bg-emerald-100/40 blur-[180px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32 relative">
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-950 text-[#b8e2b0] px-8 py-3 rounded-full text-[12px] font-black uppercase tracking-[0.4em] mb-12 w-fit mx-auto lg:mx-0 shadow-2xl shadow-emerald-950/20"
              >
                The Future of Healthcare Logistics
              </motion.div>

              <h1 className="text-7xl md:text-9xl xl:text-[11rem] font-black text-slate-900 leading-[0.85] mb-14 tracking-tighter">
                Heal <br />
                <span className="text-[#b8e2b0] italic drop-shadow-2xl">Ultra.</span>
              </h1>

              <p className="max-w-2xl text-slate-500 font-bold text-2xl mb-16 leading-relaxed tracking-tight mx-auto lg:mx-0">
                The world's most advanced hospital inventory network.
                Experience <span className="text-slate-900">Zero-Latency admissions</span> and real-time 3D bed tracking.
              </p>

              <div className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-start">
                <Link
                  to="/auth?role=patient"
                  className="px-16 py-8 bg-[#b8e2b0] text-emerald-900 rounded-[32px] font-black text-2xl shadow-[0_30px_60px_-15px_rgba(184,226,176,0.5)] hover:bg-emerald-900 hover:text-white transition-all transform hover:-translate-y-3 flex items-center justify-center gap-4 group"
                >
                  Quick Admission <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
                </Link>
                <Link
                  to="/auth?role=hospital"
                  className="px-16 py-8 bg-white text-slate-900 border-4 border-slate-50 rounded-[32px] font-black text-2xl hover:border-[#b8e2b0] transition-all transform hover:-translate-y-3 shadow-xl shadow-slate-900/5 flex items-center justify-center"
                >
                  Medical Partnership
                </Link>
              </div>

              <div className="mt-24 flex flex-wrap gap-14 justify-center lg:justify-start items-center grayscale opacity-60">
                <div className="flex items-center gap-3"><Users className="w-6 h-6" /><span className="text-xs font-black uppercase tracking-widest">50k+ Trust</span></div>
                <div className="flex items-center gap-3"><Shield className="w-6 h-6" /><span className="text-xs font-black uppercase tracking-widest">ISO 27001 Certified</span></div>
                <div className="flex items-center gap-3"><Activity className="w-6 h-6" /><span className="text-xs font-black uppercase tracking-widest">24/7 Live Monitoring</span></div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-3xl perspective-2000 hidden lg:block">
              <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative group h-[700px]"
              >
                <div className="rounded-[80px] overflow-hidden shadow-[0_80px_160px_rgba(0,0,0,0.2)] border-[16px] border-white relative w-full h-full">
                  <img
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    alt="Futuristic Hospital"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent" />
                </div>

                <motion.div
                  style={{ translateZ: 150 }}
                  className="absolute -bottom-16 -right-16 bg-white p-12 rounded-[48px] shadow-[0_50px_100px_rgba(0,0,0,0.1)] border border-slate-50 flex flex-col gap-6"
                >
                  <Activity className="w-16 h-16 text-[#b8e2b0] animate-pulse" />
                  <div>
                    <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-1">Network Capacity</p>
                    <p className="text-5xl font-black text-slate-900 tracking-tighter">98% Efficient</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-60 bg-slate-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#b8e2b0] rounded-full blur-[300px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white mb-20 tracking-tighter italic leading-tight"
          >
            "Healthcare shouldn't be a search. <br /> It should be a <span className="text-[#b8e2b0]">Certainty.</span>"
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {[
              { title: "Transparency", desc: "Real-time ledger access for every hospital bed in the network. No hidden costs or queues.", icon: Shield },
              { title: "Standardization", desc: "Uniform care quality and pricing across all partner clinics. A truly national standard.", icon: IndianRupee },
              { title: "Empathy-First", desc: "We focus on saving time so you can focus on healing. Zero friction from day one.", icon: Heart },
            ].map((item, i) => (
              <motion.div
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.9 }}
                key={i}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-[#b8e2b0]/20 rounded-[32px] flex items-center justify-center text-[#b8e2b0] mb-12 border border-[#b8e2b0]/30">
                  <item.icon className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">{item.title}</h3>
                <p className="text-slate-400 font-bold text-lg leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-60 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-40 gap-10">
            <div className="max-w-3xl">
              <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.5em] mb-8">The Protocol</p>
              <h2 className="text-7xl md:text-8xl font-black text-slate-900 tracking-tighter leading-tight italic">
                Admission in <br /> <span className="text-[#b8e2b0]">3 Pulse Beats.</span>
              </h2>
            </div>
            <p className="max-w-md text-slate-400 font-bold text-xl leading-relaxed mb-4">
              We've engineered a clinical booking experience that rivals the simplicity of modern digital banking.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {[
              { step: "01", title: "Live Discovery", desc: "Browse real-time ICU and General ward maps across 500+ clinics.", img: "https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=800" },
              { step: "02", title: "Instant Select", desc: "Lock your preferred bed slot with a single click. No wait times.", img: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=800" },
              { step: "03", title: "Swift Entry", desc: "Digital verification at the hospital gate. Entry within 2 minutes.", img: "https://images.unsplash.com/photo-1586773860418-d372a6765b45?auto=format&fit=crop&q=80&w=800" },
            ].map((item, i) => (
              <motion.div
                whileHover={{ y: -20 }}
                key={i}
                className="group relative overflow-hidden rounded-[56px] shadow-2xl h-[600px]"
              >
                <img src={item.img} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={item.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent p-12 flex flex-col justify-end">
                  <p className="text-8xl font-black text-[#b8e2b0]/30 mb-6 drop-shadow-2xl">{item.step}</p>
                  <h3 className="text-4xl font-black text-white mb-4 italic uppercase">{item.title}</h3>
                  <p className="text-slate-200 font-bold leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-60 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="relative">
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#b8e2b0]/20 rounded-full blur-3xl" />
              <img src="https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=1200" className="rounded-[80px] shadow-2xl w-full translate-x-4 translate-y-4" alt="Tech" />
              <div className="absolute bottom-12 -right-12 bg-white p-12 rounded-[48px] shadow-2xl max-w-[280px]">
                <Activity className="text-[#b8e2b0] w-12 h-12 mb-6" />
                <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-1">Latency</p>
                <p className="text-4xl font-black text-slate-900 italic">0.02ms</p>
              </div>
            </div>
            <div>
              <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.5em] mb-10">The Architecture</p>
              <h2 className="text-6xl md:text-8xl font-black text-slate-900 mb-14 tracking-tighter italic leading-none">
                Clinical Grade <br /> <span className="text-emerald-700 underline decoration-[#b8e2b0]">Intelligence.</span>
              </h2>
              <div className="space-y-12">
                {[
                  { title: "Immutable Ledger", desc: "Every bed booking is carved into our cryptographic ledger, ensuring zero double-bookings or priority skips." },
                  { title: "3D Asset Mapping", desc: "Visualize actual floor plans and bed locations via our spatial mapping engine before you arrive." },
                  { title: "Live Oxygen Sync", desc: "Network-wide tracking of critical resources like ventilators and oxygen supply nodes." },
                ].map((feat, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="w-1 h-20 bg-emerald-100 group-hover:bg-[#b8e2b0] transition-colors" />
                    <div>
                      <h4 className="text-2xl font-black text-slate-900 mb-4">{feat.title}</h4>
                      <p className="text-slate-500 font-bold leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Matrix */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { val: "940+", label: "Hospitals Unified", icon: Building2 },
              { val: "2.5M", label: "Lives Touched", icon: Users },
              { val: "100%", label: "Transparency Score", icon: Shield },
              { val: "avg. 3s", label: "Booking Latency", icon: Activity },
            ].map((stat, i) => (
              <div key={i} className="p-12 border-4 border-slate-50 rounded-[56px] hover:border-[#b8e2b0] transition-colors">
                <stat.icon className="w-10 h-10 text-[#b8e2b0] mb-8" />
                <h5 className="text-5xl font-black text-slate-900 mb-2 italic tracking-tighter">{stat.val}</h5>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-60 bg-emerald-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute -bottom-1/2 -right-1/2 w-[1000px] h-[1000px] bg-[#b8e2b0] rounded-full blur-[300px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-7xl md:text-9xl font-black text-white mb-20 tracking-tighter italic leading-[0.85]">
            Ready to heal <br /> <span className="text-[#b8e2b0]">faster?</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-10 justify-center">
            <Link to="/auth?role=patient" className="px-20 py-10 bg-[#b8e2b0] text-emerald-900 rounded-[40px] font-black text-2xl shadow-3xl hover:bg-white transition-all transform hover:-translate-y-4">
              Book a Bed Now
            </Link>
            <Link to="/auth?role=admin" className="px-20 py-10 bg-emerald-900 text-[#b8e2b0] border-4 border-[#b8e2b0]/30 rounded-[40px] font-black text-2xl hover:bg-[#b8e2b0]/10 transition-all transform hover:-translate-y-4">
              Admin Access
            </Link>
          </div>
        </div>
      </section>
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
    const mockUser = {
      id: role === "hospital" ? 1 : 101,
      name:
        role === "admin"
          ? "Admin"
          : role === "hospital"
            ? "Medicity Super Specialty"
            : "Rahul Sharma",
      role: role,
    };
    setUser(mockUser);
    localStorage.setItem("medstay_user", JSON.stringify(mockUser));
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

const PatientPortal = ({ hospitals, setHospitals, bookings, setBookings, user }) => {
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState("Bangalore");
  const [bookingDetails, setBookingDetails] = useState({
    patientName: user?.name || "",
    age: "",
    gender: "Male",
    phone: "",
    reason: "",
  });

  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = userLocation === "All Operations" || h.location.toLowerCase().includes(userLocation.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  const uniqueLocations = Array.from(new Set(hospitals.map(h => {
    const parts = h.location.split(",");
    return parts[parts.length - 1].trim();
  })));

  const handleBooking = (e) => {
    e.preventDefault();

    const newBooking = {
      id: Date.now(),
      ...bookingDetails,
      hospitalName: selectedHospital.name,
      hospitalId: selectedHospital.id,
      bedId: selectedBed.id,
      bedType: selectedBed.type,
      status: "Confirmed",
      timestamp: new Date().toLocaleString(),
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    localStorage.setItem("medstay_bookings", JSON.stringify(updatedBookings));

    const updatedHospitals = hospitals.map(h => {
      if (h.id === selectedHospital.id) {
        return {
          ...h,
          wards: h.wards.map(w => ({
            ...w,
            beds: w.beds.map(b => b.id === selectedBed.id ? { ...b, status: "occupied" } : b)
          }))
        };
      }
      return h;
    });
    setHospitals(updatedHospitals);
    localStorage.setItem("medstay_hospitals", JSON.stringify(updatedHospitals));

    setSelectedBed(null);
    setSelectedHospital(null);
    alert("Booking Successful! Your bed has been reserved.");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 pb-40">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-16">
        <div>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              <MapPin className="w-3 h-3" /> Live Operations
            </div>
            <select
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
              className="bg-slate-900 text-[#b8e2b0] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-none outline-none cursor-pointer hover:bg-emerald-950 transition-colors"
            >
              <option value="All Operations">Global Network</option>
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Inventory in <span className="text-[#b8e2b0] italic">{userLocation === "All Operations" ? "Global Network" : userLocation}.</span>
          </h2>
        </div>

        <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl p-2 w-full lg:w-[400px]">
          <Search className="text-slate-300 w-5 h-5 mx-4" />
          <input
            type="text"
            placeholder="Search within node..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none font-bold text-sm flex-1 py-3"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="mr-4 text-slate-300 hover:text-slate-900">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredHospitals.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-400 font-black uppercase tracking-widest">No nodes found in "{searchQuery}"</p>
          </div>
        ) : (
          filteredHospitals.map((h) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -12 }}
              className="card-premium group"
            >
              <div className="h-64 relative overflow-hidden">
                <img
                  src={h.image}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  alt={h.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-6 left-6 glass px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2">
                  <Star className="w-3 h-3 text-emerald-600 fill-emerald-600" /> {h.rating} ({h.reviews})
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
                  <MapPin className="w-4 h-4 text-[#b8e2b0]" /> {h.location}
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
                  Inspect Layout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))
        )}
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
              className="bg-white w-full max-w-6xl rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <button
                onClick={() => { setSelectedHospital(null); setSelectedBed(null); }}
                className="absolute top-8 right-8 p-3 bg-slate-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer z-[1010]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-1/3 bg-slate-50 p-12 border-r border-slate-100 overflow-y-auto no-scrollbar">
                <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight italic">
                  {selectedHospital.name}
                </h2>
                <p className="text-slate-400 font-bold mb-10 leading-relaxed">
                  {selectedBed
                    ? `You've selected Slot ${selectedBed.id}. Please provide patient details.`
                    : "Select your ward category and choose a specific bed slot for immediate reservation."}
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
                {!selectedBed ? (
                  <BedLayout
                    wards={selectedHospital.wards}
                    onSelect={(bed) => setSelectedBed(bed)}
                  />
                ) : (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h3 className="text-2xl font-black text-slate-900 mb-8">Patient Details</h3>
                    <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Full Name</label>
                        <input
                          required
                          value={bookingDetails.patientName}
                          onChange={(e) => setBookingDetails({ ...bookingDetails, patientName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none font-bold"
                          placeholder="e.g. Rahul Sharma"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Age / Gender</label>
                        <div className="flex gap-4">
                          <input
                            required
                            type="number"
                            value={bookingDetails.age}
                            onChange={(e) => setBookingDetails({ ...bookingDetails, age: e.target.value })}
                            className="w-24 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none font-bold"
                            placeholder="Age"
                          />
                          <select
                            value={bookingDetails.gender}
                            onChange={(e) => setBookingDetails({ ...bookingDetails, gender: e.target.value })}
                            className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none font-bold appearance-none cursor-pointer"
                          >
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Contact Number</label>
                        <input
                          required
                          type="tel"
                          value={bookingDetails.phone}
                          onChange={(e) => setBookingDetails({ ...bookingDetails, phone: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none font-bold"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Reason for Admission</label>
                        <input
                          required
                          value={bookingDetails.reason}
                          onChange={(e) => setBookingDetails({ ...bookingDetails, reason: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none font-bold"
                          placeholder="Short description..."
                        />
                      </div>
                      <div className="md:col-span-2 mt-8 flex gap-4">
                        <button type="button" onClick={() => setSelectedBed(null)} className="flex-1 py-5 border-2 border-slate-100 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all cursor-pointer">Back</button>
                        <button type="submit" className="flex-[2] py-5 bg-[#b8e2b0] text-emerald-900 rounded-2xl font-black shadow-lg hover:bg-emerald-900 hover:text-white transition-all cursor-pointer">Confirm Reservation</button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {bookings.length > 0 && (
        <div className="mt-32">
          <h3 className="text-3xl font-black text-slate-900 mb-10 italic">Your Bookings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{b.timestamp}</p>
                  <h4 className="text-xl font-black text-slate-900 mb-1">{b.hospitalName}</h4>
                  <p className="text-sm font-bold text-emerald-700">Slot: {b.bedId}</p>
                </div>
                <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 text-emerald-700 font-black text-xs">{b.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const HospitalPortal = ({ bookings, hospitals, user }) => {
  const hospitalBookings = bookings.filter(b => b.hospitalName === user?.name);
  const currentHospital = hospitals.find(h => h.name === user?.name) || hospitals[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 pb-40">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-20 bg-slate-900 p-12 rounded-[56px] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#b8e2b0]/10 blur-[120px] rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 bg-[#b8e2b0]/20 text-[#b8e2b0] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 w-fit border border-[#b8e2b0]/20">
            Node: Terminal-EX-01
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight italic">
            {user?.name}
          </h2>
          <p className="text-slate-400 font-bold mt-2">Inventory Management Console</p>
        </div>

        <div className="flex gap-6 relative z-10">
          <div className="glass-dark p-8 rounded-[32px] min-w-[160px]">
            <p className="text-[10px] font-black text-[#b8e2b0] uppercase tracking-widest mb-2">Active</p>
            <p className="text-5xl font-black tracking-tighter">{hospitalBookings.length}</p>
          </div>
          <div className="glass-dark p-8 rounded-[32px] min-w-[160px]">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Capacity</p>
            <p className="text-5xl font-black tracking-tighter">
              {currentHospital.wards.reduce((acc, w) => acc + w.beds.length, 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-3xl font-black text-slate-900 italic tracking-tight">Incoming Queue</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#b8e2b0] rounded-full animate-ping" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Syncing</p>
            </div>
          </div>

          <div className="space-y-8">
            {hospitalBookings.length === 0 ? (
              <div className="bg-slate-50 p-20 rounded-[56px] text-center border-4 border-dashed border-slate-100">
                <p className="text-slate-400 font-black uppercase text-xs tracking-widest">System standby...</p>
                <p className="text-slate-300 font-bold mt-2">Waiting for network requests.</p>
              </div>
            ) : (
              hospitalBookings.map((b) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  key={b.id}
                  className="card-premium p-10 group relative isolate"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-bl-full -z-10 transition-all group-hover:bg-[#b8e2b0]/20" />
                  <div className="flex flex-col md:flex-row justify-between gap-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-5 mb-8">
                        <div className="w-16 h-16 bg-slate-900 rounded-[20px] flex items-center justify-center text-[#b8e2b0] font-black text-xl shadow-xl">
                          {b.patientName[0]}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Patient Identity</p>
                          <h4 className="text-2xl font-black text-slate-900">{b.patientName} <span className="text-slate-300 font-bold ml-2 text-lg">({b.age}y)</span></h4>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Reserved Slot</p>
                          <span className="px-4 py-2 bg-emerald-950 text-[#b8e2b0] rounded-xl text-xs font-black uppercase">{b.bedId}</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Contact</p>
                          <p className="text-sm font-black text-slate-900">{b.phone}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Clinical Note</p>
                          <p className="text-sm font-bold text-slate-600 italic">"{b.reason}"</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center gap-4">
                      <button className="px-10 py-5 bg-[#b8e2b0] text-emerald-900 rounded-[22px] font-black text-xs uppercase tracking-widest hover:bg-emerald-900 hover:text-white transition-all shadow-xl shadow-emerald-900/5">
                        Confirm Entry
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-black text-slate-900 mb-10 italic tracking-tight">Ward Metrics</h3>
          <div className="space-y-8">
            {currentHospital.wards.map((w, idx) => (
              <div key={idx} className="card-premium p-10 bg-slate-50/50">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{w.name}</h4>
                  <span className="text-[12px] font-black text-emerald-900 bg-[#b8e2b0] px-4 py-1.5 rounded-full border border-emerald-900/10">
                    {w.beds.filter(b => b.status === "available").length} Left
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-3 text-xs flex rounded-full bg-slate-200">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(w.beds.filter(b => b.status === "available").length / w.beds.length) * 100}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-emerald-600 to-[#b8e2b0]"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Occupancy</span>
                  <span>{Math.round((w.beds.filter(b => b.status === "occupied").length / w.beds.length) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPortal = ({ bookings, hospitals, setHospitals }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHospital, setNewHospital] = useState({
    name: "",
    location: "",
    pricePerDay: "",
    type: "Multi-Specialty",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
  });

  const handleAddHospital = (e) => {
    e.preventDefault();
    const hospital = {
      ...newHospital,
      id: Date.now(),
      rating: 5.0,
      reviews: 0,
      distance: "0 km",
      wards: [
        { name: "General Ward", beds: Array.from({ length: 15 }, (_, i) => ({ id: `GEN-${i + 1}`, type: "General", status: "available" })) },
        { name: "Executive ICU", beds: Array.from({ length: 8 }, (_, i) => ({ id: `ICU-${i + 1}`, type: "ICU", status: "available" })) }
      ]
    };
    const updated = [...hospitals, hospital];
    setHospitals(updated);
    localStorage.setItem("medstay_hospitals", JSON.stringify(updated));
    setShowAddForm(false);
    setNewHospital({ name: "", location: "", pricePerDay: "", type: "Multi-Specialty", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800" });
    alert("New Node Activated in the Network!");
  };
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 pb-40">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-20 bg-[#b8e2b0] p-16 rounded-[64px] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 bg-emerald-950 text-[#b8e2b0] px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 w-fit shadow-xl">
            Network Operations Command
          </div>
          <h2 className="text-6xl md:text-7xl font-black text-emerald-950 tracking-tighter leading-tight italic">
            Global <br /> <span className="opacity-40">Intelligence</span>
          </h2>
        </div>

        <div className="flex flex-wrap gap-8 relative z-10">
          <motion.div whileHover={{ scale: 1.05 }} className="bg-emerald-950 p-10 rounded-[40px] text-white shadow-2xl min-w-[200px]">
            <p className="text-[10px] font-black text-[#b8e2b0] uppercase tracking-[0.3em] mb-3">Network Reservations</p>
            <p className="text-6xl font-black tracking-tighter italic">{bookings.length}</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-10 rounded-[40px] shadow-2xl min-w-[200px] border border-emerald-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Live Nodes</p>
            <p className="text-6xl font-black text-slate-900 tracking-tighter italic">{hospitals.length}</p>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl min-w-[200px] flex flex-col items-center justify-center gap-2 border-4 border-white/10 hover:border-[#b8e2b0] transition-all cursor-pointer"
          >
            <Plus className="w-8 h-8 text-[#b8e2b0]" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Add Hospital</p>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-2xl rounded-[40px] p-12 shadow-2xl relative">
              <button
                onClick={() => setShowAddForm(false)}
                className="absolute top-10 right-10 p-3 bg-slate-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="mb-10">
                <h3 className="text-3xl font-black text-slate-900 italic tracking-tight">Onboard New Hospital</h3>
                <p className="text-slate-400 font-bold">Deploy a new medical node to the global network.</p>
              </div>
              <form onSubmit={handleAddHospital} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Hospital Name</label>
                    <input required value={newHospital.name} onChange={e => setNewHospital({ ...newHospital, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-[#b8e2b0]/20" placeholder="e.g. City Life Hospital" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Location/City</label>
                    <input required value={newHospital.location} onChange={e => setNewHospital({ ...newHospital, location: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-[#b8e2b0]/20" placeholder="e.g. Bangalore, Sector 4" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Price Per Day (₹)</label>
                    <input required type="number" value={newHospital.pricePerDay} onChange={e => setNewHospital({ ...newHospital, pricePerDay: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-[#b8e2b0]/20" placeholder="e.g. 4500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Facility Type</label>
                    <select value={newHospital.type} onChange={e => setNewHospital({ ...newHospital, type: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold outline-none cursor-pointer">
                      <option>Multi-Specialty</option>
                      <option>General Hospital</option>
                      <option>Trauma Center</option>
                      <option>ICU Specialist</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[24px] font-black text-xl shadow-xl hover:bg-[#b8e2b0] hover:text-emerald-900 transition-all transform hover:-translate-y-2">Activate Node</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="card-premium overflow-hidden p-16 isolate relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#b8e2b0] to-transparent" />
        <div className="flex items-center justify-between mb-16">
          <h3 className="text-3xl font-black text-slate-900 italic tracking-tight">Ledger Operations</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Healthy</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left pb-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Patient Entity</th>
                <th className="text-left pb-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Node Location</th>
                <th className="text-left pb-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Slot ID</th>
                <th className="text-left pb-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Timeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.length === 0 ? (
                <tr><td colSpan="4" className="py-32 text-center text-slate-300 font-bold italic">No active ledger entries...</td></tr>
              ) : (
                bookings.map((b) => (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={b.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="py-10">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-lg group-hover:rotate-6 transition-transform">
                          {b.patientName[0]}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-lg leading-tight">{b.patientName}</p>
                          <p className="text-[10px] font-bold text-slate-400">{b.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-10">
                      <p className="font-black text-slate-600 bg-slate-100 px-4 py-2 rounded-xl text-xs w-fit group-hover:bg-[#b8e2b0] group-hover:text-emerald-900 transition-colors uppercase">
                        {b.hospitalName}
                      </p>
                    </td>
                    <td className="py-10">
                      <span className="font-black text-emerald-700 bg-emerald-50 px-5 py-2.5 rounded-2xl text-[10px] uppercase border border-emerald-100">
                        {b.bedId}
                      </span>
                    </td>
                    <td className="py-10 text-xs font-black text-slate-400 group-hover:text-slate-900 transition-colors">
                      {b.timestamp}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- App Root ---

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("medstay_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [hospitals, setHospitals] = useState(() => {
    const saved = localStorage.getItem("medstay_hospitals");
    return saved ? JSON.parse(saved) : INITIAL_HOSPITALS;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem("medstay_bookings");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [user]);

  // Sync state across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "medstay_bookings") {
        setBookings(JSON.parse(e.newValue || "[]"));
      }
      if (e.key === "medstay_hospitals") {
        setHospitals(JSON.parse(e.newValue || JSON.stringify(INITIAL_HOSPITALS)));
      }
      if (e.key === "medstay_user") {
        setUser(JSON.parse(e.newValue || "null"));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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
                <PatientPortal
                  hospitals={hospitals}
                  setHospitals={setHospitals}
                  bookings={bookings}
                  setBookings={setBookings}
                  user={user}
                />
              ) : (
                <Navigate to="/auth?role=patient" />
              )
            }
          />
          <Route
            path="/hospital"
            element={
              user?.role === "hospital" ? (
                <HospitalPortal
                  bookings={bookings}
                  hospitals={hospitals}
                  user={user}
                />
              ) : (
                <Navigate to="/auth?role=hospital" />
              )
            }
          />
          <Route
            path="/admin"
            element={
              user?.role === "admin" ? (
                <AdminPortal
                  bookings={bookings}
                  hospitals={hospitals}
                  setHospitals={setHospitals}
                />
              ) : (
                <Navigate to="/auth?role=admin" />
              )
            }
          />
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
