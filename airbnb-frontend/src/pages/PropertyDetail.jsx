import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/properties/${id}`);
        setProperty(response.data);
        setError(null);
      } catch (err) {
        setError('Không thể tải thông tin căn hộ. Vui lòng thử lại sau.');
        console.error('Error fetching property:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-red-500 text-center text-lg">{error}</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600">Không tìm thấy thông tin căn hộ.</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
        <div className="flex items-center mt-2 space-x-4">
          <div className="flex items-center">
            <span className="text-yellow-500">⭐</span>
            <span className="ml-1 font-semibold">{property.rating}</span>
            <span className="ml-1 text-gray-600">({property.reviewCount} đánh giá)</span>
          </div>
          <span className="text-gray-600">·</span>
          <span className="text-gray-600">{property.location?.city}, {property.location?.country}</span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-96">
          <div className="md:col-span-2">
            <img
              src={property.images?.[selectedImage] || property.images?.[0]}
              alt={property.title}
              className="w-full h-full object-cover rounded-l-2xl"
            />
          </div>
          <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2">
            {property.images?.slice(0, 4).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${property.title} ${index + 1}`}
                className={`w-full h-full object-cover cursor-pointer ${
                  index === 1 ? 'rounded-tr-2xl' : ''
                } ${index === 3 ? 'rounded-br-2xl' : ''}`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2">
          {/* Property Type & Host */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-2xl font-semibold mb-2">{property.type} tại {property.location?.city}</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-gray-600">{property.maxGuests} khách · {property.bedrooms} phòng ngủ · {property.bathrooms} phòng tắm</span>
              </div>
            </div>
          </div>

          {/* Host Info */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={property.host?.avatar}
                alt={property.host?.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold">Chủ nhà: {property.host?.name}</h3>
                {property.host?.isSuperhost && (
                  <span className="inline-block bg-pink-100 text-pink-800 text-sm font-semibold px-2 py-1 rounded-full mt-1">
                    👑 Superhost
                  </span>
                )}
                <p className="text-gray-600 mt-1">{property.host?.reviews} đánh giá</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Mô tả</h3>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Tiện nghi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.amenities?.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-green-500">✓</span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Property Details */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Chi tiết căn hộ</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="font-semibold">Số khách tối đa</p>
                <p className="text-gray-600">{property.maxGuests} khách</p>
              </div>
              <div>
                <p className="font-semibold">Phòng ngủ</p>
                <p className="text-gray-600">{property.bedrooms} phòng</p>
              </div>
              <div>
                <p className="font-semibold">Phòng tắm</p>
                <p className="text-gray-600">{property.bathrooms} phòng</p>
              </div>
              {property.area && (
                <div>
                  <p className="font-semibold">Diện tích</p>
                  <p className="text-gray-600">{property.area} m²</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 border border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-2xl font-bold">${property.price.toLocaleString()}</span>
              <span className="text-gray-600">/ đêm</span>
            </div>
            
            {/* Date Picker (sẽ thêm sau) */}
            <div className="border border-gray-300 rounded-lg mb-4">
              <div className="grid grid-cols-2 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">
                  <label className="text-xs font-semibold">NHẬN PHÒNG</label>
                  <div className="text-gray-600">Thêm ngày</div>
                </div>
                <div className="p-3">
                  <label className="text-xs font-semibold">TRẢ PHÒNG</label>
                  <div className="text-gray-600">Thêm ngày</div>
                </div>
              </div>
              <div className="p-3">
                <label className="text-xs font-semibold">KHÁCH</label>
                <div className="text-gray-600">Thêm khách</div>
              </div>
            </div>

            <button className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition duration-200 mb-4">
              Đặt phòng
            </button>

            <p className="text-center text-gray-600 text-sm mb-4">
              Bạn sẽ không bị tính phí ngay
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 underline">${property.price.toLocaleString()} x 5 đêm</span>
                <span>${(property.price * 5).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 underline">Phí dịch vụ</span>
                <span>$150,000</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                <span>Tổng cộng</span>
                <span>${(property.price * 5 + 150000).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;