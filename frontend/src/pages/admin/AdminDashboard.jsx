import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { FiUserPlus, FiUsers, FiUserCheck, FiEdit, FiShield, FiArrowRight } from 'react-icons/fi';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Vendor Management',
      description: 'Add, update and manage vendor memberships',
      icon: <FiUserCheck size={20} />,
      gradient: 'from-indigo-500 to-blue-600',
      actions: [
        { label: 'Add Vendor', icon: <FiUserPlus size={16} />, path: '/admin/vendors/add', desc: 'Register a new vendor' },
        { label: 'Manage Vendors', icon: <FiEdit size={16} />, path: '/admin/vendors', desc: 'Edit, remove or extend memberships' },
      ],
    },
    {
      title: 'User Management',
      description: 'Add and manage platform users',
      icon: <FiUsers size={20} />,
      gradient: 'from-purple-500 to-pink-500',
      actions: [
        { label: 'Add User', icon: <FiUserPlus size={16} />, path: '/admin/users/add', desc: 'Register a new user' },
        { label: 'Manage Users', icon: <FiEdit size={16} />, path: '/admin/users', desc: 'Edit or remove user accounts' },
      ],
    },
  ];

  return (
    <div className="animate-slide-up">
      {/* Welcome header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <FiShield size={18} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Welcome back, {user?.name || 'Admin'}
            </h1>
            <p className="text-sm text-gray-500">Manage your platform from the admin dashboard</p>
          </div>
        </div>
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            {/* Section header */}
            <div className={`bg-gradient-to-r ${section.gradient} px-6 py-5`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-white">{section.title}</h2>
                  <p className="text-[12px] text-white/70 mt-0.5">{section.description}</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="p-4 space-y-2">
              {section.actions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all duration-200 group text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-50 group-hover:bg-indigo-100 text-gray-400 group-hover:text-indigo-600 flex items-center justify-center transition-colors duration-200">
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{action.label}</p>
                    <p className="text-[12px] text-gray-400 mt-0.5">{action.desc}</p>
                  </div>
                  <FiArrowRight size={16} className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all duration-200" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
