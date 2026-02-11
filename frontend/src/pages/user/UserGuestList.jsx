import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import { USER } from '../../services/endpoints.js';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal.jsx';
import Loader from '../../components/Loader.jsx';
import { FiPlus, FiTrash2, FiEdit, FiArrowLeft } from 'react-icons/fi';

const UserGuestList = () => {
  const navigate = useNavigate();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, editing: null });
  const [form, setForm] = useState({ name: '', email: '', phone: '', relation: '' });

  const fetchGuests = async () => {
    try { setLoading(true); const { data } = await API.get(USER.GUEST_LIST); setGuests(data); }
    catch { toast.error('Failed to load guest list'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchGuests(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => { setForm({ name: '', email: '', phone: '', relation: '' }); setModal({ open: true, editing: null }); };
  const openEdit = (g) => { setForm({ name: g.name, email: g.email || '', phone: g.phone || '', relation: g.relation || '' }); setModal({ open: true, editing: g._id }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal.editing) { await API.put(USER.GUEST_BY_ID(modal.editing), form); toast.success('Guest updated'); }
      else { await API.post(USER.GUEST_LIST, form); toast.success('Guest added'); }
      setModal({ open: false, editing: null }); fetchGuests();
    } catch { toast.error('Operation failed'); }
  };

  const handleDelete = async (id) => {
    try { await API.delete(USER.GUEST_BY_ID(id)); toast.success('Guest removed'); fetchGuests(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="animate-in fade-in">
      <button onClick={() => navigate('/user/dashboard')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 mb-4 transition"><FiArrowLeft size={14} /> Back to Dashboard</button>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Guest List</h2>
        <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition"><FiPlus size={15} /> Add Guest</button>
      </div>

      {loading ? <Loader text="Loading guest list..." /> : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['#','Name','Email','Phone','Relation','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {guests.map((g, i) => (
                <tr key={g._id} className="hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{g.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{g.email || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{g.phone || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{g.relation || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(g)} className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition" title="Edit"><FiEdit size={14} /></button>
                      <button onClick={() => handleDelete(g._id)} className="p-1.5 rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition" title="Delete"><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {guests.length === 0 && <p className="text-center py-8 text-sm text-gray-400">No guests added yet.</p>}
        </div>
      )}

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false, editing: null })} title={modal.editing ? 'Edit Guest' : 'Add Guest'}>
        <form onSubmit={handleSubmit} className="space-y-3">
          {[{l:'Name',k:'name',t:'text',r:true},{l:'Email',k:'email',t:'email'},{l:'Phone',k:'phone',t:'tel'},{l:'Relation',k:'relation',t:'text',p:'e.g. Friend, Family'}].map(f => (
            <div key={f.k}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{f.l}</label>
              <input type={f.t} name={f.k} value={form[f.k]} onChange={handleChange} required={f.r} placeholder={f.p} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition" />
            </div>
          ))}
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setModal({ open: false, editing: null })} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition">{modal.editing ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserGuestList;
