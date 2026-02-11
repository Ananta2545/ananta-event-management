import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiSend } from 'react-icons/fi';

const VendorRequestItem = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ itemName: '', description: '', quantity: 1 });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(`Request for "${form.itemName}" has been submitted!`);
    setForm({ itemName: '', description: '', quantity: 1 });
  };

  return (
    <div className="animate-in fade-in max-w-lg mx-auto">
      <button onClick={() => navigate('/vendor/dashboard')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-4 transition"><FiArrowLeft size={14} /> Back to Dashboard</button>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Request Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Item Name</label>
            <input type="text" name="itemName" value={form.itemName} onChange={handleChange} required placeholder="Enter item name" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the item you need" rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity</label>
            <input type="number" name="quantity" value={form.quantity} onChange={handleChange} min="1" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
          </div>
          <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition">
            <FiSend size={15} /> Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendorRequestItem;
