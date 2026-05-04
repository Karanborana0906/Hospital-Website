import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, UserPlus, MessageSquare, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


const homeFeatures = [
  {
    icon: <Calendar className="h-8 w-8 text-blue-500" />,
    title: 'Easy Scheduling',
    description: 'Book appointments with top specialists seamlessly anytime, anywhere.',
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-blue-500" />,
    title: 'AI Health Assistant',
    description: 'Instantly get preliminary advice using our intelligent AI chatbot.',
  },
  {
    icon: <Shield className="h-8 w-8 text-blue-500" />,
    title: 'Secure Records',
    description: 'Upload and manage your medical reports with industry-leading security.',
  },
  {
    icon: <UserPlus className="h-8 w-8 text-blue-500" />,
    title: 'Top Specialists',
    description: 'Access a vetted network of highly experienced healthcare professionals.',
  },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white overflow-hidden rounded-b-[3rem] shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
        <div className="relative max-w-[95%] mx-auto px-4 sm:px-6 lg:px-12 py-24 lg:py-32">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Modern Healthcare, <br />
              <span className="text-blue-300">Powered by AI</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl leading-relaxed">
              Experience the future of medicine with CureSync. Book appointments, manage records, and chat with our smart AI health assistant all in one professional platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={!user ? '/login-required' : '/appointments'} className="bg-white text-blue-700 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg flex items-center justify-center gap-2">
                Book Appointment <ArrowRight className="w-5 h-5"/>
              </Link>
              <Link to={!user ? '/login-required' : '/chatbot'} className="bg-blue-600 bg-opacity-30 border border-blue-400 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-opacity-40 transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5"/> Ask AI Assistant
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Choose CureSync?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">We combine world-class medical expertise with cutting-edge artificial intelligence to provide unparalleled patient care.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {homeFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-slate-100 group">
                <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  {React.cloneElement(feature.icon, { className: 'h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300' })}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Ready to take control of your health?</h2>
          <p className="text-lg text-slate-600 mb-8">Join thousands of patients who trust CureSync for their healthcare needs.</p>
          <Link to="/register" className="inline-block bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200">
            Create Your Patient Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
