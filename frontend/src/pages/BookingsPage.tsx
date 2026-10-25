import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, MapPin, CheckCircle2, XCircle, AlertCircle, 
  ChevronRight, MessageCircle, Calendar, User, Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending': return <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"><Clock size={12}/> Pending</span>;
    case 'confirmed': return <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"><CheckCircle2 size={12}/> Upcoming</span>;
    case 'on-the-way': return <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"><Clock size={12}/> On the way</span>;
    case 'arriving-soon': return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse"><Clock size={12}/> Arriving Soon</span>;
    case 'completed': return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"><CheckCircle2 size={12}/> Completed</span>;
    case 'cancelled': return <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"><XCircle size={12}/> Cancelled</span>;
    default: return null;
  }
};

export default function BookingsPage() {
  const { bookings } = useApp();

  const getETADisplay = (booking: any) => {
    if (booking.status === 'completed' || booking.status === 'cancelled' || booking.status === 'pending') return null;
    
    const now = Date.now();
    const scheduled = booking.scheduledTime;
    const diffMs = scheduled - now;
    const diffMins = Math.floor(diffMs / 60000);

    if (booking.status === 'arriving-soon') {
      return {
        label: 'Arriving in',
        value: `${booking.etaMinutes || 5} mins`,
        sub: `Expected at ${new Date(scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50'
      };
    }

    if (booking.status === 'on-the-way') {
      return {
        label: 'ETA',
        value: `${booking.etaMinutes || 25} mins`,
        sub: 'Worker is traveling',
        color: 'text-blue-600',
        bg: 'bg-blue-50'
      };
    }

    if (diffMins > 0) {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return {
        label: 'Starts in',
        value: hours > 0 ? `${hours}h ${mins}m` : `${mins} mins`,
        sub: `Expected reach: ${new Date(scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50'
      };
    }

    return null;
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
           <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">My Bookings</h1>
           <p className="text-sm text-gray-500">Track and manage your service history</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
           <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100">All</button>
           <button className="px-6 py-2 text-gray-400 text-sm font-bold hover:text-indigo-600 transition-colors">Past</button>
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {bookings.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] p-20 text-center border border-gray-100 flex flex-col items-center shadow-sm"
            >
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-300 mb-8 shadow-inner">
                <Search size={48} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No bookings yet</h2>
              <p className="text-gray-500 max-w-sm mx-auto mb-10 leading-relaxed">
                You haven't scheduled any services. Browse our categories to find verified professionals for your home.
              </p>
              <Link to="/discovery" className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                Explore Services
              </Link>
            </motion.div>
          ) : (
            bookings.map((booking, i) => {
              const eta = getETADisplay(booking);
              return (
              <motion.div 
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.1 }}
                key={booking.id}
                className="group bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-default"
              >
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="relative">
                    <img src={booking.workerImg} className="w-20 h-20 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform" alt="" />
                    <div className={`absolute -bottom-1 -right-1 p-2 rounded-full shadow-lg ${
                      booking.status === 'confirmed' ? 'bg-indigo-500 text-white' : 
                      booking.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                      booking.status === 'on-the-way' ? 'bg-blue-500 text-white' :
                      booking.status === 'arriving-soon' ? 'bg-emerald-500 text-white' :
                      booking.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                       {booking.status === 'pending' || booking.status === 'on-the-way' ? <Clock size={14} /> : <CheckCircle2 size={14} />}
                    </div>
                  </div>

                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mb-3">
                      <h3 className="font-bold text-xl text-gray-900">{booking.category} with {booking.workerName}</h3>
                      <StatusBadge status={booking.status} />
                    </div>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-500 font-medium">
                      <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100"><Calendar size={14} className="text-indigo-400" /> {new Date(booking.scheduledTime).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100"><Clock size={14} className="text-indigo-400" /> {new Date(booking.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100"><MapPin size={14} className="text-indigo-400" /> {booking.address}</span>
                    </div>

                    {eta && (
                      <div className={`mt-6 inline-flex items-center gap-4 ${eta.bg} p-2 pr-6 rounded-2xl border border-gray-100`}>
                        <div className={`w-10 h-10 ${eta.color.replace('text-', 'bg-').concat('/10')} rounded-xl flex items-center justify-center ${eta.color}`}>
                           <Clock size={20} className={booking.status === 'arriving-soon' ? 'animate-pulse' : ''} />
                        </div>
                        <div>
                           <div className="flex items-center gap-2">
                             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{eta.label}</p>
                             <span className={`text-xs font-bold ${eta.color}`}>{eta.value}</span>
                           </div>
                           <p className="text-xs text-gray-500 font-medium">{eta.sub}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-6 w-full lg:w-auto pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-100 pl-0 lg:pl-10">
                    <div className="text-right hidden sm:block mr-4">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Payment</p>
                      <p className="font-bold text-gray-900 text-2xl">₹{booking.totalAmount}</p>
                    </div>
                    <div className="flex gap-3 flex-1 lg:flex-initial">
                      <Link to="/chat" className="flex-1 lg:flex-none h-14 w-14 lg:w-14 bg-gray-50 text-indigo-600 rounded-2xl hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100 flex items-center justify-center">
                        <MessageCircle size={24} />
                      </Link>
                      <button className="flex-1 lg:flex-none px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm">
                        Details
                      </button>
                    </div>
                  </div>
                </div>

                {booking.status === 'cancelled' && (
                  <div className="mt-6 p-4 bg-red-50/50 rounded-2xl border border-red-50 flex items-center gap-3">
                    <AlertCircle size={14} className="text-red-500" />
                    <p className="text-xs text-red-700 font-medium italic">This booking was cancelled. Re-book to find another expert.</p>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </AnimatePresence>
      </div>

      <div className="mt-16 p-10 bg-indigo-900 rounded-[40px] relative overflow-hidden shadow-2xl shadow-indigo-100/50">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
         <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-3xl"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-[32px] flex items-center justify-center border border-white/20 shadow-inner rotate-3">
               <AlertCircle size={48} className="text-white" />
            </div>
            <div className="text-center md:text-left flex-1">
               <h4 className="text-2xl font-bold text-white mb-3 font-display">Rescheduling Policy</h4>
               <p className="text-indigo-100 leading-relaxed max-w-xl text-sm italic">
                  "Life happens! You can reschedule or cancel any confirmed booking up to 2 hours before the start time at no charge. We value your time and our professionals' schedules."
               </p>
            </div>
            <button className="px-10 py-5 bg-white text-indigo-900 rounded-[24px] font-bold shadow-xl hover:bg-indigo-50 active:scale-95 transition-all text-sm uppercase tracking-widest whitespace-nowrap">
               View Help Center
            </button>
         </div>
      </div>
    </div>
  );
}
