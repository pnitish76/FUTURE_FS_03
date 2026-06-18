import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaTimes, FaSearch, FaUserTie } from 'react-icons/fa';

export default function CustomerManager() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
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

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/customers?search=${search}`);
      if (res.data.success) {
        setCustomers(res.data.customers);
      }
    } catch (error) {
      showToast('Failed to load customers from database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setFormData({
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
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cust) => {
    setEditingCustomer(cust);
    setFormData({
      customerName: cust.customerName,
      firmName: cust.firmName,
      billingAddress: cust.billingAddress,
      shippingAddress: cust.shippingAddress,
      phone: cust.phone,
      email: cust.email || '',
      gstin: cust.gstin || '',
      state: cust.state || 'Gujarat',
      stateCode: cust.stateCode || '24'
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // State code mapping helper for convenience
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
      'Haryana': '06',
      'Punjab': '03',
      'Andhra Pradesh': '37',
      'Telangana': '36',
      'Bihar': '10',
      'Kerala': '32'
    };

    if (stateCodes[stateVal]) {
      codeVal = stateCodes[stateVal];
    }
    setFormData(prev => ({ ...prev, state: stateVal, stateCode: codeVal }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.firmName.trim() || !formData.billingAddress.trim() || !formData.shippingAddress.trim() || !formData.phone.trim()) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (editingCustomer) {
        const res = await api.put(`/customers/${editingCustomer._id}`, formData);
        if (res.data.success) {
          showToast('Customer profile updated successfully.', 'success');
          fetchCustomers();
          handleCloseModal();
        }
      } else {
        const res = await api.post('/customers', formData);
        if (res.data.success) {
          showToast('Customer profile added successfully.', 'success');
          fetchCustomers();
          handleCloseModal();
        }
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Error occurred while saving customer profile.';
      showToast(errMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer record?')) return;
    try {
      const res = await api.delete(`/customers/${id}`);
      if (res.data.success) {
        showToast('Customer record deleted.', 'success');
        fetchCustomers();
      }
    } catch (error) {
      showToast('Failed to delete customer record.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-205 shadow-sm">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <FaSearch className="text-xs" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers by name, firm, or GSTIN..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>
        
        <button
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto px-5 py-2.5 bg-brand-red hover:bg-red-700 text-white rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer transition-colors"
        >
          <FaPlus /> Add Customer
        </button>
      </div>

      {/* Customer List table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="animate-spin text-3xl text-brand-red" />
        </div>
      ) : customers.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs font-semibold">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Firm / Company Details</th>
                  <th className="p-4">Billing State</th>
                  <th className="p-4">GSTIN</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {customers.map((cust) => (
                  <tr key={cust._id} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <div className="font-bold text-brand-navy">{cust.customerName}</div>
                      <div className="text-[10px] text-slate-450 font-semibold mt-0.5">{cust.phone} | {cust.email || 'No Email'}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold">{cust.firmName}</div>
                      <div className="text-[10px] text-slate-450 mt-0.5 line-clamp-1 max-w-xs">{cust.billingAddress}</div>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-750 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">
                        {cust.state} (Code: {cust.stateCode})
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-brand-navy">
                      {cust.gstin || 'UNREGISTERED'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(cust)}
                          className="p-1.5 bg-slate-100 border hover:bg-slate-200 hover:text-slate-900 rounded text-slate-600 cursor-pointer"
                          title="Edit Customer"
                        >
                          <FaEdit className="text-xs" />
                        </button>
                        <button
                          onClick={() => handleDelete(cust._id)}
                          className="p-1.5 bg-red-50 border border-red-100 hover:bg-red-100 text-red-650 rounded cursor-pointer"
                          title="Delete Customer"
                        >
                          <FaTrash className="text-xs" />
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
          <FaUserTie className="text-4xl text-slate-300" />
          <p className="text-sm font-semibold text-slate-450">No customer profiles found.</p>
        </div>
      )}

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={handleCloseModal} className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs" />
          
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-slate-100 animate-scale-up">
            <div className="bg-brand-navy p-5 text-white flex justify-between items-center border-b border-slate-800">
              <h3 className="font-heading font-black text-sm uppercase tracking-wider">
                {editingCustomer ? 'Edit Customer Profile' : 'Add New Customer'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:bg-brand-red text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {/* Customer Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Customer Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="e.g. Amit Patel"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>
                {/* Firm Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Firm / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="firmName"
                    value={formData.firmName}
                    onChange={handleChange}
                    placeholder="e.g. Patel Industries"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>
                {/* Email */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. patel@firm.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>
              </div>

              {/* Billing Address */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Billing Address *
                </label>
                <textarea
                  required
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Official registered billing address..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>

              {/* Shipping Address */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Shipping / Delivery Address *
                </label>
                <div className="flex justify-between items-center mb-1">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, shippingAddress: prev.billingAddress }))}
                    className="text-[9px] font-bold uppercase text-brand-blue hover:underline cursor-pointer"
                  >
                    Copy Billing Address
                  </button>
                </div>
                <textarea
                  required
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Delivery address..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* GSTIN */}
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    GSTIN Number (15-digit)
                  </label>
                  <input
                    type="text"
                    maxLength="15"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                    placeholder="e.g. 24AAIFJ8080B1ZJ"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20 font-mono uppercase"
                  />
                </div>
                {/* State */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleStateChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:bg-white cursor-pointer"
                  >
                    <option value="Gujarat">Gujarat (24)</option>
                    <option value="Maharashtra">Maharashtra (27)</option>
                    <option value="Rajasthan">Rajasthan (08)</option>
                    <option value="Madhya Pradesh">Madhya Pradesh (23)</option>
                    <option value="Delhi">Delhi (07)</option>
                    <option value="Karnataka">Karnataka (29)</option>
                    <option value="Tamil Nadu">Tamil Nadu (33)</option>
                    <option value="Uttar Pradesh">Uttar Pradesh (09)</option>
                    <option value="West Bengal">West Bengal (19)</option>
                    <option value="Haryana">Haryana (06)</option>
                    <option value="Punjab">Punjab (03)</option>
                    <option value="Andhra Pradesh">Andhra Pradesh (37)</option>
                    <option value="Telangana">Telangana (36)</option>
                    <option value="Bihar">Bihar (10)</option>
                    <option value="Kerala">Kerala (32)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-650 font-heading font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-brand-red hover:bg-red-700 text-white rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer disabled:opacity-75"
                >
                  {submitting ? <FaSpinner className="animate-spin" /> : null}
                  {editingCustomer ? 'Save Changes' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
