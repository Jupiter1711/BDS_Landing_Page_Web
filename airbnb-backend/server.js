const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB (dùng MongoDB Atlas free)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BDS_Landing_Page_Web';

mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ Đã kết nối MongoDB'))
.catch(err => console.error('❌ Lỗi MongoDB:', err));

// Routes đơn giản
app.get('/', (req, res) => {
  res.json({ message: 'Airbnb Clone API đang chạy!' });
});

// Mock data API
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
    }
  ];
  res.json(properties);
});

app.get('/api/properties/:id', (req, res) => {
  const property = {
    id: parseInt(req.params.id),
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
    description: "Căn hộ đầy đủ tiện nghi với view thành phố tuyệt đẹp. Phù hợp cho gia đình và công tác.",
    amenities: ["Wifi", "Bếp", "Máy lạnh", "TV", "Máy giặt", "Bãi đỗ xe"],
    host: {
      name: "Nguyễn Văn A",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      joined: "Tháng 1, 2023",
      reviews: 45
    },
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1
  };
  res.json(property);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});