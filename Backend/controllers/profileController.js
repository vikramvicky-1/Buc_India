const User = require('../models/User');
const { cloudinary } = require('../middleware/cloudinaryConfig');

const getProfile = async (req, res) => {
  try {
    const { email, phone } = req.query;
    
    if (!email && !phone) {
      return res.status(400).json({ message: 'Email or phone is required' });
    }

    const query = {};
    if (email) query.email = email.toLowerCase();
    if (phone) query.phone = phone;

    const user = await User.findOne(query);
    
    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: error.message });
  }
};

const createOrUpdateProfile = async (req, res) => {
  try {
    const {
      email,
      phone,
      fullName,
      dateOfBirth,
      bloodGroup,
      address,
      city,
      state,
      pincode,
      bikeModel,
      bikeRegistrationNumber,
      licenseNumber,
      emergencyContactName,
      emergencyContactPhone
    } = req.body;

    if (!email || !phone) {
      return res.status(400).json({ message: 'Email and phone are required' });
    }

    // Check if user exists
    let user = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });

    const userData = {
      email: email.toLowerCase(),
      phone,
      fullName,
      dateOfBirth,
      bloodGroup,
      address,
      city,
      state,
      pincode,
      bikeModel,
      bikeRegistrationNumber,
      licenseNumber,
      emergencyContactName,
      emergencyContactPhone
    };

    // Handle profile image upload if provided
    if (req.files && req.files.profileImage) {
      // Delete old image if exists
      if (user && user.profileImagePublicId) {
        try {
          await cloudinary.uploader.destroy(user.profileImagePublicId);
        } catch (e) {
          console.warn('Could not delete old profile image:', e.message);
        }
      }
      userData.profileImage = req.files.profileImage[0].path;
      userData.profileImagePublicId = req.files.profileImage[0].filename;
    }

    if (user) {
      // Update existing user
      user = await User.findOneAndUpdate(
        { $or: [{ email: email.toLowerCase() }, { phone }] },
        userData,
        { new: true, runValidators: true }
      );
    } else {
      // Create new user
      user = new User(userData);
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error('Create/Update Profile Error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field} is already registered with another account` 
      });
    }

    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  createOrUpdateProfile
};
