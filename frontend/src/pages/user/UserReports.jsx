import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { USER } from "../../services/endpoints";
import Loader from "../../components/Loader";
import { FiArrowLeft, FiShoppingBag, FiDollarSign } from "react-icons/fi";
import { toast } from "react-toastify";

const UserReports = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Fetch User's Orders to calculate stats
        const { data } = await API.get(USER.ORDERS);
        const totalOrders = data.length;
        const totalSpent = data.reduce(
          (acc, order) => acc + (order.totalAmount || 0),
          0,
        );
        setStats({ totalOrders, totalSpent });
      } catch (error) {
        console.error("Failed to fetch user reports", error);
        toast.error("Failed to load report data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader text="Generating your report..." />;

  return (
    <div className="animate-in fade-in space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/user/dashboard")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FiArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Activity Report
          </h1>
          <p className="text-sm text-gray-500">
            Summary of your orders and spending
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Total Orders
            </p>
            <h3 className="text-4xl font-bold text-gray-900">
              {stats.totalOrders}
            </h3>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <FiShoppingBag size={32} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Total Spent
            </p>
            <h3 className="text-4xl font-bold text-gray-900">
              ₹{stats.totalSpent.toLocaleString()}
            </h3>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <FiDollarSign size={32} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReports;
