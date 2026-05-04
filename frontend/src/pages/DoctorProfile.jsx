import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, MapPin, Star, Award, Clock, DollarSign, Calendar, ChevronLeft, Phone, Mail } from 'lucide-react';
import axios from 'axios';

const DoctorProfile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAvailableToday = (doc) => {
    if (!doc.availableDays) return true;
    const today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
    return doc.availableDays.includes(today);
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await axios.get(`/api/doctors/${id}`);
        setDoctor(data);
      } catch (error) {
        console.error('Error fetching doctor', error);
        // Fallback for demo
        setDoctor({
          _id: id,
          userId: { name: 'Dr. Sarah Jenkins', email: 'sarah.j@curesync.com' },
          specialization: 'Cardiology',
          experience: 15,
          about: 'Dr. Sarah Jenkins is a board-certified cardiologist with over 15 years of experience in cardiovascular health. She has performed numerous successful surgeries and is dedicated to providing personalized care to her patients.',
          fees: 150,
          city: 'Mumbai',
          availableDays: ['Monday', 'Wednesday', 'Friday'],
          availableTime: { start: '09:00', end: '14:00' }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!doctor) return <div className="text-center py-20">Doctor not found</div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header / Hero */}
      <div className="bg-blue-600 pt-12 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Link to="/doctors" className="inline-flex items-center text-blue-100 hover:text-white mb-8 transition-colors">
            <ChevronLeft className="w-5 h-5 mr-1" /> Back to Search
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            <div className="h-32 w-32 bg-white rounded-3xl p-1 shadow-2xl">
              <div className="h-full w-full bg-blue-50 rounded-[1.4rem] flex items-center justify-center text-blue-600 text-4xl font-bold">
                {doctor.userId?.name.charAt(4)}
              </div>
            </div>
            
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                <h1 className="text-3xl font-extrabold text-white">{doctor.userId?.name}</h1>
                <div className="inline-flex items-center bg-blue-500/30 backdrop-blur-md px-3 py-1 rounded-full text-blue-50 text-sm font-bold border border-blue-400/30">
                  <Star className="w-4 h-4 mr-1 fill-white" /> 4.9 (120+ Reviews)
                </div>
                {isAvailableToday(doctor) && (
                  <div className="inline-flex items-center bg-emerald-500/30 backdrop-blur-md px-3 py-1 rounded-full text-emerald-50 text-[10px] font-bold uppercase tracking-wider border border-emerald-400/30">
                    Available Today
                  </div>
                )}
              </div>
              <p className="text-xl text-blue-100 mb-4">{doctor.specialization}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-blue-100 text-sm">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {doctor.city}</span>
                <span className="flex items-center gap-1"><Award className="w-4 h-4" /> {doctor.experience} Years Experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Bio & Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">About Doctor</h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                {doctor.about}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-slate-50">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <p className="flex items-center text-slate-600 text-sm">
                      <Mail className="w-4 h-4 mr-3 text-blue-500" /> {doctor.userId?.email}
                    </p>
                    <p className="flex items-center text-slate-600 text-sm">
                      <Phone className="w-4 h-4 mr-3 text-blue-500" /> +91 98765-43210
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Clinic Address</h3>
                  <p className="flex items-start text-slate-600 text-sm">
                    <MapPin className="w-4 h-4 mr-3 text-blue-500 mt-1" />
                    CureSync Specialist Clinic, <br />
                    123 Health Ave, {doctor.city}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Experience & Education</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">Senior Surgeon</h4>
                    <p className="text-sm text-slate-500">City General Hospital • 2015 - Present</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">Medical Degree (MBBS, MD)</h4>
                    <p className="text-sm text-slate-500">Stanford Medical School • 2005 - 2010</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Widget */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                 <p className="text-slate-500 font-medium text-sm text-center">Consultation Fee</p>
                 <p className="text-3xl font-extrabold text-slate-800">${doctor.fees}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" /> Available Days
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {doctor.availableDays?.join(', ') || 'Mon, Tue, Wed'}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> Office Hours
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {doctor.availableTime?.start} AM - {doctor.availableTime?.end} PM
                  </p>
                </div>
              </div>

              <Link 
                to={`/appointments?doctor=${doctor._id}`}
                className="w-full flex items-center justify-center py-4 rounded-xl bg-blue-600 text-white font-extrabold text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all hover:-translate-y-1 mb-4"
              >
                Book Appointment
              </Link>
              <p className="text-center text-xs text-slate-400">
                Free cancellation up to 24h before
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
