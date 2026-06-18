import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  review: {
    type: String,
    required: [true, 'Review is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  }
}, {
  timestamps: true
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
