import Inquiry from '../models/Inquiry.js';

// @desc    Create customer inquiry
// @route   POST /api/inquiries
// @access  Public
export const createInquiry = async (req, res) => {
  try {
    const { name, phone, productRequirement, message } = req.body;

    if (!name || !phone || !productRequirement || !message) {
      return res.status(400).json({ success: false, message: 'Please enter all required fields' });
    }

    const inquiry = await Inquiry.create({
      name,
      phone,
      productRequirement,
      message
    });

    return res.status(201).json({ success: true, inquiry });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private/Admin
export const getInquiries = async (req, res) => {
  try {
    // Sort unread first, then by date descending
    const inquiries = await Inquiry.find().sort({ status: 1, createdAt: -1 });
    return res.json({ success: true, count: inquiries.length, inquiries });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update inquiry status (read/unread)
// @route   PUT /api/inquiries/:id
// @access  Private/Admin
export const markInquiryRead = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['read', 'unread'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status parameter provided' });
    }

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry message not found' });
    }

    inquiry.status = status;
    await inquiry.save();

    return res.json({ success: true, inquiry });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private/Admin
export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    await Inquiry.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Inquiry message deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
