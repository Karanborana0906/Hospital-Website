import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    return (
        <div className="bg-slate-50 min-h-[calc(100vh-16rem)] py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">How can we help?</h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
                        Our dedicated support team and medical staff are here to assist you 24/7.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full">
                            <h2 className="text-2xl font-bold text-slate-800 mb-8">Get in Touch</h2>
                            
                            <div className="space-y-8">
                                <div className="flex items-start">
                                    <div className="bg-blue-50 p-3 rounded-xl mr-4">
                                        <Mail className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Email Us</p>
                                        <p className="text-slate-800 font-medium">support@curesync.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-indigo-50 p-3 rounded-xl mr-4">
                                        <Phone className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Call Us</p>
                                        <p className="text-slate-800 font-medium">+1 (555) 000-1111</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-emerald-50 p-3 rounded-xl mr-4">
                                        <MapPin className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Visit Us</p>
                                        <p className="text-slate-800 font-medium">123 Health Ave, Medical District<br/>New York, NY 10001</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                             <h2 className="text-2xl font-bold text-slate-800 mb-8">Send a Message</h2>
                             <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 transition-all font-medium" placeholder="Jane Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                        <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 transition-all font-medium" placeholder="jane@example.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 transition-all font-medium">
                                        <option>General Inquiry</option>
                                        <option>Technical Support</option>
                                        <option>Appointment Issue</option>
                                        <option>Feedback</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                                    <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 h-40 resize-none font-medium" placeholder="Tell us how we can help..."></textarea>
                                </div>
                                <button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-10 rounded-xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
                                    <Send className="w-4 h-4" /> Send Message
                                </button>
                             </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
