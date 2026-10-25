/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import WorkerDiscovery from './pages/WorkerDiscovery';
import AuthPage from './pages/AuthPage';
import WorkerProfilePage from './pages/WorkerProfilePage';
import ChatPage from './pages/ChatPage';
import HomeDashboard from './pages/HomeDashboard';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import DashboardLayout from './components/DashboardLayout';
import AIAssistant from './components/AIAssistant';
import { User, Menu, X } from 'lucide-react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <span className="font-bold">H</span>
          </div>
          <span className="text-xl font-display font-bold text-indigo-900">HireLocal</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/discovery" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Find Help</Link>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">How it works</a>
          
          {user ? (
            <Link to="/dashboard" className="px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/auth" className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100 hover:border-indigo-200 transition-all">
                <User size={16} className="text-indigo-600" />
                <span className="text-sm font-semibold">Join as Worker</span>
              </Link>
              <Link to="/auth" className="px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
    </nav>
  );
}

import WorkerDashboard from './pages/WorkerDashboard';
import JobRequests from './pages/JobRequests';
import WorkerJobs from './pages/WorkerJobs';
import { useApp } from './context/AppContext';

function AppRoutes() {
  const { user, viewMode, loading } = useApp();
  const location = useLocation();

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  // If user is logged in and not on a public page, show DashboardLayout
  const publicRoutes = ['/', '/auth'];
  const isDashboardView = user && !publicRoutes.includes(location.pathname);

  if (isDashboardView) {
    return (
      <DashboardLayout>
        <Routes>
          {/* Customer Routes */}
          <Route path="/dashboard" element={<HomeDashboard />} />
          <Route path="/discovery" element={<WorkerDiscovery />} />
          <Route path="/worker/:id" element={<WorkerProfilePage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          
          {/* Worker Routes */}
          <Route path="/worker/dashboard" element={<WorkerDashboard />} />
          <Route path="/worker/requests" element={<JobRequests />} />
          <Route path="/worker/jobs" element={<WorkerJobs />} />
          
          {/* Shared Routes */}
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          <Route path="*" element={<Navigate to={viewMode === 'customer' ? "/dashboard" : "/worker/dashboard"} replace />} />
        </Routes>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/discovery" element={<WorkerDiscovery />} />
        <Route path="/worker/:id" element={<WorkerProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Footer only on non-dashboard */}
      {!isDashboardView && location.pathname !== '/chat' && (
        <footer className="bg-gray-50 border-t border-gray-200 py-12 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
            <div>
              <h4 className="font-bold mb-4">HireLocal</h4>
              <p className="text-sm text-gray-500 italic">"Making localized skilled work accessible and reliable."</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-xs uppercase tracking-wider text-gray-400">Services</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Home Maintenance</li>
                <li>Cleaning Services</li>
                <li>Tutors & Lessons</li>
                <li>Personal Training</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-xs uppercase tracking-wider text-gray-400">Support</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Help Center</li>
                <li>Safety Guide</li>
                <li>Cancellation Policy</li>
              </ul>
            </div>
            <div>
               <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 mb-2">DOWNLOAD THE APP</p>
                  <div className="flex gap-2">
                     <div className="w-1/2 h-8 bg-gray-900 rounded-lg"></div>
                     <div className="w-1/2 h-8 bg-gray-900 rounded-lg"></div>
                  </div>
               </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <AIAssistant />
    </BrowserRouter>
  );
}
