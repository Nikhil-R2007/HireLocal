import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Star, SlidersHorizontal, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { APIProvider, Map, Marker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { WorkerProfile } from '../types';
import { WorkerCardSkeleton } from '../components/ui/Skeleton';

// Mock Data with real coordinates
const MOCK_WORKERS: Partial<WorkerProfile>[] = [
  {
    uid: '1',
    name: 'Arjun Sharma',
    skills: ['Plumbing', 'Pipe leak expert'],
    rating: 4.8,
    reviewCount: 124,
    isOnline: true,
    hourlyRate: 450,
    photoURL: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&h=400&fit=crop',
    location: { lat: 19.0760, lng: 72.8777, address: 'Andheri, Mumbai' }
  },
  {
    uid: '2',
    name: 'Priya Patel',
    skills: ['Home Tutor', 'Mathematics'],
    rating: 4.9,
    reviewCount: 56,
    isOnline: true,
    hourlyRate: 800,
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    location: { lat: 13.0827, lng: 80.2707, address: 'Adyar, Chennai' }
  },
  {
    uid: '3',
    name: 'Vikram Singh',
    skills: ['Electrician', 'AC Service'],
    rating: 4.7,
    reviewCount: 89,
    isOnline: false,
    hourlyRate: 350,
    photoURL: 'https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?w=400&h=400&fit=crop',
    location: { lat: 17.3850, lng: 78.4867, address: 'Gachibowli, Hyderabad' }
  },
  {
    uid: '4',
    name: 'Deepa Nair',
    skills: ['Yoga Trainer', 'Wellness'],
    rating: 5.0,
    reviewCount: 42,
    isOnline: true,
    hourlyRate: 600,
    photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    location: { lat: 9.9312, lng: 76.2673, address: 'Kadavanthra, Cochin' }
  },
  {
    uid: '5',
    name: 'Suresh Kumar',
    skills: ['Plumbing', 'Drainage'],
    rating: 4.6,
    reviewCount: 156,
    isOnline: true,
    hourlyRate: 400,
    photoURL: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=400&h=400&fit=crop',
    location: { lat: 13.0475, lng: 80.2090, address: 'Anna Nagar, Chennai' }
  }
];

const CATEGORIES = ['All', 'Plumbing', 'Electrician', 'Home Tutor', 'Yoga Trainer'];

export default function WorkerDiscovery() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedWorker, setSelectedWorker] = useState<Partial<WorkerProfile> | null>(null);
  const [center, setCenter] = useState({ lat: 13.0827, lng: 80.2707 }); // Default: Chennai
  const [zoom, setZoom] = useState(12);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  // Filter logic
  const filteredWorkers = useMemo(() => {
    return MOCK_WORKERS.filter(worker => {
      const matchesSearch = worker.name?.toLowerCase().includes(search.toLowerCase()) || 
                            worker.skills?.some(s => s.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || worker.skills?.some(s => s.toLowerCase().includes(selectedCategory.toLowerCase()));
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  // Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          console.log("Using default location: Chennai");
        }
      );
    }
  }, []);

  const handleWorkerClick = (worker: Partial<WorkerProfile>) => {
    setSelectedWorker(worker);
    if (worker.location) {
      setCenter({ lat: worker.location.lat, lng: worker.location.lng });
      setZoom(14);
    }
  };

  const mapsApiKey = (import.meta as any).env.VITE_GOOGLE_MAPS_PLATFORM_KEY;

  if (!mapsApiKey) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 pt-20 pb-4 px-6 sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
             <div className="flex-1 flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-6 py-3 w-full">
                <Search className="text-gray-400 mr-3" size={20} />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for services..." 
                  className="w-full bg-transparent border-none outline-none text-sm font-medium"
                />
             </div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-12 text-center">
            <div className="max-w-md">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Map View Unavailable</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                We're unable to load the interactive map right now (Missing API Key). You can still browse our verified experts in the list below.
              </p>
              <div className="grid grid-cols-1 gap-4">
                {filteredWorkers.map(w => (
                  <div key={w.uid} onClick={() => handleWorkerClick(w)} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-indigo-200 transition-all">
                    <img src={w.photoURL} className="w-12 h-12 rounded-xl" alt="" />
                    <div className="text-left">
                      <h4 className="font-bold">{w.name}</h4>
                      <p className="text-xs text-gray-400">{w.skills?.join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </main>
      </div>
    );
  }

  return (
    <APIProvider apiKey={mapsApiKey}>
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        {/* Header / Search */}
        <header className="bg-white border-b border-gray-100 pt-20 pb-4 px-6 sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-6 py-3 w-full focus-within:bg-white focus-within:border-indigo-200 transition-all">
              <Search className="text-gray-400 mr-3" size={20} />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for plumbers, electricians, or tutors..." 
                className="w-full bg-transparent border-none outline-none text-sm font-medium"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              )}
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedCategory === cat 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                      : 'bg-white text-gray-500 border-gray-100 hover:border-indigo-100 hover:text-indigo-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col md:flex-row relative">
          {/* Sidebar: Profile List */}
          <div className="w-full md:w-[420px] lg:w-[480px] bg-white border-r border-gray-100 flex flex-col z-20 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recommended Pros</h2>
                <p className="text-xs text-gray-400 font-medium">{filteredWorkers.length} verified workers nearby</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                <SlidersHorizontal size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  [...Array(4)].map((_, i) => (
                    <motion.div 
                      key={`skeleton-${i}`}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                      <WorkerCardSkeleton />
                    </motion.div>
                  ))
                ) : filteredWorkers.length > 0 ? (
                  filteredWorkers.map((worker) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={worker.uid}
                      onClick={() => handleWorkerClick(worker)}
                      className={`group relative flex items-start gap-4 p-4 rounded-[24px] border transition-all cursor-pointer ${
                        selectedWorker?.uid === worker.uid
                          ? 'bg-indigo-50 border-indigo-200 shadow-md ring-2 ring-indigo-600/5'
                          : 'bg-white border-transparent hover:border-indigo-100 hover:shadow-sm'
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <img 
                          src={worker.photoURL} 
                          alt={worker.name} 
                          className="w-20 h-20 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                        />
                        {worker.isOnline && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col h-20">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-gray-900 truncate pr-2 group-hover:text-indigo-600 transition-colors">{worker.name}</h3>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-700 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                            <Star size={10} className="text-yellow-500 fill-yellow-500" />
                            {worker.rating}
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-400 font-medium mb-auto truncate">
                          {worker.skills?.join(', ')}
                        </p>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-sm font-display font-bold text-indigo-900">₹{worker.hourlyRate}<span className="text-[10px] font-medium text-gray-400">/hr</span></span>
                          <div className="text-[10px] text-gray-400 flex items-center gap-1 font-bold uppercase tracking-tight">
                            <MapPin size={10} /> {worker.location?.address}
                          </div>
                        </div>
                      </div>
                      
                      <div className={`self-center pl-2 transition-transform ${selectedWorker?.uid === worker.uid ? 'text-indigo-600 translate-x-1' : 'text-gray-200 group-hover:text-indigo-400'}`}>
                        <ChevronRight size={20} />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-sm">No workers found matching your criteria.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Map Section */}
          <div className="flex-1 relative bg-gray-100 h-full">
            <Map
              defaultCenter={center}
              center={center}
              defaultZoom={zoom}
              zoom={zoom}
              onZoomChange={(e) => setZoom(e.detail.zoom)}
              mapId="bf50a913425a85d0" // Replace with a real mapId if you have a custom theme
              disableDefaultUI={true}
              className="w-full h-full"
            >
              {filteredWorkers.map(worker => (
                worker.location && (
                  <Marker
                    key={worker.uid}
                    position={{ lat: worker.location.lat, lng: worker.location.lng }}
                    onClick={() => handleWorkerClick(worker)}
                  />
                )
              ))}

              {selectedWorker && selectedWorker.location && (
                <InfoWindow
                  position={{ lat: selectedWorker.location.lat, lng: selectedWorker.location.lng }}
                  onCloseClick={() => setSelectedWorker(null)}
                >
                  <div className="p-2 max-w-[200px]">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={selectedWorker.photoURL} className="w-10 h-10 rounded-lg object-cover" alt="" />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 leading-tight">{selectedWorker.name}</h4>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                          ₹{selectedWorker.hourlyRate}/hr
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 mb-3">{selectedWorker.skills?.slice(0, 2).join(', ')}</p>
                    <button className="w-full py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
                      View Full Profile
                    </button>
                  </div>
                </InfoWindow>
              )}
            </Map>

            {/* Geolocation Control */}
            <button 
              onClick={() => {
                navigator.geolocation.getCurrentPosition(p => setCenter({ lat: p.coords.latitude, lng: p.coords.longitude }));
              }}
              className="absolute bottom-10 right-6 p-4 bg-white rounded-2xl shadow-2xl text-indigo-600 hover:bg-indigo-50 transition-all border border-gray-100 active:scale-95"
            >
              <MapPin size={24} />
            </button>
          </div>
        </main>
      </div>
    </APIProvider>
  );
}
