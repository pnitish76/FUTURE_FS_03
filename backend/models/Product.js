import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Power Tools', 'Hand Tools', 'Industrial Machinery', 'Welding Equipment', 'Safety Equipment', 'Hardware Accessories', 'Automatic Flour Mills']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Stock count is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  hsnCode: {
    type: String,
    required: [true, 'HSN Code is required'],
    default: '8437'
  },
  gstRate: {
    type: Number,
    required: [true, 'GST Rate percentage is required'],
    default: 18
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
