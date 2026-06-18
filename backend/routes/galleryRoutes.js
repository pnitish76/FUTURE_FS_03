import express from 'express';
import { getGallery, createGalleryItem, deleteGalleryItem } from '../controllers/galleryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.route('/')
  .get(getGallery)
  .post(protect, upload.single('image'), createGalleryItem);

router.route('/:id')
  .delete(protect, deleteGalleryItem);

export default router;
