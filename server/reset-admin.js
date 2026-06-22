const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const reset = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteOne({ email: 'admin@company.com' });
    await User.create({
      name: 'Admin',
      email: 'admin@company.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin user recreated successfully');
    console.log('Email: admin@company.com');
    console.log('Password: admin123');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

reset();
