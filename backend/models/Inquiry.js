import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[6789]\d{9}$/, 'Please enter a valid 10-digit mobile number']
  },
  productRequirement: {
    type: String,
    required: [true, 'Product requirement is required']
  },
  message: {
    type: String,
    required: [true, 'Message description is required']
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread'
  }
}, {
  timestamps: true
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
