import React, { useState } from 'react';
import { Search, MapPin, Bed, Phone, Star, Shield, Filter, Cross, Activity, User, Heart, ChevronRight, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_HOSPITALS = [
  {
    id: 1,
    name: "City General Hospital",
    location: "Indiranagar, Bangalore",
    totalBeds: 150,
    availableBeds: 12,
    type: "Multi-Specialty",
    rating: 4.8,
    reviews: 1240,
    pricePerDay: 4500,
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=800",
    features: ["Oxygen Support", "ICU Available", "24/7 Pharmacy"]
  },
  {
    id: 2,
    name: "Astra Specialty Care",
    location: "Koramangala, Bangalore",
    totalBeds: 80,
    availableBeds: 5,
    type: "Cardiology",
    rating: 4.6,
    reviews: 850,
    pricePerDay: 6200,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
    features: ["Advanced Labs", "Emergency Care", "Private Suites"]
  },
  {
    id: 3,
    name: "SafeHands Community Hospital",
    location: "Whitefield, Bangalore",
    totalBeds: 200,
    availableBeds: 45,
    type: "General Practice",
    rating: 4.2,
    reviews: 620,
    pricePerDay: 2800,
    image: "https://images.unsplash.com/photo-1632833239869-a37e31580662?auto=format&fit=crop&q=80&w=800",
    features: ["Child Care", "Maternity", "Ambulance Service"]
  }
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [hospitals, setHospitals] = useState(MOCK_HOSPITALS);
  const [isHospitalAdmin, setIsHospitalAdmin] = useState(false);
  const [myBedCount, setMyBedCount] = useState(12);

  const filteredHospitals = hospitals.filter(h =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Premium Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-200">
                <Cross className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">MedStay</span>
            </div>

            <div className="hidden md:flex items-center gap-10">
              <nav className="flex gap-8 text-sm font-bold text-slate-500">
                <a href="#" className="hover:text-blue-600 transition-colors">Find Beds</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Emergency</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Doctor Consult</a>
              </nav>
              <div className="h-6 w-px bg-slate-200" />
              <button
                onClick={() => setIsHospitalAdmin(!isHospitalAdmin)}
                className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-xl transition-all border border-blue-100"
              >
                {isHospitalAdmin ? "Switch to Booking" : "Hospital Partner Login"}
              </button>
              <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all">
                Sign In
              </button>
            </div>

            <button className="md:hidden p-2 text-slate-600">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <main>
        {!isHospitalAdmin ? (
          <>
            {/* Hero Section */}
            <section className="relative pt-16 pb-24 overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 blur-[120px] rounded-full -mr-64 -mt-32" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-100/30 blur-[100px] rounded-full -ml-32 -mb-32" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-3xl mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-6"
                  >
                    <Activity className="w-3.5 h-3.5" /> Over 500+ Hospitals Listed
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8"
                  >
                    Find and Book <br />
                    <span className="text-blue-600">Hospital Beds </span>
                    Instantly.
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl"
                  >
                    Check real-time availability of ICU, Oxygen, and General beds.
                    Simplified admissions for you and your loved ones.
                  </motion.p>
                </div>

                {/* OYO-style Search Box */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white p-2.5 rounded-[32px] shadow-2xl shadow-blue-900/10 border border-slate-100 flex flex-col md:flex-row gap-2 max-w-4xl"
                >
                  <div className="flex-[1.5] flex items-center gap-4 px-6 py-4 rounded-3xl hover:bg-slate-50 transition-colors group">
                    <Search className="w-6 h-6 text-slate-400 group-focus-within:text-blue-600" />
                    <input
                      type="text"
                      placeholder="Search Hospital or Locality"
                      className="w-full bg-transparent border-none outline-none font-bold text-slate-800 placeholder:text-slate-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="hidden md:block w-px h-10 self-center bg-slate-100" />
                  <div className="flex-1 flex items-center gap-4 px-6 py-4 rounded-3xl hover:bg-slate-50 transition-colors">
                    <MapPin className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</div>
                      <div className="font-bold text-slate-800">Bangalore, India</div>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-10 py-5 rounded-[24px] font-black text-lg hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-200">
                    Find Beds
                  </button>
                </motion.div>

                {/* Categories */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-4 mt-12 overflow-x-auto no-scrollbar pb-4"
                >
                  {["All Hospitals", "ICU Beds", "Oxygen Support", "Cardiac Care", "Child Care", "Maternity"].map((cat, i) => (
                    <button key={cat} className={`whitespace-nowrap px-6 py-3 rounded-2xl text-sm font-bold transition-all border ${i === 0 ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' : 'bg-white text-slate-600 border-slate-100 hover:border-blue-200 hover:text-blue-600'}`}>
                      {cat}
                    </button>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* List Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Recommended for You</h2>
                  <p className="text-slate-500 font-medium">Top rated hospitals with available facilities</p>
                </div>
                <button className="flex items-center gap-2 text-blue-600 font-black text-sm hover:underline">
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredHospitals.map(h => (
                  <motion.div
                    layout
                    key={h.id}
                    className="bg-white rounded-[40px] border border-slate-100 overflow-hidden group hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img src={h.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={h.name} />
                      <div className="absolute top-6 right-6 bg-white/95 backdrop-blur px-3 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-xl">
                        <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" /> {h.rating} ({h.reviews})
                      </div>
                      <div className="absolute bottom-6 left-6 flex gap-2">
                        <span className="bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Verified</span>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-black text-slate-900 mb-1">{h.name}</h3>
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                            <MapPin className="w-3.5 h-3.5" /> {h.location}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mb-8 flex-wrap">
                        {h.features.slice(0, 2).map(f => (
                          <span key={f} className="text-[10px] font-black text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 uppercase tracking-tighter">
                            {f}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                        <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Starting From</div>
                          <div className="text-2xl font-black text-slate-900">₹{h.pricePerDay}<span className="text-sm font-bold text-slate-400">/day</span></div>
                        </div>
                        <button className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95">
                          Book Bed
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="max-w-5xl mx-auto px-4 py-20">
            <div className="bg-white rounded-[48px] p-12 border border-slate-100 shadow-2xl shadow-blue-900/5">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 mb-2">Hospital Dashboard</h2>
                  <p className="text-slate-500 font-medium">Manage your clinical inventory and live status</p>
                </div>
                <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-3xl font-black text-sm flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" /> Live on MedStay
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                  { label: "Available Beds", value: myBedCount, icon: Bed, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Active Bookings", value: 12, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "Avg. Patient Stay", value: "4.2d", icon: User, color: "text-orange-600", bg: "bg-orange-50" }
                ].map((stat, i) => (
                  <div key={i} className="p-8 rounded-[32px] border border-slate-50 bg-slate-50/50">
                    <stat.icon className={`${stat.color} w-8 h-8 mb-6`} />
                    <div className="text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-600 rounded-[40px] p-10 text-white">
                <div className="max-w-md">
                  <h3 className="text-2xl font-black mb-4">Quick Update Inventory</h3>
                  <p className="text-blue-100 font-medium mb-8 leading-relaxed">Update your bed count instantly. This will reflect on the main search engine immediately for all customers.</p>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-3 text-blue-200">Total Available Beds</label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={myBedCount}
                      onChange={(e) => setMyBedCount(parseInt(e.target.value) || 0)}
                      className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-2xl font-black outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    />
                    <button className="bg-white text-blue-600 px-10 rounded-2xl font-black hover:bg-blue-50 transition-all">
                      Save Status
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <Cross className="text-white w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-slate-900">MedStay</span>
              </div>
              <p className="text-slate-400 font-medium max-w-sm mb-10 leading-relaxed">
                Empowering patients with real-time healthcare data. Making bed booking as easy as booking a hotel room.
              </p>
              <div className="flex gap-4">
                {[Heart, Shield, Phone].map((Icon, i) => (
                  <div key={i} className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <Icon className="w-5 h-5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-8">Quick Links</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li><a href="#" className="hover:text-blue-600">Find a Hospital</a></li>
                <li><a href="#" className="hover:text-blue-600">Bed Availability</a></li>
                <li><a href="#" className="hover:text-blue-600">Emergency Care</a></li>
                <li><a href="#" className="hover:text-blue-600">Admin Login</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-8">Support</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li><a href="#" className="hover:text-blue-600">24/7 Helpline</a></li>
                <li><a href="#" className="hover:text-blue-600">Partner with Us</a></li>
                <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2026 MedStay Technologies. All Rights Reserved.</div>
            <div className="flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <a href="#">Twitter</a>
              <a href="#">Instagram</a>
              <a href="#">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
