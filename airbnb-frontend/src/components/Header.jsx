import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo - bên trái */}
          <Link to="/" className="flex items-center">
            <div className="text-rose-500 font-bold text-2xl">
              airbnb
            </div>
          </Link>

          {/* Thanh tìm kiếm - ở giữa */}
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
                  <svg 
                    className="w-3 h-3 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={3} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* User menu - bên phải */}
          <div className="flex items-center space-x-4">
            <button className="text-sm font-medium hover:bg-gray-100 px-4 py-2 rounded-full">
              Trở thành chủ nhà
            </button>
            
            <div className="flex items-center border border-gray-300 rounded-full p-2 hover:shadow-md cursor-pointer">
              <svg 
                className="w-5 h-5 text-gray-500 mx-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
              <div className="bg-gray-500 rounded-full p-1 ml-1">
                <svg 
                  className="w-4 h-4 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;