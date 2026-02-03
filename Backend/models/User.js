const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    trim: true,
    default: ''
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  bloodGroup: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  pincode: {
    type: String,
    default: ''
  },
  bikeModel: {
    type: String,
    default: ''
  },
  bikeRegistrationNumber: {
    type: String,
    default: ''
  },
  licenseNumber: {
    type: String,
    default: ''
  },
  emergencyContactName: {
    type: String,
    default: ''
  },
  emergencyContactPhone: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: ''
  },
  profileImagePublicId: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
