import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Calendar, ArrowLeft, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const RepeatPatients = () => {
    const [repeatPatients, setRepeatPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRepeatPatients();
    }, []);

    const fetchRepeatPatients = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            
            const { data } = await axios.get('/api/appointments/repeat-patients', config);
            setRepeatPatients(data);
        } catch (error) {
            console.error('Error fetching repeat patients:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <Link to="/admin" className="text-blue-600 flex items-center text-sm font-medium hover:underline mb-2">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-slate-800">Repeat Patients</h1>
                <p className="text-slate-500 mt-2">Patients who have visited multiple times</p>
            </div>

            {loading ? (
                <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
            ) : repeatPatients.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
                    <Users className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                    <p>No repeat patients found yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-100 p-2 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">Total Repeat Patients</p>
                                    <p className="text-sm text-slate-500">{repeatPatients.length} patients with multiple visits</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Patient</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Email</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">City</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Total Visits</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">First Visit</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Last Visit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {repeatPatients.map((item) => (
                                <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-800">{item.patient?.name}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-600">{item.patient?.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-600">{item.patient?.city || 'N/A'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                                            <Users className="w-3 h-3 mr-1" /> {item.appointmentCount}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm text-slate-600">
                                            <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                                            {new Date(item.firstVisit).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm text-slate-600">
                                            <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                                            {new Date(item.lastVisit).toLocaleDateString()}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RepeatPatients;
