import Testimonial from '../models/Testimonial.js';

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: testimonials.length, testimonials });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
export const createTestimonial = async (req, res) => {
  try {
    const { customerName, review, rating } = req.body;

    if (!customerName || !review || rating === undefined) {
      return res.status(400).json({ success: false, message: 'Please enter all required fields' });
    }

    const testimonial = await Testimonial.create({
      customerName,
      review,
      rating: Number(rating)
    });

    return res.status(201).json({ success: true, testimonial });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
export const updateTestimonial = async (req, res) => {
  try {
    const { customerName, review, rating } = req.body;
    let testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    const updateData = {
      customerName,
      review,
      rating: rating !== undefined ? Number(rating) : testimonial.rating
    };

    testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    return res.json({ success: true, testimonial });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
