import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // State cho form đặt phòng
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        console.log('Fetching property with ID:', id); // Debug
        const response = await axios.get(`http://localhost:5000/api/properties/${id}`);
        console.log('Property data received:', response.data); // Debug
        setProperty(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching property:', err);
        if (err.response?.status === 404) {
          setError('Không tìm thấy căn hộ với ID này.');
        } else {
          setError('Không thể tải thông tin căn hộ. Vui lòng thử lại sau.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Tính toán giá cả
  const calculateTotal = () => {
    if (!checkIn || !checkOut || !property || !property.price) {
      return {
        nights: 0,
        basePrice: 0,
        serviceFee: 0,
        cleaningFee: 0,
        total: 0
      };
    }
    
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const basePrice = property.price * nights;
    const serviceFee = basePrice * 0.1;
    const cleaningFee = property.price * 0.05;
    
    return {
      nights,
      basePrice,
      serviceFee,
      cleaningFee,
      total: basePrice + serviceFee + cleaningFee
    };
  };

  const handleBooking = async () => {
    if (!user) {
      setBookingError('Vui lòng đăng nhập để đặt phòng');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (!checkIn || !checkOut) {
      setBookingError('Vui lòng chọn ngày nhận phòng và trả phòng');
      return;
    }

    const calculation = calculateTotal();
    if (calculation.nights <= 0) {
      setBookingError('Ngày trả phòng phải sau ngày nhận phòng');
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError(null);

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/bookings', {
        propertyId: id,
        checkIn,
        checkOut,
        guests
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setBookingSuccess(true);
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    } catch (err) {
      setBookingError(err.response?.data?.error || 'Đã xảy ra lỗi khi đặt phòng');
    } finally {
      setBookingLoading(false);
    }
  };

  // LOADING STATE
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

  // ERROR STATE
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-red-500 text-center text-lg mb-4">{error}</div>
        <button 
          onClick={() => navigate('/')}
          className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition duration-200 mx-auto block"
        >
          Quay về trang chủ
        </button>
      </div>
    );
  }

  // PROPERTY NULL CHECK
  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600 mb-4">Không tìm thấy thông tin căn hộ.</div>
        <button 
          onClick={() => navigate('/')}
          className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition duration-200 mx-auto block"
        >
          Quay về trang chủ
        </button>
      </div>
    );
  }

  // Tính toán chỉ khi có property
  const calculation = calculateTotal();

  // Hàm xử lý lỗi ảnh
  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&h=400&fit=crop';
    e.target.alt = 'Default property image';
  };

  const handleAvatarError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face';
    e.target.alt = 'Default avatar';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {property.title || 'Căn hộ không có tiêu đề'}
        </h1>
        <div className="flex items-center mt-2 space-x-4">
          <div className="flex items-center">
            <span className="text-yellow-500">⭐</span>
            <span className="ml-1 font-semibold">
              {property.rating ? property.rating.toFixed(1) : 'Mới'}
            </span>
            <span className="ml-1 text-gray-600">
              ({property.reviewCount || 0} đánh giá)
            </span>
          </div>
          <span className="text-gray-600">·</span>
          <span className="text-gray-600">
            {property.location?.city || 'Đang cập nhật'}, {property.location?.country || 'Việt Nam'}
          </span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-96">
          <div className="md:col-span-2">
            <img
              src={property.images?.[selectedImage] || property.images?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop'}
              alt={property.title || 'Căn hộ'}
              className="w-full h-full object-cover rounded-l-2xl"
              onError={handleImageError}
            />
          </div>
          <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2">
            {(property.images && property.images.length > 0 ? property.images.slice(0, 4) : [
              'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop'
            ]).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${property.title || 'Căn hộ'} ${index + 1}`}
                className={`w-full h-full object-cover cursor-pointer ${
                  index === 1 ? 'rounded-tr-2xl' : ''
                } ${index === 3 ? 'rounded-br-2xl' : ''}`}
                onClick={() => setSelectedImage(index)}
                onError={handleImageError}
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
            <h2 className="text-2xl font-semibold mb-2">
              {property.type || 'Căn hộ'} chỗ ở tại {property.location?.city || 'địa phương này'}
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-gray-600">
                  {property.maxGuests || 1} khách · {property.bedrooms || 1} phòng ngủ · {property.bathrooms || 1} phòng tắm
                  {property.area && ` · ${property.area} m²`}
                </span>
              </div>
            </div>
          </div>

          {/* Host Info */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={property.host?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'}
                alt={property.host?.name || 'Chủ nhà'}
                className="w-16 h-16 rounded-full"
                onError={handleAvatarError}
              />
              <div>
                <h3 className="text-xl font-semibold">
                  Chủ nhà: {property.host?.name || 'Đang cập nhật'}
                </h3>
                {property.host?.isSuperhost && (
                  <span className="inline-block bg-pink-100 text-pink-800 text-sm font-semibold px-2 py-1 rounded-full mt-1">
                    👑 Superhost
                  </span>
                )}
                <p className="text-gray-600 mt-1">
                  {property.host?.reviews || 0} đánh giá
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Mô tả</h3>
            <p className="text-gray-700 leading-relaxed">
              {property.description || 'Chưa có mô tả cho căn hộ này.'}
            </p>
          </div>

          {/* Amenities */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Tiện nghi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.amenities && property.amenities.length > 0 ? (
                property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-green-500">✓</span>
                    <span>{amenity}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-gray-500 text-center py-4">
                  Đang cập nhật thông tin tiện nghi...
                </div>
              )}
            </div>
          </div>

          {/* Property Details */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Chi tiết căn hộ</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="font-semibold">Số khách tối đa</p>
                <p className="text-gray-600">{property.maxGuests || 1} khách</p>
              </div>
              <div>
                <p className="font-semibold">Phòng ngủ</p>
                <p className="text-gray-600">{property.bedrooms || 1} phòng</p>
              </div>
              <div>
                <p className="font-semibold">Phòng tắm</p>
                <p className="text-gray-600">{property.bathrooms || 1} phòng</p>
              </div>
              <div>
                <p className="font-semibold">Diện tích</p>
                <p className="text-gray-600">{property.area ? `${property.area} m²` : 'Đang cập nhật'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 border border-gray-200 rounded-2xl p-6 shadow-lg">
            {/* Hiển thị trạng thái giá */}
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <span className="text-2xl font-bold">
                  {property.price ? `$${property.price.toLocaleString()}` : 'Liên hệ giá'}
                </span>
                <span className="text-gray-600 ml-2">/ đêm</span>
              </div>
              {!property.price && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                  Chưa có giá
                </span>
              )}
            </div>
            
            {/* Thông báo khi không có giá */}
            {!property.price && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-blue-800 text-sm font-medium">Căn hộ này chưa có giá cụ thể</p>
                    <p className="text-blue-600 text-sm mt-1">Vui lòng liên hệ chủ nhà để biết giá chi tiết</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Date Picker */}
            <div className={`border border-gray-300 rounded-lg mb-4 ${!property.price ? 'opacity-50' : ''}`}>
              <div className="grid grid-cols-2 border-b border-gray-300">
                <div className="p-3 border-r border-gray-300">
                  <label className="text-xs font-semibold block mb-1">NHẬN PHÒNG</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-gray-700 focus:outline-none text-sm bg-transparent"
                    min={new Date().toISOString().split('T')[0]}
                    disabled={!property.price}
                  />
                </div>
                <div className="p-3">
                  <label className="text-xs font-semibold block mb-1">TRẢ PHÒNG</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-gray-700 focus:outline-none text-sm bg-transparent"
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    disabled={!property.price}
                  />
                </div>
              </div>
              <div className="p-3">
                <label className="text-xs font-semibold block mb-1">KHÁCH</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full text-gray-700 focus:outline-none text-sm bg-transparent"
                  disabled={!property.price}
                >
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'khách' : 'khách'}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Booking Button */}
            <button 
              onClick={handleBooking}
              disabled={bookingLoading || !checkIn || !checkOut || !property.price}
              className={`w-full py-3 rounded-lg font-semibold transition duration-200 mb-4 ${
                property.price 
                  ? 'bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {bookingLoading ? 'Đang xử lý...' : (
                property.price ? 'Đặt phòng' : 'Liên hệ chủ nhà'
              )}
            </button>

            {/* Nút liên hệ khi không có giá */}
            {!property.price && (
              <button 
                onClick={() => {
                  // Có thể thêm chức năng liên hệ ở đây
                  alert(`Liên hệ với chủ nhà ${property.host?.name} để biết giá chi tiết`);
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 mb-4"
              >
                📞 Liên hệ chủ nhà
              </button>
            )}

            {/* Error/Success Messages */}
            {bookingError && (
              <div className="text-red-500 text-sm mb-4 text-center">{bookingError}</div>
            )}
            {bookingSuccess && (
              <div className="text-green-500 text-sm mb-4 text-center">
                Đặt phòng thành công! Đang chuyển hướng...
              </div>
            )}

            <p className="text-center text-gray-600 text-sm mb-4">
              Bạn sẽ không bị tính phí ngay
            </p>

            {/* Price Breakdown */}
            {calculation.nights > 0 && property.price && (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 underline">
                    ${property.price.toLocaleString()} x {calculation.nights} đêm
                  </span>
                  <span>${calculation.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 underline">Phí dịch vụ</span>
                  <span>${calculation.serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 underline">Phí vệ sinh</span>
                  <span>${calculation.cleaningFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-base">
                  <span>Tổng cộng</span>
                  <span>${calculation.total.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;