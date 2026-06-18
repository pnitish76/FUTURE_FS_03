import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { 
  FaClipboardList, FaCheckCircle, FaTrash, FaSpinner, 
  FaEnvelope, FaSearch, FaUser, FaPhoneAlt, FaEnvelopeOpenText 
} from 'react-icons/fa';

export default function InquiryManager() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const { showToast } = useToast();

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await api.get('/inquiries');
      if (res.data.success) {
        setInquiries(res.data.inquiries);
      }
    } catch (error) {
      showToast('Failed to load customer inquiries.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'read' ? 'unread' : 'read';
    try {
      const res = await api.put(`/inquiries/${id}`, { status: nextStatus });
      if (res.data.success) {
        showToast(
          nextStatus === 'read' 
            ? 'Inquiry marked as read.' 
            : 'Inquiry marked as unread.', 
          'success'
        );
        fetchInquiries();
      }
    } catch (error) {
      showToast('Failed to update inquiry status.', 'error');
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer inquiry?')) return;

    try {
      const res = await api.delete(`/inquiries/${id}`);
      if (res.data.success) {
        showToast('Inquiry deleted successfully.', 'success');
        fetchInquiries();
      }
    } catch (error) {
      showToast('Failed to delete inquiry.', 'error');
    }
  };

  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = inq.name.toLowerCase().includes(search.toLowerCase()) || 
                          inq.phone.includes(search) || 
                          inq.productRequirement.toLowerCase().includes(search.toLowerCase()) || 
                          inq.message.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-64">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <FaSearch className="text-xs" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inquiries..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold placeholder-slate-400 outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-650 outline-none bg-white cursor-pointer"
          >
            <option value="All">All Inquiries</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>
        </div>
      </div>

      {/* inquiries Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="animate-spin text-3xl text-brand-red" />
        </div>
      ) : filteredInquiries.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-bold uppercase text-slate-400 bg-slate-50/50">
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Requirement</th>
                  <th className="py-4 px-6">Message Details</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-705">
                {filteredInquiries.map((inq) => (
                  <tr 
                    key={inq._id} 
                    className={`transition-colors hover:bg-slate-50/40 ${
                      inq.status === 'unread' ? 'bg-red-500/[0.01]' : ''
                    }`}
                  >
                    {/* Customer */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center font-bold border ${
                          inq.status === 'unread' 
                            ? 'bg-red-50 border-red-100 text-brand-red' 
                            : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}>
                          {inq.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-slate-800 font-bold flex items-center gap-1.5">
                            {inq.name}
                            {inq.status === 'unread' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-red inline-block" />
                            )}
                          </p>
                          <a href={`tel:${inq.phone}`} className="text-[10px] text-slate-400 hover:text-brand-red flex items-center gap-1 mt-0.5">
                            <FaPhoneAlt className="text-[9px]" /> {inq.phone}
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Requirement */}
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1.5 rounded-lg bg-brand-blue/10 border border-brand-blue/15 text-brand-blue text-[10px] font-bold uppercase">
                        {inq.productRequirement}
                      </span>
                    </td>

                    {/* Message Body */}
                    <td className="py-4 px-6 max-w-sm">
                      <p className="text-slate-650 leading-relaxed font-normal whitespace-pre-line bg-slate-50 p-3 rounded-lg border border-slate-150/40">
                        {inq.message}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-slate-500 font-normal">
                      {new Date(inq.createdAt).toLocaleString('en-IN', {
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>

                    {/* Status badge */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleStatus(inq._id, inq.status)}
                        className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase border cursor-pointer transition-colors ${
                          inq.status === 'unread'
                            ? 'bg-red-100 border-red-200 text-red-650 hover:bg-red-200 animate-pulse'
                            : 'bg-green-100 border-green-200 text-green-700 hover:bg-green-200'
                        }`}
                        title={inq.status === 'unread' ? "Mark as Read" : "Mark as Unread"}
                      >
                        {inq.status}
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleStatus(inq._id, inq.status)}
                          className={`p-2 rounded-lg border shadow-sm transition-all cursor-pointer ${
                            inq.status === 'unread'
                              ? 'bg-green-50 hover:bg-green-150 border-green-150 text-green-600'
                              : 'bg-slate-50 hover:bg-slate-150 border-slate-200 text-slate-500'
                          }`}
                          title={inq.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                        >
                          {inq.status === 'unread' ? <FaCheckCircle /> : <FaEnvelope />}
                        </button>
                        <button
                          onClick={() => handleDeleteInquiry(inq._id)}
                          className="p-2 bg-red-50 hover:bg-red-100 border border-red-100 text-red-650 rounded-lg shadow-sm cursor-pointer transition-all"
                          title="Delete Message"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white py-16 text-center rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3">
          <FaClipboardList className="text-4xl text-slate-350" />
          <p className="text-sm font-semibold text-slate-450">No customer inquiries found.</p>
        </div>
      )}
    </div>
  );
}
