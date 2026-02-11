import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import { USER } from '../../services/endpoints.js';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';
import { FiShoppingBag, FiArrowLeft } from 'react-icons/fi';

const UserVendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try { setLoading(true); const params = filter !== 'All' ? { category: filter } : {}; const { data } = await API.get(USER.VENDORS, { params }); setVendors(data); }
      catch { toast.error('Failed to load vendors'); }
      finally { setLoading(false); }
    })();
  }, [filter]);

  const categories = ['All', 'Caterer', 'Decorator', 'Photographer', 'DJ', 'Venue', 'Florist', 'Planner', 'Other'];

  return (
    <div className="animate-in fade-in">
      <button onClick={() => navigate('/user/dashboard')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 mb-4 transition"><FiArrowLeft size={14} /> Back to Dashboard</button>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Vendors</h2>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-5">
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition ${filter === c ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'}`}>{c}</button>
        ))}
      </div>

      {loading ? <Loader text="Loading vendors..." /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map(v => (
            <div key={v._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition cursor-pointer" onClick={() => navigate(`/user/shop/${v._id}`)}>
              <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3"><FiShoppingBag size={22} /></div>
              <h3 className="text-base font-semibold text-gray-900">{v.name}</h3>
              <p className="text-sm text-purple-600 font-medium mt-0.5">{v.vendorCategory}</p>
              <p className="text-xs text-gray-400 mt-1">{v.email}</p>
              <button className="mt-3 w-full px-3 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition">Shop Now</button>
            </div>
          ))}
          {vendors.length === 0 && <p className="col-span-full text-center py-10 text-sm text-gray-400">No vendors found for this category.</p>}
        </div>
      )}
    </div>
  );
};

export default UserVendorList;
