import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import { VENDOR } from '../../services/endpoints.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';
import { FiPackage, FiShoppingCart, FiDollarSign, FiPlusCircle, FiList, FiToggleRight, FiSend, FiArrowRight } from 'react-icons/fi';

const VendorDashboard = () => {
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try { const { data } = await API.get(VENDOR.DASHBOARD); setStats(data); }
      catch { toast.error('Failed to load dashboard'); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: <FiPackage size={20} />, gradient: 'from-blue-500 to-blue-600', lightBg: 'bg-blue-50' },
    { label: 'Total Orders', value: stats.totalOrders, icon: <FiShoppingCart size={20} />, gradient: 'from-amber-500 to-orange-500', lightBg: 'bg-amber-50' },
    { label: 'Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <FiDollarSign size={20} />, gradient: 'from-emerald-500 to-green-600', lightBg: 'bg-emerald-50' },
  ];

  const actions = [
    { label: 'Your Items', desc: 'View and manage products', icon: <FiList size={18} />, path: '/vendor/your-items' },
    { label: 'Add New Item', desc: 'List a new product', icon: <FiPlusCircle size={18} />, path: '/vendor/add-item' },
    { label: 'Transactions', desc: 'View order history', icon: <FiDollarSign size={18} />, path: '/vendor/transactions' },
    { label: 'Product Status', desc: 'Toggle availability', icon: <FiToggleRight size={18} />, path: '/vendor/product-status' },
    { label: 'Request Item', desc: 'Request new supplies', icon: <FiSend size={18} />, path: '/vendor/request-item' },
  ];

  return (
    <div className="animate-slide-up">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back, {user?.name || 'Vendor'}</h1>
        <p className="text-sm text-gray-500 mt-1">Here's an overview of your business</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white shadow-sm`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">{s.value}</p>
              <p className="text-[12px] text-gray-400 font-medium mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {actions.map(a => (
          <button key={a.label} onClick={() => navigate(a.path)}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200 group text-left shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-gray-50 group-hover:bg-indigo-100 text-gray-400 group-hover:text-indigo-600 flex items-center justify-center transition-colors duration-200">
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{a.label}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">{a.desc}</p>
            </div>
            <FiArrowRight size={14} className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all duration-200" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default VendorDashboard;
