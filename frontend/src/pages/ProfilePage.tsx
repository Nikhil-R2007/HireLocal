import React from 'react';
import { motion } from 'motion/react';
import { User, Mail, MapPin, Shield, Camera, ChevronRight, Settings, CreditCard, Bell, Lock } from 'lucide-react';
import { auth } from '../lib/firebase';

export default function ProfilePage() {
  const user = auth.currentUser;

  const sections = [
    { icon: <User size={20} />, title: 'Personal Info', desc: 'Name, email, and photo' },
    { icon: <CreditCard size={20} />, title: 'Payments', desc: 'Cards, UPI and wallet' },
    { icon: <Shield size={20} />, title: 'Trust & Safety', desc: 'ID verification and background' },
    { icon: <Bell size={20} />, title: 'Notifications', desc: 'Booking alerts and chat pings' },
    { icon: <Lock size={20} />, title: 'Security', desc: 'Password and 2FA' },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 mb-8 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
               <img src={user?.photoURL || ''} alt="" className="w-32 h-32 rounded-[40px] object-cover shadow-2xl border-4 border-white" />
               <button className="absolute bottom-2 right-2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={16} />
               </button>
            </div>
            
            <div className="text-center md:text-left flex-1">
               <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
                  <Shield size={12} fill="currentColor" /> Verified Member
               </div>
               <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">{user?.displayName}</h1>
               <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400 font-medium">
                  <span className="flex items-center gap-1.5"><Mail size={16} /> {user?.email}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={16} /> Mumbai, Maharashtra</span>
               </div>
            </div>

            <button className="px-6 py-3 bg-gray-50 text-gray-900 font-bold rounded-2xl hover:bg-gray-100 border border-gray-100 transition-colors">
               Edit Profile
            </button>
         </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
         <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 px-4">Account Settings</h3>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
               {sections.map((item, i) => (
                 <button key={i} className="w-full flex items-center justify-between p-5 hover:bg-indigo-50/30 transition-all group">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-white group-hover:text-indigo-600 transition-all shadow-sm">
                          {item.icon}
                       </div>
                       <div className="text-left">
                          <p className="text-sm font-bold text-gray-900">{item.title}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-tight">{item.desc}</p>
                       </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                 </button>
               ))}
            </div>
         </div>

         <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 px-4">Refer & Earn</h3>
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 blur-sm group-hover:scale-125 transition-transform">
                  <Settings size={140} strokeWidth={1} />
               </div>
               <div className="relative z-10">
                  <h4 className="text-2xl font-display font-bold mb-4">Invite friends, get ₹25</h4>
                  <p className="text-sm text-indigo-100 mb-8 max-w-[200px] leading-relaxed">
                    Gift your friends ₹25 for their first booking and get ₹25 in your wallet.
                  </p>
                  <button className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-2xl shadow-xl shadow-indigo-900/50 hover:bg-indigo-50 transition-colors">
                     Copy Link
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
