import express from 'express';
import { createOrder, getOrders, updateOrderStatus, deleteOrder, payOrder, getOrderById } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createOrder)
  .get(protect, getOrders);

router.route('/:id')
  .get(getOrderById)
  .put(protect, updateOrderStatus)
  .delete(protect, deleteOrder);

router.route('/:id/pay')
  .put(payOrder);

export default router;
