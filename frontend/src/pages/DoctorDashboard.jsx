import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Users, FileText, Activity, Clock, ChevronRight, LayoutDashboard, AlertCircle, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import api from '../services/apiService';

import { useAuth } from '../context/AuthContext';
import doctorService from '../services/doctorService';

const DoctorDashboard = () => {

  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    totalPatients: 0,
    pendingReports: 0
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!['doctor', 'admin'].includes(userInfo.role)) {
      navigate('/');
      return;
    }

    const fetchDoctorData = async () => {
        try {
            const statsData = await doctorService.getStats(userInfo.token);
            setStats(statsData);
            
            const aptData = await doctorService.getAppointments(userInfo.token);
            if (Array.isArray(aptData)) {
                setAppointments(aptData);
            } else if (aptData && Array.isArray(aptData.data)) {
                setAppointments(aptData.data);
            }
        } catch (error) {
            console.error("Error fetching doctor data", error);
        } finally {
            setLoading(false);
        }
    };

    fetchDoctorData();
  }, [navigate]);


  const updateStatus = async (id, status) => {
    try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        // Overlap Check (if approving)
        if (status === 'approved') {
            const targetApt = appointments.find(a => a._id === id);
            const isOverlap = appointments.some(a => 
                a._id !== id && 
                a.status === 'approved' && 
                new Date(a.appointmentDate).toDateString() === new Date(targetApt.appointmentDate).toDateString() &&
                a.timeSlot === targetApt.timeSlot
            );
            
            if (isOverlap) {
                alert("Conflict Detected: Another appointment is already approved for this time slot.");
                return;
            }
        }

        await api.put(`/api/appointments/${id}/status`, { status }, config);
        
        // Refresh data
        const aptData = await doctorService.getAppointments(userInfo.token);
        if (Array.isArray(aptData)) {
            setAppointments(aptData.slice(0, 5));
        } else if (aptData && Array.isArray(aptData.data)) {
            setAppointments(aptData.data.slice(0, 5));
        }
        const statsData = await doctorService.getStats(userInfo.token);
        setStats(statsData);
    } catch (error) {
        console.error("Error updating status", error);
        alert("Error updating status");
    }
  };



  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Doctor <span className="text-blue-600 tracking-tighter">Admin Panel</span>
          </h1>
          <p className="text-slate-500 font-medium">Clinical management and patient oversight</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-blue-50 p-3 rounded-2xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Appointments</p>
            </div>
            <p className="text-3xl font-black text-slate-800">{stats.upcomingAppointments}</p>
            <p className="text-xs text-slate-400 mt-1">Scheduled for today</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-indigo-50 p-3 rounded-2xl">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Patients</p>
            </div>
            <p className="text-3xl font-black text-slate-800">{stats.totalPatients}</p>
            <p className="text-xs text-slate-400 mt-1">Under your care</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-emerald-50 p-3 rounded-2xl">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Pending Reports</p>
            </div>
            <p className="text-3xl font-black text-slate-800">{stats.pendingReports}</p>
            <p className="text-xs text-slate-400 mt-1">Awaiting review</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-800 uppercase tracking-tight">Upcoming Schedule</h3>
              <Link to="/admin/manage-appointments" className="text-xs font-bold text-blue-600 hover:underline px-3 py-1 bg-blue-50 rounded-full">View Full Manager</Link>
            </div>
            
            {loading ? (
                <div className="p-12 text-center animate-pulse">
                    <div className="h-4 w-32 bg-slate-100 mx-auto rounded mb-2"></div>
                    <div className="h-3 w-48 bg-slate-50 mx-auto rounded"></div>
                </div>
            ) : appointments.length > 0 ? (
                <div className="divide-y divide-slate-50">
                    {Array.isArray(appointments) && appointments.map((apt) => (
                        <div key={apt._id} className="p-5 hover:bg-slate-50/80 transition-colors flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-10 rounded-full ${apt.status === 'approved' ? 'bg-emerald-400' : apt.status === 'cancelled' ? 'bg-red-400' : 'bg-amber-400'}`} />
                                <div>
                                    <p className="font-black text-slate-800 tracking-tight">{apt.patientId?.name || 'Unknown Patient'}</p>
                                    <p className="text-xs text-slate-500">{apt.patientId?.email}</p>
                                    {apt.patientId?.city && <p className="text-xs text-slate-400">{apt.patientId?.city}</p>}
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                                            <Clock className="w-3 h-3" /> {apt.timeSlot}
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                                            <Calendar className="w-3 h-3" /> {new Date(apt.appointmentDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {apt.status === 'pending' ? (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => updateStatus(apt._id, 'approved')}
                                            className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
                                            title="Approve"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(apt._id, 'cancelled')}
                                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                                            title="Cancel"
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                        apt.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                    }`}>
                                        {apt.status}
                                    </span>
                                )}
                                <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    ))}
                </div>

            ) : (
                <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                    <AlertCircle className="w-12 h-12 text-slate-100 mb-4" />
                    <p className="font-bold uppercase tracking-widest text-[10px]">No appointments scheduled</p>
                    <p className="text-sm italic mt-1 font-medium">Your schedule is currently clear.</p>
                </div>
            )}
          </div>

          {/* Schedule Overview / Check Availability */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-slate-800 uppercase tracking-tight">Availability Check</h3>
                <input 
                    type="date" 
                    className="text-xs font-bold border-none bg-slate-50 rounded-lg p-1 px-2 focus:ring-0"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
                {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map(slot => {
                    const apt = Array.isArray(appointments) ? appointments.find(a => 
                        new Date(a.appointmentDate).toDateString() === new Date(selectedDate).toDateString() && 
                        a.timeSlot === slot &&
                        a.status === 'approved'
                    ) : null;
                    return (
                        <div key={slot} className={`p-3 rounded-2xl border flex flex-col gap-1 transition-all ${
                            apt ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'
                        }`}>
                            <span className="text-[10px] font-black uppercase text-slate-400">{slot}</span>
                            <span className={`text-xs font-bold ${apt ? 'text-amber-700' : 'text-emerald-700'}`}>
                                {apt ? 'BOOKED' : 'AVAILABLE'}
                            </span>
                        </div>
                    );
                })}
            </div>

            <h3 className="font-black text-slate-800 uppercase tracking-tight mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/admin/manage-reports" className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-xl shadow-sm">
                    <Activity className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="font-bold text-slate-800">Review Medical Reports</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </Link>

              <Link to="/admin/repeat-patients" className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-purple-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-xl shadow-sm">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-bold text-slate-800">Repeat Patients</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-purple-600 transition-colors" />
              </Link>

              <Link to="/admin/manage-appointments" className="w-full flex items-center justify-between p-4 bg-slate-800 text-white rounded-2xl hover:bg-slate-900 transition-all shadow-lg shadow-slate-200">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-700 p-2 rounded-xl text-white">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="font-bold">Full Schedule Manager</span>
                </div>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
