import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { FiShoppingBag, FiPackage, FiUsers, FiShoppingCart, FiArrowRight } from 'react-icons/fi';

const UserDashboard = () => {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const actions = [
    { label: 'Browse Vendors', desc: 'Find services for your event', icon: <FiShoppingBag size={20} />, path: '/user/vendors', gradient: 'from-purple-500 to-purple-600' },
    { label: 'My Orders', desc: 'Track your order status', icon: <FiPackage size={20} />, path: '/user/orders', gradient: 'from-blue-500 to-blue-600' },
    { label: 'Guest List', desc: 'Manage event attendees', icon: <FiUsers size={20} />, path: '/user/guest-list', gradient: 'from-emerald-500 to-green-600' },
    { label: `My Cart${cartItems.length > 0 ? ` (${cartItems.length})` : ''}`, desc: 'Review selected items', icon: <FiShoppingCart size={20} />, path: '/user/cart', gradient: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="animate-slide-up">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back, {user?.name || 'User'}</h1>
        <p className="text-sm text-gray-500 mt-1">Plan your perfect event from here</p>
      </div>

      {/* Cart stat */}
      {cartItems.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 mb-6 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-sm"><FiShoppingCart size={20} /></div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{cartItems.length}</p>
            <p className="text-[12px] text-gray-400 font-medium mt-0.5">Items in Cart</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map(a => (
          <button key={a.label} onClick={() => navigate(a.path)}
            className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-300 group text-left shadow-sm">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center text-white shadow-sm`}>
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold text-gray-900">{a.label}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">{a.desc}</p>
            </div>
            <FiArrowRight size={16} className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all duration-200" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
