import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data fallback - THÊM PROPERTY KHÔNG CÓ GIÁ ĐỂ TEST
  const mockProperties = [
    {
      id: 1,
      title: "Căn hộ sang trọng tại Quận 1",
      price: 1200000,
      type: "Toàn bộ căn hộ",
      rating: 4.89,
      reviewCount: 128,
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=500&h=400&fit=crop",
      location: "Quận 1, TP.HCM",
      isSuperhost: true
    },
    {
      id: 2,
      title: "Biệt thự view biển Nha Trang",
      price: 2500000,
      type: "Toàn bộ biệt thự",
      rating: 4.95,
      reviewCount: 89,
      image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=500&h=400&fit=crop",
      location: "Nha Trang",
      isSuperhost: false
    },
    {
      id: 3,
      title: "Căn hộ cao cấp Quận 2",
      price: null, // THÊM TRƯỜNG HỢP KHÔNG CÓ GIÁ
      type: "Toàn bộ căn hộ",
      rating: 4.7,
      reviewCount: 56,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=400&fit=crop",
      location: "Quận 2, TP.HCM",
      isSuperhost: true
    }
  ];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/properties');
        console.log('API Response:', response.data); // DEBUG
        setProperties(response.data);
        setError(null);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
        setError('Không thể tải dữ liệu từ server');
        // Fallback to mock data
        setProperties(mockProperties);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Đang tải danh sách chỗ ở...</div>
        </div>
      </div>
    );
  }

  if (error && properties.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Filter Categories */}
      <div className="flex space-x-12 py-6 border-b border-gray-200 overflow-x-auto">
        {['Biểu tượng', 'Hồ bơi', 'Phòng tập', 'Bãi biển', 'Miền quê', 'Nhà nhỏ', 'Thiết kế', 'View'].map((category) => (
          <div 
            key={category} 
            className="flex flex-col items-center cursor-pointer min-w-[70px]"
          >
            <div className="w-8 h-8 mb-2 text-gray-400">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <span className="text-xs whitespace-nowrap text-gray-500">
              {category}
            </span>
          </div>
        ))}
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {properties.map((property) => (
          <Link 
            key={property.id} 
            to={`/property/${property.id}`}
            className="property-card group"
          >
            <div className="relative">
              {/* Property Image */}
              <img 
                src={property.image} 
                alt={property.title}
                className="w-full h-64 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Superhost Badge */}
              {property.isSuperhost && (
                <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded-md text-xs font-semibold border border-gray-200">
                  SUPERHOST
                </div>
              )}

              {/* Price Status Badge - THÊM BADGE TRẠNG THÁI GIÁ */}
              {!property.price && (
                <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-xs font-semibold border border-yellow-200">
                  CHƯA CÓ GIÁ
                </div>
              )}
            </div>
            
            {/* Property Info */}
            <div className="mt-3 space-y-1">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900 line-clamp-1 flex-1">
                  {property.title}
                </h3>
                <div className="flex items-center space-x-1 shrink-0 ml-2">
                  <svg 
                    className="w-3 h-3 text-black" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span className="text-sm">{property.rating || 'Mới'}</span>
                </div>
              </div>
              
              <p className="text-gray-500 text-sm">
                {property.location}
              </p>
              <p className="text-gray-500 text-sm">
                {property.type}
              </p>
              
              {/* Price Display - CẬP NHẬT HIỂN THỊ GIÁ */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center">
                  <span className={`font-semibold ${!property.price ? 'text-gray-500' : 'text-gray-900'}`}>
                    {property.price 
                      ? `${property.price.toLocaleString('vi-VN')} VND`
                      : 'Liên hệ giá'
                    }
                  </span>
                  {property.price && (
                    <span className="text-gray-500 text-sm ml-1">/ đêm</span>
                  )}
                </div>
                
                {/* Additional price status indicator */}
                {!property.price && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    📞 Liên hệ
                  </span>
                )}
              </div>

              {/* Review count with fallback */}
              <div className="text-gray-500 text-sm">
                {property.reviewCount ? `(${property.reviewCount} đánh giá)` : '(Chưa có đánh giá)'}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Summary - THÊM THỐNG KÊ NHANH */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center">
            <span className="font-semibold mr-2">Tổng số chỗ ở:</span>
            <span>{properties.length}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2">Có giá:</span>
            <span>{properties.filter(p => p.price).length}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2">Chưa có giá:</span>
            <span>{properties.filter(p => !p.price).length}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2">Superhost:</span>
            <span>{properties.filter(p => p.isSuperhost).length}</span>
          </div>
        </div>
      </div>

      {/* Error warning but still showing data */}
      {error && properties.length > 0 && (
        <div className="mt-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Đang hiển thị dữ liệu mẫu: {error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;