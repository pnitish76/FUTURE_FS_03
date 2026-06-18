import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[6789]\d{9}$/, 'Please enter a valid 10-digit mobile number']
  },
  shippingAddress: {
    type: String,
    required: [true, 'Shipping address is required']
  },
  deliveryMethod: {
    type: String,
    enum: ['Delivery', 'Store Pickup'],
    default: 'Delivery'
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  shippingCost: {
    type: Number,
    required: true,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    default: 'None'
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
