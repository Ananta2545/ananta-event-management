import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import AdminLogin from "./pages/auth/AdminLogin.jsx";
import AdminSignup from "./pages/auth/AdminSignup.jsx";
import VendorLogin from "./pages/auth/VendorLogin.jsx";
import VendorSignup from "./pages/auth/VendorSignup.jsx";
import UserLogin from "./pages/auth/UserLogin.jsx";
import UserSignup from "./pages/auth/UserSignup.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import MaintainVendor from "./pages/admin/MaintainVendor.jsx";
import MaintainUser from "./pages/admin/MaintainUser.jsx";
import AddVendor from "./pages/admin/AddVendor.jsx";
import UpdateVendor from "./pages/admin/UpdateVendor.jsx";
import AddUserAdmin from "./pages/admin/AddUserAdmin.jsx";
import UpdateUserAdmin from "./pages/admin/UpdateUserAdmin.jsx";
import AdminReports from "./pages/admin/AdminReports.jsx";
import AdminTransactions from "./pages/admin/AdminTransactions.jsx";

import VendorDashboard from "./pages/vendor/VendorDashboard.jsx";
import VendorAddItem from "./pages/vendor/VendorAddItem.jsx";
import VendorYourItems from "./pages/vendor/VendorYourItems.jsx";
import VendorTransactions from "./pages/vendor/VendorTransactions.jsx";
import VendorProductStatus from "./pages/vendor/VendorProductStatus.jsx";
import VendorRequestItem from "./pages/vendor/VendorRequestItem.jsx";
import VendorViewProduct from "./pages/vendor/VendorViewProduct.jsx";

import UserDashboard from "./pages/user/UserDashboard.jsx";
import UserVendorList from "./pages/user/UserVendorList.jsx";
import UserShopItems from "./pages/user/UserShopItems.jsx";
import UserCart from "./pages/user/UserCart.jsx";
import UserCheckout from "./pages/user/UserCheckout.jsx";
import UserGuestList from "./pages/user/UserGuestList.jsx";
import UserOrderStatus from "./pages/user/UserOrderStatus.jsx";
import UserReports from "./pages/user/UserReports.jsx";

const App = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[80px] pb-12 min-h-screen">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/login" />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/vendor/login" element={<VendorLogin />} />
          <Route path="/vendor/signup" element={<VendorSignup />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/signup" element={<UserSignup />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vendors"
            element={
              <ProtectedRoute role="admin">
                <MaintainVendor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <MaintainUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vendors/add"
            element={
              <ProtectedRoute role="admin">
                <AddVendor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vendors/update/:id"
            element={
              <ProtectedRoute role="admin">
                <UpdateVendor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/add"
            element={
              <ProtectedRoute role="admin">
                <AddUserAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/update/:id"
            element={
              <ProtectedRoute role="admin">
                <UpdateUserAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute role="admin">
                <AdminReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/transactions"
            element={
              <ProtectedRoute role="admin">
                <AdminTransactions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendor/dashboard"
            element={
              <ProtectedRoute role="vendor">
                <VendorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/add-item"
            element={
              <ProtectedRoute role="vendor">
                <VendorAddItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/your-items"
            element={
              <ProtectedRoute role="vendor">
                <VendorYourItems />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/transactions"
            element={
              <ProtectedRoute role="vendor">
                <VendorTransactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/product-status"
            element={
              <ProtectedRoute role="vendor">
                <VendorProductStatus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/request-item"
            element={
              <ProtectedRoute role="vendor">
                <VendorRequestItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/view-product/:id"
            element={
              <ProtectedRoute role="vendor">
                <VendorViewProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/vendors"
            element={
              <ProtectedRoute role="user">
                <UserVendorList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/shop/:vendorId"
            element={
              <ProtectedRoute role="user">
                <UserShopItems />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/cart"
            element={
              <ProtectedRoute role="user">
                <UserCart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/checkout"
            element={
              <ProtectedRoute role="user">
                <UserCheckout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/guest-list"
            element={
              <ProtectedRoute role="user">
                <UserGuestList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/orders"
            element={
              <ProtectedRoute role="user">
                <UserOrderStatus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/reports"
            element={
              <ProtectedRoute role="user">
                <UserReports />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
};

export default App;
