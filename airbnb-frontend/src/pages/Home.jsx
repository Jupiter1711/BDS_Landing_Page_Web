import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data fallback
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
    }
  ];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/properties');
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
                  <span className="text-sm">{property.rating}</span>
                </div>
              </div>
              
              <p className="text-gray-500 text-sm">
                {property.location}
              </p>
              <p className="text-gray-500 text-sm">
                {property.type}
              </p>
              
              <div className="flex items-center pt-1">
                <span className="font-semibold">
                  {property.price.toLocaleString('vi-VN')} VND
                </span>
                <span className="text-gray-500 text-sm ml-1">/ đêm</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Error warning but still showing data */}
      {error && properties.length > 0 && (
        <div className="mt-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Đang hiển thị dữ liệu mẫu: {error}
        </div>
      )}
    </div>
  );
};

export default Home;