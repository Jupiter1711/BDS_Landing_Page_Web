const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Property = require('./models/Property');

// Load biến môi trường
require('dotenv').config();

// Kiểm tra biến môi trường
if (!process.env.MONGODB_URI) {
  console.log('⚠️  Cảnh báo: MONGODB_URI chưa được set trong file .env');
  console.log('💡 Tạo file .env với nội dung: MONGODB_URI=your_connection_string');
}

// Sử dụng biến môi trường, nếu không có thì throw error
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ LỖI: MONGODB_URI không được định nghĩa');
  console.log('📝 Vui lòng tạo file .env trong thư mục airbnb-backend với nội dung:');
  console.log('MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/database-name');
  process.exit(1); // Dừng chương trình nếu không có MONGODB_URI
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Biến để theo dõi trạng thái kết nối
let dbConnected = false;

// Kết nối MongoDB Atlas
console.log('🔄 Đang kết nối đến MongoDB Atlas...');

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ Đã kết nối MongoDB Atlas thành công!');
  console.log(`📊 Database: ${mongoose.connection.name}`);
  console.log(`📍 Host: ${mongoose.connection.host}`);
  dbConnected = true;
  console.log(`📊 Database status: Connected`);
})
.catch(err => {
  console.error('❌ Lỗi kết nối MongoDB Atlas:', err.message);
  console.log(`📊 Database status: Disconnected`);
  console.log('💡 Kiểm tra:');
  console.log('   1. Connection string trong file .env');
  console.log('   2. Network Access trong MongoDB Atlas');
  console.log('   3. Username/password trong connection string');
});

// Routes
app.get('/', (req, res) => {
  const dbStatus = dbConnected ? 'Connected' : 'Disconnected';
  res.json({ 
    message: 'Airbnb Clone API đang chạy!',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Lấy danh sách properties từ database
app.get('/api/properties', async (req, res) => {
  try {
    // Kiểm tra kết nối database
    if (!dbConnected) {
      console.log('⚠️ Database chưa kết nối, đang sử dụng mock data');
      return res.json(getMockProperties());
    }

    const properties = await Property.find();
    
    if (properties.length === 0) {
      console.log('📝 Database trống, đang sử dụng mock data');
      return res.json(getMockProperties());
    }
    // Format data để tương thích với frontend
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
    console.log('🔄 Đang sử dụng mock data do lỗi database');
    res.json(getMockProperties());
  }
});

// Lấy chi tiết property từ database
app.get('/api/properties/:id', async (req, res) => {
  try {
    // Kiểm tra kết nối database
    if (!dbConnected) {
      console.log('⚠️ Database chưa kết nối, đang sử dụng mock data');
      const mockProperties = getMockProperties();
      const property = mockProperties.find(p => p.id === req.params.id) || mockProperties[0];
      return res.json(property);
    }

    // Kiểm tra xem ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }

    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ error: 'Không tìm thấy căn hộ' });
    }
    
    // Format data để tương thích với frontend
    const formattedProperty = {
      id: property._id,
      title: property.title,
      price: property.price,
      type: property.type,
      rating: property.rating,
      reviewCount: property.reviewCount,
      images: property.images,
      location: property.location.city,
      description: property.description,
      amenities: property.amenities,
      host: property.host,
      maxGuests: property.maxGuests,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area
    };
    
    res.json(formattedProperty);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết property:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy chi tiết property' });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    let propertiesCount = 0;
    if (dbConnected) {
      propertiesCount = await Property.countDocuments();
    }
    
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: dbConnected ? 'connected' : 'disconnected',
      propertiesCount: propertiesCount
    });
  } catch (error) {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: dbConnected ? 'connected' : 'disconnected',
      propertiesCount: 'Error counting'
    });
  }
});

// Mock data function
function getMockProperties() {
  return [
    {
      id: 'mock-1',
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
      id: 'mock-2',
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
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});