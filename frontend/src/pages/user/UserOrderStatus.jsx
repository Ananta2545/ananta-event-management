import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import { USER } from '../../services/endpoints.js';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';
import { FiArrowLeft } from 'react-icons/fi';

const UserOrderStatus = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const { data } = await API.get(USER.ORDERS); setOrders(data); }
      catch { toast.error('Failed to load orders'); }
      finally { setLoading(false); }
    })();
  }, []);

  const statusColor = (s) => {
    if (s === 'Delivered') return 'bg-emerald-100 text-emerald-700';
    if (s === 'Out For Delivery') return 'bg-blue-100 text-blue-700';
    if (s === 'Ready for Shipping') return 'bg-amber-100 text-amber-700';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="animate-in fade-in">
      <button onClick={() => navigate('/user/dashboard')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 mb-4 transition"><FiArrowLeft size={14} /> Back to Dashboard</button>
      <h2 className="text-xl font-bold text-gray-900 mb-5">My Orders</h2>

      {loading ? <Loader text="Loading orders..." /> : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
                <span className="text-sm font-mono text-gray-500">Order #{order._id.slice(-6).toUpperCase()}</span>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor(order.status)}`}>{order.status}</span>
              </div>
              {/* Items */}
              <div className="px-5 py-3 divide-y divide-gray-50">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between py-1.5 text-sm">
                    <span className="text-gray-700">{item.name} <span className="text-gray-400">x{item.qty}</span></span>
                    <span className="font-medium text-gray-900">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                <span>Payment: {order.paymentMethod}</span>
                <span className="font-bold text-sm text-gray-900">Total: ₹{order.totalAmount}</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-center py-10 text-sm text-gray-400">No orders yet. Start shopping!</p>}
        </div>
      )}
    </div>
  );
};

export default UserOrderStatus;
