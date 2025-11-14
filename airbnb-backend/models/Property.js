// models/Property.js
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['Toàn bộ căn hộ', 'Phòng riêng', 'Toàn bộ biệt thự', 'Toàn bộ nhà'],
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  images: [{
    type: String,
    required: true
  }],
  location: {
    address: String,
    city: String,
    country: {
      type: String,
      default: 'Vietnam'
    }
  },
  amenities: [String],
  host: {
    name: {
      type: String,
      required: true
    },
    avatar: String,
    joined: Date,
    reviews: {
      type: Number,
      default: 0
    },
    isSuperhost: {
      type: Boolean,
      default: false
    }
  },
  maxGuests: {
    type: Number,
    required: true,
    min: 1
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 1
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 1
  },
  area: Number, // m2
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Tạo index cho tìm kiếm nhanh
propertySchema.index({ title: 'text', description: 'text' });
propertySchema.index({ price: 1 });
propertySchema.index({ location: 1 });

module.exports = mongoose.model('Property', propertySchema);