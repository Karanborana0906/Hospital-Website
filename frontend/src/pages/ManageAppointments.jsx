import React, { useState, useEffect } from 'react';
import api from '../services/apiService';
import { Calendar, CheckCircle, XCircle, Clock, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            
            // Choose endpoint based on role
            const endpoint = userInfo.role === 'superadmin' ? '/api/appointments/admin' : '/api/appointments/doctor';
            
            const { data } = await api.get(endpoint, config);
            setAppointments(data);
        } catch (error) {

            console.error(error);
            // Fallback for UI
            setAppointments([
                { 
                    _id: '1', 
                    patientId: { name: 'John Doe' }, 
                    doctorId: { userId: { name: 'Dr. Sarah Jenkins' } },
                    appointmentDate: '2026-03-20',
                    timeSlot: '10:00 AM',
                    status: 'pending',
                    reason: 'General checkup'
                },
                { 
                    _id: '2', 
                    patientId: { name: 'Jane Smith' }, 
                    doctorId: { userId: { name: 'Dr. Michael Chen' } },
                    appointmentDate: '2026-03-21',
                    timeSlot: '02:00 PM',
                    status: 'approved',
                    reason: 'Bral headache'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

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
                    alert("Conflict: Another appointment is already approved for this time slot.");
                    return;
                }
            }

            await api.put(`/api/appointments/${id}/status`, { status }, config);
            
            setAppointments(appointments.map(a => a._id === id ? {...a, status} : a));
        } catch (error) {

            console.error("Error updating status", error);
            alert("Error updating status");
        }
    };


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <Link to={JSON.parse(localStorage.getItem('userInfo') || '{}').role === 'superadmin' ? "/superadmin" : "/admin"} className="text-blue-600 flex items-center text-sm font-medium hover:underline mb-2">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-slate-800">Appointment Management</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Patient</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Doctor</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Schedule</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {appointments.map((apt) => (
                            <tr key={apt._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-slate-800">{apt.patientId?.name}</p>
                                    <p className="text-xs text-slate-500">{apt.patientId?.email}</p>
                                    {apt.patientId?.city && <p className="text-xs text-slate-400">{apt.patientId?.city}</p>}
                                    <p className="text-xs text-slate-400 mt-1">"{apt.reason}"</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-medium text-slate-700">{apt.doctorId?.userId?.name}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center text-sm text-slate-600 mb-1">
                                        <Calendar className="w-3 h-3 mr-1 text-blue-500" /> {new Date(apt.appointmentDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center text-xs text-slate-400">
                                        <Clock className="w-3 h-3 mr-1" /> {apt.timeSlot}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest
                                        ${apt.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                                          apt.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                                          'bg-amber-100 text-amber-700'}`}>
                                        {apt.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {apt.status === 'pending' && (
                                        <div className="flex justify-end gap-2">
                                            <button 
                                              onClick={() => updateStatus(apt._id, 'approved')}
                                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                              title="Approve"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                            </button>
                                            <button 
                                              onClick={() => updateStatus(apt._id, 'cancelled')}
                                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                                              title="Reject"
                                            >
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageAppointments;
