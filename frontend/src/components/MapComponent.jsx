import React from 'react';
import { MapPin, Navigation, Hospital, Clock } from 'lucide-react';

/**
 * A professional simulated Map component for the hospital system.
 * In a production app, this would use google-maps-react or @react-google-maps/api.
 */
const MapComponent = ({ doctors = [], hospitals = [], userLocation, height = "400px", showStats = true }) => {
  return (
    <div 
      className="relative bg-slate-100 rounded-2xl overflow-hidden shadow-inner border border-slate-200"
      style={{ height }}
    >
      {/* Simulated Map Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.google.com/maps/vt/pb=!1m4!1m3!1i12!2i2345!3i1234!2m3!1e0!2sm!3i123456789!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1f2')] bg-repeat" />
      </div>

      {/* Map Grid Pattern */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-10 pointer-events-none">
        {[...Array(24)].map((_, i) => (
          <div key={i} className="border-r border-b border-slate-400" />
        ))}
      </div>

      {/* User Location Marker */}
      {userLocation && (
        <div 
          className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
          style={{ left: '50%', top: '50%' }}
        >
          <div className="bg-blue-600 p-2 rounded-full shadow-lg border-2 border-white animate-pulse">
            <Navigation className="w-5 h-5 text-white fill-current" />
          </div>
          <span className="mt-2 bg-white px-2 py-1 rounded shadow-sm text-[10px] font-bold text-blue-600 whitespace-nowrap">Your Location</span>
        </div>
      )}

      {/* Doctor Markers */}
      {doctors.map((doctor, idx) => {
        // Use real lat/lng if available, otherwise scatter
        let leftPos = 50;
        let topPos = 50;

        if (doctor.location && doctor.location.lat && doctor.location.lng) {
            // Mapping lat/lng to percentage for demo purposes
            // This is a simple linear mapping for India-wide view
            // Mumbai center approx (19, 73) -> (50, 50)
            leftPos = 50 + (doctor.location.lng - 72.8777) * 4; 
            topPos = 50 - (doctor.location.lat - 19.0760) * 4;
        } else {
            const offsetLat = (idx % 2 === 0) ? -15 : 20;
            const offsetLng = (idx % 3 === 0) ? -25 : 15;
            leftPos = 50 + offsetLng;
            topPos = 50 + offsetLat;
        }
        
        const openGoogleMaps = () => {
            const query = encodeURIComponent(`${doctor.userId?.name || doctor.name} ${doctor.city}`);
            window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
        };

        return (
          <div 
            key={doctor._id || idx}
            onClick={openGoogleMaps}
            className="absolute z-10 transform -translate-x-1/2 -translate-y-full flex flex-col items-center group cursor-pointer"
            style={{ 
              left: `${leftPos}%`, 
              top: `${topPos}%` 
            }}
          >
            {/* Tooltip */}
            <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-2 rounded-lg shadow-xl border border-slate-100 min-w-[120px] pointer-events-none">
              <p className="font-bold text-slate-800 text-xs">{doctor.userId?.name || doctor.name}</p>
              <p className="text-[10px] text-blue-600 font-bold">{doctor.specialization}</p>
              <p className="text-[8px] text-slate-400 mt-1 italic">Click to view on Google Maps</p>
            </div>
            
            <MapPin className="w-8 h-8 text-blue-600 fill-blue-50 drop-shadow-md transition-transform group-hover:scale-110" />
            <div className="w-2 h-2 bg-blue-900/20 rounded-full blur-[1px] mt-1" />
          </div>
        );
      })}

      {/* Hospital Markers */}
      {hospitals.map((hospital, idx) => {
        // Use real lat/lng if available (especially for Ujjain demo), otherwise scatter
        let leftPos = 50;
        let topPos = 50;
        
        if (hospital.location && hospital.location.lat && hospital.location.lng) {
            // Very basic projection for DEMO (maps local offsets)
            // Assuming center of Ujjain for Ujjain users
            leftPos = 50 + (hospital.location.lng - 75.7885) * 500; 
            topPos = 50 - (hospital.location.lat - 23.1765) * 500;
        } else {
            const offsetLat = (idx === 0) ? -20 : (idx === 1) ? 25 : -15;
            const offsetLng = (idx === 0) ? -35 : (idx === 1) ? 30 : 40;
            leftPos = 50 + offsetLng;
            topPos = 50 + offsetLat;
        }

        const openGoogleMaps = () => {
            const query = encodeURIComponent(`${hospital.name} ${hospital.city}`);
            window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
        };

        return (
          <div 
            key={hospital._id || idx}
            onClick={openGoogleMaps}
            className="absolute z-10 transform -translate-x-1/2 -translate-y-full flex flex-col items-center group cursor-pointer"
            style={{ 
              left: `${leftPos}%`, 
              top: `${topPos}%` 
            }}
          >
            {/* Tooltip */}
            <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-2 rounded-lg shadow-xl border border-slate-100 min-w-[150px] pointer-events-none">
              <p className="font-bold text-emerald-800 text-xs">{hospital.name}</p>
              <p className="text-[10px] text-slate-500 font-medium">{hospital.type} Hospital</p>
              <div className="mt-1 pt-1 border-t border-slate-50 flex items-center text-[10px] text-emerald-600 font-bold">
                 <Clock className="w-3 h-3 mr-1" /> 24/7 Emergency
              </div>
              <p className="text-[8px] text-slate-300 mt-1 italic">Click for Google Maps Navigation</p>
            </div>
            
            <Hospital className="w-10 h-10 text-emerald-500 fill-emerald-50 drop-shadow-md border-2 border-white rounded-xl p-1 bg-white transition-transform group-hover:scale-110 active:scale-90" />
            <div className="w-3 h-3 bg-slate-900/10 rounded-full blur-[2px] mt-1" />
          </div>
        );
      })}


      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button className="bg-white p-2 rounded-lg shadow-md hover:bg-slate-50 text-slate-600 font-bold text-lg">+</button>
        <button className="bg-white p-2 rounded-lg shadow-md hover:bg-slate-50 text-slate-600 font-bold text-lg">-</button>
      </div>

      {showStats && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white shadow-xl flex items-center space-x-3 animate-slide-up">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-black text-slate-700 tracking-tight">
            {doctors.length > 0 ? `${doctors.length} Specialists Found` : `${hospitals.length} Emergency Centers Nearby`}
          </span>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
