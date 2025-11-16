const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  cleanliness: {
    type: Number,
    min: 1,
    max: 5
  },
  accuracy: {
    type: Number,
    min: 1,
    max: 5
  },
  communication: {
    type: Number,
    min: 1,
    max: 5
  },
  location: {
    type: Number,
    min: 1,
    max: 5
  },
  checkIn: {
    type: Number,
    min: 1,
    max: 5
  },
  value: {
    type: Number,
    min: 1,
    max: 5
  },
  images: [{
    type: String
  }],
  isRecommended: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Đảm bảo mỗi user chỉ review 1 lần cho 1 booking
reviewSchema.index({ booking: 1, user: 1 }, { unique: true });

// Static method để tính average rating
reviewSchema.statics.calculateAverageRating = async function(propertyId) {
  const result = await this.aggregate([
    {
      $match: { property: propertyId }
    },
    {
      $group: {
        _id: '$property',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
        cleanliness: { $avg: '$cleanliness' },
        accuracy: { $avg: '$accuracy' },
        communication: { $avg: '$communication' },
        location: { $avg: '$location' },
        checkIn: { $avg: '$checkIn' },
        value: { $avg: '$value' }
      }
    }
  ]);

  try {
    await this.model('Property').findByIdAndUpdate(propertyId, {
      rating: result[0]?.averageRating || 0,
      reviewCount: result[0]?.reviewCount || 0,
      reviewScores: {
        cleanliness: result[0]?.cleanliness || 0,
        accuracy: result[0]?.accuracy || 0,
        communication: result[0]?.communication || 0,
        location: result[0]?.location || 0,
        checkIn: result[0]?.checkIn || 0,
        value: result[0]?.value || 0
      }
    });
  } catch (error) {
    console.error('Error updating property rating:', error);
  }
};

// Gọi calculateAverageRating sau khi save
reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.property);
});

// Gọi calculateAverageRating sau khi remove
reviewSchema.post('remove', function() {
  this.constructor.calculateAverageRating(this.property);
});

module.exports = mongoose.model('Review', reviewSchema);