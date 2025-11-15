// routes/properties.js
const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// Lấy danh sách properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find();
    
    if (properties.length === 0) {
      console.log('📝 Database trống, đang sử dụng mock data');
      return res.json(getMockProperties());
    }

    const formattedProperties = properties.map(property => ({
      id: property._id,
      title: property.title,
      price: property.price,
      type: property.type,
      rating: property.rating,
      reviewCount: property.reviewCount,
      image: property.images[0],
      location: property.location.city,
      description: property.description,
      amenities: property.amenities,
      host: property.host
    }));
    
    console.log(`📊 Trả về ${formattedProperties.length} properties từ database`);
    res.json(formattedProperties);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách properties:', error);
    res.json(getMockProperties());
  }
});

// Lấy chi tiết property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ error: 'Không tìm thấy căn hộ' });
    }
    
    const formattedProperty = {
      id: property._id,
      title: property.title,
      price: property.price,
      type: property.type,
      rating: property.rating,
      reviewCount: property.reviewCount,
      images: property.images,
      location: property.location,
      description: property.description,
      amenities: property.amenities,
      host: property.host,
      maxGuests: property.maxGuests,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      isAvailable: property.isAvailable
    };
    
    res.json(formattedProperty);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết property:', error);
    
    // Fallback to mock data if error
    const mockProperties = getMockProperties();
    const property = mockProperties.find(p => p.id === req.params.id);
    if (property) {
      return res.json(property);
    }
    res.status(500).json({ error: 'Lỗi server khi lấy chi tiết property' });
  }
});

// Mock data function
function getMockProperties() {
  return [
    {
      id: '69188cdcbe2279805e0a126d',
      title: "Căn hộ cao cấp Quận 1 - View Panorama tuyệt đẹp",
      price: 1200000,
      type: "Toàn bộ căn hộ",
      rating: 4.89,
      reviewCount: 128,
      images: [
        "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop"
      ],
      location: {
        address: "123 Nguyễn Huệ, Quận 1",
        city: "TP.HCM",
        country: "Vietnam"
      },
      description: "Căn hộ sang trọng với view toàn cảnh thành phố, đầy đủ tiện nghi cao cấp. Vị trí trung tâm Quận 1, thuận tiện di chuyển đến các địa điểm du lịch và mua sắm.",
      amenities: ["Wifi", "Bếp đầy đủ", "Máy lạnh", "TV thông minh", "Máy giặt", "Bàn làm việc", "Hồ bơi", "Phòng gym"],
      host: {
        name: "Nguyễn Văn A",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
        joined: new Date('2020-03-15'),
        reviews: 45,
        isSuperhost: true
      },
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 2,
      area: 65,
      isAvailable: true
    }
  ];
}

module.exports = router;