import React, { useState, useEffect } from 'react';
import { Search, Star, Clock, Calendar, MapPin, ChevronRight, Navigation, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { calculateDistance, formatDistance } from '../services/locationService';
import MapComponent from '../components/MapComponent';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [sortByDistance, setSortByDistance] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app we fetch this from API, for UI demonstration we use placeholder or fetch if backend ready
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get('/api/doctors');
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors', error);
        // Fallback data if DB is empty
        setDoctors([
          {
            _id: '1',
            userId: { name: 'Dr. Sarah Jenkins' },
            specialization: 'Cardiology',
            experience: 15,
            about: 'Specializes in heart conditions and cardiovascular surgery.',
            fees: 150,
            city: 'Mumbai',
            location: { lat: 19.0760, lng: 72.8777 }
          },
          {
            _id: '2',
            userId: { name: 'Dr. Michael Chen' },
            specialization: 'Neurology',
            experience: 12,
            about: 'Expert in treating neurological disorders and brain injuries.',
            fees: 180,
            city: 'Delhi',
            location: { lat: 28.6139, lng: 77.2090 }
          },
          {
             _id: '3',
             userId: { name: 'Dr. Emily Parker' },
             specialization: 'Pediatrics',
             experience: 8,
             about: 'Compassionate pediatric care for infants to young adults.',
             fees: 100,
             city: 'Mumbai',
             location: { lat: 19.1070, lng: 72.8377 }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Calculate distances and filter
  const processedDoctors = doctors
    .map(doc => {
      let distance = null;
      if (user?.location && doc.location) {
        distance = calculateDistance(
          user.location.lat,
          user.location.lng,
          doc.location.lat,
          doc.location.lng
        );
      }
      return { ...doc, distance };
    })
    .filter(doc => {
      const matchesSearch = doc.userId?.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
                           doc.specialization.toLowerCase().includes(searchFilter.toLowerCase());
      const matchesCity = !cityFilter || doc.city?.toLowerCase() === cityFilter.toLowerCase();
      return matchesSearch && matchesCity;
    });

  // Sort by distance if enabled and user location available
  if (sortByDistance && user?.location) {
    processedDoctors.sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
  }

  const cities = [...new Set(doctors.map(doc => doc.city))].filter(Boolean);

  const isAvailableToday = (doc) => {
    if (!doc.availableDays) return true; // Default fallback
    const today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
    return doc.availableDays.includes(today);
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-16rem)] py-12 animate-fade-in text-slate-900">
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Find Your <span className="text-blue-600">Specialist</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Find the right expert for your health needs and book an appointment today.
          </p>

          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-grow w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or specialization..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition-all"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-48 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-400" />
              </div>
              <select
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 appearance-none bg-white shadow-sm transition-all"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="flex bg-slate-200 p-1 rounded-xl">
              <button 
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
              >
                List View
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
              >
                Map View
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            {user?.location && (
              <button
                onClick={() => setSortByDistance(!sortByDistance)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  sortByDistance ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                <Navigation className="w-4 h-4" />
                <span>Sort by Distance</span>
              </button>
            )}
            <span className="text-xs text-slate-400 italic">
              {user?.location ? 'Using your GPS location' : 'Enable GPS for distance sorting'}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : viewMode === 'map' ? (
          <div className="max-w-6xl mx-auto h-[600px]">
            <MapComponent 
              doctors={processedDoctors} 
              userLocation={user?.location} 
              height="100%" 
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processedDoctors.map((doctor, index) => (
              <div 
                key={doctor._id} 
                className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover-lift group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="h-24 w-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl flex justify-center items-center text-blue-600 font-bold text-3xl group-hover:scale-105 transition-transform duration-500 shadow-inner">
                      {doctor.userId?.name.charAt(4) || 'D'}
                    </div>
                    <div className="flex flex-col items-end space-y-3">
                      <div className="flex items-center bg-amber-50/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-amber-700 text-xs font-black tracking-wider uppercase border border-amber-100">
                        <Star className="w-3.5 h-3.5 mr-1 fill-amber-400 text-amber-400" /> 4.9
                      </div>
                      {isAvailableToday(doctor) ? (
                        <div className="flex items-center bg-emerald-50/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-emerald-700 text-[10px] font-black uppercase tracking-tighter border border-emerald-100">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse" />
                          Today
                        </div>
                      ) : (
                        <div className="flex items-center bg-slate-50/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-slate-500 text-[10px] font-black uppercase tracking-tighter border border-slate-100">
                           Soon
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-slate-900 mb-1 leading-tight tracking-tight">{doctor.userId?.name}</h3>
                    <div className="flex items-center text-blue-600 font-bold text-sm tracking-wide">
                      <span>{doctor.specialization}</span>
                      <span className="mx-2 text-slate-300">•</span>
                      <span className="text-slate-500 flex items-center font-medium"><MapPin className="w-3.5 h-3.5 mr-1" /> {doctor.city}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-slate-50/50 p-3 rounded-2xl text-center border border-slate-100/50">
                      <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Experience</p>
                      <p className="text-sm font-black text-slate-800">{doctor.experience} Yrs</p>
                    </div>
                    <div className="bg-slate-50/50 p-3 rounded-2xl text-center border border-slate-100/50">
                      <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Fee</p>
                      <p className="text-sm font-black text-slate-800">${doctor.fees}</p>
                    </div>
                  </div>

                  {doctor.distance !== null && (
                    <div className="mb-6 flex items-center justify-center bg-blue-50/50 border border-blue-100 p-2 rounded-xl text-blue-700 text-xs font-black tracking-tight">
                      <Navigation className="w-3 h-3 mr-2" /> {formatDistance(doctor.distance)} from your location
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Link 
                      to={`/doctors/${doctor._id}`} 
                      className="flex-grow flex items-center justify-center py-4 px-4 rounded-2xl border-2 border-slate-100 text-slate-600 font-black text-sm hover:bg-slate-50 transition-all active:scale-95"
                    >
                      Profile
                    </Link>
                    <Link 
                      to={`/appointments?doctor=${doctor._id}`} 
                      className="flex-grow flex items-center justify-center py-4 px-4 rounded-2xl bg-blue-600 text-white font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all hover:scale-[1.02] active:scale-95"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && processedDoctors.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No doctors found</h3>
            <p className="text-slate-500">Try adjusting your search filters or city.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
