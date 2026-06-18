import Customer from '../models/Customer.js';

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private/Admin
export const getCustomers = async (req, res) => {
  try {
    const search = req.query.search;
    let query = {};
    if (search) {
      query = {
        $or: [
          { customerName: { $regex: search, $options: 'i' } },
          { firmName: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { gstin: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const customers = await Customer.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, count: customers.length, customers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new customer
// @route   POST /api/customers
// @access  Private/Admin
export const createCustomer = async (req, res) => {
  try {
    const { customerName, firmName, billingAddress, shippingAddress, phone, email, gstin, state, stateCode } = req.body;

    if (!customerName || !firmName || !billingAddress || !shippingAddress || !phone) {
      return res.status(400).json({ success: false, message: 'Please enter all required fields' });
    }

    const customer = await Customer.create({
      customerName,
      firmName,
      billingAddress,
      shippingAddress,
      phone,
      email,
      gstin,
      state: state || 'Gujarat',
      stateCode: stateCode || '24'
    });

    return res.status(201).json({ success: true, customer });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a customer
// @route   PUT /api/customers/:id
// @access  Private/Admin
export const updateCustomer = async (req, res) => {
  try {
    const { customerName, firmName, billingAddress, shippingAddress, phone, email, gstin, state, stateCode } = req.body;
    let customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const updateData = {
      customerName,
      firmName,
      billingAddress,
      shippingAddress,
      phone,
      email,
      gstin,
      state: state || 'Gujarat',
      stateCode: stateCode || '24'
    };

    customer = await Customer.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    return res.json({ success: true, customer });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Private/Admin
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    await Customer.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
