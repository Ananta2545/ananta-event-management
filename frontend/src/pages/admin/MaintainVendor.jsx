import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import { ADMIN } from '../../services/endpoints.js';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal.jsx';
import Loader from '../../components/Loader.jsx';
import { FiEdit, FiTrash2, FiPlus, FiRefreshCw, FiXCircle, FiArrowLeft } from 'react-icons/fi';

const MaintainVendor = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, vendor: null });
  const [membershipModal, setMembershipModal] = useState({ open: false, vendor: null, months: 1 });
  const navigate = useNavigate();

  const fetchVendors = async () => {
    try { setLoading(true); const { data } = await API.get(ADMIN.VENDORS); setVendors(data); }
    catch { toast.error('Failed to load vendors'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchVendors(); }, []);

  const handleDelete = async () => {
    try { await API.delete(ADMIN.VENDOR_BY_ID(deleteModal.vendor._id)); toast.success('Vendor deleted'); setDeleteModal({ open: false, vendor: null }); fetchVendors(); }
    catch { toast.error('Delete failed'); }
  };

  const handleExtend = async () => {
    try { await API.put(ADMIN.EXTEND_MEMBERSHIP(membershipModal.vendor._id), { months: membershipModal.months }); toast.success('Membership extended'); setMembershipModal({ open: false, vendor: null, months: 1 }); fetchVendors(); }
    catch { toast.error('Failed to extend membership'); }
  };

  const handleCancel = async (vendor) => {
    try { await API.put(ADMIN.CANCEL_MEMBERSHIP(vendor._id)); toast.success('Membership cancelled'); fetchVendors(); }
    catch { toast.error('Failed to cancel membership'); }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString() : 'N/A';
  const isActive = (v) => v.membershipEnd && new Date(v.membershipEnd) > new Date();

  return (
    <div className="animate-slide-up">
      <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-1.5 text-[13px] font-medium text-gray-400 hover:text-indigo-600 mb-6 transition-colors"><FiArrowLeft size={14} /> Back to Dashboard</button>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Manage Vendors</h2>
        <Link to="/admin/vendors/add" className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-[13px] font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-sm shadow-indigo-200">
          <FiPlus size={15} /> Add Vendor
        </Link>
      </div>

      {loading ? <Loader text="Loading vendors..." /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Name','Email','Phone','Category','Start','End','Status','Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vendors.map(v => (
                <tr key={v._id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{v.name}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{v.email}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{v.phone || '-'}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{v.vendorCategory || '-'}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{fmt(v.membershipStart)}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{fmt(v.membershipEnd)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${isActive(v) ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {isActive(v) ? 'Active' : 'Expired'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5">
                      <button onClick={() => navigate(`/admin/vendors/update/${v._id}`)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Edit"><FiEdit size={14} /></button>
                      <button onClick={() => setDeleteModal({ open: true, vendor: v })} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Delete"><FiTrash2 size={14} /></button>
                      <button onClick={() => setMembershipModal({ open: true, vendor: v, months: 1 })} className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors" title="Extend"><FiRefreshCw size={14} /></button>
                      <button onClick={() => handleCancel(v)} className="p-1.5 rounded-lg bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors" title="Cancel Membership"><FiXCircle size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {vendors.length === 0 && <p className="text-center py-8 text-sm text-gray-400">No vendors found.</p>}
        </div>
      )}

      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, vendor: null })} title="Delete Vendor">
        <p className="text-sm text-gray-600">Are you sure you want to delete <strong>{deleteModal.vendor?.name}</strong>?</p>
        <div className="flex gap-3 justify-end mt-5">
          <button onClick={() => setDeleteModal({ open: false, vendor: null })} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Cancel</button>
          <button onClick={handleDelete} className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition">Delete</button>
        </div>
      </Modal>

      <Modal isOpen={membershipModal.open} onClose={() => setMembershipModal({ open: false, vendor: null, months: 1 })} title="Extend Membership">
        <p className="text-sm text-gray-600 mb-4">Extend membership for <strong>{membershipModal.vendor?.name}</strong></p>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Months</label>
          <select value={membershipModal.months} onChange={e => setMembershipModal({ ...membershipModal, months: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
            {[1,3,6,12].map(m => <option key={m} value={m}>{m} month{m>1?'s':''}</option>)}
          </select>
        </div>
        <div className="flex gap-3 justify-end mt-5">
          <button onClick={() => setMembershipModal({ open: false, vendor: null, months: 1 })} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Cancel</button>
          <button onClick={handleExtend} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">Extend</button>
        </div>
      </Modal>
    </div>
  );
};

export default MaintainVendor;
