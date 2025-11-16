import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewSection = ({ propertyId, property }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/reviews/property/${propertyId}`);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [propertyId]);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        {[1, 2, 3].map(i => (
          <div key={i} className="border-b border-gray-200 py-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 pt-8">
      <h2 className="text-2xl font-bold mb-6">
        ⭐ {property?.rating?.toFixed(1) || '0.0'} · {property?.reviewCount || 0} đánh giá
      </h2>

      {/* Review Scores Breakdown */}
      {property?.reviewScores && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            { key: 'cleanliness', label: 'Sạch sẽ' },
            { key: 'accuracy', label: 'Mô tả chính xác' },
            { key: 'communication', label: 'Giao tiếp' },
            { key: 'location', label: 'Vị trí' },
            { key: 'checkIn', label: 'Nhận phòng' },
            { key: 'value', label: 'Giá trị' }
          ].map(({ key, label }) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-gray-700">{label}</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-pink-600 h-2 rounded-full" 
                    style={{ width: `${(property.reviewScores[key] / 5) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold w-8">
                  {property.reviewScores[key]?.toFixed(1) || '0.0'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews.map((review) => (
          <div key={review._id} className="border-b border-gray-100 pb-6">
            <div className="flex items-start space-x-4">
              <img
                src={review.user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'}
                alt={review.user.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{review.user.name}</h4>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <span>{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-semibold">{review.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{review.comment}</p>
                
                {review.isRecommended && (
                  <div className="text-green-600 text-sm font-semibold">
                    ✓ Đề xuất
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {reviews.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-6 border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {showAll ? 'Hiển thị ít hơn' : `Hiển thị tất cả ${reviews.length} đánh giá`}
        </button>
      )}

      {reviews.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Chưa có đánh giá nào cho chỗ ở này.
        </div>
      )}
    </div>
  );
};

export default ReviewSection;