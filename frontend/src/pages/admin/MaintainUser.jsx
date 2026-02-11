import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import { ADMIN } from '../../services/endpoints.js';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal.jsx';
import Loader from '../../components/Loader.jsx';
import { FiEdit, FiTrash2, FiPlus, FiArrowLeft } from 'react-icons/fi';

const MaintainUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try { setLoading(true); const { data } = await API.get(ADMIN.USERS); setUsers(data); }
    catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async () => {
    try { await API.delete(ADMIN.USER_BY_ID(deleteModal.user._id)); toast.success('User deleted'); setDeleteModal({ open: false, user: null }); fetchUsers(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="animate-slide-up">
      <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-1.5 text-[13px] font-medium text-gray-400 hover:text-indigo-600 mb-6 transition-colors"><FiArrowLeft size={14} /> Back to Dashboard</button>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Manage Users</h2>
        <Link to="/admin/users/add" className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-[13px] font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-sm shadow-indigo-200">
          <FiPlus size={15} /> Add User
        </Link>
      </div>

      {loading ? <Loader text="Loading users..." /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Name','Email','Phone','Joined','Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{u.name}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{u.email}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{u.phone || '-'}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5">
                      <button onClick={() => navigate(`/admin/users/update/${u._id}`)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Edit"><FiEdit size={14} /></button>
                      <button onClick={() => setDeleteModal({ open: true, user: u })} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Delete"><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="text-center py-8 text-sm text-gray-400">No users found.</p>}
        </div>
      )}

      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, user: null })} title="Delete User">
        <p className="text-sm text-gray-600">Are you sure you want to delete <strong>{deleteModal.user?.name}</strong>?</p>
        <div className="flex gap-3 justify-end mt-5">
          <button onClick={() => setDeleteModal({ open: false, user: null })} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Cancel</button>
          <button onClick={handleDelete} className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition">Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default MaintainUser;
