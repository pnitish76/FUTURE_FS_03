import express from 'express';
import { createInquiry, getInquiries, markInquiryRead, deleteInquiry } from '../controllers/inquiryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createInquiry)
  .get(protect, getInquiries);

router.route('/:id')
  .put(protect, markInquiryRead)
  .delete(protect, deleteInquiry);

export default router;
