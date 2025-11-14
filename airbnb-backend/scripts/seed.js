// scripts/seed.js
const mongoose = require('mongoose');
const Property = require('../models/Property');
require('dotenv').config();

const sampleProperties = [
  {
    title: "Căn hộ sang trọng tại Quận 1",
    description: "Căn hộ đầy đủ tiện nghi với view thành phố tuyệt đẹp. Phù hợp cho gia đình và công tác.",
    price: 1200000,
    type: "Toàn bộ căn hộ",
    rating: 4.89,
    reviewCount: 128,
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop"
    ],
    location: {
      address: "Đường Nguyễn Huệ",
      city: "Quận 1, TP.HCM"
    },
    amenities: ["Wifi", "Bếp", "Máy lạnh", "TV", "Máy giặt", "Bãi đỗ xe", "Hồ bơi", "Phòng gym"],
    host: {
      name: "Nguyễn Văn A",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      joined: new Date('2023-01-15'),
      reviews: 45,
      isSuperhost: true
    },
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    area: 65
  },
  {
    title: "Biệt thự view biển Nha Trang",
    description: "Biệt thự sang trọng ngay sát biển với view panorama tuyệt đẹp. Thiết kế hiện đại, đầy đủ tiện nghi cao cấp.",
    price: 2500000,
    type: "Toàn bộ biệt thự",
    rating: 4.95,
    reviewCount: 89,
    images: [
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop"
    ],
    location: {
      address: "Bãi biển Trần Phú",
      city: "Nha Trang"
    },
    amenities: ["Hồ bơi", "Wifi", "Bếp", "Máy giặt", "Máy lạnh", "TV", "Bãi đỗ xe", "Lò sưởi", "Ban công"],
    host: {
      name: "Trần Thị B",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      joined: new Date('2022-03-20'),
      reviews: 89,
      isSuperhost: true
    },
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    area: 120
  },
  {
    title: "Nhà phố cổ Hội An",
    description: "Nhà phố cổ với kiến trúc truyền thống Việt Nam, nằm trong khu phố cổ Hội An. Trải nghiệm văn hóa độc đáo.",
    price: 800000,
    type: "Toàn bộ nhà",
    rating: 4.92,
    reviewCount: 156,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583418856643-8520c6e549d0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1598940603846-a1edd0ef2574?w=800&h=600&fit=crop"
    ],
    location: {
      address: "Phố cổ Hội An",
      city: "Hội An"
    },
    amenities: ["Wifi", "Bếp", "Điều hòa", "Vườn", "Xe đạp miễn phí", "Quạt trần"],
    host: {
      name: "Phạm Văn C",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      joined: new Date('2021-11-05'),
      reviews: 67,
      isSuperhost: false
    },
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1,
    area: 45
  }
];

async function seedDatabase() {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Đã kết nối MongoDB');

    // Xóa dữ liệu cũ (cẩn thận với production!)
    await Property.deleteMany({});
    console.log('✅ Đã xóa dữ liệu cũ');

    // Thêm dữ liệu mẫu
    await Property.insertMany(sampleProperties);
    console.log('✅ Đã thêm dữ liệu mẫu thành công');

    // Đếm số lượng properties
    const count = await Property.countDocuments();
    console.log(`📊 Tổng số properties trong database: ${count}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed database:', error);
    process.exit(1);
  }
}

seedDatabase();