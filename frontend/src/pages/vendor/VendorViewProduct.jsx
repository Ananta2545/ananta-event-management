import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API, { API_BASE_URL } from '../../services/api.js';
import { VENDOR } from '../../services/endpoints.js';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';
import { FiArrowLeft } from 'react-icons/fi';

const VendorViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try { const { data } = await API.get(VENDOR.PRODUCT_BY_ID(id)); setProduct(data); }
      catch { toast.error('Failed to load product'); navigate('/vendor/your-items'); }
    })();
  }, [id, navigate]);

  if (!product) return <Loader text="Loading product..." />;

  return (
    <div className="animate-in fade-in max-w-2xl mx-auto">
      <button onClick={() => navigate('/vendor/your-items')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-4 transition"><FiArrowLeft size={14} /> Back to Items</button>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {product.image && (
          <img src={`${API_BASE_URL}/uploads/${product.image}`} alt={product.name} className="w-full h-64 object-cover" />
        )}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">₹{product.price}</p>
          <span className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-semibold ${product.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{product.status}</span>
          <p className="text-sm text-gray-400 mt-4">Added: {new Date(product.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default VendorViewProduct;
