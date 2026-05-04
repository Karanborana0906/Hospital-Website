import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, FileText, Pill, LogOut, User, Activity } from 'lucide-react';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('userInfo');
    if (data) {
      setUserInfo(JSON.parse(data));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  if (!userInfo) return null;

  return (
    <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-12 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Patient <span className="text-emerald-600 tracking-tighter">Portal</span></h1>
          <p className="text-slate-600 mt-1">Welcome back, {userInfo.name}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            onClick={handleLogout}
            className="flex items-center text-red-600 hover:text-red-800 font-medium transition-colors"
          >
            <LogOut className="h-5 w-5 mr-1" /> Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Quick Links */}
        <Link to="/appointments" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all group">
          <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
            <Calendar className="h-6 w-6 text-blue-600 group-hover:text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Appointments</h2>
          <p className="text-slate-500 text-sm">View or book new appointments</p>
        </Link>
        
        <Link to="/reports" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all group">
          <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
            <FileText className="h-6 w-6 text-indigo-600 group-hover:text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Medical Reports</h2>
          <p className="text-slate-500 text-sm">Upload and view test results</p>
        </Link>
        
        <Link to="/medicines" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all group">
          <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors">
            <Pill className="h-6 w-6 text-emerald-600 group-hover:text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Medicines</h2>
          <p className="text-slate-500 text-sm">Search and understand prescriptions</p>
        </Link>
        
        <Link to="/chatbot" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all group">
          <div className="bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
            <Activity className="h-6 w-6 text-purple-600 group-hover:text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Health AI</h2>
          <p className="text-slate-500 text-sm">Chat with our intelligent assistant</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
            <h3 className="text-lg font-bold text-slate-800">Upcoming Appointments</h3>
            <Link to="/appointments" className="text-blue-600 text-sm font-medium hover:underline">View All</Link>
          </div>
          <div className="text-center py-8 text-slate-500">
            {/* Real data would map here */}
            <p>No upcoming appointments found.</p>
            <Link to="/appointments" className="mt-4 inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors">
              Book Appointment
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
            <h3 className="text-lg font-bold text-slate-800">Recent Reports</h3>
            <Link to="/reports" className="text-blue-600 text-sm font-medium hover:underline">Upload</Link>
          </div>
          <div className="text-center py-8 text-slate-500">
            {/* Real data would map here */}
            <p>No recent medical reports uploaded.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
