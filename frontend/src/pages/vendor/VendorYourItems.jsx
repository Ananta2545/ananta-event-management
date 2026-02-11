import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import { VENDOR } from '../../services/endpoints.js';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal.jsx';
import Loader from '../../components/Loader.jsx';
import { FiEdit, FiTrash2, FiEye, FiPlus, FiArrowLeft } from 'react-icons/fi';

const VendorYourItems = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, product: null });
  const [editModal, setEditModal] = useState({ open: false, product: null });
  const [editForm, setEditForm] = useState({ name: '', price: '', status: 'Available' });
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try { setLoading(true); const { data } = await API.get(VENDOR.PRODUCTS); setProducts(data); }
    catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async () => {
    try { await API.delete(VENDOR.PRODUCT_BY_ID(deleteModal.product._id)); toast.success('Product deleted'); setDeleteModal({ open: false, product: null }); fetchProducts(); }
    catch { toast.error('Delete failed'); }
  };

  const openEdit = (p) => { setEditForm({ name: p.name, price: p.price, status: p.status }); setEditModal({ open: true, product: p }); };

  const handleUpdate = async () => {
    try { await API.put(VENDOR.PRODUCT_BY_ID(editModal.product._id), editForm); toast.success('Product updated'); setEditModal({ open: false, product: null }); fetchProducts(); }
    catch { toast.error('Update failed'); }
  };

  return (
    <div className="animate-in fade-in">
      <button onClick={() => navigate('/vendor/dashboard')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-4 transition"><FiArrowLeft size={14} /> Back to Dashboard</button>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Your Items</h2>
        <button onClick={() => navigate('/vendor/add-item')} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"><FiPlus size={15} /> Add Item</button>
      </div>

      {loading ? <Loader text="Loading your items..." /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition">
              {p.image && <img src={`/uploads/${p.image}`} alt={p.name} className="w-full h-44 object-cover" />}
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-900">{p.name}</h3>
                <p className="text-lg font-bold text-blue-600 mt-1">₹{p.price}</p>
                <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{p.status}</span>
              </div>
              <div className="flex border-t border-gray-100">
                <button onClick={() => navigate(`/vendor/view-product/${p._id}`)} className="flex-1 flex items-center justify-center gap-1 py-2.5 text-xs text-gray-500 hover:bg-gray-50 transition"><FiEye size={13} /> View</button>
                <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1 py-2.5 text-xs text-blue-600 hover:bg-blue-50 border-x border-gray-100 transition"><FiEdit size={13} /> Edit</button>
                <button onClick={() => setDeleteModal({ open: true, product: p })} className="flex-1 flex items-center justify-center gap-1 py-2.5 text-xs text-red-500 hover:bg-red-50 transition"><FiTrash2 size={13} /> Delete</button>
              </div>
            </div>
          ))}
          {products.length === 0 && <p className="col-span-full text-center py-10 text-sm text-gray-400">No products yet. Add your first item!</p>}
        </div>
      )}

      {/* Delete Modal */}
      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, product: null })} title="Delete Product">
        <p className="text-sm text-gray-600">Delete <strong>{deleteModal.product?.name}</strong>? This cannot be undone.</p>
        <div className="flex gap-3 justify-end mt-5">
          <button onClick={() => setDeleteModal({ open: false, product: null })} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Cancel</button>
          <button onClick={handleDelete} className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition">Delete</button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModal.open} onClose={() => setEditModal({ open: false, product: null })} title="Edit Product">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
            <input type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
            <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-5">
          <button onClick={() => setEditModal({ open: false, product: null })} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Cancel</button>
          <button onClick={handleUpdate} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">Update</button>
        </div>
      </Modal>
    </div>
  );
};

export default VendorYourItems;
