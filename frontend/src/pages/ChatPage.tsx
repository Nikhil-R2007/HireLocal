import React, { useState } from 'react';
import { Send, User, ChevronLeft, MapPin, MoreVertical, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export default function ChatPage() {
  const { viewMode } = useApp();
  const [message, setMessage] = useState('');
  
  // Role-based mock data
  const CUSTOMER_CHAT = {
    partner: {
      name: 'Arjun Sharma',
      role: 'Worker',
      img: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100&h=100&fit=crop',
      online: true
    },
    messages: [
      { id: 'c1', sender: 'other', text: 'Hi, I saw your booking request for the sink repair.', time: '10:02 AM' },
      { id: 'c2', sender: 'me', text: 'Yes! Are you available to come at 2 PM today?', time: '10:05 AM' },
      { id: 'c3', sender: 'other', text: '2 PM works for me. Just checking—do you have the spare washer, or should I bring one?', time: '10:06 AM' }
    ]
  };

  const WORKER_CHAT = {
    partner: {
      name: 'Nikhil R.',
      role: 'Customer',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      online: true
    },
    messages: [
      { id: 'w1', sender: 'other', text: 'Hi, my kitchen sink is leaking.', time: '09:15 AM' },
      { id: 'w2', sender: 'me', text: 'I can visit today around 4 PM.', time: '09:18 AM' },
      { id: 'w3', sender: 'other', text: 'That works. Please message me when you leave.', time: '09:20 AM' }
    ]
  };

  const activeChat = viewMode === 'customer' ? CUSTOMER_CHAT : WORKER_CHAT;

  return (
    <div className="h-screen pt-16 flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-16 z-20">
        <div className="flex items-center gap-4">
          <button className="md:hidden text-gray-400">
            <ChevronLeft size={24} />
          </button>
          <div className="relative">
             <img src={activeChat.partner.img} className="w-10 h-10 rounded-full object-cover" alt={activeChat.partner.name} />
             {activeChat.partner.online && (
               <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
             )}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 leading-tight">{activeChat.partner.name}</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{activeChat.partner.role}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
            <Phone size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="text-center">
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
            Today
           </span>
        </div>

        {activeChat.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm shadow-sm ${
              msg.sender === 'me' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
            }`}>
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-1 text-right opacity-60`}>{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto flex gap-3">
          <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 flex items-center border border-transparent focus-within:border-indigo-100 transition-all">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message ${activeChat.partner.name}...`}
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>
          <button className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
