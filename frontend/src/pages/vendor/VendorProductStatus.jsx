import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import { VENDOR } from '../../services/endpoints.js';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';
import { FiArrowLeft } from 'react-icons/fi';

const VendorProductStatus = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try { const { data } = await API.get(VENDOR.PRODUCTS); setProducts(data); }
      catch { toast.error('Failed to load products'); }
      finally { setLoading(false); }
    })();
  }, []);

  const toggleStatus = async (product) => {
    const newStatus = product.status === 'Available' ? 'Unavailable' : 'Available';
    try {
      await API.put(VENDOR.PRODUCT_BY_ID(product._id), { status: newStatus });
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, status: newStatus } : p));
      toast.success(`Status changed to ${newStatus}`);
    } catch { toast.error('Failed to update status'); }
  };

  return (
    <div className="animate-in fade-in">
      <button onClick={() => navigate('/vendor/dashboard')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-4 transition"><FiArrowLeft size={14} /> Back to Dashboard</button>
      <h2 className="text-xl font-bold text-gray-900 mb-5">Product Status</h2>

      {loading ? <Loader text="Loading products..." /> : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Product','Price','Status','Toggle'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(p => (
                <tr key={p._id} className="hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">₹{p.price}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(p)} className={`px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition ${p.status === 'Available' ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
                      Mark {p.status === 'Available' ? 'Unavailable' : 'Available'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p className="text-center py-8 text-sm text-gray-400">No products found.</p>}
        </div>
      )}
    </div>
  );
};

export default VendorProductStatus;
