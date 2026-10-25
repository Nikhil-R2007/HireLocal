import React from 'react';
import { Search, MapPin, User, Star, MessageSquare, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-indigo-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-12 gap-4 h-full transform -rotate-12 scale-125">
            {[...Array(48)].map((_, i) => (
              <div key={i} className="h-24 bg-white/10 rounded-lg"></div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6"
          >
            Find help. <br /><span className="text-emerald-400 text-6xl">Nearby & Instantly.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto font-sans"
          >
            HireLocal connects you with verified skilled professionals in your neighborhood. Plumbers, tutors, designers, and more—ready when you are.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4"
          >
            <div className="bg-white rounded-full p-2 pl-6 flex items-center w-full max-w-md shadow-2xl">
              <Search className="text-gray-400 mr-2" size={20} />
              <input 
                type="text" 
                placeholder="What service do you need?" 
                className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
              />
              <Link to="/auth" className="bg-indigo-600 px-6 py-2 rounded-full text-white font-medium hover:bg-indigo-700 transition-colors">
                Search
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex gap-4 justify-center"
          >
            <Link to="/auth" className="px-8 py-3 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-lg">
              Get Started
            </Link>
            <Link to="/auth" className="px-8 py-3 bg-indigo-500 text-white rounded-2xl font-bold hover:bg-indigo-400 transition-all border border-indigo-400">
              Become a Worker
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl mb-2 text-indigo-900">Popular Categories</h2>
              <p className="text-gray-500">Fastest growing services in your area</p>
            </div>
            <a href="#" className="hidden sm:block text-indigo-600 font-medium hover:underline">View all categories</a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Plumbing', 'Electrician', 'Home Tutor', 'Interior Design', 'House Cleaning', 'Car Wash', 'Yoga Trainer', 'IT Support'].map((cat, i) => (
              <motion.div 
                key={cat}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer text-center group transition-all hover:bg-white hover:shadow-xl hover:border-indigo-100"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <User size={24} />
                </div>
                <h3 className="font-medium text-gray-800">{cat}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Real-time Discovery Preview */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              LIVE DISCOVERY
            </div>
            <h2 className="text-4xl mb-6">See who's online <br />right now.</h2>
            <p className="text-lg text-gray-600 mb-8">
              No more waiting days for a quote. Our real-time worker status lets you book professionals who are active and ready to help immediately.
            </p>
            
            <ul className="space-y-4">
              {[
                { icon: <Clock />, text: "Instant booking response" },
                { icon: <MapPin />, text: "Hyperlocal worker tracking" },
                { icon: <Star />, text: "Verified ratings & reviews" }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <div className="text-indigo-600">{item.icon}</div>
                  <span className="font-medium">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative">
            <div className="bg-white p-4 rounded-3xl shadow-2xl border border-gray-200 aspect-square overflow-hidden relative group">
              <div className="absolute inset-0 bg-gray-100 pattern-grid-indigo opacity-10"></div>
              {/* Fake Map Elements */}
              <div className="absolute top-1/4 left-1/3">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="bg-indigo-600 p-2 rounded-full text-white shadow-lg"
                >
                  <MapPin size={24} />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
