import React, { useState, useEffect } from 'react';
import api from '../services/apiService';
import { Calendar as CalendarIcon, Clock, User, AlertCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();
  const location = useLocation();
  
  // Form state
  const [doctorId, setDoctorId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [reason, setReason] = useState('');

  // Pre-fill doctor from URL
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const docId = query.get('doctor');
    
    if (docId && doctors.length > 0) {
      const selected = doctors.find(d => d._id === docId);
      if (selected) {
        setDoctorId(selected._id);
        setSearchTerm(`${selected.userId?.name} - ${selected.specialization}`);
      }
    }
  }, [location.search, doctors]);

  const filteredDoctors = doctors.filter(doc => 
    doc.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectDoctor = (doc) => {
    setDoctorId(doc._id);
    setSearchTerm(`${doc.userId?.name} - ${doc.specialization}`);
    setShowDropdown(false);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user?.token}` } };
        
        // Use Promise.all if real API, simulating fallback for UI
        api.get('/api/appointments', config).then(res => setAppointments(res.data)).catch(err => console.log('Mocking appointments'));
        api.get('/api/doctors').then(res => setDoctors(res.data)).catch(err => {
          setDoctors([
            { _id: '69b4fafec84c714ef6b66f46', userId: { name: 'Dr. Sarah Jenkins' }, specialization: 'Cardiology' },
            { _id: '69b4fafec84c714ef6b66f47', userId: { name: 'Dr. Michael Chen' }, specialization: 'Neurology' }
          ]);
        });
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchInitialData();
    else setLoading(false);
  }, [user?.token]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await api.post('/api/appointments', { doctorId, appointmentDate, timeSlot, reason }, config);
      
      if (data.dateShifted) {
        setSuccess(`Appointment booked successfully! Date shifted from ${new Date(data.originalDate).toLocaleDateString()} to ${new Date(data.finalDate).toLocaleDateString()} due to daily limit.`);
      } else {
        setSuccess('Appointment booked successfully!');
      }
      
      // Update local state to reflect new appointment
      const selectedDoc = doctors.find(d => d._id === doctorId);
      setAppointments([...appointments, { ...data, doctorId: selectedDoc, status: 'pending' }]);
      
      // Reset form
      setDoctorId('');
      setSearchTerm('');
      setAppointmentDate('');
      setTimeSlot('');
      setReason('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error booking appointment');
    }
  };

  if (!user?.token) {
    return <div className="text-center py-20 text-xl text-slate-600">Please log in to manage your appointments.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Manage Appointments</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Booking Form */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 self-start">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" /> Book New
          </h2>
          
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 flex items-start"><AlertCircle className="w-4 h-4 mr-1 mt-0.5" />{error}</div>}
          {success && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm mb-4">{success}</div>}
          
          <form className="space-y-4" onSubmit={handleBook}>
            {/* Patient Information - Read Only */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Patient Information</h3>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  readOnly
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium"
                />
              </div>
              {user?.city && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">City</label>
                  <input
                    type="text"
                    value={user?.city || ''}
                    readOnly
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium"
                  />
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Doctor</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Search by name or specialty..."
                  className="w-full pl-10 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50 transition-all font-medium"
                  value={searchTerm}
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (doctorId) setDoctorId('');
                  }}
                />
              </div>

              {showDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                  {filteredDoctors.length > 0 ? (
                    filteredDoctors.map(doc => (
                      <div
                        key={doc._id}
                        className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                        onClick={() => selectDoctor(doc)}
                      >
                        <div className="font-bold text-slate-800">{doc.userId?.name}</div>
                        <div className="text-xs text-blue-600 font-bold uppercase tracking-wider">{doc.specialization}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-slate-500 italic">No doctors found matching "{searchTerm}"</div>
                  )}
                </div>
              )}
              {/* Hidden input for form requirement */}
              <input type="hidden" required value={doctorId} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input 
                type="date" 
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Time Slot</label>
              <select 
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
              >
                <option value="">Select time...</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Reason for visit</label>
              <textarea 
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50 h-24 resize-none"
                placeholder="Briefly describe your symptoms..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-2">
              Confirm Booking
            </button>
          </form>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Your History</h2>
          
          {loading ? (
            <div className="text-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>
          ) : appointments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
              <CalendarIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p>You don't have any appointments booked yet.</p>
            </div>
          ) : (
             appointments.map((apt, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-start mb-4 sm:mb-0">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4 flex-shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{apt.doctorId?.userId?.name || 'Specialist'}</h3>
                    <p className="text-sm text-blue-600 font-medium mb-1">{apt.doctorId?.specialization || 'General'}</p>
                    <div className="flex items-center text-xs text-slate-500 space-x-4">
                      <span className="flex items-center"><CalendarIcon className="w-3 h-3 mr-1"/> {new Date(apt.appointmentDate || Date.now()).toLocaleDateString()}</span>
                      <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {apt.timeSlot || 'Pending'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start sm:items-end">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                    ${apt.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                      apt.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                      'bg-amber-100 text-amber-700'}`}>
                    {apt.status || 'Pending'}
                  </span>
                  {apt.reason && <p className="text-xs text-slate-400 mt-2 max-w-xs truncate" title={apt.reason}>"{apt.reason}"</p>}
                </div>
              </div>
            ))
          )}
        </div>
        
      </div>
    </div>
  );
};

export default Appointments;
