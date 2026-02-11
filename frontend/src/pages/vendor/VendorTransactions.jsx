import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import { VENDOR } from '../../services/endpoints.js';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';
import { FiArrowLeft } from 'react-icons/fi';

const VendorTransactions = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try { const { data } = await API.get(VENDOR.ORDERS); setOrders(data); }
      catch { toast.error('Failed to load transactions'); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(VENDOR.ORDER_STATUS(orderId), { status: newStatus });
      toast.success('Status updated');
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch { toast.error('Failed to update status'); }
  };

  const statuses = ['Ordered', 'Received', 'Ready for Shipping', 'Out For Delivery', 'Delivered'];

  const statusColor = (s) => {
    if (s === 'Delivered') return 'bg-emerald-100 text-emerald-700';
    if (s === 'Out For Delivery') return 'bg-blue-100 text-blue-700';
    return 'bg-amber-100 text-amber-700';
  };

  return (
    <div className="animate-in fade-in">
      <button onClick={() => navigate('/vendor/dashboard')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-4 transition"><FiArrowLeft size={14} /> Back to Dashboard</button>
      <h2 className="text-xl font-bold text-gray-900 mb-5">Transactions</h2>

      {loading ? <Loader text="Loading transactions..." /> : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Order ID','Customer','Items','Amount','Payment','Status','Date','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(o => (
                <tr key={o._id} className="hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3 text-sm font-mono text-gray-500">{o._id.slice(-6).toUpperCase()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{o.userId?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{o.items?.length || 0} items</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹{o.totalAmount}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{o.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor(o.status)}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <select value={o.status} onChange={e => handleStatusChange(o._id, e.target.value)} className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none">
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="text-center py-8 text-sm text-gray-400">No transactions yet.</p>}
        </div>
      )}
    </div>
  );
};

export default VendorTransactions;
