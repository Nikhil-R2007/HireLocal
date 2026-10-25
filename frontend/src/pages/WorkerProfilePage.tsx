import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, MapPin, Shield, Clock, Phone, MessageSquare, 
  ChevronRight, Calendar, CheckCircle2, User, Award, 
  ArrowLeft, CreditCard, AlertCircle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

// Sample Workers Data (Matched with WorkerDiscovery)
const WORKERS = [
  {
    uid: '1',
    name: 'Arjun Sharma',
    skills: ['Plumbing', 'Pipe leak expert'],
    rating: 4.8,
    reviewCount: 124,
    isOnline: true,
    hourlyRate: 450,
    experience: '8+ years',
    bio: 'Certified plumbing professional with over 8 years of experience. Specialist in domestic pipe leaks, water heater installations, and sanitary fitting. Known for prompt service and clean workspace.',
    photoURL: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&h=400&fit=crop',
    location: { lat: 19.0760, lng: 72.8777, address: 'Andheri, Mumbai' },
    recentReviews: [
      { 
        id: 'r1', 
        userName: 'Sumit Khanna', 
        userImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        rating: 5, 
        comment: 'Very professional. Fixed the leak in 20 minutes. Highly recommended for any plumbing issues.', 
        date: '2 days ago' 
      },
      { 
        id: 'r2', 
        userName: 'Anjali Pathak', 
        userImg: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        rating: 4, 
        comment: 'Good work, but arrived 10 mins late. The quality of work was excellent though.', 
        date: '1 week ago' 
      },
      { 
        id: 'r3', 
        userName: 'Rohan Mehra', 
        userImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        rating: 5, 
        comment: 'Arjun is very polite and knows his work well. Cleaned up the workspace perfectly after finishing.', 
        date: '2 weeks ago' 
      }
    ]
  },
  {
    uid: '2',
    name: 'Priya Verma',
    skills: ['Electrician', 'Wiring'],
    rating: 4.9,
    reviewCount: 56,
    isOnline: true,
    hourlyRate: 800,
    experience: '5+ years',
    bio: 'Professional electrician specialized in residential wiring and appliance repairs. Focused on safety and efficiency.',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    location: { lat: 13.0827, lng: 80.2707, address: 'Adyar, Chennai' },
    recentReviews: [
      { 
        id: 'r4', 
        userName: 'Karan Singh', 
        userImg: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
        rating: 5, 
        comment: 'Excellent service. Fixed my AC wiring perfectly.', 
        date: '3 days ago' 
      },
      { 
        id: 'r5', 
        userName: 'Sneha Rao', 
        userImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
        rating: 5, 
        comment: 'Very professional, arrived exactly on time.', 
        date: '1 month ago' 
      }
    ]
  }
];

export default function WorkerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addBooking, user } = useApp();
  
  const [bookingStep, setBookingStep] = useState<'idle' | 'selecting' | 'confirming' | 'success'>('idle');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('10:00');

  const worker = WORKERS.find(w => w.uid === id) || WORKERS[0];

  const handleBookNow = () => {
    setBookingStep('selecting');
  };

  const handleConfirmBooking = () => {
    setBookingStep('confirming');
    
    // Simulate API call
    setTimeout(() => {
      const scheduledTime = new Date(`${selectedDate}T${selectedTime}`).getTime();
      addBooking({
        id: Math.random().toString(36).substr(2, 9),
        customerId: user?.uid || 'temp_cust',
        customerName: user?.name || 'Nikhil',
        workerId: worker.uid,
        workerName: worker.name,
        category: worker.skills[0],
        status: 'pending',
        scheduledTime: scheduledTime,
        createdAt: Date.now(),
        totalAmount: worker.hourlyRate * 2, // Default 2 hours
        address: worker.location?.address || 'Mumbai, MH',
        workerImg: worker.photoURL,
        customerImg: user?.photoURL
      });
      setBookingStep('success');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Header */}
      <div className="relative h-64 bg-indigo-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pattern-grid-white"></div>
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-md transition-all border border-white/10"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
               <div className="flex flex-col md:flex-row items-start md:items-end gap-8 mb-8">
                  <div className="relative">
                    <img 
                      src={worker.photoURL} 
                      className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] object-cover shadow-2xl border-4 border-white" 
                      alt="" 
                    />
                    {worker.isOnline && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Top Rated Pro</span>
                       <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Identity Verified</span>
                    </div>
                    <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">{worker.name}</h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 font-medium">
                       <span className="flex items-center gap-1.5"><Star size={16} className="text-yellow-400 fill-yellow-400"/> {worker.rating} ({worker.reviewCount} reviews)</span>
                       <span className="flex items-center gap-1.5"><MapPin size={16}/> {worker.location?.address}</span>
                       <span className="flex items-center gap-1.5 text-indigo-600 font-bold"><Award size={16}/> {worker.experience} Experience</span>
                    </div>
                  </div>
               </div>

               <div className="space-y-6">
                 <section>
                   <h3 className="text-lg font-bold text-gray-900 mb-3">About</h3>
                   <p className="text-gray-500 leading-relaxed italic pr-12">"{worker.bio}"</p>
                 </section>

                 <section>
                   <h3 className="text-lg font-bold text-gray-900 mb-3">Skills & Expertise</h3>
                   <div className="flex flex-wrap gap-2">
                     {worker.skills.map(skill => (
                       <span key={skill} className="px-4 py-2 bg-gray-50 text-gray-700 rounded-2xl text-xs font-bold border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-default">
                         {skill}
                       </span>
                     ))}
                   </div>
                 </section>
               </div>
            </div>

            {/* Reviews Section */}
            <div id="reviews-section" className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
               <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
                 <div className="flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-2xl">
                   <Star size={16} className="text-indigo-600 fill-indigo-600" />
                   <span className="text-sm font-bold text-indigo-600">{worker.rating}</span>
                   <span className="text-xs text-indigo-400 font-medium">({worker.reviewCount})</span>
                 </div>
               </div>

               <div className="space-y-6">
                 {worker.recentReviews.length > 0 ? worker.recentReviews.map(review => (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     key={review.id} 
                     className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 hover:border-indigo-100 transition-all group"
                   >
                     <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                       <div className="flex items-center gap-4">
                         <img 
                           src={review.userImg} 
                           alt={review.userName} 
                           className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-sm"
                         />
                         <div>
                           <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                             {review.userName}
                           </h4>
                           <div className="flex gap-0.5 mt-1">
                             {[...Array(5)].map((_, i) => (
                               <Star 
                                 key={i} 
                                 size={12} 
                                 className={`${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} `} 
                               />
                             ))}
                           </div>
                         </div>
                       </div>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-white px-2 py-1 rounded-lg border border-gray-100">
                         {review.date}
                       </p>
                     </div>
                     <p className="text-sm text-gray-600 leading-relaxed italic">
                       "{review.comment}"
                     </p>
                   </motion.div>
                 )) : (
                   <div className="py-12 text-center">
                     <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
                       <MessageSquare size={32} />
                     </div>
                     <p className="text-gray-400 text-sm font-medium">No reviews yet for this category.</p>
                   </div>
                 )}
               </div>
            </div>
          </div>

          {/* Sidebar: Booking Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
               <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-indigo-100/50 border border-indigo-50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 -mr-16 -mt-16 rounded-full opacity-50"></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-end mb-8">
                       <div>
                         <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Service Rate</p>
                         <h2 className="text-4xl font-display font-bold text-gray-900">₹{worker.hourlyRate}<span className="text-lg font-medium text-gray-400">/hr</span></h2>
                       </div>
                       <div className="text-right">
                         <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 uppercase tracking-tighter">Instant Booking</span>
                       </div>
                    </div>

                    <div className="space-y-4 mb-8">
                       <div className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                         <Clock className="text-indigo-600" size={18} />
                         <div>
                           <p className="font-bold">Avg. Response Time</p>
                           <p className="text-xs text-gray-400 font-medium">Responds in <span className="text-indigo-600">under 10 mins</span></p>
                         </div>
                       </div>
                       <div className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                         <Shield className="text-emerald-500" size={18} />
                         <div>
                           <p className="font-bold">Trust Safety Shield</p>
                           <p className="text-xs text-gray-400 font-medium">Includes ₹10k backup insurance</p>
                         </div>
                       </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {bookingStep === 'idle' && (
                        <motion.button 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          onClick={handleBookNow}
                          className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                        >
                          Book Arjun Now
                          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      )}

                      {(bookingStep === 'selecting' || bookingStep === 'confirming') && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                          className="space-y-6"
                        >
                          <div className="space-y-4">
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Select Date</p>
                              <div className="relative">
                                <input 
                                  type="date" 
                                  value={selectedDate}
                                  onChange={(e) => setSelectedDate(e.target.value)}
                                  className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-bold outline-none focus:border-indigo-600 transition-all cursor-pointer"
                                />
                                <Calendar className="absolute right-4 top-4 text-gray-400 pointer-events-none" size={18} />
                              </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Preferred Time</p>
                                <div className="grid grid-cols-3 gap-2">
                                  {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(t => (
                                    <button 
                                      key={t}
                                      onClick={() => setSelectedTime(t)}
                                      className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                                        selectedTime === t 
                                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                                          : 'bg-white text-gray-500 border-gray-100 hover:border-indigo-100'
                                      }`}
                                    >
                                      {t}
                                    </button>
                                  ))}
                                </div>
                            </div>
                          </div>

                          <div className="pt-6 border-t border-gray-100">
                             <div className="flex justify-between items-center mb-6">
                               <p className="text-sm font-bold text-gray-900">Total Estimate (2h)</p>
                               <p className="text-xl font-bold text-indigo-600">₹{worker.hourlyRate * 2}</p>
                             </div>
                             
                             <button 
                               onClick={handleConfirmBooking}
                               disabled={bookingStep === 'confirming'}
                               className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-wait"
                             >
                               {bookingStep === 'confirming' ? (
                                  <RefreshCw size={20} className="animate-spin" />
                               ) : (
                                  <>
                                    <CreditCard size={20} />
                                    Confirm Booking
                                  </>
                               )}
                             </button>
                             <button 
                               onClick={() => setBookingStep('idle')}
                               className="w-full mt-4 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
                             >
                               Cancel Selection
                             </button>
                          </div>
                        </motion.div>
                      )}

                      {bookingStep === 'success' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          className="text-center py-6"
                        >
                           <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6 shadow-inner">
                             <CheckCircle2 size={40} />
                           </div>
                           <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h3>
                           <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                             Your booking request has been sent to <span className="font-bold text-indigo-600 font-display">{worker.name}</span>. We'll notify you once it's accepted.
                           </p>
                           <button 
                             onClick={() => navigate('/bookings')}
                             className="w-full py-5 bg-white border-2 border-indigo-100 text-indigo-600 rounded-[24px] font-bold hover:bg-indigo-50 transition-all shadow-sm"
                           >
                             Go to My Bookings
                           </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
               </div>

               <div className="bg-white rounded-3xl p-6 border border-gray-100 flex items-center gap-4 group hover:border-indigo-100 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Have questions?</h4>
                    <p className="text-xs text-gray-400">Chat with Arjun before booking</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
