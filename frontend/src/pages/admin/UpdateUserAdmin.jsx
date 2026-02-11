import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../services/api.js';
import { ADMIN } from '../../services/endpoints.js';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

const UpdateUserAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try { const { data } = await API.get(ADMIN.USER_BY_ID(id)); setForm({ name: data.name, email: data.email, phone: data.phone || '' }); }
      catch { toast.error('Failed to load user'); navigate('/admin/users'); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { setSubmitting(true); await API.put(ADMIN.USER_BY_ID(id), form); toast.success('User updated'); navigate('/admin/users'); }
    catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <Loader text="Loading user..." />;

  return (
    <div className="animate-slide-up max-w-lg mx-auto">
      <button onClick={() => navigate('/admin/users')} className="flex items-center gap-1.5 text-[13px] font-medium text-gray-400 hover:text-indigo-600 mb-6 transition-colors"><FiArrowLeft size={14} /> Back to Users</button>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-6">Update User</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {[{l:'Name',k:'name',t:'text'},{l:'Email',k:'email',t:'email'},{l:'Phone',k:'phone',t:'tel'}].map(f => (
            <div key={f.k}>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">{f.l}</label>
              <input type={f.t} required value={form[f.k]} onChange={e => setForm({...form,[f.k]:e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all duration-200" />
            </div>
          ))}
          <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 transition-all duration-200 shadow-sm shadow-indigo-200">
            {submitting ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><FiSave size={15} /> Update User</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserAdmin;
