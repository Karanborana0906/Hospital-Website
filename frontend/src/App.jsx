import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import Doctors from './pages/Doctors';
import DoctorProfile from './pages/DoctorProfile';
import Emergency from './pages/Emergency';
import Appointments from './pages/Appointments';
import Reports from './pages/Reports';
import Medicines from './pages/Medicines';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ManageDoctors from './pages/ManageDoctors';
import ManageUsers from './pages/ManageUsers';
import ManageAppointments from './pages/ManageAppointments';
import ManageReports from './pages/ManageReports';
import ManageMedicinesAdmin from './pages/ManageMedicinesAdmin';
import RepeatPatients from './pages/RepeatPatients';
import LoginRequired from './pages/LoginRequired';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';



import About from './pages/About';
import Contact from './pages/Contact';

// Protected Route Component for Admin
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin' && user.role !== 'superadmin' && user.role !== 'doctor') return <Navigate to="/" />;
  return children;
};

// Protected Route Component for SuperAdmin
const SuperAdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'superadmin') return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chatbot" element={<AdminRoute><div className="p-4 sm:p-8 pt-4"><Chatbot /></div></AdminRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PatientDashboard />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorProfile />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/superadmin" element={<SuperAdminRoute><SuperAdminDashboard /></SuperAdminRoute>} />
            <Route path="/admin" element={<AdminRoute><DoctorDashboard /></AdminRoute>} />
            <Route path="/admin/repeat-patients" element={<AdminRoute><RepeatPatients /></AdminRoute>} />
            <Route path="/admin/manage-doctors" element={<SuperAdminRoute><ManageDoctors /></SuperAdminRoute>} />
            <Route path="/admin/manage-users" element={<SuperAdminRoute><ManageUsers /></SuperAdminRoute>} />
            <Route path="/admin/manage-appointments" element={<AdminRoute><ManageAppointments /></AdminRoute>} />
            <Route path="/admin/manage-reports" element={<AdminRoute><ManageReports /></AdminRoute>} />
            <Route path="/admin/manage-medicines" element={<AdminRoute><ManageMedicinesAdmin /></AdminRoute>} />
            <Route path="/login-required" element={<LoginRequired />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />



            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* Simple Footer */}
        <footer className="bg-slate-900 text-slate-300 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold text-white flex items-center gap-2">
                CureSync
              </span>
              <p className="text-sm mt-2 text-slate-400">Your AI-Powered Health Partner</p>
            </div>
            <div className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} CureSync. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
