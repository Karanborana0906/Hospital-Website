import React, { useState } from 'react';
import { apiService } from '../services/apiService.js';
import { FileText, Upload, File, AlertCircle } from 'lucide-react';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('reportFile', file);

    setLoading(true);
    try {
      const config = { 
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}` 
        } 
      };
      
      const { data } = await apiService.uploadReport(formData);
      setReports([data, ...reports]);
      setMessage('Report uploaded successfully');
      setTitle('');
      setDescription('');
      setFile(null);
    // Reset file input by finding it, or controlled if React 18 supports it nicely (usually ref is needed)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error uploading report. (Demo mode active)');
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo.token) {
    return <div className="text-center py-20 text-xl text-slate-600">Please log in to view reports.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center">
        <FileText className="w-8 h-8 mr-3 text-indigo-600" /> Medical Reports
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 self-start">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-indigo-600" /> Upload New
          </h2>
          
          {message && <div className={`p-3 rounded-lg text-sm mb-4 ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {message}
          </div>}

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Report Title</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-slate-50"
                placeholder="e.g. Blood Test Results"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
              <textarea 
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-slate-50 h-20 resize-none"
                placeholder="Brief notes from doctor..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select File (PDF, Image)</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col justify-center items-center w-full h-32 bg-slate-50 rounded-lg border-2 border-slate-300 border-dashed cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex flex-col justify-center items-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="text-sm text-slate-500"><span className="font-semibold">Click to browse</span> or drag and drop</p>
                    <p className="text-xs text-slate-400 text-center px-4 mt-1">{file ? file.name : 'PNG, JPG or PDF (MAX. 10MB)'}</p>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileChange} accept=".png,.jpg,.jpeg,.pdf" />
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-4 disabled:opacity-50">
              {loading ? 'Uploading...' : 'Save Report'}
            </button>
          </form>
        </div>

        {/* Reports List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Your Documents</h2>
          
          {reports.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
              <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p>No medical reports found. Upload your previous reports securely.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
               {reports.map((report, idx) => (
                 <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition-shadow group flex items-start">
                   <div className="w-10 h-10 rounded bg-indigo-50 flex justify-center items-center text-indigo-500 mr-4 flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                     <File className="w-5 h-5" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <h3 className="text-sm font-bold text-slate-800 truncate mb-1" title={report.title}>{report.title}</h3>
                     <p className="text-xs text-slate-500 mb-2">{new Date(report.uploadDate || Date.now()).toLocaleDateString()}</p>
                     <p className="text-xs text-slate-600 line-clamp-2">{report.description || 'No description provided.'}</p>
                     <div className="mt-3">
                        <a href={`${report.filePath}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wide">
                          View Document &rarr;
                        </a>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
