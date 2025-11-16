import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/bookings/my-bookings', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBookings(response.data);
        setError(null);
      } catch (err) {
        setError('Không thể tải danh sách đặt phòng');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đặt phòng này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Cập nhật lại danh sách
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
      ));
    } catch (err) {
      setError('Không thể hủy đặt phòng');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Đang chờ';
      case 'cancelled':
        return 'Đã hủy';
      case 'completed':
        return 'Đã hoàn thành';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="border border-gray-200 rounded-lg p-6 mb-4">
              <div className="flex space-x-4">
                <div className="w-32 h-24 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Đặt phòng của tôi</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">Bạn chưa có đặt phòng nào.</div>
          <Link 
            to="/" 
            className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition duration-200"
          >
            Khám phá các căn hộ
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => (
            <div key={booking._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition duration-200">
              <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <img
                  src={booking.property.images?.[0]}
                  alt={booking.property.title}
                  className="w-full md:w-48 h-40 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        <Link 
                          to={`/property/${booking.property._id}`}
                          className="hover:text-pink-600 transition duration-200"
                        >
                          {booking.property.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {new Date(booking.checkIn).toLocaleDateString('vi-VN')} - {new Date(booking.checkOut).toLocaleDateString('vi-VN')}
                      </p>
                      <p className="text-gray-600 mb-2">{booking.guests} khách</p>
                    </div>
                    <div className="flex flex-col items-start md:items-end space-y-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                      <p className="text-xl font-semibold text-pink-600">
                        ${booking.totalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div className="text-sm text-gray-600">
                      Đặt lúc: {new Date(booking.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="flex space-x-3">
                      <Link
                        to={`/property/${booking.property._id}`}
                        className="text-pink-600 hover:text-pink-700 font-semibold text-sm"
                      >
                        Xem chi tiết
                      </Link>
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="text-red-600 hover:text-red-700 font-semibold text-sm"
                        >
                          Hủy đặt phòng
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;