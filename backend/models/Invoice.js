import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoiceNo: {
    type: String,
    required: [true, 'Invoice number is required'],
    unique: true
  },
  invoiceDate: {
    type: Date,
    required: [true, 'Invoice date is required'],
    default: Date.now
  },
  challanNo: {
    type: String,
    trim: true
  },
  poNo: {
    type: String,
    trim: true
  },
  poDate: {
    type: Date
  },
  dispatchThrough: {
    type: String,
    trim: true
  },
  vehicleNo: {
    type: String,
    trim: true
  },
  transportName: {
    type: String,
    trim: true
  },
  lrNo: {
    type: String,
    trim: true
  },
  destination: {
    type: String,
    trim: true
  },
  paymentTerms: {
    type: String,
    trim: true
  },
  customerDetails: {
    customerName: { type: String, required: true },
    firmName: { type: String, required: true },
    billingAddress: { type: String, required: true },
    shippingAddress: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    gstin: { type: String },
    state: { type: String, required: true, default: 'Gujarat' },
    stateCode: { type: String, required: true, default: '24' }
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      title: { type: String, required: true },
      hsnCode: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      unit: { type: String, required: true, default: 'PCS' },
      rate: { type: Number, required: true, min: 0 }, // base price before tax
      discount: { type: Number, default: 0 }, // percentage
      taxRate: { type: Number, required: true, default: 18 }, // GST %
      taxAmount: { type: Number, required: true, default: 0 },
      totalAmount: { type: Number, required: true, default: 0 }, // row total after discount & tax
      
      // Machinery specific details
      machineModel: { type: String, trim: true },
      serialNo: { type: String, trim: true },
      motorNo: { type: String, trim: true },
      colour: { type: String, trim: true },
      warrantyNo: { type: String, trim: true },
      installationDate: { type: Date }
    }
  ],
  taxableAmount: { type: Number, required: true, default: 0 },
  cgst: { type: Number, required: true, default: 0 },
  sgst: { type: Number, required: true, default: 0 },
  igst: { type: Number, required: true, default: 0 },
  freightCharges: { type: Number, default: 0 },
  packingCharges: { type: Number, default: 0 },
  otherCharges: { type: Number, default: 0 },
  roundOff: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true, default: 0 },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Pending'],
    default: 'Unpaid'
  },
  status: {
    type: String,
    enum: ['Draft', 'Saved'],
    default: 'Saved'
  },
  additionalNotes: {
    type: String,
    trim: true
  },
  bankDetails: {
    bankName: { type: String, default: 'BANK OF BARODA' },
    branch: { type: String, default: 'Canal Road' },
    accountNumber: { type: String, default: '70920200000673' },
    ifscCode: { type: String, default: 'BARB0DBCAN' },
    upiId: { type: String, default: 'jaybhagwati@okaxis' }
  }
}, {
  timestamps: true
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
