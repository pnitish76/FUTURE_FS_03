import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  firmName: {
    type: String,
    required: [true, 'Firm name is required'],
    trim: true
  },
  billingAddress: {
    type: String,
    required: [true, 'Billing address is required']
  },
  shippingAddress: {
    type: String,
    required: [true, 'Shipping address is required']
  },
  phone: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  gstin: {
    type: String,
    trim: true,
    uppercase: true
  },
  state: {
    type: String,
    required: [true, 'State name is required'],
    default: 'Gujarat'
  },
  stateCode: {
    type: String,
    required: [true, 'State code is required'],
    default: '24'
  }
}, {
  timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
