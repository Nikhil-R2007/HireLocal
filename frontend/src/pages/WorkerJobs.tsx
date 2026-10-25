import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, Clock, MapPin, CheckCircle2, 
  MessageCircle, Star, Search 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function WorkerJobs() {
  const { bookings } = useApp();
  
  // Jobs that are confirmed or completed (this worker is the provider)
  const myJobs = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed');

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">My Service Schedule</h1>
          <p className="text-gray-500">Track your confirmed jobs and service history.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
           <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100">Schedule</button>
           <button className="px-6 py-2 text-gray-400 text-sm font-bold hover:text-indigo-600">History</button>
        </div>
      </div>

      <div className="space-y-6">
        {myJobs.length === 0 ? (
          <div className="bg-white rounded-[40px] p-20 text-center border border-gray-100 flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6 font-display text-4xl font-bold">
              !
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No active jobs found</h3>
            <p className="text-gray-400 max-w-xs mx-auto mb-8">You haven't accepted any jobs yet. Check the requests tab for new opportunities.</p>
            <button className="px-8 py-3 bg-white border-2 border-indigo-100 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all">
              Go to Job Requests
            </button>
          </div>
        ) : (
          myJobs.map((job, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={job.id}
              className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-8"
            >
              <div className="relative flex-shrink-0">
                 <img src={job.customerImg || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'} className="w-20 h-20 rounded-2xl object-cover shadow-sm" alt="" />
                 {job.status === 'completed' && (
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-1.5 rounded-full text-white shadow-lg">
                      <CheckCircle2 size={16} />
                    </div>
                 )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{job.customerName}</h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    job.status === 'confirmed' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400 font-medium">
                  <span className="flex items-center gap-1.5"><Calendar size={14}/> {new Date(job.scheduledTime).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14}/> {new Date(job.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14}/> {job.address}</span>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end gap-2 pr-4 border-l border-gray-50 pl-8">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payout</p>
                  <p className="text-2xl font-bold text-gray-900">₹{job.totalAmount}</p>
              </div>

              <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                <button className="flex-1 md:flex-none p-4 bg-gray-50 text-indigo-600 rounded-2xl hover:bg-indigo-50 transition-colors">
                  <MessageCircle size={24} />
                </button>
                {job.status === 'confirmed' ? (
                  <button className="flex-1 md:flex-none px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all">
                    Complete Job
                  </button>
                ) : (
                  <button className="flex-1 md:flex-none px-8 py-4 bg-white border border-gray-100 text-gray-400 rounded-2xl font-bold cursor-default">
                    View Receipt
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
