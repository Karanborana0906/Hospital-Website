import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';

const LoginRequired = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown <= 0) {
      navigate('/register');
    }
  }, [countdown, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-10 text-center animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-amber-500" />
        </div>
        
        <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Login First</h2>
        <p className="text-slate-500 font-medium mb-8">
          You need an account to access our AI Assistant and Booking features.
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 mb-8 flex flex-col items-center">
          <div className="relative w-16 h-16 flex items-center justify-center mb-3">
             <Loader2 className="w-full h-full text-blue-600 animate-spin absolute" strokeWidth={3} />
             <span className="text-2xl font-black text-blue-600 relative">{countdown}</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Redirecting to Registration...</p>
        </div>

        <button 
          onClick={() => navigate('/register')}
          className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group"
        >
          Go to Sign Up <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default LoginRequired;
