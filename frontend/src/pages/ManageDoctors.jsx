import React, { useState, useEffect } from 'react';
import api from '../services/apiService';
import { UserPlus, ArrowLeft, Trash, Edit, Check, Eye } from 'lucide-react';

import { Link } from 'react-router-dom';

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form Stats
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [experience, setExperience] = useState('');
    const [fees, setFees] = useState('');
    const [about, setAbout] = useState('');
    const [city, setCity] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const { data } = await api.get('/api/doctors');
            if (Array.isArray(data)) {
                setDoctors(data);
            } else if (data && Array.isArray(data.data)) {
                setDoctors(data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            
            // In a real app, you'd have an admin endpoint to create doctor + linked user
            // This is a simplified version
            const location = lat && lng ? { lat: Number(lat), lng: Number(lng) } : null;
            await api.post('/api/auth/register', { 
                name, email, password, role: 'doctor', 
                city, location,
                specialization, experience, fees, about
            });
            
            // Then logic to create doctor profile would follow
            // For now, refresh list
            fetchDoctors();
            setShowForm(false);
            // Reset form
            setName(''); setEmail(''); setPassword(''); setSpecialization('');
            setExperience(''); setFees(''); setAbout(''); setCity('');
            setLat(''); setLng('');
        } catch (error) {
            alert(error.response?.data?.message || "Error adding doctor");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <Link to={JSON.parse(localStorage.getItem('userInfo') || '{}').role === 'superadmin' ? "/superadmin" : "/admin"} className="text-blue-600 flex items-center text-sm font-medium hover:underline mb-2">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Manage <span className="text-blue-600 tracking-tighter">Medical Staff</span></h1>
                </div>
                <button 
                  onClick={() => setShowForm(!showForm)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
                >
                    {showForm ? 'Cancel' : 'Add New Doctor'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h2 className="text-xl font-bold mb-6 text-slate-800">Doctor Information</h2>
                    <form onSubmit={handleAddDoctor} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Credentials / Password</label>
                                <input type="password" placeholder="Create temporary login" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                                <input type="text" placeholder="Cardiology, Pediatrics etc." className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required value={specialization} onChange={e => setSpecialization(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Exp (Years)</label>
                                    <input type="number" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required value={experience} onChange={e => setExperience(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Fees ($)</label>
                                    <input type="number" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required value={fees} onChange={e => setFees(e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">About Doctor</label>
                                <textarea className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-20" value={about} onChange={e => setAbout(e.target.value)} />
                            </div>
                        </div>

                        {/* Location Section */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                           <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                <input type="text" placeholder="e.g. Mumbai" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required value={city} onChange={e => setCity(e.target.value)} />
                           </div>
                           <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Latitude</label>
                                <input type="number" step="any" placeholder="19.0760" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" value={lat} onChange={e => setLat(e.target.value)} />
                           </div>
                           <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Longitude</label>
                                <input type="number" step="any" placeholder="72.8777" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" value={lng} onChange={e => setLng(e.target.value)} />
                           </div>
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
                                Register Doctor Profile
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Doctor</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Specialization</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">City</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {Array.isArray(doctors) && doctors.map((doctor) => (
                            <tr key={doctor._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 mr-3">
                                            {doctor.userId?.name?.charAt(4) || 'D'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{doctor.userId?.name}</p>
                                            <p className="text-xs text-slate-500">{doctor.userId?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-blue-600">
                                    {doctor.specialization}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {doctor.city || 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                    <Link 
                                        to={`/profile/${doctor.userId?._id}`} 
                                        className="text-slate-400 hover:text-blue-600 p-1"
                                        title="View Profile"
                                    >
                                        <Eye className="w-4 h-4"/>
                                    </Link>
                                    <button className="text-slate-400 hover:text-blue-600 p-1"><Edit className="w-4 h-4"/></button>
                                    <button className="text-slate-400 hover:text-red-600 p-1"><Trash className="w-4 h-4"/></button>
                                </td>

                            </tr>
                        ))}
                        {Array.isArray(doctors) && doctors.length === 0 && !loading && (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-slate-400 italic">No doctors registered in the system yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageDoctors;
