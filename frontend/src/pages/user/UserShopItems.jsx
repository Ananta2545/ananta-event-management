import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API, { API_BASE_URL } from '../../services/api.js';
import { USER } from '../../services/endpoints.js';
import { useCart } from '../../context/CartContext.jsx';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';
import { FiShoppingCart, FiArrowLeft } from 'react-icons/fi';

const UserShopItems = () => {
  const { vendorId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try { const { data } = await API.get(USER.VENDOR_PRODUCTS(vendorId)); setProducts(data); }
      catch { toast.error('Failed to load products'); }
      finally { setLoading(false); }
    })();
  }, [vendorId]);

  const handleAdd = (product) => { addToCart({ ...product, vendorId }); toast.success(`${product.name} added to cart!`); };

  return (
    <div className="animate-in fade-in">
      <button onClick={() => navigate('/user/vendors')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 mb-4 transition"><FiArrowLeft size={14} /> Back to Vendors</button>
      <h2 className="text-xl font-bold text-gray-900 mb-5">Shop Items</h2>

      {loading ? <Loader text="Loading products..." /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition">
              {p.image && <img src={`${API_BASE_URL}/uploads/${p.image}`} alt={p.name} className="w-full h-44 object-cover" />}
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-900">{p.name}</h3>
                <p className="text-lg font-bold text-purple-600 mt-1">₹{p.price}</p>
                <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{p.status}</span>
              </div>
              {p.status === 'Available' && (
                <button onClick={() => handleAdd(p)} className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 transition">
                  <FiShoppingCart size={15} /> Add to Cart
                </button>
              )}
            </div>
          ))}
          {products.length === 0 && <p className="col-span-full text-center py-10 text-sm text-gray-400">No products available from this vendor.</p>}
        </div>
      )}
    </div>
  );
};

export default UserShopItems;
