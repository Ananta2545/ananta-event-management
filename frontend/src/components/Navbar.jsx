import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { FiShoppingCart, FiLogOut, FiHome, FiMenu, FiX, FiAlertCircle } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogout = () => setShowLogoutModal(true);

  const confirmLogout = () => {
    const role = user?.role;
    setShowLogoutModal(false);
    setOpen(false);
    logout();
    navigate(role === 'vendor' ? '/vendor/login' : role === 'user' ? '/user/login' : '/admin/login');
  };

  const getDashboardPath = () => (!user ? '/' : `/${user.role}/dashboard`);

  if (!user) return null;

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const linkClass = (path) =>
    `flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
      isActive(path)
        ? 'text-indigo-700 bg-indigo-50/80'
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/80'
    }`;

  const roleColor = {
    admin: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    vendor: 'bg-blue-50 text-blue-600 border-blue-100',
    user: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  return (
    <>
    <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to={getDashboardPath()} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-indigo-200">
            A
          </div>
          <span className="hidden sm:block text-[15px] font-bold text-gray-900 tracking-tight">
            Ananta<span className="text-indigo-600">.</span>
          </span>
        </Link>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition">
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5">
          <Link to={getDashboardPath()} className={linkClass(getDashboardPath())}><FiHome size={14} /> Dashboard</Link>

          {user.role === 'admin' && (
            <>
              <Link to="/admin/vendors" className={linkClass('/admin/vendors')}>Vendors</Link>
              <Link to="/admin/users" className={linkClass('/admin/users')}>Users</Link>
            </>
          )}

          {user.role === 'vendor' && (
            <>
              <Link to="/vendor/your-items" className={linkClass('/vendor/your-items')}>Your Items</Link>
              <Link to="/vendor/add-item" className={linkClass('/vendor/add-item')}>Add Item</Link>
              <Link to="/vendor/transactions" className={linkClass('/vendor/transactions')}>Transactions</Link>
              <Link to="/vendor/product-status" className={linkClass('/vendor/product-status')}>Status</Link>
            </>
          )}

          {user.role === 'user' && (
            <>
              <Link to="/user/vendors" className={linkClass('/user/vendors')}>Vendors</Link>
              <Link to="/user/orders" className={linkClass('/user/orders')}>Orders</Link>
              <Link to="/user/guest-list" className={linkClass('/user/guest-list')}>Guests</Link>
              <Link to="/user/cart" className={`relative ${linkClass('/user/cart')}`}>
                <FiShoppingCart size={14} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </>
          )}
        </div>

        {/* User info + logout */}
        <div className="hidden md:flex items-center gap-2.5">
          <div className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border ${roleColor[user.role] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
            <span className="capitalize">{user.name}</span>
            <span className="opacity-40">|</span>
            <span className="uppercase tracking-wider">{user.role}</span>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-[13px] font-medium text-gray-400 px-3 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all duration-200">
            <FiLogOut size={13} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-lg px-4 py-3 space-y-0.5 animate-fade-in">
          <Link to={getDashboardPath()} onClick={() => setOpen(false)} className={linkClass(getDashboardPath())}><FiHome size={14} /> Dashboard</Link>

          {user.role === 'admin' && (
            <>
              <Link to="/admin/vendors" onClick={() => setOpen(false)} className={linkClass('/admin/vendors')}>Vendors</Link>
              <Link to="/admin/users" onClick={() => setOpen(false)} className={linkClass('/admin/users')}>Users</Link>
            </>
          )}
          {user.role === 'vendor' && (
            <>
              <Link to="/vendor/your-items" onClick={() => setOpen(false)} className={linkClass('/vendor/your-items')}>Your Items</Link>
              <Link to="/vendor/add-item" onClick={() => setOpen(false)} className={linkClass('/vendor/add-item')}>Add Item</Link>
              <Link to="/vendor/transactions" onClick={() => setOpen(false)} className={linkClass('/vendor/transactions')}>Transactions</Link>
              <Link to="/vendor/product-status" onClick={() => setOpen(false)} className={linkClass('/vendor/product-status')}>Product Status</Link>
            </>
          )}
          {user.role === 'user' && (
            <>
              <Link to="/user/vendors" onClick={() => setOpen(false)} className={linkClass('/user/vendors')}>Vendors</Link>
              <Link to="/user/orders" onClick={() => setOpen(false)} className={linkClass('/user/orders')}>Orders</Link>
              <Link to="/user/guest-list" onClick={() => setOpen(false)} className={linkClass('/user/guest-list')}>Guests</Link>
              <Link to="/user/cart" onClick={() => setOpen(false)} className={linkClass('/user/cart')}>
                <FiShoppingCart size={14} /> Cart {cartItems.length > 0 && `(${cartItems.length})`}
              </Link>
            </>
          )}
          <div className="pt-2 mt-2 border-t border-gray-100">
            <div className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border mb-2 ${roleColor[user.role]}`}>
              {user.name} <span className="opacity-40">|</span> <span className="uppercase tracking-wider">{user.role}</span>
            </div>
            <button onClick={() => { setOpen(false); handleLogout(); }}
              className="w-full flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium text-red-500 hover:bg-red-50 transition-all">
              <FiLogOut size={13} /> Sign out
            </button>
          </div>
        </div>
      )}
    </nav>

    {/* Logout Confirmation Modal */}
    {showLogoutModal && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowLogoutModal(false)} />
        <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-scale-in">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <FiAlertCircle className="text-red-500" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Sign Out</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to sign out of your account?</p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button onClick={confirmLogout} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 shadow-sm shadow-red-200 transition-all">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Navbar;
