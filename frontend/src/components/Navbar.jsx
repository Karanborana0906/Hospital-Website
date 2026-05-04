import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Menu, X, LayoutDashboard, MessageSquare, LogOut, Shield, ShieldAlert, User as UserIcon } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Doctors', path: '/doctors', restricted: ['admin', 'doctor', 'superadmin'] },
    { name: 'Health AI', path: '/chatbot', icon: <MessageSquare className="w-4 h-4" /> },
    { name: 'Emergency', path: '/emergency' },
  ];

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-800">CureSync</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks
              .filter(link => !link.restricted || !user || !link.restricted.includes(user.role))
              .map((link) => (
              <Link
                key={link.name}
                to={!user && (link.path === '/chatbot' || link.path === '/doctors') ? '/login-required' : link.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  location.pathname === link.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {link.icon && link.icon}
                <span>{link.name}</span>
              </Link>

            ))}

            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            {user ? (
              <div className="flex items-center space-x-3 pl-2">
                {user.role === 'superadmin' ? (
                  <Link 
                    to="/superadmin" 
                    className="flex items-center px-4 py-2 border-2 border-amber-500 bg-amber-50 rounded-xl text-amber-700 text-sm font-black hover:bg-amber-100 transition-all shadow-sm"
                  >
                    <ShieldAlert className="w-4 h-4 mr-2" /> Super Admin
                  </Link>
                ) : user.role === 'doctor' || user.role === 'admin' ? (
                  <Link 
                    to="/admin" 
                    className="flex items-center px-4 py-2 border-2 border-blue-600 rounded-xl text-blue-600 text-sm font-black hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  >
                    <Shield className="w-4 h-4 mr-2" /> Admin Panel
                  </Link>
                ) : (
                  <Link 
                    to="/dashboard" 
                    className="flex items-center px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-900 transition-all shadow-md"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                  </Link>
                )}
                
                <Link 
                  to="/profile" 
                  className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                  title="My Profile"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>

                <button 
                  onClick={handleLogout}

                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-2">
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-blue-600 text-sm font-bold px-4 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-200 hover:scale-105"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 animate-in slide-in-from-top duration-300">
          <div className="px-4 py-6 space-y-4">
            {navLinks
              .filter(link => !link.restricted || !user || !link.restricted.includes(user.role))
              .map((link) => (
                <Link
                  key={link.name}
                  to={!user && (link.path === '/chatbot' || link.path === '/doctors') ? '/login-required' : link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-xl text-lg font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all"
                >
                  {link.icon || <Activity className="w-5 h-5" />}
                  <span>{link.name}</span>
                </Link>

            ))}
            
            <div className="pt-4 border-t border-slate-100">
              {user ? (
                <>
                  <Link
                    to={user.role === 'superadmin' ? '/superadmin' : ['admin', 'doctor'].includes(user.role) ? '/admin' : '/dashboard'}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 p-3 rounded-xl font-bold transition-all mb-3 ${
                      user.role === 'superadmin' ? 'bg-amber-500 text-white' : user.role === 'doctor' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Go to {user.role === 'superadmin' ? 'Super Admin' : user.role === 'doctor' ? 'Admin Panel' : 'Dashboard'}</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 p-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all mb-1"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}

                    className="flex items-center space-x-3 p-3 w-full rounded-xl text-red-600 font-bold hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-center p-3 rounded-xl border-2 border-slate-200 text-slate-700 font-bold"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="text-center p-3 rounded-xl bg-blue-600 text-white font-bold"
                  >
                    Join Us
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
