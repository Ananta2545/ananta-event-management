import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { FiPackage } from 'react-icons/fi';

const VendorSignup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'vendor', vendorCategory: 'Caterer', membershipMonths: 1 });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const categories = ['Caterer', 'Decorator', 'Photographer', 'DJ', 'Venue', 'Florist', 'Planner', 'Other'];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      toast.success('Registration successful!');
      navigate('/vendor/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 items-center justify-center text-white shadow-lg shadow-blue-200 mb-4">
            <FiPackage size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Vendor Sign Up</h1>
          <p className="text-sm text-gray-500 mt-1">Create your vendor account</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {[{ l: 'Full Name', n: 'name', t: 'text', ph: 'Your business name' }, { l: 'Email', n: 'email', t: 'email', ph: 'vendor@email.com' }, { l: 'Password', n: 'password', t: 'password', ph: 'Min 4 characters' }, { l: 'Phone', n: 'phone', t: 'text', ph: 'Phone number' }].map(f => (
              <div key={f.n}>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">{f.l}</label>
                <input type={f.t} name={f.n} value={form[f.n]} onChange={handleChange} required={f.n !== 'phone'} minLength={f.t === 'password' ? 4 : undefined}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all duration-200" placeholder={f.ph} />
              </div>
            ))}
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Category</label>
              <select name="vendorCategory" value={form.vendorCategory} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all duration-200">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button type="submit" disabled={submitting}
              className="w-full py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm shadow-blue-200">
              {submitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Create Account
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-[13px] text-gray-500">Already have an account? <Link to="/vendor/login" className="text-blue-600 hover:text-blue-700 font-medium">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default VendorSignup;
