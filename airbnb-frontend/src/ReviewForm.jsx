import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ booking, property, onReviewSubmitted }) => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    cleanliness: 5,
    accuracy: 5,
    communication: 5,
    location: 5,
    checkIn: 5,
    value: 5,
    isRecommended: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/reviews', {
        propertyId: property._id,
        bookingId: booking._id,
        ...formData
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setShowForm(false);
      onReviewSubmitted();
      // Reset form
      setFormData({
        rating: 5,
        comment: '',
        cleanliness: 5,
        accuracy: 5,
        communication: 5,
        location: 5,
        checkIn: 5,
        value: 5,
        isRecommended: true
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi gửi đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const RatingInput = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between mb-4">
      <span className="font-medium">{label}</span>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="text-2xl focus:outline-none"
          >
            {star <= value ? '⭐' : '☆'}
          </button>
        ))}
      </div>
    </div>
  );

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
      >
        Viết đánh giá
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-4">Viết đánh giá</h3>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Overall Rating */}
          <div className="mb-6">
            <label className="block font-semibold mb-3">Đánh giá tổng quan</label>
            <div className="flex space-x-1 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  className="text-3xl focus:outline-none"
                >
                  {star <= formData.rating ? '⭐' : '☆'}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Ratings */}
          <div className="space-y-2 mb-6">
            <RatingInput
              label="Sạch sẽ"
              value={formData.cleanliness}
              onChange={(value) => setFormData(prev => ({ ...prev, cleanliness: value }))}
            />
            <RatingInput
              label="Mô tả chính xác"
              value={formData.accuracy}
              onChange={(value) => setFormData(prev => ({ ...prev, accuracy: value }))}
            />
            <RatingInput
              label="Giao tiếp"
              value={formData.communication}
              onChange={(value) => setFormData(prev => ({ ...prev, communication: value }))}
            />
            <RatingInput
              label="Vị trí"
              value={formData.location}
              onChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
            />
            <RatingInput
              label="Nhận phòng"
              value={formData.checkIn}
              onChange={(value) => setFormData(prev => ({ ...prev, checkIn: value }))}
            />
            <RatingInput
              label="Giá trị"
              value={formData.value}
              onChange={(value) => setFormData(prev => ({ ...prev, value: value }))}
            />
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">Bình luận của bạn</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Chia sẻ trải nghiệm của bạn với chỗ ở này..."
              required
            />
          </div>

          {/* Recommendation */}
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="recommend"
              checked={formData.isRecommended}
              onChange={(e) => setFormData(prev => ({ ...prev, isRecommended: e.target.checked }))}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <label htmlFor="recommend" className="ml-2 font-medium">
              Tôi đề xuất chỗ ở này
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || !formData.comment.trim()}
              className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;