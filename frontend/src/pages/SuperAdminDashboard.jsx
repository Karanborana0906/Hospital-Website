import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, Calendar, Activity, Pill, UserPlus, Settings, LogOut, ShieldAlert, Clock, Globe, BarChart3, TrendingUp, History, FileText } from 'lucide-react';
import { apiService } from '../services/apiService.js';
import adminService from '../services/adminService';

const SuperAdminDashboard = () => {
    const { user } = useAuth();
    const isSuperAdmin = true; // High-level override for this dedicated dashboard
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDoctors: 0,
        totalPatients: 0,
        totalLogins: 0,
        todayLogins: 0,
        activeUsersCount: 0,
        totalAppointments: 0,
        totalMedicines: 0,
        totalReports: 0,
        trendData: []
    });
    const [loginLogs, setLoginLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (userInfo.role !== 'superadmin') {
            navigate('/');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const data = await adminService.getStats(userInfo.token);
                setStats(data);
                
                const logs = await adminService.getLoginLogs(userInfo.token);
                if (Array.isArray(logs)) {
                    setLoginLogs(logs);
                } else if (logs && Array.isArray(logs.data)) {
                    setLoginLogs(logs.data);
                }
            } catch (error) {
                console.error("Error fetching admin stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-slate-900/5 py-8">
            <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-amber-500 p-3 rounded-2xl shadow-lg shadow-amber-200 animate-pulse">
                            <ShieldAlert className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                                Super Admin <span className="text-blue-600 tracking-tighter">Intelligence Hub</span>
                            </h1>
                            <p className="text-slate-500 font-medium">Global master control for system-wide operations</p>
                        </div>
                    </div>
                </div>


            {/* Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* User Stats Card */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-50 p-3 rounded-2xl">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase">User Metrics</span>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</p>
                                <p className="text-3xl font-black text-slate-800">{stats.totalUsers}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-400">Doctors: <span className="text-slate-800">{stats.totalDoctors}</span></p>
                                <p className="text-[10px] font-bold text-slate-400">Patients: <span className="text-slate-800">{stats.totalPatients}</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Login Stats Card */}
                <div className={`${isSuperAdmin ? 'bg-slate-900' : 'bg-indigo-600'} p-6 rounded-3xl shadow-xl shadow-indigo-100 text-white relative overflow-hidden group`}>
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10 group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-32 h-32" />
                    </div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <span className={`text-[10px] font-black text-white ${isSuperAdmin ? 'bg-amber-500' : 'bg-white/20'} px-2 py-1 rounded-full uppercase`}>
                            {isSuperAdmin ? 'Global Intelligence' : 'Login Analytics'}
                        </span>
                    </div>
                    <div className="relative z-10 space-y-1">
                        <p className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Total System Logins</p>
                        <p className="text-4xl font-black">{stats.totalLogins}</p>
                        <div className="flex gap-4 mt-2">
                             <div className="bg-white/10 px-3 py-1.5 rounded-xl">
                                <p className="text-[9px] font-bold text-indigo-200 uppercase">Today</p>
                                <p className="text-sm font-black">{stats.todayLogins}</p>
                             </div>
                             <div className="bg-white/10 px-3 py-1.5 rounded-xl">
                                <p className="text-[9px] font-bold text-indigo-200 uppercase">Active (24h)</p>
                                <p className="text-sm font-black">{stats.activeUsersCount}</p>
                             </div>
                        </div>
                    </div>
                </div>

                {/* System Activity Card */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-emerald-50 p-3 rounded-2xl">
                            <Activity className="w-6 h-6 text-emerald-600" />
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase">System Health</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Appointments</p>
                             <p className="text-2xl font-black text-slate-800">{stats.totalAppointments}</p>
                        </div>
                        <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Medicines</p>
                             <p className="text-2xl font-black text-slate-800">{stats.totalMedicines}</p>
                        </div>
                        <div className="col-span-2 pt-2 border-t border-slate-50">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Medical Reports</p>
                             <div className="flex items-center justify-between">
                                <p className="text-2xl font-black text-slate-800">{stats.totalReports}</p>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Verified</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Login History Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                             <History className="w-5 h-5 text-slate-600" />
                        </div>
                        <h3 className="font-black text-slate-800 uppercase tracking-tight">Recent Login History</h3>
                    </div>
                    <button className="text-xs font-bold text-blue-600 hover:underline">View All Logs</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Login Time</th>
                                <th className="px-6 py-4">IP Address</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {Array.isArray(loginLogs) && loginLogs.map((log) => (
                                <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                                {log.userId?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{log.userId?.name || 'Unknown User'}</p>
                                                <p className="text-[10px] text-slate-400">{log.userId?.email || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${
                                            log.role === 'admin' ? 'bg-purple-50 text-purple-600' :
                                            log.role === 'doctor' ? 'bg-blue-50 text-blue-600' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                            {log.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Clock className="w-3 h-3" />
                                            <span className="text-xs font-medium">
                                                {new Date(log.loginTime).toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Globe className="w-3 h-3" />
                                            <span className="text-[10px] font-mono">{log.ipAddress}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="inline-flex items-center bg-emerald-50 px-2 py-1 rounded-full text-[9px] font-black text-emerald-600 uppercase border border-emerald-100">
                                            <div className="w-1 h-1 bg-emerald-500 rounded-full mr-1.5" />
                                            Successful
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {loginLogs.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                         <p className="text-slate-400 text-sm font-medium italic">No login activity recorded yet.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Charts & Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Login Activity Trend */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-black text-slate-800 uppercase tracking-tight">Login Activity Trend</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">7-Day Access Frequency</p>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 rounded-full">
                            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                            <span className="text-[10px] font-black text-indigo-600 uppercase">Logins</span>
                        </div>
                    </div>
                    
                    {/* Dynamic SVG Chart */}
                    <div className="h-48 w-full relative">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.15" />
                                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <line x1="0" y1="200" x2="1000" y2="200" stroke="#f1f5f9" strokeWidth="1" />
                            
                            {stats.trendData && stats.trendData.length > 1 ? (
                                <>
                                    {/* Real Data Line */}
                                    <path 
                                        d={`M ${Array.isArray(stats.trendData) ? stats.trendData.map((d, i) => `${(i / (stats.trendData.length - 1)) * 1000} ${200 - (Math.min(d.count, 20) * 8)}`).join(' L ') : ''}`} 
                                        fill="none" 
                                        stroke="#4f46e5" 
                                        strokeWidth="4" 
                                        strokeLinecap="round"
                                        className="drop-shadow-lg animate-draw"
                                    />
                                    {/* Data Points */}
                                    {Array.isArray(stats.trendData) && stats.trendData.map((d, i) => (
                                        <circle 
                                            key={i}
                                            cx={(i / (stats.trendData.length - 1)) * 1000} 
                                            cy={200 - (Math.min(d.count, 20) * 8)} 
                                            r="4" 
                                            fill="white" 
                                            stroke="#4f46e5" 
                                            strokeWidth="3"
                                        />
                                    ))}
                                </>
                            ) : (
                                /* Fallback / Simulation Path */
                                <path 
                                    d="M 0 180 Q 150 140 300 160 T 500 80 T 750 120 T 1000 40" 
                                    fill="none" 
                                    stroke="#4f46e5" 
                                    strokeWidth="4" 
                                    strokeLinecap="round"
                                    className="drop-shadow-lg opacity-20"
                                />
                            )}
                        </svg>
                        <div className="flex justify-between mt-6 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span>Mon</span>
                            <span>Today</span>
                        </div>
                    </div>
                </div>

                {/* User Distribution Chart */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-black text-slate-800 uppercase tracking-tight">User Distribution</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Doctors vs Patients</p>
                        </div>
                        <BarChart3 className="w-5 h-5 text-slate-400" />
                    </div>
                    
                    <div className="flex items-center justify-around h-48">
                        {/* Custom SVG Doughnut */}
                        <div className="relative w-32 h-32">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                                <circle 
                                    cx="18" cy="18" r="16" fill="none" 
                                    stroke="#4f46e5" strokeWidth="4" 
                                    strokeDasharray={`${(stats.totalDoctors / (stats.totalUsers || 1)) * 100} 100`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-lg font-black text-slate-800">{stats.totalUsers}</span>
                                <span className="text-[8px] font-black text-slate-400 uppercase">Total</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-indigo-600 rounded-full" />
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Doctors</p>
                                    <p className="text-sm font-black text-slate-800">{stats.totalDoctors}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-slate-100 rounded-full" />
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Patients</p>
                                    <p className="text-sm font-black text-slate-800">{stats.totalPatients}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Management Rows */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Admin Quick Actions</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 p-6 gap-4">
                            <Link to="/admin/manage-doctors" className="flex items-center p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group">
                                <Activity className="w-8 h-8 text-blue-500 mr-4" />
                                <div>
                                    <h4 className="font-bold text-slate-800">Manage Doctors</h4>
                                    <p className="text-xs text-slate-500">Add, edit or remove staff</p>
                                </div>
                            </Link>
                            <Link to="/admin/manage-users" className="flex items-center p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group">
                                <Users className="w-8 h-8 text-indigo-500 mr-4" />
                                <div>
                                    <h4 className="font-bold text-slate-800">User Directory</h4>
                                    <p className="text-xs text-slate-500">Manage patient accounts</p>
                                </div>
                            </Link>
                            <Link to="/admin/manage-appointments" className="flex items-center p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group">
                                <Calendar className="w-8 h-8 text-amber-500 mr-4" />
                                <div>
                                    <h4 className="font-bold text-slate-800">Appointments</h4>
                                    <p className="text-xs text-slate-500">Review and approve visits</p>
                                </div>
                            </Link>
                            <Link to="/admin/manage-reports" className="flex items-center p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group">
                                <FileText className="w-8 h-8 text-indigo-400 mr-4" />
                                <div>
                                    <h4 className="font-bold text-slate-800">Reports</h4>
                                    <p className="text-xs text-slate-500">Verify medical records</p>
                                </div>
                            </Link>
                            <Link to="/admin/manage-medicines" className="flex items-center p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group">

                                <Pill className="w-8 h-8 text-emerald-500 mr-4" />
                                <div>
                                    <h4 className="font-bold text-slate-800">Inventory</h4>
                                    <p className="text-xs text-slate-500">List and update medicines</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 self-start">
                    <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-4">System Status</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">Database Connection</span>
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">STABLE</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">Email Service</span>
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">ACTIVE</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">AI Gateway</span>
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">READY</span>
                        </div>
                        <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-50">
                            <span className="text-slate-600">Version</span>
                            <span className="text-slate-400">v1.0.4-stable</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
};

export default SuperAdminDashboard;
