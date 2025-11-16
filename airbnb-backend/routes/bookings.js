// routes/bookings.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const auth = require('../middleware/auth');

// Tạo booking mới (cần đăng nhập)
router.post('/', auth, async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guests } = req.body;

    // Kiểm tra property có tồn tại không
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Không tìm thấy căn hộ' });
    }

    // Kiểm tra tính khả dụng của property
    const existingBooking = await Booking.findOne({
      property: propertyId,
      $or: [
        {
          checkIn: { $lte: new Date(checkOut) },
          checkOut: { $gte: new Date(checkIn) }
        }
      ],
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'Căn hộ không khả dụng trong khoảng thời gian này' });
    }

    // Tính tổng giá
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const totalPrice = property.price * nights;

    const booking = new Booking({
      property: propertyId,
      user: req.user.id,
      checkIn,
      checkOut,
      guests,
      totalPrice
    });

    await booking.save();

    // Populate thông tin property và user
    await booking.populate('property');
    await booking.populate('user', '-password');

    res.status(201).json(booking);
  } catch (error) {
    console.error('Lỗi khi tạo booking:', error);
    res.status(500).json({ error: 'Lỗi server khi tạo booking' });
  }
});

// Lấy danh sách booking của user hiện tại (cần đăng nhập)
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('property')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách booking:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy danh sách booking' });
  }
});

// Lấy chi tiết booking (cần đăng nhập và là chủ sở hữu booking)
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('property')
      .populate('user', '-password');

    if (!booking) {
      return res.status(404).json({ error: 'Không tìm thấy booking' });
    }

    // Kiểm tra xem user có quyền xem booking này không
    if (booking.user._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Không có quyền truy cập' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết booking:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy chi tiết booking' });
  }
});

// Hủy booking (cần đăng nhập và là chủ sở hữu booking)
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Không tìm thấy booking' });
    }

    // Kiểm tra xem user có quyền hủy booking này không
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Không có quyền hủy booking' });
    }

    // Chỉ cho phép hủy khi booking chưa được xác nhận hoặc đang pending
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return res.status(400).json({ error: 'Không thể hủy booking ở trạng thái hiện tại' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error('Lỗi khi hủy booking:', error);
    res.status(500).json({ error: 'Lỗi server khi hủy booking' });
  }
});

module.exports = router;