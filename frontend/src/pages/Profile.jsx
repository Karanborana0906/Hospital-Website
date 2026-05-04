import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Shield, Briefcase, Clock, DollarSign, Save, Edit3, ArrowLeft, CheckCircle } from 'lucide-react';
import authService from '../services/authService';
import doctorService from '../services/doctorService';

const Profile = () => {
    const { id } = useParams(); // For Super Admin viewing others
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [doctorProfile, setDoctorProfile] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        city: '',
        password: '',
        specialization: '',
        experience: '',
        fees: '',
        about: ''
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                const targetId = id || userInfo._id;
                
                // Fetch basic user info
                let userData;
                if (id && userInfo.role === 'superadmin') {
                    userData = await authService.getUserById(id, userInfo.token);
                } else {
                    userData = await authService.getProfile(userInfo.token);
                }
                setUserProfile(userData);

                // If user is doctor/admin, fetch doctor profile
                if (userData.role === 'doctor' || userData.role === 'admin') {
                    const docData = await doctorService.getDoctorByUserId(targetId);
                    setDoctorProfile(docData);
                    setFormData({
                        name: userData.name,
                        email: userData.email,
                        city: userData.city || '',
                        password: '',
                        specialization: docData.specialization || '',
                        experience: docData.experience || '',
                        fees: docData.fees || '',
                        about: docData.about || ''
                    });
                } else {
                    setFormData({
                        name: userData.name,
                        email: userData.email,
                        city: userData.city || '',
                        password: '',
                        specialization: '',
                        experience: '',
                        fees: '',
                        about: ''
                    });
                }
            } catch (error) {
                console.error("Error fetching profile", error);
                setMessage({ type: 'error', text: 'Failed to load profile data.' });
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            
            // Update User Info
            await authService.updateProfile({
                name: formData.name,
                email: formData.email,
                city: formData.city,
                password: formData.password || undefined
            }, userInfo.token);

            // Update Doctor Info if applicable
            if (userProfile.role === 'doctor' || userProfile.role === 'admin') {
                await doctorService.updateProfile({
                    specialization: formData.specialization,
                    experience: formData.experience,
                    fees: formData.fees,
                    about: formData.about,
                    city: formData.city
                }, userInfo.token);
            }

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
            // Update local state is handled by authService updating localStorage, but we refresh anyway
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    if (loading && !userProfile) return <div className="p-20 text-center animate-pulse font-black text-slate-400 uppercase tracking-widest">Loading Profile...</div>;

    const isOwnProfile = !id || id === JSON.parse(localStorage.getItem('userInfo') || '{}')._id;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="mb-8 flex items-center justify-between">
                <div>
                     <button onClick={() => navigate(-1)} className="text-blue-600 flex items-center text-sm font-bold hover:underline mb-2 uppercase tracking-tight">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Go Back
                    </button>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                        {isOwnProfile ? 'Your ' : `${userProfile?.name}'s `}
                        <span className="text-blue-600">Profile</span>
                    </h1>
                </div>
                {isOwnProfile && (
                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
                            isEditing ? 'bg-slate-100 text-slate-600' : 'bg-blue-600 text-white shadow-lg shadow-blue-100 hover:scale-105'
                        }`}
                    >
                        {isEditing ? 'Cancel Edit' : <><Edit3 className="w-4 h-4" /> Edit Profile</>}
                    </button>
                )}
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in duration-300 ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                }`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                    <span className="font-bold text-sm">{message.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" /> Basic Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Display Name</label>
                            {isEditing ? (
                                <input name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 font-bold" />
                            ) : (
                                <p className="text-lg font-bold text-slate-800">{userProfile?.name}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                            {isEditing ? (
                                <input name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 font-bold" />
                            ) : (
                                <p className="text-lg font-bold text-slate-800">{userProfile?.email}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">City / Location</label>
                            {isEditing ? (
                                <input name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 font-bold" />
                            ) : (
                                <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-slate-400" /> {userProfile?.city || 'Not specified'}
                                </p>
                            )}
                        </div>
                        {isEditing && (
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">New Password (Leave blank to keep same)</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 font-bold" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Professional Info Card (Only for Doctor/Admin) */}
                {(userProfile?.role === 'doctor' || userProfile?.role === 'admin') && (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 animate-in slide-in-from-bottom duration-500">
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-6 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-indigo-600" /> Clinical Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Specialization</label>
                                {isEditing ? (
                                    <input name="specialization" value={formData.specialization} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 font-bold" />
                                ) : (
                                    <p className="font-bold text-slate-800 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg inline-block">{doctorProfile?.specialization || 'General Surgery'}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Experience (Years)</label>
                                {isEditing ? (
                                    <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 font-bold" />
                                ) : (
                                    <p className="text-lg font-bold text-slate-800 flex items-center gap-2"><Clock className="w-4 h-4 text-slate-300" /> {doctorProfile?.experience} Years</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Consultation Fee</label>
                                {isEditing ? (
                                    <input type="number" name="fees" value={formData.fees} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 font-bold" />
                                ) : (
                                    <p className="text-lg font-bold text-slate-800 flex items-center gap-2"><DollarSign className="w-4 h-4 text-slate-300" /> ${doctorProfile?.fees}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">About / Bio</label>
                            {isEditing ? (
                                <textarea name="about" value={formData.about} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 font-bold h-32 resize-none" />
                            ) : (
                                <p className="text-slate-600 leading-relaxed italic">{doctorProfile?.about || 'No biography provided yet.'}</p>
                            )}
                        </div>
                    </div>
                )}

                {isEditing && (
                    <div className="flex justify-end gap-4">
                        <button 
                            type="button" 
                            onClick={() => setIsEditing(false)}
                            className="px-8 py-3 rounded-xl font-bold text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            Discard Changes
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-slate-900 text-white px-10 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Profile;
