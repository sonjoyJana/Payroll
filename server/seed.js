const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const exists = await User.findOne({ email: 'admin@company.com' });
    if (exists) {
      console.log('Admin user already exists');
      console.log('Email: admin@company.com');
      console.log('Password: admin123');
      process.exit();
    }
    await User.create({
      name: 'Admin',
      email: 'admin@company.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin user created successfully');
    console.log('Email: admin@company.com');
    console.log('Password: admin123');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
