import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService.js';
import { FileText, Download, ArrowLeft, Search, User, Calendar as CalendarIcon, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            
            // Choose endpoint based on role
            const endpoint = userInfo.role === 'superadmin' ? '/api/reports/admin' : '/api/reports/doctor';
            
            const { data } = await apiService.adminGetReports();
            if (Array.isArray(data)) {
                setReports(data);
            } else if (data && Array.isArray(data.data)) {
                setReports(data.data);
            }
        } catch (error) {
            console.error("Error fetching reports", error);
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredReports = Array.isArray(reports) ? reports.filter(report => 
        report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-slate-50/30">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link to={JSON.parse(localStorage.getItem('userInfo') || '{}').role === 'superadmin' ? "/superadmin" : "/admin"} className="text-blue-600 flex items-center text-sm font-bold hover:underline mb-2 uppercase tracking-tight">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Medical Report <span className="text-blue-600">Oversight</span></h1>
                    <p className="text-slate-500 text-sm font-medium">Review and verify patient health documentation</p>
                </div>
                
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Search by title or patient name..."
                        className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full md:w-80 shadow-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center animate-pulse">
                        <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4" />
                        <div className="h-4 w-48 bg-slate-100 mx-auto rounded mb-2" />
                        <div className="h-3 w-32 bg-slate-50 mx-auto rounded" />
                    </div>
                ) : filteredReports.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                                    <th className="px-8 py-5">Report Details</th>
                                    <th className="px-8 py-5">Patient Information</th>
                                    <th className="px-8 py-5">Uploaded On</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {Array.isArray(filteredReports) && filteredReports.map((report) => (
                                    <tr key={report._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-blue-50 p-3 rounded-2xl group-hover:bg-blue-100 transition-colors">
                                                    <FileText className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-800 tracking-tight">{report.title}</p>
                                                    <p className="text-xs text-slate-400 font-medium italic">{report.description || 'No description provided'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600 border border-indigo-100">
                                                    {report.patientId?.name?.charAt(0) || 'P'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{report.patientId?.name || 'Unknown Patient'}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{report.patientId?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <CalendarIcon className="w-4 h-4 text-slate-300" />
                                                <span className="text-xs font-bold">{new Date(report.uploadDate).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <a 
                                                href={`${report.filePath}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
                                            >
                                                <ExternalLink className="w-3 h-3" /> View Report
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-20 text-center flex flex-col items-center">
                        <div className="bg-slate-50 p-6 rounded-full mb-4">
                            <FileText className="w-12 h-12 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No reports found</p>
                        <p className="text-sm italic mt-2 text-slate-500 font-medium">Try refining your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageReports;
