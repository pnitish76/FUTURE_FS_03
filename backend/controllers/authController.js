import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'jay_bhagwati_tools_machinery_secret_key_2026', {
    expiresIn: '30d',
  });
};

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, phone, emailOrPhone, password } = req.body;
    const identifier = emailOrPhone || email || phone;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email or phone and password' });
    }

    const query = {};
    if (identifier.includes('@')) {
      query.email = identifier.toLowerCase();
    } else {
      const cleanPhone = identifier.replace(/[\s-+]/g, '').slice(-10);
      query.phone = cleanPhone;
    }

    const user = await User.findOne(query);

    if (user && (await user.matchPassword(password))) {
      return res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email/phone or password' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !password) {
      return res.status(400).json({ success: false, message: 'Please enter name and password' });
    }

    if (!email && !phone) {
      return res.status(400).json({ success: false, message: 'Please enter either email or phone number' });
    }

    const conditions = [];
    if (email) {
      conditions.push({ email: email.toLowerCase() });
    }
    if (phone) {
      const cleanPhone = phone.replace(/[\s-+]/g, '').slice(-10);
      conditions.push({ phone: cleanPhone });
    }

    const userExists = await User.findOne({ $or: conditions });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email or phone number' });
    }

    const cleanPhone = phone ? phone.replace(/[\s-+]/g, '').slice(-10) : undefined;

    const user = await User.create({
      name,
      email: email ? email.toLowerCase() : undefined,
      phone: cleanPhone,
      password,
      role: role || 'customer'
    });

    if (user) {
      return res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user data provided' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
