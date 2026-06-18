import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { 
  FaPlus, FaEdit, FaTrash, FaSpinner, FaSearch, 
  FaCopy, FaEye, FaPrint, FaFileInvoiceDollar, FaFilter 
} from 'react-icons/fa';

export default function InvoiceManager() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deletingId, setDeletingId] = useState(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      let url = `/invoices?search=${search}`;
      if (statusFilter !== 'All') {
        url += `&status=${statusFilter}`;
      }
      const res = await api.get(url);
      if (res.data.success) {
        setInvoices(res.data.invoices);
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to load invoices.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [search, statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice? This cannot be undone.')) {
      return;
    }
    try {
      setDeletingId(id);
      const res = await api.delete(`/invoices/${id}`);
      if (res.data.success) {
        showToast('Invoice deleted successfully.', 'success');
        setInvoices(prev => prev.filter(inv => inv._id !== id));
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete invoice.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const res = await api.post(`/invoices/${id}/duplicate`);
      if (res.data.success) {
        showToast('Invoice duplicated as Draft.', 'success');
        fetchInvoices();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to duplicate invoice.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-navy/10 rounded-xl flex items-center justify-center text-brand-navy">
            <FaFileInvoiceDollar className="text-xl" />
          </div>
          <div>
            <h1 className="font-heading font-black text-brand-navy text-lg uppercase tracking-wide">GST Billing Book</h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Manage machinery sales, Indian tax rules, and print professional A4 bills.</p>
          </div>
        </div>
        <Link
          to="/admin/dashboard/invoices/new"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider bg-brand-red text-white hover:bg-red-700 transition-colors shadow-md hover:shadow-lg w-full md:w-auto"
        >
          <FaPlus /> Create Invoice
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <FaSearch className="text-sm" />
          </span>
          <input
            type="text"
            placeholder="Search invoice no or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-navy/20 focus:border-brand-navy"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase">
            <FaFilter className="text-[10px]" /> Status:
          </span>
          <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            {['All', 'Saved', 'Draft'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer ${
                  statusFilter === status 
                    ? 'bg-white text-brand-navy shadow-sm' 
                    : 'text-slate-500 hover:text-brand-navy'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Invoices List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <FaSpinner className="animate-spin text-3xl text-brand-red" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Loading invoice data...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-20 bg-slate-50/50">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <FaFileInvoiceDollar className="text-2xl" />
            </div>
            <h3 className="font-heading font-bold text-sm text-slate-700 uppercase tracking-wider">No Invoices Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-semibold">
              Create a new invoice, or adjust your search parameters to view items.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-bold uppercase text-slate-400 bg-slate-50/60">
                  <th className="py-4 px-6">Invoice details</th>
                  <th className="py-4 px-6">Customer & Firm</th>
                  <th className="py-4 px-6 text-right">Taxable Amt</th>
                  <th className="py-4 px-6 text-right">Grand Total</th>
                  <th className="py-4 px-6 text-center">Tax Split</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {invoices.map((inv) => {
                  const dateStr = new Date(inv.invoiceDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });
                  const isDraft = inv.status === 'Draft';
                  const isLocal = inv.customerDetails?.stateCode === '24';
                  
                  return (
                    <tr key={inv._id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-slate-900 font-bold tracking-wider">{inv.invoiceNo}</p>
                          <p className="text-[10px] text-slate-450 mt-0.5">{dateStr}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-slate-800 font-bold">{inv.customerDetails?.firmName || inv.customerDetails?.customerName}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {inv.customerDetails?.gstin ? `GSTIN: ${inv.customerDetails.gstin}` : 'No GSTIN'} ({inv.customerDetails?.state})
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right text-slate-600 font-mono">
                        ₹{inv.taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-right text-brand-navy font-bold font-mono">
                        ₹{inv.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {isLocal ? (
                          <span className="inline-flex flex-col text-[9px] uppercase tracking-wider font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            <span>CGST: ₹{inv.cgst.toLocaleString('en-IN')}</span>
                            <span>SGST: ₹{inv.sgst.toLocaleString('en-IN')}</span>
                          </span>
                        ) : (
                          <span className="inline-flex text-[9px] uppercase tracking-wider font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            IGST: ₹{inv.igst.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold ${
                          isDraft 
                            ? 'bg-amber-50 text-amber-600 border border-amber-200' 
                            : 'bg-green-50 text-green-600 border border-green-200'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/dashboard/invoices/view/${inv._id}`}
                            title="Print / View"
                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-brand-navy hover:bg-slate-50 transition-colors"
                          >
                            <FaEye className="text-xs" />
                          </Link>
                          
                          <Link
                            to={`/admin/dashboard/invoices/edit/${inv._id}`}
                            title="Edit Invoice"
                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-brand-navy hover:bg-slate-50 transition-colors"
                          >
                            <FaEdit className="text-xs" />
                          </Link>

                          <button
                            onClick={() => handleDuplicate(inv._id)}
                            title="Duplicate Invoice"
                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-brand-navy hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <FaCopy className="text-xs" />
                          </button>

                          <button
                            onClick={() => handleDelete(inv._id)}
                            disabled={deletingId === inv._id}
                            title="Delete Invoice"
                            className="w-8 h-8 rounded-lg border border-red-105 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            {deletingId === inv._id ? (
                              <FaSpinner className="animate-spin text-xs" />
                            ) : (
                              <FaTrash className="text-xs" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
