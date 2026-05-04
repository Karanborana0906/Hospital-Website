import React from 'react';
import { Shield, Users, Heart, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="bg-blue-600 py-20 text-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-5xl font-black mb-6 tracking-tight">Caring for life,<br/>Empowering health.</h1>
                    <p className="text-xl text-blue-100 max-w-2xl font-medium leading-relaxed">
                        CureSync is a next-generation hospital platform dedicated to providing seamless, 
                        technology-driven medical care for patients worldwide.
                    </p>
                </div>
                <div className="absolute -bottom-20 -right-20 opacity-10">
                    <Heart className="w-96 h-96" />
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-blue-600 font-black uppercase tracking-widest text-sm mb-4 block">Our Commitment</span>
                        <h2 className="text-4xl font-extrabold text-slate-800 mb-6 leading-tight">Revolutionizing the Patient Journey</h2>
                        <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                            Founded in 2024, CureSync was built on the belief that healthcare should be accessible, 
                            transparent, and intelligent. By combining expert medical knowledge with advanced AI, 
                            we bridge the gap between diagnosis and recovery.
                        </p>
                        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                            Millions of patients trust us for our integrated ecosystem that manages everything from 
                            instant symptom checking to secure document storage.
                        </p>
                        <div className="flex gap-4">
                            <div className="flex flex-col border-r border-slate-200 pr-8">
                                <span className="text-3xl font-black text-blue-600">15+</span>
                                <span className="text-xs font-bold text-slate-400">SPECIALTIES</span>
                            </div>
                            <div className="flex flex-col border-r border-slate-200 pr-8">
                                <span className="text-3xl font-black text-blue-600">100k</span>
                                <span className="text-xs font-bold text-slate-400">PATIENTS</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-blue-600">24/7</span>
                                <span className="text-xs font-bold text-slate-400">SUPPORT</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-1 rounded-3xl overflow-hidden shadow-2xl relative">
                         <div className="bg-white p-10 rounded-[1.4rem] space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-2xl">
                                    <Shield className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg mb-1">Uncompromising Privacy</h3>
                                    <p className="text-sm text-slate-500">Your medical data is encrypted with bank-grade security protocols.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-indigo-100 p-3 rounded-2xl">
                                    <Users className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg mb-1">Collaborative Care</h3>
                                    <p className="text-sm text-slate-500">Doctors and patients stay connected through a unified platform.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-amber-100 p-3 rounded-2xl">
                                    <Award className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg mb-1">Certified Excellence</h3>
                                    <p className="text-sm text-slate-500">Working with nationally accredited laboratory and specialists.</p>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="bg-slate-900 py-16 text-center text-white">
                 <h2 className="text-3xl font-bold mb-6">Ready to take control of your health?</h2>
                 <Link to="/register" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-blue-900/40">
                    Get Started with CureSync <ArrowRight className="w-4 h-4" />
                 </Link>
            </div>
        </div>
    );
};

export default About;
