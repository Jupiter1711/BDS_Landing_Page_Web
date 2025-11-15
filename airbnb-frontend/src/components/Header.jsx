import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
            {/* Logo bên trái */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="DudesChaseMoney" 
              className="h-24 w-auto"
            />
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow">
              <button className="text-sm font-semibold px-4 border-r border-gray-300">
                Nơi nào đó
              </button>
              <button className="text-sm text-gray-500 px-4 border-r border-gray-300">
                Tuần bất kỳ
              </button>
              <button className="text-sm text-gray-500 px-4 flex items-center">
                Thêm khách
                <div className="ml-2 bg-rose-500 rounded-full p-2">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <button className="text-sm font-medium hover:bg-gray-100 px-4 py-2 rounded-full">
              Trở thành chủ nhà
            </button>
            
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center border border-gray-300 rounded-full p-2 hover:shadow-md cursor-pointer">
                  <svg className="w-5 h-5 text-gray-500 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <div className="bg-gray-500 rounded-full p-1 ml-1">
                    <img 
                      className="w-4 h-4 rounded-full object-cover" 
                      src={user.avatar} 
                      alt={user.name}
                    />
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium hover:bg-gray-100 px-4 py-2 rounded-full"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login"
                  className="text-sm font-medium hover:bg-gray-100 px-4 py-2 rounded-full"
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/register"
                  className="text-sm font-medium hover:bg-gray-100 px-4 py-2 rounded-full"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;