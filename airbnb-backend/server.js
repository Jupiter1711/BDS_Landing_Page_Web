const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas với options mới
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ Đã kết nối MongoDB Atlas thành công!');
  console.log(`📊 Database: ${mongoose.connection.name}`);
})
.catch(err => {
  console.error('❌ Lỗi kết nối MongoDB Atlas:', err.message);
  console.log('📝 Đang sử dụng mock data thay vì database thật');
});

// Routes đơn giản
app.get('/', (req, res) => {
  res.json({ 
    message: 'Airbnb Clone API đang chạy!',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Using mock data'
  });
});

// Mock data API (vẫn giữ nguyên để fallback)
app.get('/api/properties', (req, res) => {
  const properties = [
    {
      id: 1,
      title: "Căn hộ sang trọng tại Quận 1",
      price: 1200000,
      type: "Toàn bộ căn hộ",
      rating: 4.89,
      reviewCount: 128,
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=500&h=400&fit=crop",
      location: "Quận 1, TP.HCM",
      description: "Căn hộ đầy đủ tiện nghi với view thành phố tuyệt đẹp",
      amenities: ["Wifi", "Bếp", "Máy lạnh", "TV"],
      host: {
        name: "Nguyễn Văn A",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
      }
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
      description: "Biệt thự sang trọng ngay sát biển",
      amenities: ["Hồ bơi", "Wifi", "Bếp", "Máy giặt"],
      host: {
        name: "Trần Thị B",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
      }
    },
    {
      id: 3,
      title: "Nhà phố cổ Hội An",
      price: 800000,
      type: "Toàn bộ nhà",
      rating: 4.92,
      reviewCount: 156,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop",
      location: "Hội An",
      description: "Nhà phố cổ với kiến trúc truyền thống Việt Nam",
      amenities: ["Wifi", "Bếp", "Điều hòa", "Vườn"],
      host: {
        name: "Phạm Văn C",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
      }
    }
  ];
  res.json(properties);
});

app.get('/api/properties/:id', (req, res) => {
  const propertyId = parseInt(req.params.id);
  
  // Mock data cho từng property
  const properties = {
    1: {
      id: 1,
      title: "Căn hộ sang trọng tại Quận 1",
      price: 1200000,
      type: "Toàn bộ căn hộ",
      rating: 4.89,
      reviewCount: 128,
      images: [
        "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop"
      ],
      location: "Quận 1, TP.HCM",
      description: "Căn hộ đầy đủ tiện nghi với view thành phố tuyệt đẹp. Phù hợp cho gia đình và công tác. Căn hộ nằm ở vị trí trung tâm, gần các tiện ích như siêu thị, nhà hàng, và khu vui chơi.",
      amenities: ["Wifi", "Bếp", "Máy lạnh", "TV", "Máy giặt", "Bãi đỗ xe", "Hồ bơi", "Phòng gym"],
      host: {
        name: "Nguyễn Văn A",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        joined: "Tháng 1, 2023",
        reviews: 45,
        isSuperhost: true
      },
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 1,
      area: 65 // m2
    },
    2: {
      id: 2,
      title: "Biệt thự view biển Nha Trang",
      price: 2500000,
      type: "Toàn bộ biệt thự",
      rating: 4.95,
      reviewCount: 89,
      images: [
        "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop"
      ],
      location: "Nha Trang",
      description: "Biệt thự sang trọng ngay sát biển với view panorama tuyệt đẹp. Thiết kế hiện đại, đầy đủ tiện nghi cao cấp.",
      amenities: ["Hồ bơi", "Wifi", "Bếp", "Máy giặt", "Máy lạnh", "TV", "Bãi đỗ xe", "Lò sưởi", "Ban công"],
      host: {
        name: "Trần Thị B",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
        joined: "Tháng 3, 2022",
        reviews: 89,
        isSuperhost: true
      },
      maxGuests: 6,
      bedrooms: 3,
      bathrooms: 2,
      area: 120 // m2
    }
  };

  const property = properties[propertyId];
  
  if (!property) {
    return res.status(404).json({ error: 'Không tìm thấy căn hộ' });
  }
  
  res.json(property);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📊 Database status: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Using mock data'}`);
});