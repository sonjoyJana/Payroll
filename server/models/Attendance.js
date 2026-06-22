const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  checkIn: {
    type: String,
  },
  checkOut: {
    type: String,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'half-day', 'late', 'leave'],
    default: 'present',
  },
}, { timestamps: true });

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
