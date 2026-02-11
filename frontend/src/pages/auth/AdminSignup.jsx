import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { FiShield } from 'react-icons/fi';

const AdminSignup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'admin' });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      toast.success('Admin account created!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 items-center justify-center text-white shadow-lg shadow-indigo-200 mb-4">
            <FiShield size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Sign Up</h1>
          <p className="text-sm text-gray-500 mt-1">Create your admin account</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {[{ label: 'Full Name', name: 'name', type: 'text', ph: 'Enter your name' }, { label: 'Email', name: 'email', type: 'email', ph: 'admin@company.com' }, { label: 'Password', name: 'password', type: 'password', ph: 'Min 4 characters' }, { label: 'Phone', name: 'phone', type: 'tel', ph: 'Phone number' }].map(f => (
              <div key={f.name}>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">{f.label}</label>
                <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange} required={f.name !== 'phone'} minLength={f.type === 'password' ? 4 : undefined}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all duration-200" placeholder={f.ph} />
              </div>
            ))}
            <button type="submit" disabled={submitting}
              className="w-full py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm shadow-indigo-200">
              {submitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Create Account
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-[13px] text-gray-500">Already have an account? <Link to="/admin/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
