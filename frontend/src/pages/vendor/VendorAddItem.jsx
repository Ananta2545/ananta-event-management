import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import { VENDOR } from '../../services/endpoints.js';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiUpload, FiSave } from 'react-icons/fi';

const VendorAddItem = () => {
  const [form, setForm] = useState({ name: '', price: '', status: 'Available' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('status', form.status);
    if (image) formData.append('image', image);
    try {
      await API.post(VENDOR.PRODUCTS, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Product added successfully!');
      navigate('/vendor/your-items');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product');
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in max-w-lg mx-auto">
      <button onClick={() => navigate('/vendor/your-items')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-4 transition"><FiArrowLeft size={14} /> Back to Your Items</button>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Add New Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Enter product name" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} required min="1" placeholder="Enter price" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Product Image</label>
            <label className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 cursor-pointer transition">
              <FiUpload size={16} /> {image ? image.name : 'Click to upload image'}
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
            {preview && <img src={preview} alt="Preview" className="mt-3 w-full h-48 object-cover rounded-lg border border-gray-200" />}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
              {submitting ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding...</> : <><FiSave size={15} /> Add Product</>}
            </button>
            <button type="button" onClick={() => navigate('/vendor/your-items')} disabled={submitting} className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorAddItem;
