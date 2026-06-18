import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { 
  FaFileInvoiceDollar, FaRegChartBar, FaCalendarAlt, FaDownload, 
  FaSpinner, FaCalculator, FaUsers, FaArrowRight
} from 'react-icons/fa';

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const { showToast } = useToast();

  // Filter states
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1); // default last 30 days
    return d.toISOString().substring(0, 10);
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().substring(0, 10));
  
  // Ledger states
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerInvoices, setCustomerInvoices] = useState([]);

  // Fetch report data
  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [invRes, custRes] = await Promise.all([
        api.get('/invoices'),
        api.get('/customers')
      ]);
      
      if (invRes.data.success) setInvoices(invRes.data.invoices);
      if (custRes.data.success) setCustomers(custRes.data.customers);
    } catch (error) {
      showToast('Failed to load reports metadata.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  // Filter invoices for GSTR
  const getFilteredInvoices = () => {
    if (!startDate || !endDate) return invoices;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // set to end of day
    
    return invoices.filter(inv => {
      const invDate = new Date(inv.invoiceDate);
      return invDate >= start && invDate <= end;
    });
  };

  const filteredInvoices = getFilteredInvoices();

  // Calculate Aggregations
  const getAggregates = () => {
    let taxable = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    let total = 0;

    filteredInvoices.forEach(inv => {
      taxable += inv.taxableAmount || 0;
      cgst += inv.cgst || 0;
      sgst += inv.sgst || 0;
      igst += inv.igst || 0;
      total += inv.grandTotal || 0;
    });

    return {
      taxableAmount: taxable,
      cgst,
      sgst,
      igst,
      totalGst: cgst + sgst + igst,
      grandTotal: total
    };
  };

  const aggregates = getAggregates();

  // Load customer specific ledger
  useEffect(() => {
    if (!selectedCustomerId) {
      setCustomerInvoices([]);
      return;
    }
    const custInvs = invoices.filter(inv => {
      // Find matches based on firmName or phone matching
      const targetCust = customers.find(c => c._id === selectedCustomerId);
      return targetCust && (inv.customerDetails?.phone === targetCust.phone || inv.customerDetails?.firmName === targetCust.firmName);
    });
    setCustomerInvoices(custInvs);
  }, [selectedCustomerId, invoices, customers]);

  // Download simple CSV report (GSTR-1 format)
  const handleExportCSV = () => {
    const headers = ['Invoice No', 'Date', 'Firm Name', 'GSTIN', 'State', 'Taxable Amt', 'CGST', 'SGST', 'IGST', 'GST Total', 'Grand Total', 'Status'];
    const rows = filteredInvoices.map(inv => [
      inv.invoiceNo,
      new Date(inv.invoiceDate).toLocaleDateString('en-IN'),
      inv.customerDetails?.firmName,
      inv.customerDetails?.gstin || 'Unregistered',
      inv.customerDetails?.state,
      inv.taxableAmount,
      inv.cgst,
      inv.sgst,
      inv.igst,
      (inv.cgst + inv.sgst + inv.igst).toFixed(2),
      inv.grandTotal,
      inv.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `GSTR_Sales_Report_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <FaSpinner className="animate-spin text-3xl text-brand-red" />
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Loading Analytics Dashboard...</p>
      </div>
    );
  }

  const selectedCustomer = customers.find(c => c._id === selectedCustomerId);
  const totalLedgerSales = customerInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalLedgerUnpaid = customerInvoices.filter(inv => inv.paymentStatus !== 'Paid').reduce((sum, inv) => sum + inv.grandTotal, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-navy/10 rounded-xl flex items-center justify-center text-brand-navy">
            <FaRegChartBar className="text-xl" />
          </div>
          <div>
            <h1 className="font-heading font-black text-brand-navy text-lg uppercase tracking-wide">Tax & Sales Reports</h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Access aggregated GSTR filing metrics, monthly turnover charts, and customer ledgers.</p>
          </div>
        </div>
      </div>

      {/* Grid: Sales widgets summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Taxable Value</span>
          <span className="text-xl font-heading font-black text-slate-800 block mt-1.5 font-mono">₹{aggregates.taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          <span className="text-[9px] font-bold text-slate-400 mt-1 block uppercase">Excluding GST charges</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total GST Collected</span>
          <span className="text-xl font-heading font-black text-brand-blue block mt-1.5 font-mono">₹{aggregates.totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          <span className="text-[9px] font-bold text-slate-400 mt-1 block uppercase">CGST + SGST + IGST Sum</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Sales Turnover</span>
          <span className="text-xl font-heading font-black text-green-600 block mt-1.5 font-mono">₹{aggregates.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          <span className="text-[9px] font-bold text-slate-400 mt-1 block uppercase">Rounded invoice amounts</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Invoices Billed</span>
          <span className="text-xl font-heading font-black text-brand-navy block mt-1.5 font-mono">{filteredInvoices.length} Bills</span>
          <span className="text-[9px] font-bold text-slate-400 mt-1 block uppercase">During selected dates</span>
        </div>
      </div>

      {/* Section 1: GSTR Tax Report Engine */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-brand-navy">
            <FaCalculator className="text-sm" />
            <h2 className="font-heading font-bold text-xs uppercase tracking-wider">GSTR-1 Sales & Tax Summary</h2>
          </div>

          {/* Date range picker */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <FaCalendarAlt className="text-slate-450 text-[10px]" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent focus:outline-none text-[11px]"
              />
              <span className="text-slate-400 px-1 font-bold">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent focus:outline-none text-[11px]"
              />
            </div>

            <button
              onClick={handleExportCSV}
              disabled={filteredInvoices.length === 0}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-navy text-white hover:bg-slate-800 transition-colors rounded-xl text-[10px] font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer"
            >
              <FaDownload /> Export CSV
            </button>
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12 text-slate-450 text-xs font-semibold">
            No billing transactions recorded in the selected period.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-slate-200 font-bold uppercase text-slate-400 bg-slate-50/50">
                  <th className="py-3 px-4">Invoice No</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer Firm</th>
                  <th className="py-3 px-4">GSTIN</th>
                  <th className="py-3 px-4 text-right">Taxable (₹)</th>
                  <th className="py-3 px-4 text-right">CGST (₹)</th>
                  <th className="py-3 px-4 text-right">SGST (₹)</th>
                  <th className="py-3 px-4 text-right">IGST (₹)</th>
                  <th className="py-3 px-4 text-right">GST Total (₹)</th>
                  <th className="py-3 px-4 text-right font-bold">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {filteredInvoices.map(inv => {
                  const invGst = inv.cgst + inv.sgst + inv.igst;
                  return (
                    <tr key={inv._id} className="hover:bg-slate-50/30">
                      <td className="py-3 px-4 font-mono font-bold">{inv.invoiceNo}</td>
                      <td className="py-3 px-4 text-[10px] text-slate-450">
                        {new Date(inv.invoiceDate).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-slate-800">{inv.customerDetails?.firmName}</td>
                      <td className="py-3 px-4 font-mono text-slate-550 uppercase">
                        {inv.customerDetails?.gstin || 'Unregistered'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        {inv.taxableAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-500">
                        {inv.cgst > 0 ? inv.cgst.toLocaleString('en-IN') : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-500">
                        {inv.sgst > 0 ? inv.sgst.toLocaleString('en-IN') : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-blue-600">
                        {inv.igst > 0 ? inv.igst.toLocaleString('en-IN') : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                        {invGst > 0 ? invGst.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-brand-navy">
                        {inv.grandTotal.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}

                {/* Aggregate Totals Footer */}
                <tr className="bg-slate-900 text-white font-bold font-mono">
                  <td colSpan="4" className="py-3 px-4 text-left uppercase text-[9px] tracking-wider">
                    Total Aggregated Filings:
                  </td>
                  <td className="py-3 px-4 text-right">
                    ₹{aggregates.taxableAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-350">
                    ₹{aggregates.cgst.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-350">
                    ₹{aggregates.sgst.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right text-blue-300">
                    ₹{aggregates.igst.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right text-green-300">
                    ₹{aggregates.totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right text-brand-red">
                    ₹{aggregates.grandTotal.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 2: Customer Ledgers Ledger Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
        <div className="flex items-center gap-2 text-brand-navy border-b border-slate-100 pb-4">
          <FaUsers className="text-sm" />
          <h2 className="font-heading font-bold text-xs uppercase tracking-wider">Customer ledger & Statement</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Select Corporate Customer</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-navy/20 focus:border-brand-navy"
            >
              <option value="">-- Choose Corporate Profile --</option>
              {customers.map(c => (
                <option key={c._id} value={c._id}>{c.firmName} ({c.customerName})</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            {!selectedCustomerId ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs italic bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-8">
                Choose a customer from the dropdown directory to inspect payment logs.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Customer Details summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">GSTIN & Address</span>
                    <p className="font-bold text-slate-800 uppercase mt-0.5">{selectedCustomer?.gstin || 'Unregistered'}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{selectedCustomer?.billingAddress}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Total Billings</span>
                    <p className="font-bold text-brand-navy text-sm font-mono mt-0.5">₹{totalLedgerSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    <p className="text-[9px] text-slate-400 uppercase font-semibold mt-0.5">{customerInvoices.length} total invoices</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Outstanding Balance</span>
                    <p className="font-bold text-brand-red text-sm font-mono mt-0.5">₹{totalLedgerUnpaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    <p className="text-[9px] text-slate-400 uppercase font-semibold mt-0.5">Unpaid / pending status</p>
                  </div>
                </div>

                {/* List of customer's invoices */}
                {customerInvoices.length === 0 ? (
                  <div className="text-center py-6 text-slate-450 italic text-xs">
                    No billing history found for this customer.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 font-bold uppercase text-slate-400 bg-slate-50/30">
                          <th className="py-2.5 px-3">Invoice No</th>
                          <th className="py-2.5 px-3">Billing Date</th>
                          <th className="py-2.5 px-3 text-right">Grand Total (₹)</th>
                          <th className="py-2.5 px-3 text-center">Payment Status</th>
                          <th className="py-2.5 px-3 text-center">Invoice Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                        {customerInvoices.map(inv => (
                          <tr key={inv._id} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{inv.invoiceNo}</td>
                            <td className="py-2.5 px-3 text-[10px] text-slate-450">
                              {new Date(inv.invoiceDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                              {inv.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className={`inline-flex px-2 py-0.5 text-[9px] font-bold rounded-full ${
                                inv.paymentStatus === 'Paid'
                                  ? 'bg-green-50 text-green-600 border border-green-200'
                                  : 'bg-amber-50 text-amber-600 border border-amber-200'
                              }`}>
                                {inv.paymentStatus}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className={`inline-flex px-2 py-0.5 text-[9px] font-bold rounded-full ${
                                inv.status === 'Draft'
                                  ? 'bg-slate-100 text-slate-500'
                                  : 'bg-green-50 text-green-600'
                              }`}>
                                {inv.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
