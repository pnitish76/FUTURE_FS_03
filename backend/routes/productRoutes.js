import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, upload.single('image'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, upload.single('image'), updateProduct)
  .delete(protect, deleteProduct);

export default router;
