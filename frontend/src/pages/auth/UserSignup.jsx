import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { FiUser } from 'react-icons/fi';

const UserSignup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'user' });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      toast.success('Registration successful!');
      navigate('/user/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User Sign Up</h1>
          <p className="text-sm text-gray-500 mt-1">Create your account to start planning</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {[{ l: 'Full Name', n: 'name', t: 'text', ph: 'Enter your name' }, { l: 'Email', n: 'email', t: 'email', ph: 'user@email.com' }, { l: 'Password', n: 'password', t: 'password', ph: 'Min 6 characters' }, { l: 'Phone', n: 'phone', t: 'text', ph: 'Phone number' }].map(f => (
              <div key={f.n}>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">{f.l}</label>
                <input type={f.t} name={f.n} value={form[f.n]} onChange={handleChange} required minLength={f.t === 'password' ? 6 : undefined}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white outline-none transition-all duration-200" placeholder={f.ph} />
              </div>
            ))}
            <button type="submit" disabled={submitting}
              className="w-full py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm shadow-purple-200">
              {submitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Create Account
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-[13px] text-gray-500">Already have an account? <Link to="/user/login" className="text-purple-600 hover:text-purple-700 font-medium">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
