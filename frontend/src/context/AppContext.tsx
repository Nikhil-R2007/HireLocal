import React, { createContext, useContext, useState, useEffect } from 'react';
import { ViewMode, UserRole, Booking, UserProfile } from '../types';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AppContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  user: UserProfile | null;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Mock Bookings
const INITIAL_BOOKINGS: Booking[] = [
  { 
    id: '1', 
    customerId: 'cust_1', 
    customerName: 'Nikhil',
    workerId: 'worker_1', 
    workerName: 'Arjun Sharma',
    category: 'Plumbing',
    status: 'arriving-soon', 
    scheduledTime: Date.now() + 5 * 60000, // 5 mins from now
    createdAt: Date.now() - 3600000,
    totalAmount: 450,
    address: 'Sector 12, Navi Mumbai',
    workerImg: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100&h=100&fit=crop',
    etaMinutes: 5
  },
  { 
    id: '2', 
    customerId: 'cust_2', 
    customerName: 'Nikhil',
    workerId: 'worker_2', 
    workerName: 'Priya Verma',
    category: 'Electrician',
    status: 'on-the-way', 
    scheduledTime: Date.now() + 25 * 60000, // 25 mins from now
    createdAt: Date.now() - 7200000,
    totalAmount: 850,
    address: 'Andheri West, Mumbai',
    workerImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    etaMinutes: 22
  },
  { 
    id: '3', 
    customerId: 'cust_3', 
    customerName: 'Nikhil',
    workerId: 'worker_3', 
    workerName: 'Rahul Singh',
    category: 'AC Repair',
    status: 'confirmed', 
    scheduledTime: Date.now() + 120 * 60000, // 2 hours from now
    createdAt: Date.now() - 100000,
    totalAmount: 1200,
    address: 'Bandra, Mumbai',
    workerImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>('customer');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Initializing auth listener...');
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      console.log('Auth state changed - User:', u ? u.uid : 'null');
      if (u) {
        try {
          console.log('Fetching user profile from Firestore...');
          const userDoc = await getDoc(doc(db, 'users', u.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            console.log('User profile found:', data.role);
            setUser(data);
            setViewMode(data.role || 'customer');
          } else {
            console.warn('No user profile found in Firestore for UID:', u.uid);
            setUser({
              uid: u.uid,
              name: u.displayName || 'User',
              email: u.email || '',
              role: 'customer',
              photoURL: u.photoURL || ''
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser({
            uid: u.uid,
            name: u.displayName || 'User',
            email: u.email || '',
            role: 'customer',
            photoURL: u.photoURL || ''
          });
        }
      } else {
        console.log('No user authenticated');
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  return (
    <AppContext.Provider value={{ 
      viewMode, 
      setViewMode, 
      user, 
      bookings, 
      addBooking, 
      updateBookingStatus,
      loading 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
