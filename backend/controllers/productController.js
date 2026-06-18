import Product from '../models/Product.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, count: products.length, products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { title, category, description, price, stock, hsnCode, gstRate } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({ success: false, message: 'Please enter all required fields' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Product image file is required' });
    }

    let imageUrl = req.file.path;
    // Format local path to relative url if not Cloudinary hosted
    if (!imageUrl.startsWith('http')) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const product = await Product.create({
      title,
      category,
      description,
      price: price || 0,
      stock: stock || 0,
      hsnCode: hsnCode || '8437',
      gstRate: gstRate || 18,
      image: imageUrl
    });

    return res.status(201).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { title, category, description, price, stock, hsnCode, gstRate } = req.body;
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let updateData = { title, category, description };
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (hsnCode !== undefined) updateData.hsnCode = hsnCode;
    if (gstRate !== undefined) updateData.gstRate = gstRate;

    if (req.file) {
      let imageUrl = req.file.path;
      if (!imageUrl.startsWith('http')) {
        imageUrl = `/uploads/${req.file.filename}`;
      }
      updateData.image = imageUrl;
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    return res.json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
