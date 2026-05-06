import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService.js';
import { Pill, Search, Info, AlertTriangle, CheckCircle } from 'lucide-react';

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial fetch of some common medicines
    fetchMedicines('');
  }, []);

  const fetchMedicines = async (searchKw) => {
    setLoading(true);
    try {
      // In a real app we fetch this from API, for UI demonstration we use placeholder if backend fails
      const { data } = await apiService.getMedicines(searchKw);
      setMedicines(data);
    } catch (error) {
      console.error('Error fetching medicines', error);
      // Fallback data if DB is empty / backend disconnected
      const mockData = [
        {
          _id: '1',
          name: 'Paracetamol 500mg',
          category: 'Analgesic',
          usage: 'Fever, mild to moderate pain relief.',
          dosage: '1-2 tablets every 4-6 hours as needed. Max 8 tablets in 24 hours.',
          sideEffects: 'Rare, but can cause liver damage if overdosed. Possible allergic reactions.',
        },
        {
           _id: '2',
           name: 'Amoxicillin 250mg',
           category: 'Antibiotic',
           usage: 'Bacterial infections such as chest infections and dental abscesses.',
           dosage: '1 capsule three times a day for 5-7 days. DO NOT stop early.',
           sideEffects: 'Diarrhea, nausea, skin rash.',
        },
        {
           _id: '3',
           name: 'Cetirizine 10mg',
           category: 'Antihistamine',
           usage: 'Hay fever, allergies, hives.',
           dosage: '1 tablet daily.',
           sideEffects: 'Drowsiness, dry mouth, headache.',
        }
      ];
      
      if (searchKw) {
         setMedicines(mockData.filter(m => m.name.toLowerCase().includes(searchKw.toLowerCase())));
      } else {
         setMedicines(mockData);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMedicines(keyword);
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-16rem)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 bg-emerald-100 flex items-center justify-center rounded-2xl mb-4">
            <Pill className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Medicine Directory</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Search our comprehensive database to understand your prescriptions.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative flex">
            <div className="relative flex-grow">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                 <Search className="h-5 w-5 text-slate-400" />
               </div>
               <input
                 type="text"
                 placeholder="Search medicine name..."
                 className="w-full pl-12 pr-4 py-4 rounded-l-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm text-lg"
                 value={keyword}
                 onChange={(e) => setKeyword(e.target.value)}
               />
            </div>
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-r-xl transition-colors shadow-sm text-lg">
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicines.map((med) => (
              <div key={med._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all group">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{med.name}</h2>
                    <span className="inline-block mt-1 px-2.5 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded-full">{med.category || 'General'}</span>
                  </div>
                  <Pill className="w-8 h-8 text-emerald-500 opacity-50 transform group-hover:rotate-45 transition-transform" />
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" /> Use For
                    </h3>
                    <p className="text-slate-700 font-medium">{med.usage}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center">
                      <Info className="w-3 h-3 mr-1" /> Typical Dosage
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{med.dosage}</p>
                  </div>

                  <div className="pt-2">
                    <div className="bg-amber-50 rounded-lg p-3 text-sm border border-amber-100">
                      <strong className="text-amber-800 flex items-center mb-1">
                        <AlertTriangle className="w-4 h-4 mr-1 text-amber-600" /> Side Effects
                      </strong>
                      <p className="text-amber-700 text-xs leading-relaxed">{med.sideEffects || 'Consult pharmacist.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && medicines.length === 0 && (
          <div className="text-center py-20 text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
            <Search className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-lg">No medicines found matching "{keyword}".</p>
            <p className="text-sm mt-1">Please check your spelling and try again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Medicines;
