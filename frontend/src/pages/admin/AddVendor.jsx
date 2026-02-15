import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import { ADMIN } from '../../services/endpoints.js';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

const AddVendor = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', vendorCategory: 'Caterer', membershipMonths: 1 });
  const [submitting, setSubmitting] = useState(false);
  const categories = ['Caterer','Decorator','Photographer','DJ','Venue','Florist','Planner','Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { setSubmitting(true); await API.post(ADMIN.VENDORS, form); toast.success('Vendor added successfully'); navigate('/admin/vendors'); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to add vendor'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="animate-slide-up max-w-lg mx-auto">
      <button onClick={() => navigate('/admin/vendors')} className="flex items-center gap-1.5 text-[13px] font-medium text-gray-400 hover:text-indigo-600 mb-6 transition-colors"><FiArrowLeft size={14} /> Back to Vendors</button>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-6">Add Vendor</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {[{l:'Name',k:'name',t:'text'},{l:'Email',k:'email',t:'email'},{l:'Password',k:'password',t:'password'},{l:'Phone',k:'phone',t:'tel'}].map(f => (
            <div key={f.k}>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">{f.l}</label>
              <input type={f.t} required value={form[f.k]} onChange={e => setForm({...form,[f.k]:e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all duration-200" />
            </div>
          ))}
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Category</label>
            <select value={form.vendorCategory} onChange={e => setForm({...form, vendorCategory: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all duration-200">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-2">Membership Duration</label>
            <div className="grid grid-cols-4 gap-3">
              {[1, 3, 6, 12].map(m => (
                <label key={m} className={`flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all duration-200 ${form.membershipMonths === m ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="membershipMonths"
                    value={m}
                    checked={form.membershipMonths === m}
                    onChange={() => setForm({ ...form, membershipMonths: m })}
                    className="sr-only"
                  />
                  <span className="text-lg font-bold">{m}</span>
                  <span className="text-[10px] uppercase font-medium">Months</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 transition-all duration-200 shadow-sm shadow-indigo-200">
            {submitting ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><FiSave size={15} /> Add Vendor</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVendor;
