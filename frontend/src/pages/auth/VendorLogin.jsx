import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { FiPackage } from 'react-icons/fi';

const VendorLogin = () => {
  const [form, setForm] = useState({ email: '', password: '', role: 'vendor' });
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(form);
      toast.success('Welcome Vendor!');
      navigate('/vendor/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Vendor Login</h1>
          <p className="text-sm text-gray-500 mt-1">Access your vendor dashboard</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all duration-200" placeholder="vendor@email.com" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all duration-200" placeholder="Enter password" />
            </div>
            <button type="submit" disabled={submitting}
              className="w-full py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm shadow-blue-200">
              {submitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Sign In
            </button>
          </form>
        </div>

        <div className="text-center mt-6 space-y-2">
          <p className="text-[13px] text-gray-500">Don't have an account? <Link to="/vendor/signup" className="text-blue-600 hover:text-blue-700 font-medium">Sign Up</Link></p>
          <p className="text-[13px] text-gray-400">Login as <Link to="/admin/login" className="text-blue-600 hover:text-blue-700 font-medium">Admin</Link> or <Link to="/user/login" className="text-blue-600 hover:text-blue-700 font-medium">User</Link></p>
        </div>
      </div>
    </div>
  );
};

export default VendorLogin;
