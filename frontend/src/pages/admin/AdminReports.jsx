import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { ADMIN } from "../../services/endpoints";
import Loader from "../../components/Loader";
import {
  FiArrowLeft,
  FiUsers,
  FiShoppingBag,
  FiUserCheck,
} from "react-icons/fi";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const AdminReports = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get(ADMIN.REPORTS);
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader text="Loading reports..." />;

  const cardData = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: <FiUsers size={24} />,
      color: "bg-blue-500",
    },
    {
      title: "Total Vendors",
      value: stats?.totalVendors || 0,
      icon: <FiUserCheck size={24} />,
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: <FiShoppingBag size={24} />,
      color: "bg-purple-500",
    },
    {
      title: "Active Vendors",
      value: stats?.activeVendors || 0,
      icon: <FiUserCheck size={24} />,
      color: "bg-indigo-500",
    },
  ];

  const vendorDoughnut = {
    labels: ["Active Vendors", "Expired Vendors"],
    datasets: [
      {
        data: [stats?.activeVendors || 0, stats?.expiredVendors || 0],
        backgroundColor: ["#10B981", "#EF4444"],
        hoverBackgroundColor: ["#059669", "#DC2626"],
        borderWidth: 0,
      },
    ],
  };

  const overviewBar = {
    labels: ["Users", "Vendors", "Active Vendors", "Expired Vendors", "Orders"],
    datasets: [
      {
        label: "Count",
        data: [
          stats?.totalUsers || 0,
          stats?.totalVendors || 0,
          stats?.activeVendors || 0,
          stats?.expiredVendors || 0,
          stats?.totalOrders || 0,
        ],
        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#6366F1",
          "#EF4444",
          "#8B5CF6",
        ],
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, font: { size: 12 } },
        grid: { color: "#f3f4f6" },
      },
      x: { ticks: { font: { size: 11 } }, grid: { display: false } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { padding: 20, font: { size: 13 } },
      },
    },
  };

  return (
    <div className="animate-in fade-in space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FiArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Reports</h1>
          <p className="text-sm text-gray-500">
            Overview of system performance and metrics
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {card.value}
              </h3>
            </div>
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${card.color}`}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Platform Overview
          </h3>
          <div className="h-72">
            <Bar data={overviewBar} options={barOptions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Vendor Status
          </h3>
          <div className="h-72 flex items-center justify-center">
            <Doughnut data={vendorDoughnut} options={doughnutOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
