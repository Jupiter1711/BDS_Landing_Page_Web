const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Đăng ký
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    // Validation
    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).json({ 
        success: false,
        error: 'Vui lòng điền đầy đủ thông tin' 
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ 
        success: false,
        error: 'Mật khẩu xác nhận không khớp' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        error: 'Mật khẩu phải có ít nhất 6 ký tự' 
      });
    }

    // Kiểm tra user đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'Email đã được sử dụng' 
      });
    }

    // Tạo user mới
    const user = await User.create({
      name,
      email,
      password
    });

    // Tạo token
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );

    // Ẩn password trước khi trả về
    user.password = undefined;

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      },
      message: 'Đăng ký thành công!'
    });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ 
      success: false,
      error: 'Lỗi server khi đăng ký' 
    });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Vui lòng cung cấp email và mật khẩu' 
      });
    }

    // Tìm user và bao gồm password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ 
        success: false,
        error: 'Email hoặc mật khẩu không đúng' 
      });
    }

    // Tạo token
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );

    // Ẩn password
    user.password = undefined;

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      },
      message: 'Đăng nhập thành công!'
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ 
      success: false,
      error: 'Lỗi server khi đăng nhập' 
    });
  }
});

// Lấy thông tin user hiện tại
router.get('/me', async (req, res) => {
  try {
    // Lấy token từ header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Token không tồn tại' 
      });
    }

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Tìm user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'User không tồn tại' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        favorites: user.favorites
      }
    });
  } catch (error) {
    console.error('Lỗi xác thực:', error);
    res.status(401).json({ 
      success: false,
      error: 'Token không hợp lệ' 
    });
  }
});

module.exports = router;