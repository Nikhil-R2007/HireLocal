import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, MessageSquare, Search, Star, Clock, 
  MapPin, TrendingUp, Users, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function HomeDashboard() {
  const { user, bookings } = useApp();
  const navigate = useNavigate();
  
  const upcomingBooking = bookings.find(b => b.status === 'confirmed' || b.status === 'pending');
  const activeBookingsCount = bookings.filter(b => b.status === 'confirmed').length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
            Welcome, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-gray-500 font-medium">Your home services at a glance.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm transition-all hover:bg-gray-50 cursor-pointer">
           <ShieldCheck className="text-emerald-500" size={18} />
           <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">Safe & Secured</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { icon: <Calendar className="text-indigo-600" />, label: 'Active Bookings', value: activeBookingsCount, color: 'bg-indigo-50' },
          { icon: <MessageSquare className="text-emerald-600" />, label: 'New Messages', value: '4', color: 'bg-emerald-50' },
          { icon: <Star className="text-amber-600" />, label: 'Loyalty Points', value: '850', color: 'bg-amber-50' },
          { icon: <Users className="text-pink-600" />, label: 'Pros Nearby', value: '12', color: 'bg-pink-50' },
        ].map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-tighter">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Recent Activity / Next Booking */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your Next Service</h2>
              <Link to="/bookings" className="text-sm font-semibold text-indigo-600 hover:underline flex items-center gap-1 group">
                Manage all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {upcomingBooking ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-indigo-600 rounded-[3rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group border-4 border-white"
              >
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <Clock size={160} strokeWidth={1} />
                 </div>
                 <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-6">
                        <span className={`px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30`}>
                           {upcomingBooking.status} • NEXT
                        </span>
                        <div className="flex -space-x-2">
                           <div className="w-6 h-6 rounded-full border-2 border-indigo-600 bg-white"></div>
                           <div className="w-6 h-6 rounded-full border-2 border-indigo-600 bg-indigo-400"></div>
                        </div>
                      </div>
                      <h3 className="text-3xl lg:text-4xl font-bold mb-4 font-display leading-tight">{upcomingBooking.category} Installation</h3>
                      <div className="flex flex-wrap items-center gap-6 text-indigo-100 text-sm font-medium">
                         <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl"><Clock size={16} /> {new Date(upcomingBooking.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                         <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl"><MapPin size={16} /> {upcomingBooking.address}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-[2rem] border border-white/20">
                       <div className="text-right">
                          <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-0.5">Professional</p>
                          <p className="font-bold">{upcomingBooking.workerName}</p>
                       </div>
                       <img src={upcomingBooking.workerImg} className="w-16 h-16 rounded-2xl border-2 border-white/40 shadow-lg object-cover" alt="" />
                    </div>
                 </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-[3rem] p-12 text-center border-2 border-dashed border-gray-100 flex flex-col items-center group hover:border-indigo-200 transition-all cursor-pointer" onClick={() => navigate('/discovery')}>
                <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-200 mb-6 group-hover:scale-110 transition-all">
                   <Search size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No upcoming services</h3>
                <p className="text-gray-400 text-sm max-w-xs mx-auto">
                  Find the best local experts to help you with your home tasks today.
                </p>
                <button className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                  Browse Experts
                </button>
              </div>
            )}
          </section>

          <section>
            <div className="flex justify-between items-center mb-6 pt-4">
              <h2 className="text-xl font-bold text-gray-900">Recommended Pros</h2>
              <Link to="/discovery" className="text-sm font-semibold text-indigo-600 hover:underline">See all experts</Link>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
               {[
                 { name: 'Arjun Sharma', skill: 'Plumbing Expert', rate: 450, rating: 4.8, img: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&h=400&fit=crop' },
                 { name: 'Priya Verma', skill: 'Wiring Specialist', rate: 800, rating: 4.9, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' }
               ].map((worker, i) => (
                 <div key={i} className="p-6 bg-white rounded-[2rem] border border-gray-100 flex gap-6 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all group cursor-pointer">
                    <img src={worker.img} className="w-20 h-20 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt="" />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors text-lg">{worker.name}</h4>
                      <p className="text-xs text-gray-400 font-bold mb-3 uppercase tracking-tighter">{worker.skill}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                         <div className="flex items-center gap-1 text-[10px] font-black text-gray-400">
                            <Star size={12} className="fill-yellow-500 text-yellow-500" />
                            {worker.rating}
                         </div>
                         <span className="text-sm font-bold text-indigo-600">₹{worker.rate}/hr</span>
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          </section>
        </div>

        {/* Right: Quick Actions / Tips / Promo */}
        <div className="space-y-8">
           {/* Quick Actions Card */}
           <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                 <Link to="/discovery" className="p-5 bg-gray-50 rounded-[1.5rem] flex flex-col items-center gap-3 hover:bg-indigo-600 hover:text-white transition-all border border-transparent shadow-sm group">
                    <Search size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-center">Hire Pro</span>
                 </Link>
                 <Link to="/bookings" className="p-5 bg-gray-50 rounded-[1.5rem] flex flex-col items-center gap-3 hover:bg-indigo-600 hover:text-white transition-all border border-transparent shadow-sm group">
                    <Calendar size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-center">Schedule</span>
                 </Link>
              </div>
           </div>

           {/* Safety Banner */}
           <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-50">
              <ShieldCheck className="absolute -bottom-4 -right-4 text-white/10" size={140} strokeWidth={1} />
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-4 font-display">Safety First</h3>
                <p className="text-emerald-50/80 text-sm italic leading-relaxed mb-6">
                  "Every professional on HireLocal is background verified. Your safety is our top priority."
                </p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                   <div className="w-6 h-1 bg-white rounded-full"></div>
                   Verified Network
                </div>
              </div>
           </div>

           {/* Help Card */}
           <div className="bg-indigo-50/50 rounded-[2.5rem] p-8 border border-indigo-100">
              <h4 className="font-bold text-indigo-900 mb-2">Need help?</h4>
              <p className="text-xs text-indigo-600/70 mb-6 leading-relaxed">Our support team is available 24/7 to assist with your bookings.</p>
              <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl text-xs font-bold shadow-sm hover:shadow-md transition-all border border-indigo-100/50 uppercase tracking-widest">
                Contact Support
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
