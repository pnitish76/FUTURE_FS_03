import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { 
  FaPlus, FaTrash, FaSpinner, FaArrowLeft, FaSave, 
  FaUserTie, FaBoxes, FaReceipt, FaPercent, FaRupeeSign 
} from 'react-icons/fa';

export default function InvoiceForm() {
  const { id } = useParams(); // if editing, we have this id
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  // Form states
  const [invoiceNo, setInvoiceNo] = useState('');
  const [challanNo, setChallanNo] = useState('');
  const [poNo, setPoNo] = useState('');
  const [poDate, setPoDate] = useState('');
  const [dispatchThrough, setDispatchThrough] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [transportName, setTransportName] = useState('');
  const [lrNo, setLrNo] = useState('');
  const [destination, setDestination] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Unpaid');
  const [status, setStatus] = useState('Saved');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Customer Details
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerDetails, setCustomerDetails] = useState({
    customerName: '',
    firmName: '',
    billingAddress: '',
    shippingAddress: '',
    phone: '',
    email: '',
    gstin: '',
    state: 'Gujarat',
    stateCode: '24'
  });

  // Product Items
  const [items, setItems] = useState([
    {
      product: '',
      title: '',
      hsnCode: '',
      quantity: 1,
      unit: 'PCS',
      rate: 0,
      discount: 0,
      taxRate: 18,
      taxAmount: 0,
      totalAmount: 0,
      machineModel: '',
      serialNo: '',
      motorNo: '',
      colour: '',
      warrantyNo: '',
      installationDate: ''
    }
  ]);

  // Extra charges
  const [freightCharges, setFreightCharges] = useState(0);
  const [packingCharges, setPackingCharges] = useState(0);
  const [otherCharges, setOtherCharges] = useState(0);

  // Bank Details
  const [bankDetails, setBankDetails] = useState({
    bankName: 'BANK OF BARODA',
    branch: 'Canal Road',
    accountNumber: '70920200000673',
    ifscCode: 'BARB0DBCAN',
    upiId: 'jaybhagwati@okaxis'
  });

  // Fetch initial data (customers, products, and invoice if editing)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        const [custRes, prodRes] = await Promise.all([
          api.get('/customers'),
          api.get('/products')
        ]);
        
        if (custRes.data.success) setCustomers(custRes.data.customers);
        if (prodRes.data.success) setProducts(prodRes.data.products);

        if (id) {
          // Edit mode: Load invoice details
          const invRes = await api.get(`/invoices/${id}`);
          if (invRes.data.success) {
            const inv = invRes.data.invoice;
            setInvoiceNo(inv.invoiceNo);
            setChallanNo(inv.challanNo || '');
            setPoNo(inv.poNo || '');
            setPoDate(inv.poDate ? inv.poDate.substring(0, 10) : '');
            setDispatchThrough(inv.dispatchThrough || '');
            setVehicleNo(inv.vehicleNo || '');
            setTransportName(inv.transportName || '');
            setLrNo(inv.lrNo || '');
            setDestination(inv.destination || '');
            setPaymentTerms(inv.paymentTerms || '');
            setPaymentStatus(inv.paymentStatus || 'Unpaid');
            setStatus(inv.status || 'Saved');
            setAdditionalNotes(inv.additionalNotes || '');
            setFreightCharges(inv.freightCharges || 0);
            setPackingCharges(inv.packingCharges || 0);
            setOtherCharges(inv.otherCharges || 0);
            
            if (inv.bankDetails) {
              setBankDetails(inv.bankDetails);
            }

            if (inv.customerDetails) {
              setCustomerDetails(inv.customerDetails);
              // Try matching selected customer ID if possible
              const matchedCust = custRes.data.customers.find(
                c => c.gstin === inv.customerDetails.gstin && c.firmName === inv.customerDetails.firmName
              );
              if (matchedCust) setSelectedCustomerId(matchedCust._id);
            }

            if (inv.items && inv.items.length > 0) {
              setItems(inv.items.map(item => ({
                product: item.product?._id || item.product || '',
                title: item.title,
                hsnCode: item.hsnCode,
                quantity: item.quantity,
                unit: item.unit || 'PCS',
                rate: item.rate,
                discount: item.discount || 0,
                taxRate: item.taxRate || 18,
                taxAmount: item.taxAmount || 0,
                totalAmount: item.totalAmount || 0,
                machineModel: item.machineModel || '',
                serialNo: item.serialNo || '',
                motorNo: item.motorNo || '',
                colour: item.colour || '',
                warrantyNo: item.warrantyNo || '',
                installationDate: item.installationDate ? item.installationDate.substring(0, 10) : ''
              })));
            }
          }
        }
      } catch (error) {
        showToast('Failed to load initial form metadata.', 'error');
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id]);

  // Handle customer selection from dropdown
  const handleCustomerSelect = (e) => {
    const custId = e.target.value;
    setSelectedCustomerId(custId);
    if (!custId) {
      setCustomerDetails({
        customerName: '',
        firmName: '',
        billingAddress: '',
        shippingAddress: '',
        phone: '',
        email: '',
        gstin: '',
        state: 'Gujarat',
        stateCode: '24'
      });
      return;
    }
    
    const cust = customers.find(c => c._id === custId);
    if (cust) {
      setCustomerDetails({
        customerName: cust.customerName || '',
        firmName: cust.firmName || '',
        billingAddress: cust.billingAddress || '',
        shippingAddress: cust.shippingAddress || cust.billingAddress || '',
        phone: cust.phone || '',
        email: cust.email || '',
        gstin: cust.gstin || '',
        state: cust.state || 'Gujarat',
        stateCode: cust.stateCode || '24'
      });
    }
  };

  // State code mapping helper for manually setting states
  const handleStateChange = (e) => {
    const stateVal = e.target.value;
    let codeVal = '24'; // default Gujarat

    const stateCodes = {
      'Gujarat': '24',
      'Maharashtra': '27',
      'Rajasthan': '08',
      'Madhya Pradesh': '23',
      'Delhi': '07',
      'Karnataka': '29',
      'Tamil Nadu': '33',
      'Uttar Pradesh': '09',
      'West Bengal': '19',
      'Telangana': '36',
      'Andhra Pradesh': '37',
      'Haryana': '06',
      'Punjab': '03',
      'Bihar': '10'
    };

    if (stateCodes[stateVal]) {
      codeVal = stateCodes[stateVal];
    }

    setCustomerDetails(prev => ({ 
      ...prev, 
      state: stateVal,
      stateCode: codeVal
    }));
  };

  // Handle product selection inside a row
  const handleProductSelect = (index, productId) => {
    const updated = [...items];
    const item = updated[index];
    item.product = productId;

    if (!productId) {
      item.title = '';
      item.rate = 0;
      item.hsnCode = '';
      item.taxRate = 18;
      recalculateRow(index, item);
      setItems(updated);
      return;
    }

    const prod = products.find(p => p._id === productId);
    if (prod) {
      item.title = prod.title;
      item.rate = prod.price || 0;
      item.hsnCode = prod.hsnCode || '8437';
      item.taxRate = prod.gstRate || 18;
      recalculateRow(index, item);
    }
    setItems(updated);
  };

  // Update specific row fields
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    
    // Trigger recalculations for rate, quantity, discount, taxRate
    if (['rate', 'quantity', 'discount', 'taxRate'].includes(field)) {
      recalculateRow(index, updated[index]);
    }
    
    setItems(updated);
  };

  // Recalculate a single row
  const recalculateRow = (index, item) => {
    const qty = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const discPercent = Number(item.discount) || 0;
    const taxPct = Number(item.taxRate) || 0;

    const discountAmount = (rate * discPercent) / 100;
    const discountedRate = rate - discountAmount;
    const taxableValue = discountedRate * qty;
    const taxAmt = (taxableValue * taxPct) / 100;
    const totalVal = taxableValue + taxAmt;

    item.taxAmount = Math.round(taxAmt * 100) / 100;
    item.totalAmount = Math.round(totalVal * 100) / 100;
  };

  // Add new item row
  const addItemRow = () => {
    setItems(prev => [
      ...prev,
      {
        product: '',
        title: '',
        hsnCode: '',
        quantity: 1,
        unit: 'PCS',
        rate: 0,
        discount: 0,
        taxRate: 18,
        taxAmount: 0,
        totalAmount: 0,
        machineModel: '',
        serialNo: '',
        motorNo: '',
        colour: '',
        warrantyNo: '',
        installationDate: ''
      }
    ]);
  };

  // Delete item row
  const deleteItemRow = (index) => {
    if (items.length === 1) {
      showToast('Invoice must contain at least one item.', 'warning');
      return;
    }
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // Totals calculations
  const calculateTotals = () => {
    let taxable = 0;
    let taxSum = 0;

    items.forEach(item => {
      const qty = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      const discPercent = Number(item.discount) || 0;
      const taxPct = Number(item.taxRate) || 0;

      const discountAmt = (rate * discPercent) / 100;
      const discountedRate = rate - discountAmt;
      const rowTaxable = discountedRate * qty;
      const rowTax = (rowTaxable * taxPct) / 100;

      taxable += rowTaxable;
      taxSum += rowTax;
    });

    const isLocal = customerDetails.stateCode === '24';
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (isLocal) {
      cgst = taxSum / 2;
      sgst = taxSum / 2;
    } else {
      igst = taxSum;
    }

    const freight = Number(freightCharges) || 0;
    const packing = Number(packingCharges) || 0;
    const other = Number(otherCharges) || 0;

    const rawGrandTotal = taxable + cgst + sgst + igst + freight + packing + other;
    const roundedGrandTotal = Math.round(rawGrandTotal);
    const roundOff = roundedGrandTotal - rawGrandTotal;

    return {
      taxableAmount: Math.round(taxable * 100) / 100,
      cgst: Math.round(cgst * 100) / 100,
      sgst: Math.round(sgst * 100) / 100,
      igst: Math.round(igst * 100) / 100,
      roundOff: Math.round(roundOff * 100) / 100,
      grandTotal: roundedGrandTotal
    };
  };

  const totals = calculateTotals();

  // Submit Invoice Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!customerDetails.customerName || !customerDetails.firmName || !customerDetails.billingAddress || !customerDetails.phone) {
      showToast('Please fill out customer name, firm name, phone, and billing address.', 'warning');
      return;
    }

    const invalidItems = items.some(item => !item.title || !item.hsnCode || Number(item.rate) <= 0 || Number(item.quantity) <= 0);
    if (invalidItems) {
      showToast('Please make sure all product descriptions, HSN codes, positive rates, and positive quantities are filled.', 'warning');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        challanNo,
        poNo,
        poDate: poDate || undefined,
        dispatchThrough,
        vehicleNo,
        transportName,
        lrNo,
        destination,
        paymentTerms,
        customerDetails,
        items,
        freightCharges,
        packingCharges,
        otherCharges,
        paymentStatus,
        status,
        additionalNotes,
        bankDetails
      };

      let res;
      if (id) {
        // Edit invoice
        res = await api.put(`/invoices/${id}`, payload);
      } else {
        // Create new invoice
        res = await api.post('/invoices', payload);
      }

      if (res.data.success) {
        showToast(id ? 'Invoice updated successfully!' : 'Invoice generated successfully!', 'success');
        navigate('/admin/dashboard/invoices');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to save invoice.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <FaSpinner className="animate-spin text-3xl text-brand-red" />
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Loading Form Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Form Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/dashboard/invoices"
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-brand-navy hover:bg-slate-50 transition-colors"
          >
            <FaArrowLeft className="text-sm" />
          </Link>
          <div>
            <h1 className="font-heading font-black text-brand-navy text-lg uppercase tracking-wide">
              {id ? `Edit Invoice: ${invoiceNo}` : 'Generate GST Invoice'}
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              {id ? 'Modify machinery sales records and reprint.' : 'Generate a new invoice block with dynamic GST taxes.'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Lookup and Details Block */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-brand-navy border-b border-slate-100 pb-3">
            <FaUserTie className="text-sm" />
            <h2 className="font-heading font-bold text-xs uppercase tracking-wider">Customer Info Selection</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5 col-span-1 md:col-span-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Select Customer from Directory</label>
              <select
                value={selectedCustomerId}
                onChange={handleCustomerSelect}
                className="w-full px-3.5 py-2 text-xs font-semibold bg-white border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-navy/20 focus:border-brand-navy"
              >
                <option value="">-- Manual Input / Select Saved Customer --</option>
                {customers.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.firmName} ({c.customerName} - {c.phone})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Customer Contact Name *</label>
              <input
                type="text"
                required
                value={customerDetails.customerName}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, customerName: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-navy"
                placeholder="e.g. Kirit Savaliya"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Company / Firm Name *</label>
              <input
                type="text"
                required
                value={customerDetails.firmName}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, firmName: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-navy"
                placeholder="e.g. Savaliya Agro Industries"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Mobile Number *</label>
              <input
                type="text"
                required
                value={customerDetails.phone}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-navy"
                placeholder="e.g. 9876543210"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Email Address</label>
              <input
                type="email"
                value={customerDetails.email}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-navy"
                placeholder="e.g. info@savaliyaagro.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">GSTIN / Tax Code</label>
              <input
                type="text"
                value={customerDetails.gstin}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, gstin: e.target.value.toUpperCase() }))}
                className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-navy"
                placeholder="e.g. 24ABCDE1234F1Z5"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Billing State *</label>
              <select
                value={customerDetails.state}
                onChange={handleStateChange}
                className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-navy"
              >
                {[
                  'Gujarat', 'Maharashtra', 'Rajasthan', 'Madhya Pradesh', 
                  'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 
                  'West Bengal', 'Telangana', 'Andhra Pradesh', 'Haryana', 
                  'Punjab', 'Bihar'
                ].map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">State Code (Auto)</label>
              <input
                type="text"
                disabled
                value={customerDetails.stateCode}
                className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg font-mono text-slate-500"
              />
            </div>

            <div className="space-y-1.5 col-span-1 md:col-span-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Billing Address *</label>
              <textarea
                rows="2"
                required
                value={customerDetails.billingAddress}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, billingAddress: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-navy"
                placeholder="Enter complete billing address"
              />
            </div>

            <div className="space-y-1.5 col-span-1 md:col-span-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Shipping Address (Leave same if identical)</label>
              <textarea
                rows="2"
                value={customerDetails.shippingAddress}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, shippingAddress: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-navy"
                placeholder="Enter shipping address, or leave blank to mirror billing address"
              />
            </div>
          </div>
        </div>

        {/* Invoice Logistics & Transport Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-brand-navy border-b border-slate-100 pb-3">
            <FaReceipt className="text-sm" />
            <h2 className="font-heading font-bold text-xs uppercase tracking-wider">Logistics & Challan details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Challan Number</label>
              <input
                type="text"
                value={challanNo}
                onChange={(e) => setChallanNo(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-navy"
                placeholder="e.g. CH/920"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">PO Number (Purchase Order)</label>
              <input
                type="text"
                value={poNo}
                onChange={(e) => setPoNo(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-navy"
                placeholder="e.g. PO-8839"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">PO Date</label>
              <input
                type="date"
                value={poDate}
                onChange={(e) => setPoDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-navy"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Dispatch Through</label>
              <input
                type="text"
                value={dispatchThrough}
                onChange={(e) => setDispatchThrough(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-navy"
                placeholder="e.g. Road Transport / Train"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Vehicle Number</label>
              <input
                type="text"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-navy"
                placeholder="e.g. GJ-03-BY-7822"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Transport Name</label>
              <input
                type="text"
                value={transportName}
                onChange={(e) => setTransportName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-navy"
                placeholder="e.g. Maruti Cargo Movers"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">LR / consignment No.</label>
              <input
                type="text"
                value={lrNo}
                onChange={(e) => setLrNo(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-navy"
                placeholder="e.g. LR/8890"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-navy"
                placeholder="e.g. Ahmedabad, Gujarat"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Product Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-brand-navy">
              <FaBoxes className="text-sm" />
              <h2 className="font-heading font-bold text-xs uppercase tracking-wider">Itemized Sales Breakdown</h2>
            </div>
            <button
              type="button"
              onClick={addItemRow}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-brand-navy text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <FaPlus /> Add Item Row
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 relative">
                {/* Row Delete Button */}
                <button
                  type="button"
                  onClick={() => deleteItemRow(idx)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-750 transition-colors p-1"
                  title="Remove Item Row"
                >
                  <FaTrash className="text-sm" />
                </button>

                <div className="text-[10px] font-bold text-brand-navy uppercase tracking-wider">
                  Item #{idx + 1} Specifications
                </div>

                {/* Grid 1: Basic billing fields */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                  <div className="col-span-1 md:col-span-2 space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block">Select Catalog Product</label>
                    <select
                      value={item.product}
                      onChange={(e) => handleProductSelect(idx, e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-250 rounded-lg focus:outline-none focus:border-brand-navy"
                    >
                      <option value="">-- Choose Product --</option>
                      {products.map(p => (
                        <option key={p._id} value={p._id}>{p.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block">Product Name / Title *</label>
                    <input
                      type="text"
                      required
                      value={item.title}
                      onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-250 rounded-lg focus:outline-none focus:border-brand-navy"
                      placeholder="e.g. Heavy Duty Radial Drilling Machine"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block">HSN/SAC Code *</label>
                    <input
                      type="text"
                      required
                      value={item.hsnCode}
                      onChange={(e) => handleItemChange(idx, 'hsnCode', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-250 rounded-lg focus:outline-none focus:border-brand-navy font-mono"
                      placeholder="e.g. 8437"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block">Unit Name</label>
                    <input
                      type="text"
                      required
                      value={item.unit}
                      onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-250 rounded-lg focus:outline-none focus:border-brand-navy"
                      placeholder="e.g. PCS / SET"
                    />
                  </div>
                </div>

                {/* Grid 2: Pricing, Quantities, and Discounts */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block">Rate (Base Price) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="any"
                      value={item.rate || ''}
                      onChange={(e) => handleItemChange(idx, 'rate', parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-250 rounded-lg focus:outline-none focus:border-brand-navy font-mono"
                      placeholder="Rate ₹"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block">Quantity *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={item.quantity || ''}
                      onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-250 rounded-lg focus:outline-none focus:border-brand-navy font-mono"
                      placeholder="Qty"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block">Discount %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={item.discount || ''}
                      onChange={(e) => handleItemChange(idx, 'discount', parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-250 rounded-lg focus:outline-none focus:border-brand-navy font-mono"
                      placeholder="Disc %"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block">GST Tax Rate %</label>
                    <select
                      value={item.taxRate}
                      onChange={(e) => handleItemChange(idx, 'taxRate', parseInt(e.target.value) || 18)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-250 rounded-lg focus:outline-none focus:border-brand-navy"
                    >
                      <option value="0">0% Exemption</option>
                      <option value="5">5% GST</option>
                      <option value="12">12% GST</option>
                      <option value="18">18% GST</option>
                      <option value="28">28% GST</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block">Calculated Tax</label>
                    <input
                      type="text"
                      disabled
                      value={`₹${item.taxAmount}`}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-150 border border-slate-200 rounded-lg font-mono text-slate-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block">Line Total</label>
                    <input
                      type="text"
                      disabled
                      value={`₹${item.totalAmount}`}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-150 border border-slate-200 rounded-lg font-mono text-slate-600 font-bold"
                    />
                  </div>
                </div>

                {/* Grid 3: Machinery specifications (Model, Serial, Motor, Color, Warranty, Installation) */}
                <div className="border-t border-slate-200 pt-3 mt-1">
                  <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Machinery Specs (Optional - printed in details column)</span>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[8.5px] font-bold text-slate-500 uppercase block">Machine Model</label>
                      <input
                        type="text"
                        value={item.machineModel}
                        onChange={(e) => handleItemChange(idx, 'machineModel', e.target.value)}
                        className="w-full px-2 py-1 text-[11px] bg-white border border-slate-250 rounded-lg focus:outline-none"
                        placeholder="e.g. JB-50"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[8.5px] font-bold text-slate-500 uppercase block">Serial Number</label>
                      <input
                        type="text"
                        value={item.serialNo}
                        onChange={(e) => handleItemChange(idx, 'serialNo', e.target.value)}
                        className="w-full px-2 py-1 text-[11px] bg-white border border-slate-250 rounded-lg focus:outline-none"
                        placeholder="e.g. JB/2026/089"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[8.5px] font-bold text-slate-500 uppercase block">Motor Number</label>
                      <input
                        type="text"
                        value={item.motorNo}
                        onChange={(e) => handleItemChange(idx, 'motorNo', e.target.value)}
                        className="w-full px-2 py-1 text-[11px] bg-white border border-slate-250 rounded-lg focus:outline-none"
                        placeholder="e.g. MTR-77291"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[8.5px] font-bold text-slate-500 uppercase block">Colour</label>
                      <input
                        type="text"
                        value={item.colour}
                        onChange={(e) => handleItemChange(idx, 'colour', e.target.value)}
                        className="w-full px-2 py-1 text-[11px] bg-white border border-slate-250 rounded-lg focus:outline-none"
                        placeholder="e.g. Electric Blue"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[8.5px] font-bold text-slate-500 uppercase block">Warranty Card No</label>
                      <input
                        type="text"
                        value={item.warrantyNo}
                        onChange={(e) => handleItemChange(idx, 'warrantyNo', e.target.value)}
                        className="w-full px-2 py-1 text-[11px] bg-white border border-slate-250 rounded-lg focus:outline-none"
                        placeholder="e.g. W-77281"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[8.5px] font-bold text-slate-500 uppercase block">Installation Date</label>
                      <input
                        type="date"
                        value={item.installationDate}
                        onChange={(e) => handleItemChange(idx, 'installationDate', e.target.value)}
                        className="w-full px-2 py-1 text-[11px] bg-white border border-slate-250 rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Summary, Extra Charges, Bank credentials */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: Bank & General info */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 text-brand-navy font-heading font-bold text-xs uppercase tracking-wider">
              Bank credentials & Notes
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Bank Name</label>
                <input
                  type="text"
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails(prev => ({ ...prev, bankName: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Account Number</label>
                <input
                  type="text"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">IFSC Code</label>
                <input
                  type="text"
                  value={bankDetails.ifscCode}
                  onChange={(e) => setBankDetails(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">UPI VPA Address</label>
                <input
                  type="text"
                  value={bankDetails.upiId}
                  onChange={(e) => setBankDetails(prev => ({ ...prev, upiId: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5 border-t border-slate-150 pt-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Billing Type / Save Mode</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="Saved">Final Bill (Saves and adjusts product stocks)</option>
                  <option value="Draft">Draft Quote (Does not touch product stocks)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right panel: Summary calculations & charges */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 text-brand-navy font-heading font-bold text-xs uppercase tracking-wider">
              Taxes, Charges & Invoice Grand Total
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Packing & Forwarding (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={packingCharges || ''}
                  onChange={(e) => setPackingCharges(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Freight / Transport Cost (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={freightCharges || ''}
                  onChange={(e) => setFreightCharges(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Other Loading Charges (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={otherCharges || ''}
                  onChange={(e) => setOtherCharges(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 font-semibold text-xs text-slate-700">
              <div className="flex justify-between">
                <span>Taxable Amount (Total Base Value):</span>
                <span className="font-mono font-bold text-slate-900">₹{totals.taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              {customerDetails.stateCode === '24' ? (
                <>
                  <div className="flex justify-between pl-4 text-slate-500 text-[11px]">
                    <span>Central GST (CGST) Split:</span>
                    <span className="font-mono">₹{totals.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between pl-4 text-slate-500 text-[11px] border-b border-slate-200 pb-2">
                    <span>State GST (SGST) Split:</span>
                    <span className="font-mono">₹{totals.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between pl-4 text-blue-600 text-[11px] border-b border-slate-200 pb-2">
                  <span>Integrated GST (IGST) Out-of-State:</span>
                  <span className="font-mono font-bold">₹{totals.igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="flex justify-between pt-1">
                <span>Freight, Packing & Other Charges:</span>
                <span className="font-mono">₹{(packingCharges + freightCharges + otherCharges).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2.5">
                <span>Round-off (Adjusted Paise):</span>
                <span className="font-mono text-slate-550">{totals.roundOff >= 0 ? '+' : ''}{totals.roundOff.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-base font-black text-brand-navy pt-1">
                <span className="uppercase tracking-wider">Grand Total (Rounded):</span>
                <span className="font-mono text-lg text-brand-navy">₹{totals.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase block">Term Conditions / Notes / Warranty specifics</label>
              <textarea
                rows="3"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Include custom terms (e.g., Goods once sold will not be taken back. Warranty covers manufacturers defect only.)"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>

            {/* Actions triggers */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <Link
                to="/admin/dashboard/invoices"
                className="px-5 py-2.5 border border-slate-200 text-slate-650 hover:bg-slate-50 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-red text-white hover:bg-red-700 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <FaSpinner className="animate-spin text-sm" />
                ) : (
                  <FaSave className="text-sm" />
                )}
                {id ? 'Update Bill' : 'Save Invoice'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
