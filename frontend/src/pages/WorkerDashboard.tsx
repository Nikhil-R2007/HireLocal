import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, Users, Star, IndianRupee, Clock, CheckCircle2, 
  ArrowUpRight, MessageSquare, Calendar 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function WorkerDashboard() {
  const { bookings } = useApp();
  
  const workerJobs = bookings.filter(b => b.status !== 'cancelled');
  const totalEarnings = workerJobs.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const pendingRequests = bookings.filter(b => b.status === 'pending').length;

  const stats = [
    { label: 'Total Earnings', value: `₹${totalEarnings}`, icon: <IndianRupee className="text-emerald-600" />, color: 'bg-emerald-50' },
    { label: 'Jobs Completed', value: '1', icon: <CheckCircle2 className="text-blue-600" />, color: 'bg-blue-50' },
    { label: 'Pending Requests', value: pendingRequests, icon: <Clock className="text-amber-600" />, color: 'bg-amber-50' },
    { label: 'Average Rating', value: '4.8', icon: <Star className="text-indigo-600" />, color: 'bg-indigo-50' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Professional Dashboard</h1>
          <p className="text-gray-500">Manage your bookings, earnings, and performance.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Accepting Jobs</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-default"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Jobs */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
              <button className="text-sm font-semibold text-indigo-600 hover:underline">View Schedule</button>
            </div>
            
            <div className="space-y-4">
              {workerJobs.filter(b => b.status === 'confirmed').length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                    <Calendar size={32} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">No upcoming jobs</h3>
                  <p className="text-sm text-gray-400">Your confirmed jobs will appear here.</p>
                </div>
              ) : (
                workerJobs.filter(b => b.status === 'confirmed').map((job) => (
                  <div key={job.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col md:flex-row items-center gap-6 group hover:border-indigo-100 transition-colors">
                    <img src={job.customerImg || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900">{job.customerName}</h4>
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-bold uppercase tracking-wider">{job.category}</span>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <Clock size={12} /> {new Date(job.scheduledTime).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                        <ArrowUpRight size={12} /> {job.address}
                      </p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <button className="flex-1 md:flex-none px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors">Start Job</button>
                      <button className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                        <MessageSquare size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Sidebar: Performance & Tips */}
        <div className="space-y-8">
          <div className="bg-indigo-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4">Elite Performance</h3>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed">You're in the top 5% of plumbers in Mumbai. Keep up the good work to unlock "Verified Gold" status.</p>
              <div className="h-2 bg-white/20 rounded-full mb-2">
                <div className="h-full bg-emerald-400 rounded-full w-[85%] transition-all"></div>
              </div>
              <p className="text-[10px] font-bold text-white/60">3 MORE JOBS UNTIL GOLD</p>
            </div>
            <TrendingUp className="absolute -bottom-4 -right-4 text-white/5" size={160} />
          </div>

          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
            <h3 className="font-bold mb-6 text-gray-900 flex items-center gap-2">
              <Star className="text-amber-500 fill-amber-500" size={18} />
              Growth Tips
            </h3>
            <div className="space-y-6">
              {[
                { title: 'Update your tools', desc: 'Listing new equipment can increase booking rates by 20%.' },
                { title: 'Quick responses', desc: 'Workers who reply within 5 mins get 2x more confirmed jobs.' }
              ].map((tip, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-400">{i+1}</div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 mb-1">{tip.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
