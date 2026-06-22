const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Employee = require('./models/Employee');
const User = require('./models/User');

dotenv.config();

const employees = [
  { employeeId: 'EMP001', firstName: 'Amit', lastName: 'Sharma', email: 'amit.sharma@company.com', phone: '9876543210', department: 'Engineering', position: 'Senior Developer', salary: 85000, bankName: 'State Bank of India', accountNumber: 'SBIN0001234', ifscCode: 'SBIN0000123', address: '12 MG Road, Mumbai' },
  { employeeId: 'EMP002', firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@company.com', phone: '9876543211', department: 'Marketing', position: 'Marketing Manager', salary: 72000, bankName: 'HDFC Bank', accountNumber: 'HDFC0005678', ifscCode: 'HDFC0000456', address: '45 Brigade Road, Bangalore' },
  { employeeId: 'EMP003', firstName: 'Rajesh', lastName: 'Verma', email: 'rajesh.verma@company.com', phone: '9876543212', department: 'Finance', position: 'Accountant', salary: 65000, bankName: 'ICICI Bank', accountNumber: 'ICIC0009012', ifscCode: 'ICIC0000789', address: '78 Connaught Place, Delhi' },
  { employeeId: 'EMP004', firstName: 'Ananya', lastName: 'Singh', email: 'ananya.singh@company.com', phone: '9876543213', department: 'Engineering', position: 'Junior Developer', salary: 55000, bankName: 'Axis Bank', accountNumber: 'AXIS0003456', ifscCode: 'AXIS0000345', address: '23 Park Street, Kolkata' },
  { employeeId: 'EMP005', firstName: 'Vikram', lastName: 'Joshi', email: 'vikram.joshi@company.com', phone: '9876543214', department: 'HR', position: 'HR Coordinator', salary: 48000, bankName: 'Bank of Baroda', accountNumber: 'BARB0007890', ifscCode: 'BARB0000678', address: '56 Marine Drive, Chennai' },
  { employeeId: 'EMP006', firstName: 'Neha', lastName: 'Gupta', email: 'neha.gupta@company.com', phone: '9876543215', department: 'Engineering', position: 'DevOps Engineer', salary: 78000, bankName: 'State Bank of India', accountNumber: 'SBIN0002345', ifscCode: 'SBIN0000456', address: '90 FC Road, Pune' },
  { employeeId: 'EMP007', firstName: 'Arjun', lastName: 'Reddy', email: 'arjun.reddy@company.com', phone: '9876543216', department: 'Sales', position: 'Sales Executive', salary: 62000, bankName: 'HDFC Bank', accountNumber: 'HDFC0006789', ifscCode: 'HDFC0000789', address: '34 Jubilee Hills, Hyderabad' },
  { employeeId: 'EMP008', firstName: 'Kavita', lastName: 'Nair', email: 'kavita.nair@company.com', phone: '9876543217', department: 'Marketing', position: 'Graphic Designer', salary: 51000, bankName: 'ICICI Bank', accountNumber: 'ICIC0000123', ifscCode: 'ICIC0000901', address: '67 BKC, Mumbai' },
  { employeeId: 'EMP009', firstName: 'Deepak', lastName: 'Malhotra', email: 'deepak.m@company.com', phone: '9876543218', department: 'Finance', position: 'Financial Analyst', salary: 69000, bankName: 'Axis Bank', accountNumber: 'AXIS0004567', ifscCode: 'AXIS0000567', address: '12 Salt Lake, Kolkata' },
  { employeeId: 'EMP010', firstName: 'Sneha', lastName: 'Desai', email: 'sneha.desai@company.com', phone: '9876543219', department: 'Engineering', position: 'QA Engineer', salary: 58000, bankName: 'Bank of Baroda', accountNumber: 'BARB0008901', ifscCode: 'BARB0000789', address: '89 Koramangala, Bangalore' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await Employee.countDocuments();
    if (count > 0) {
      await Employee.deleteMany({});
      await User.deleteMany({});
      console.log('Cleared existing data');
    }
    for (const emp of employees) {
      const employee = await Employee.create(emp);
      await User.create({
        name: `${emp.firstName} ${emp.lastName}`,
        email: emp.email,
        password: 'password123',
        role: 'employee',
        employeeId: employee._id,
      });
      console.log(`Created: ${emp.employeeId} - ${emp.firstName} ${emp.lastName}`);
    }
    console.log('All employees seeded successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
