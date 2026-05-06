import React, { useState, useEffect } from 'react';
import api from '../services/apiService';
import { Pill, Plus, Trash, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageMedicinesAdmin = () => {
    const [medicines, setMedicines] = useState([]);
    const [showForm, setShowForm] = useState(false);
    
    // Form state
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [usage, setUsage] = useState('');
    const [dosage, setDosage] = useState('');
    const [sideEffects, setSideEffects] = useState('');

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            const { data } = await api.get('/api/medicines');
            setMedicines(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await api.post('/api/medicines', { name, category, usage, dosage, sideEffects }, config);
            fetchMedicines();
            setShowForm(false);
            // reset form
            setName(''); setCategory(''); setUsage(''); setDosage(''); setSideEffects('');
        } catch (error) {
            alert("Error adding medicine");
            // Mocking update for local UI if offline
            setMedicines([...medicines, { name, category, usage, dosage, sideEffects, _id: Date.now().toString() }]);
            setShowForm(false);
        }
    };

    const deleteMedicine = async (id) => {
        if (window.confirm("Delete this medicine?")) {
            setMedicines(medicines.filter(m => m._id !== id));
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <Link to={JSON.parse(localStorage.getItem('userInfo') || '{}').role === 'superadmin' ? "/superadmin" : "/admin"} className="text-blue-600 flex items-center text-sm font-medium hover:underline mb-2">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-black text-slate-800 flex items-center tracking-tight">
                        <Pill className="w-8 h-8 mr-3 text-emerald-600" /> Medicine <span className="text-emerald-600 tracking-tighter pl-2">Inventory</span>
                    </h1>
                </div>
                <button 
                  onClick={() => setShowForm(!showForm)}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center shadow-lg shadow-emerald-100"
                >
                    <Plus className="w-5 h-5 mr-1" /> {showForm ? 'Cancel' : 'Add Medicine'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8 mb-10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                       <Pill className="w-32 h-32 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold mb-6 text-slate-800">Add New Entry</h2>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Medicine Name</label>
                                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-slate-50" required value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <input type="text" placeholder="Antibiotic, Painkiller etc." className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-slate-50" required value={category} onChange={e => setCategory(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">General Usage</label>
                                <textarea className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-slate-50 h-20" required value={usage} onChange={e => setUsage(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Standard Dosage</label>
                                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-slate-50" required value={dosage} onChange={e => setDosage(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Side Effects</label>
                                <textarea className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-slate-50 h-32" value={sideEffects} onChange={e => setSideEffects(e.target.value)} />
                            </div>
                        </div>
                        <div className="md:col-span-2 pt-2">
                             <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100">
                                Update Inventory Database
                             </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Medicine</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Update Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {medicines.map((med) => (
                            <tr key={med._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-slate-800">{med.name}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">
                                        {med.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-400">
                                    Today
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                      onClick={() => deleteMedicine(med._id)}
                                      className="text-slate-300 hover:text-red-600 transition-colors"
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

export default ManageMedicinesAdmin;
