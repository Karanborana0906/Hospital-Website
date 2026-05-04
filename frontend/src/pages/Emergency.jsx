import React, { useState, useEffect } from 'react';
import { Phone, MapPin, AlertCircle, Clock, Navigation } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { calculateDistance } from '../services/locationService';

const Emergency = () => {
  const { user } = useAuth();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nearestHospital, setNearestHospital] = useState(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const { data } = await axios.get('/api/hospitals');
        
        let processedHospitals = data;
        
        // Filter by user city if available to prioritize local hospitals
        if (user?.city) {
          processedHospitals = data.filter(h => h.city.toLowerCase() === user.city.toLowerCase());
        }

        // Calculate distances if user GPS is available
        if (user?.location) {
          processedHospitals = processedHospitals.map(h => ({
            ...h,
            distance: calculateDistance(
              user.location.lat, 
              user.location.lng, 
              h.location.lat, 
              h.location.lng
            )
          })).sort((a, b) => a.distance - b.distance);
        }

        setHospitals(processedHospitals);
        if (processedHospitals.length > 0) {
          setNearestHospital(processedHospitals[0]);
        }
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12 border-b border-red-100 pb-10">
        <div className="inline-flex items-center justify-center p-4 bg-red-100 rounded-full mb-4">
          <AlertCircle className="h-12 w-12 text-red-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Emergency Services</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          For life-threatening medical emergencies, please call your local emergency services immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-red-600 text-white rounded-2xl p-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10">
            <Phone className="w-48 h-48" />
          </div>
          <h2 className="text-2xl font-bold mb-2 relative z-10">24/7 Ambulance Service</h2>
          <p className="mb-6 relative z-10 text-red-100">Fast and reliable emergency transport equipped with advanced life support.</p>
          <a href="tel:911" className="block text-5xl font-extrabold tracking-wider mb-8 relative z-10 hover:text-red-100 transition-colors cursor-pointer">
            911
          </a>
          <a 
            href="tel:911" 
            className="inline-block bg-white text-red-600 font-bold py-3 px-8 rounded-full shadow-md hover:bg-neutral-100 transition-colors w-full sm:w-auto relative z-10 text-center"
          >
            Request Ambulance Now
          </a>

        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-blue-600" /> ER Wait Time
          </h2>
          <div className="flex items-center justify-between p-6 bg-slate-50 rounded-xl mb-6">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Current estimated wait</p>
              <p className="text-4xl font-bold text-slate-800">12 <span className="text-lg font-normal text-slate-500">mins</span></p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center">
              <span className="text-green-600 font-bold">LOW</span>
            </div>
          </div>
          <p className="text-sm text-slate-500">
            Wait times are estimates and subject to change based on arriving trauma cases. Severe conditions are always treated first.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-12">
        <div className="p-6 md:p-8 md:flex items-center justify-between border-b border-slate-100">
          <div className="flex-grow">
            <h2 className="text-2xl font-black text-slate-900 mb-2 flex items-center">
              <MapPin className="w-6 h-6 mr-3 text-emerald-600" /> {nearestHospital ? nearestHospital.name : 'Finding Nearest Hospital...'}
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center text-slate-500 font-medium">
              <p className="flex items-center mr-6">
                <Navigation className="w-4 h-4 mr-2" /> {nearestHospital ? nearestHospital.address : 'Locating facilities...'}
              </p>
              {nearestHospital?.distance !== undefined && (
                <p className="text-emerald-600 font-black flex items-center mt-1 sm:mt-0">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse" />
                  Only {nearestHospital.distance.toFixed(1)} km away
                </p>
              )}
            </div>
          </div>
          <button 
            disabled={!nearestHospital}
            onClick={() => {
                if (nearestHospital) {
                    const query = encodeURIComponent(`${nearestHospital.name} ${nearestHospital.city}`);
                    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                }
            }}
            className="mt-4 md:mt-0 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-100 flex items-center justify-center disabled:opacity-50"
          >
            Get Directions <Clock className="w-4 h-4 ml-2" /> 5 Min
          </button>

        </div>
        <div className="w-full h-[500px]">
           <MapComponent 
              userLocation={user?.location} 
              hospitals={hospitals}
              height="100%" 
           />
        </div>
      </div>
    </div>
  );
};

export default Emergency;
