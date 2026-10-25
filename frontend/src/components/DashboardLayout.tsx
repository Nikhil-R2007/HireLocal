import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Search, Calendar, MessageSquare, User, LogOut, Menu, X, Bell, 
  Briefcase, LayoutDashboard, ClipboardList, RefreshCw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

const CUSTOMER_NAV = [
  { icon: <Home size={20} />, label: 'Home', path: '/dashboard' },
  { icon: <Search size={20} />, label: 'Find Workers', path: '/discovery' },
  { icon: <Calendar size={20} />, label: 'My Bookings', path: '/bookings' },
  { icon: <MessageSquare size={20} />, label: 'Messages', path: '/chat' },
  { icon: <User size={20} />, label: 'Profile', path: '/profile' },
];

const WORKER_NAV = [
  { icon: <LayoutDashboard size={20} />, label: 'Worker Dash', path: '/worker/dashboard' },
  { icon: <ClipboardList size={20} />, label: 'Job Requests', path: '/worker/requests' },
  { icon: <Calendar size={20} />, label: 'My Jobs', path: '/worker/jobs' },
  { icon: <MessageSquare size={20} />, label: 'Messages', path: '/chat' },
  { icon: <User size={20} />, label: 'Worker Profile', path: '/profile' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { viewMode, setViewMode, user } = useApp();

  const handleLogout = () => {
    signOut(auth);
  };

  const navItems = viewMode === 'customer' ? CUSTOMER_NAV : WORKER_NAV;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="hidden md:flex flex-col bg-white border-r border-gray-100 relative z-30"
      >
        <div className="p-6 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-indigo-100">
            <span className="font-bold text-xl font-display">H</span>
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xl font-display font-bold text-indigo-900 whitespace-nowrap"
              >
                HireLocal
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Mode Switcher */}
        <div className="px-4 mb-8">
          <div className="bg-gray-50 p-1.5 rounded-2xl flex items-center gap-1">
            <button 
              onClick={() => setViewMode('customer')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold uppercase tracking-tight transition-all ${
                viewMode === 'customer' 
                  ? 'bg-white shadow-sm text-indigo-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <User size={14} />
              {isSidebarOpen && <span>Customer</span>}
            </button>
            <button 
              onClick={() => setViewMode('worker')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold uppercase tracking-tight transition-all ${
                viewMode === 'worker' 
                  ? 'bg-indigo-600 shadow-lg shadow-indigo-100 text-white' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Briefcase size={14} />
              {isSidebarOpen && <span>Worker</span>}
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                    : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
              >
                <div className={`${isActive ? 'text-white' : 'group-hover:text-indigo-600'}`}>
                  {item.icon}
                </div>
                {isSidebarOpen && (
                  <span className="text-sm font-semibold whitespace-nowrap">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-gray-50">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors group"
           >
              <LogOut size={20} className="group-hover:scale-110 transition-transform" />
              {isSidebarOpen && <span className="text-sm font-bold">Log Out</span>}
           </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between z-20">
          <div className="md:hidden flex items-center gap-4">
             <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white">H</div>
             <span className="font-display font-bold">HireLocal</span>
          </div>

          <div className="hidden md:block">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
               {viewMode === 'customer' ? 'Customer Space' : 'Worker Workspace'}
             </p>
             <h2 className="text-sm font-semibold text-gray-900">
               {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
             </h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                  <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">
                    {viewMode === 'customer' ? 'Verified Member' : 'Elite Professional'}
                  </p>
               </div>
               <img src={user?.photoURL || ''} className="w-10 h-10 rounded-xl bg-indigo-100 object-cover shadow-sm" alt="" />
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 relative">
          {children}
        </main>
      </div>

      {/* Mobile Nav Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-8 left-8 p-4 bg-white shadow-2xl rounded-full md:hidden z-[100] text-indigo-600"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  );
}
