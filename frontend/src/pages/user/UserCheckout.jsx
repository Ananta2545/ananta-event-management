import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import { USER } from '../../services/endpoints.js';
import { useCart } from '../../context/CartContext.jsx';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const UserCheckout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ address: '', city: '', pincode: '', paymentMethod: 'Cash' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) { toast.error('Cart is empty!'); return; }
    setSubmitting(true);

    const orderData = {
      items: cartItems.map(item => ({ productId: item._id, vendorId: item.vendorId, name: item.name, price: item.price, qty: item.qty, image: item.image || '' })),
      totalAmount: cartTotal,
      paymentMethod: form.paymentMethod,
      shippingAddress: { address: form.address, city: form.city, pincode: form.pincode },
    };

    try {
      await API.post(USER.ORDERS, orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/user/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in max-w-lg mx-auto">
      <button onClick={() => navigate('/user/cart')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 mb-4 transition"><FiArrowLeft size={14} /> Back to Cart</button>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Checkout</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
            <textarea name="address" value={form.address} onChange={handleChange} required placeholder="Enter full address" rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
              <input type="text" name="city" value={form.city} onChange={handleChange} required placeholder="City" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Pincode</label>
              <input type="text" name="pincode" value={form.pincode} onChange={handleChange} required placeholder="Pincode" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Method</label>
            <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none">
              <option value="Cash">Cash on Delivery</option>
              <option value="UPI">UPI</option>
            </select>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex justify-between text-sm text-gray-600 mb-1"><span>Items</span><span>{cartItems.length}</span></div>
            <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2"><span>Total</span><span>₹{cartTotal}</span></div>
          </div>

          <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 transition">
            {submitting ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing Order...</> : <><FiCheckCircle size={15} /> Place Order</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserCheckout;
