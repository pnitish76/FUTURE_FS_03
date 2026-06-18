import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const { customerName, phone, shippingAddress, deliveryMethod, items, subtotal, shippingCost, total } = req.body;

    const method = deliveryMethod || 'Delivery';
    let finalAddress = shippingAddress;

    if (method === 'Store Pickup') {
      finalAddress = 'Store Pickup (Collect from: Shop Number 2, Street Number 7, Station Road, opposite Bal Adalat, Bhakti Nagar, Rajkot, Gujarat 360002)';
    }

    if (!customerName || !phone || !finalAddress || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide customer details and cart items' });
    }

    // Verify product exists, check stock, get prices, and decrement stock
    const validatedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for product: ${product.title} (Available: ${product.stock})` 
        });
      }

      product.stock -= item.quantity;
      await product.save();

      validatedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price // use official DB price
      });
    }


    const order = await Order.create({
      customerName,
      phone,
      shippingAddress: finalAddress,
      deliveryMethod: method,
      items: validatedItems,
      subtotal,
      shippingCost,
      total
    });

    return res.status(201).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    // Populate product titles
    const orders = await Order.find()
      .populate('items.product', 'title category image')
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    if (!orderStatus || !['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(orderStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid order status value' });
    }

    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    await order.save();

    // Populate for response
    order = await Order.findById(req.params.id).populate('items.product', 'title category image');

    return res.json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await Order.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order payment status to paid
// @route   PUT /api/orders/:id/pay
// @access  Public
export const payOrder = async (req, res) => {
  try {
    const { paymentMethod, razorpayPaymentId } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentStatus = 'Paid';
    order.paymentMethod = razorpayPaymentId ? `Razorpay (${razorpayPaymentId})` : (paymentMethod || 'Online Payment');
    await order.save();

    return res.json({ success: true, message: 'Order paid successfully', order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'title category image');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    return res.json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
