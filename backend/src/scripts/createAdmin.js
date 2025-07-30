import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import { connectDB } from '../config/database.js';

// Create admin user script
const createAdminUser = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      where: { email: 'admin@example.com' } 
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@example.com');
      console.log('Role:', existingAdmin.role);
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      fullName: 'System Administrator',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      isDpVerify: true,
      profilePicture: 'https://res.cloudinary.com/datvbo0ey/image/upload/v1726651745/3d%20avatar/1_ijpza2.png',
      coverImage: 'https://t3.ftcdn.net/jpg/05/38/74/02/360_F_538740200_HNOc2ABQarAJshNsLB4c3DXAuiCLl2QI.jpg'
    });
    
    console.log('Admin user created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('Role:', adminUser.role);
    console.log('ID:', adminUser.id);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
};

// Run the script
createAdminUser();