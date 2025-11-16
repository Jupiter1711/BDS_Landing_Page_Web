import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo bên trái */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <img 
              src="/logo.png" 
              alt="DudesChaseMoney" 
              className="h-28 w-auto" // Giảm kích thước logo để cân đối
            />
          </Link>

          {/* Search Bar - ĐÃ SỬA */}
          <div className="flex-1 max-w-lg mx-4"> {/* Giảm max-w-2xl xuống max-w-lg và mx-8 xuống mx-4 */}
            <div className="flex items-center border border-gray-300 rounded-full px-3 py-2 shadow-sm hover:shadow-md transition-shadow">
              <button className="text-sm font-semibold px-3 border-r border-gray-300 flex-1 text-center truncate">
                Địa Điểm Bất Kì
              </button>
              <button className="text-sm text-gray-500 px-3 border-r border-gray-300 flex-1 text-center truncate">
                Giá Bán
              </button>
              <button className="text-sm text-gray-500 px-3 flex items-center justify-center flex-1">
                <span className="truncate">Thêm khách</span>
                <div className="ml-2 bg-rose-500 rounded-full p-1 shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4 shrink-0">
            <button className="text-sm font-medium hover:bg-gray-100 px-3 py-2 rounded-full whitespace-nowrap">
              Trở thành chủ nhà
            </button>
            
            {user ? (
              <div className="flex items-center space-x-2">
                {/* Dropdown Menu */}
                <div className="relative">
                  <button 
                    className="flex items-center space-x-2 border border-gray-300 rounded-full p-2 hover:shadow-md transition-shadow"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <div className="bg-gray-500 rounded-full p-1">
                      <img 
                        className="w-6 h-6 rounded-full object-cover" 
                        src={user.avatar || "/default-avatar.png"} 
                        alt={user.name}
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                    </div>
                  </button>

                  {/* Dropdown Content */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      
                      <Link 
                        to="/my-bookings" 
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        🏠 Đặt phòng của tôi
                      </Link>
                      
                      <Link 
                        to="/profile" 
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        👤 Hồ sơ
                      </Link>
                      
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100 mt-2"
                      >
                        🚪 Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login"
                  className="text-sm font-medium hover:bg-gray-100 px-3 py-2 rounded-full transition-colors whitespace-nowrap"
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/register"
                  className="text-sm font-medium hover:bg-gray-100 px-3 py-2 rounded-full transition-colors whitespace-nowrap"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
};

export default Header;