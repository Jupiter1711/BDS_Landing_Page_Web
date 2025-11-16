// Tạo file mới: src/components/SearchFilters.jsx
import React, { useState } from 'react';

const SearchFilters = ({ onSearch, loading }) => {
  const [filters, setFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    amenities: []
  });

  const propertyTypes = ['Toàn bộ căn hộ', 'Phòng riêng', 'Toàn bộ biệt thự', 'Toàn bộ nhà'];
  const amenitiesList = ['Wifi', 'Bếp', 'Máy lạnh', 'TV', 'Hồ bơi', 'Bãi đỗ xe', 'Máy giặt'];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      location: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      amenities: []
    });
    onSearch({});
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Location Search */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Địa điểm</label>
          <input
            type="text"
            placeholder="Tìm thành phố, địa điểm..."
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Khoảng giá</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Giá thấp nhất"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="number"
              placeholder="Giá cao nhất"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Loại chỗ ở</label>
          <select
            value={filters.propertyType}
            onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">Tất cả loại</option>
            {propertyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Số khách</label>
          <select
            value={filters.guests}
            onChange={(e) => handleFilterChange('guests', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            {[1,2,3,4,5,6,7,8].map(num => (
              <option key={num} value={num}>{num} khách</option>
            ))}
          </select>
        </div>

      </div>

      {/* Amenities Filter */}
      <div className="mt-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Tiện nghi</label>
        <div className="flex flex-wrap gap-2">
          {amenitiesList.map(amenity => (
            <button
              key={amenity}
              onClick={() => {
                const newAmenities = filters.amenities.includes(amenity)
                  ? filters.amenities.filter(a => a !== amenity)
                  : [...filters.amenities, amenity];
                handleFilterChange('amenities', newAmenities);
              }}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                filters.amenities.includes(amenity)
                  ? 'bg-pink-100 text-pink-700 border-pink-300'
                  : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={handleReset}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Đặt lại
        </button>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;