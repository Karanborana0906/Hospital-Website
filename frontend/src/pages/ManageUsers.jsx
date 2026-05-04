import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, Trash, Shield, ShieldAlert, ArrowLeft, Eye } from 'lucide-react';

import { Link } from 'react-router-dom';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            // Note: We need to ensure the backend has an endpoint for this
            const { data } = await axios.get('/api/auth/users', config);
            setUsers(data);
        } catch (error) {
            console.error(error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleAdmin = async (userId, currentRole) => {
        // Logic to promote/demote user
        alert(`Toggling role for ${userId}`);
    };

    const deleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            // Logic to delete
            alert(`Deleting user ${userId}`);
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
             <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link to={JSON.parse(localStorage.getItem('userInfo') || '{}').role === 'superadmin' ? "/superadmin" : "/admin"} className="text-blue-600 flex items-center text-sm font-medium hover:underline mb-2">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">User <span className="text-blue-600 tracking-tighter">Directory</span></h1>
                </div>
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">User</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Role</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-800">{user.name}</div>
                                    <div className="text-xs text-slate-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
                                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                                          user.role === 'doctor' ? 'bg-blue-100 text-blue-700' : 
                                          'bg-green-100 text-green-700'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                     <div className="flex items-center text-green-600 text-sm font-medium">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div> Active
                                     </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link 
                                      to={`/profile/${user._id}`}
                                      className="text-slate-400 hover:text-blue-600 p-1 mr-2"
                                      title="View Profile"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Link>
                                    <button 
                                      onClick={() => toggleAdmin(user._id, user.role)}
                                      title={user.role === 'admin' ? "Demote to Patient" : "Make Admin"}
                                      className="text-slate-400 hover:text-amber-600 p-1 mr-2"
                                    >
                                        {user.role === 'admin' ? <ShieldAlert className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                                    </button>
                                    <button 
                                      onClick={() => deleteUser(user._id)}
                                      className="text-slate-400 hover:text-red-600 p-1"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
