import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardCheck, Clock, MapPin, Check, X, AlertCircle, 
  MessageSquare, User 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function JobRequests() {
  const { bookings, updateBookingStatus } = useApp();
  
  const requests = bookings.filter(b => b.status === 'pending');

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Job Requests</h1>
        <p className="text-gray-500">Incoming service requests from customers in your area.</p>
      </header>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {requests.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[40px] p-16 text-center border border-gray-100 flex flex-col items-center justify-center shadow-sm"
            >
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-6 shadow-inner">
                <ClipboardCheck size={48} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">All caught up!</h2>
              <p className="text-gray-500 max-w-sm mx-auto">
                No new job requests at the moment. Make sure your status is set to "Online" to receive new bookings.
              </p>
              <button className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                Check Promotions
              </button>
            </motion.div>
          ) : (
            requests.map((request, i) => (
              <motion.div
                key={request.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                  <div className="relative">
                    <img 
                      src={request.customerImg || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop'} 
                      className="w-20 h-20 rounded-2xl object-cover shadow-md" 
                      alt="" 
                    />
                    <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-sm border border-gray-50">
                      <div className="w-4 h-4 bg-amber-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{request.customerName}</h3>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">{request.category}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-indigo-400" />
                        <span className="font-medium text-gray-700">{new Date(request.scheduledTime).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-indigo-400" />
                        <span className="font-medium text-gray-700">{request.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle size={16} className="text-indigo-400" />
                        <span className="font-bold text-emerald-600">Total: ₹{request.totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => updateBookingStatus(request.id, 'confirmed')}
                      className="flex-1 md:flex-none h-14 w-14 lg:w-auto lg:px-6 bg-emerald-500 text-white rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-600 shadow-lg shadow-emerald-50 transition-all font-bold"
                    >
                      <Check size={24} />
                      <span className="hidden lg:inline">Accept</span>
                    </button>
                    <button 
                      onClick={() => updateBookingStatus(request.id, 'cancelled')}
                      className="flex-1 md:flex-none h-14 w-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-100 transition-all border border-red-100"
                    >
                      <X size={24} />
                    </button>
                    <button className="h-14 w-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100">
                      <MessageSquare size={24} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 bg-amber-50 border border-amber-100 rounded-3xl p-6 flex items-start gap-4">
        <div className="p-2 bg-white rounded-xl text-amber-500 shadow-sm">
          <AlertCircle size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-900 mb-1">Response Time Matters</h4>
          <p className="text-xs text-amber-700 leading-relaxed">
            Accepting requests quickly improves your ranking and likelihood of getting more premium jobs. Try to respond within 15 minutes of receiving a request.
          </p>
        </div>
      </div>
    </div>
  );
}
