import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { API_BASE_URL } from "../../services/api";
import { ADMIN } from "../../services/endpoints";
import Loader from "../../components/Loader";
import {
  FiArrowLeft,
  FiSearch,
  FiDownload,
  FiX,
  FiUser,
  FiShoppingBag,
  FiMapPin,
  FiCreditCard,
  FiPackage,
} from "react-icons/fi";
import { toast } from "react-toastify";

const AdminTransactions = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get(ADMIN.TRANSACTIONS);
        setOrders(data);
      } catch (error) {
        toast.error("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredOrders = orders.filter(
    (o) =>
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.userId?.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const statusColor = (s) => {
    if (s === "Delivered") return "bg-emerald-100 text-emerald-700";
    if (s === "Out For Delivery") return "bg-blue-100 text-blue-700";
    if (s === "Ready for Shipping") return "bg-cyan-100 text-cyan-700";
    if (s === "Received") return "bg-violet-100 text-violet-700";
    if (s === "Ordered") return "bg-amber-100 text-amber-700";
    return "bg-gray-100 text-gray-700";
  };

  const handleExport = () => {
    if (filteredOrders.length === 0) {
      toast.info("No transactions to export");
      return;
    }

    const headers = [
      "Transaction ID",
      "User Name",
      "User Email",
      "Amount",
      "Payment Method",
      "Status",
      "Date",
    ];
    const rows = filteredOrders.map((o) => [
      o._id,
      o.userId?.name || "N/A",
      o.userId?.email || "N/A",
      o.totalAmount,
      o.paymentMethod,
      o.status,
      new Date(o.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Transactions exported successfully!");
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatDateTime = (d) =>
    new Date(d).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) return <Loader text="Loading transactions..." />;

  return (
    <div className="animate-in fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-sm text-gray-500">
              Manage and view all platform transactions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search ID, User, Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm w-64"
            />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors text-sm font-medium"
          >
            <FiDownload size={16} /> Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-indigo-50/40 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-mono text-gray-600">
                      {order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {order.userId?.name || "Unknown"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.userId?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {order.paymentMethod}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    No transactions found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Transaction Details
                </h2>
                <p className="text-xs text-gray-500 font-mono mt-0.5">
                  ID: {selectedOrder._id}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(selectedOrder.status)}`}
                >
                  {selectedOrder.status}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDateTime(selectedOrder.createdAt)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <FiUser size={16} className="text-indigo-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700">
                      Buyer Details
                    </h3>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <p className="text-gray-900 font-medium">
                      {selectedOrder.userId?.name || "Unknown"}
                    </p>
                    <p className="text-gray-500">
                      {selectedOrder.userId?.email || "N/A"}
                    </p>
                    {selectedOrder.userId?.phone && (
                      <p className="text-gray-500">
                        {selectedOrder.userId.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <FiCreditCard size={16} className="text-emerald-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700">
                      Payment Info
                    </h3>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <p className="text-gray-900 font-medium">
                      ₹{selectedOrder.totalAmount?.toLocaleString()}
                    </p>
                    <p className="text-gray-500">
                      Method: {selectedOrder.paymentMethod}
                    </p>
                    <p className="text-gray-500">
                      Items: {selectedOrder.items?.length || 0}
                    </p>
                  </div>
                </div>
              </div>

              {(selectedOrder.shippingAddress?.address ||
                selectedOrder.shippingAddress?.city ||
                selectedOrder.shippingAddress?.pincode) && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <FiMapPin size={16} className="text-amber-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700">
                      Shipping Address
                    </h3>
                  </div>
                  <p className="text-sm text-gray-700">
                    {[
                      selectedOrder.shippingAddress.address,
                      selectedOrder.shippingAddress.city,
                      selectedOrder.shippingAddress.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                    <FiPackage size={16} className="text-violet-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-700">
                    Items Ordered ({selectedOrder.items?.length || 0})
                  </h3>
                </div>

                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={item._id || idx}
                      className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100"
                    >
                      {item.image ? (
                        <img
                          src={`${API_BASE_URL}/uploads/${item.image}`}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center">
                          <FiShoppingBag
                            size={20}
                            className="text-gray-400"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500">
                            Qty: {item.qty}
                          </span>
                          <span className="text-gray-300">·</span>
                          <span className="text-sm text-gray-500">
                            ₹{item.price} each
                          </span>
                        </div>
                        {item.vendorId && (
                          <p className="text-xs text-indigo-600 mt-1">
                            Sold by:{" "}
                            {item.vendorId.name || "Unknown Vendor"}
                            {item.vendorId.vendorCategory
                              ? ` (${item.vendorId.vendorCategory})`
                              : ""}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-gray-900">
                          ₹{(item.price * item.qty).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    Total
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{selectedOrder.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;
