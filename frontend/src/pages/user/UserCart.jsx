import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { API_BASE_URL } from '../../services/api.js';
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';

const UserCart = () => {
  const { cartItems, removeFromCart, updateQty, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="animate-in fade-in">
        <button onClick={() => navigate('/user/dashboard')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 mb-4 transition"><FiArrowLeft size={14} /> Back to Dashboard</button>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4"><FiShoppingBag size={32} className="text-gray-300" /></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Your cart is empty</h3>
          <p className="text-sm text-gray-400 mb-4">Browse vendors to add items</p>
          <button onClick={() => navigate('/user/vendors')} className="px-5 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition">Browse Vendors</button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in">
      <button onClick={() => navigate('/user/dashboard')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 mb-4 transition"><FiArrowLeft size={14} /> Back to Dashboard</button>
      <h2 className="text-xl font-bold text-gray-900 mb-5">Your Cart</h2>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Items */}
        <div className="flex-1 space-y-3">
          {cartItems.map(item => (
            <div key={item._id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
              {item.image && <img src={`${API_BASE_URL}/uploads/${item.image}`} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h3>
                <p className="text-sm text-purple-600 font-bold">₹{item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(item._id, item.qty - 1)} className="w-7 h-7 flex items-center justify-center rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition"><FiMinus size={12} /></button>
                <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                <button onClick={() => updateQty(item._id, item.qty + 1)} className="w-7 h-7 flex items-center justify-center rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition"><FiPlus size={12} /></button>
              </div>
              <p className="text-sm font-bold text-gray-900 w-20 text-right">₹{item.price * item.qty}</p>
              <button onClick={() => removeFromCart(item._id)} className="p-1.5 rounded-md text-red-400 hover:bg-red-50 hover:text-red-500 transition"><FiTrash2 size={15} /></button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="w-full lg:w-72 lg:sticky lg:top-24 self-start">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="flex justify-between text-sm text-gray-600 mb-2"><span>Items ({cartItems.length})</span><span>₹{cartTotal}</span></div>
            <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between text-base font-bold text-gray-900"><span>Total</span><span>₹{cartTotal}</span></div>
            <button onClick={() => navigate('/user/checkout')} className="w-full mt-4 px-4 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition">Proceed to Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCart;
