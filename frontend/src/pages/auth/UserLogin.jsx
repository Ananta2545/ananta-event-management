import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { FiUser } from 'react-icons/fi';

const UserLogin = () => {
  const [form, setForm] = useState({ email: '', password: '', role: 'user' });
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(form);
      toast.success('Welcome!');
      navigate('/user/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 items-center justify-center text-white shadow-lg shadow-purple-200 mb-4">
            <FiUser size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User Login</h1>
          <p className="text-sm text-gray-500 mt-1">Access your event planning dashboard</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white outline-none transition-all duration-200" placeholder="user@email.com" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white outline-none transition-all duration-200" placeholder="Enter password" />
            </div>
            <button type="submit" disabled={submitting}
              className="w-full py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm shadow-purple-200">
              {submitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Sign In
            </button>
          </form>
        </div>

        <div className="text-center mt-6 space-y-2">
          <p className="text-[13px] text-gray-500">Don't have an account? <Link to="/user/signup" className="text-purple-600 hover:text-purple-700 font-medium">Sign Up</Link></p>
          <p className="text-[13px] text-gray-400">Login as <Link to="/admin/login" className="text-purple-600 hover:text-purple-700 font-medium">Admin</Link> or <Link to="/vendor/login" className="text-purple-600 hover:text-purple-700 font-medium">Vendor</Link></p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
