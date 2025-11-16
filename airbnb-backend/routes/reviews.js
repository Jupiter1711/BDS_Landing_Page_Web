const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Lấy danh sách reviews của một property
router.get('/property/:propertyId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ property: req.params.propertyId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ property: req.params.propertyId });

    res.json({
      reviews,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách reviews:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy reviews' });
  }
});

// Tạo review mới (cần đăng nhập)
router.post('/', auth, async (req, res) => {
  try {
    const { propertyId, bookingId, rating, comment, cleanliness, accuracy, communication, location, checkIn, value, isRecommended } = req.body;

    // Kiểm tra xem user có booking này không
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.id,
      status: 'completed'
    });

    if (!booking) {
      return res.status(400).json({ error: 'Bạn không có quyền review booking này' });
    }

    // Kiểm tra xem đã review chưa
    const existingReview = await Review.findOne({
      booking: bookingId,
      user: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({ error: 'Bạn đã review booking này rồi' });
    }

    const review = new Review({
      property: propertyId,
      user: req.user.id,
      booking: bookingId,
      rating,
      comment,
      cleanliness,
      accuracy,
      communication,
      location,
      checkIn,
      value,
      isRecommended
    });

    await review.save();
    await review.populate('user', 'name avatar');

    res.status(201).json(review);
  } catch (error) {
    console.error('Lỗi khi tạo review:', error);
    res.status(500).json({ error: 'Lỗi server khi tạo review' });
  }
});

// Lấy reviews của user hiện tại
router.get('/my-reviews', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('property', 'title images')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Lỗi khi lấy reviews của user:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy reviews' });
  }
});

module.exports = router;