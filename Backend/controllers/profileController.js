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
      password,
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

    if (user) {
      // If user exists and password is provided, verify it (acting as login)
      if (password) {
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
      }

      const userData = {
        fullName: fullName || user.fullName,
        dateOfBirth: dateOfBirth || user.dateOfBirth,
        bloodGroup: bloodGroup || user.bloodGroup,
        address: address || user.address,
        city: city || user.city,
        state: state || user.state,
        pincode: pincode || user.pincode,
        bikeModel: bikeModel || user.bikeModel,
        bikeRegistrationNumber: bikeRegistrationNumber || user.bikeRegistrationNumber,
        licenseNumber: licenseNumber || user.licenseNumber,
        emergencyContactName: emergencyContactName || user.emergencyContactName,
        emergencyContactPhone: emergencyContactPhone || user.emergencyContactPhone
      };

      // Handle profile image upload if provided
      if (req.files && req.files.profileImage) {
        // Delete old image if exists
        if (user.profileImagePublicId) {
          try {
            await cloudinary.uploader.destroy(user.profileImagePublicId);
          } catch (e) {
            console.warn('Could not delete old profile image:', e.message);
          }
        }
        userData.profileImage = req.files.profileImage[0].path;
        userData.profileImagePublicId = req.files.profileImage[0].filename;
      }

      // Handle license image upload if provided
      if (req.files && req.files.licenseImage) {
        // Delete old image if exists
        if (user.licenseImagePublicId) {
          try {
            await cloudinary.uploader.destroy(user.licenseImagePublicId);
          } catch (e) {
            console.warn('Could not delete old license image:', e.message);
          }
        }
        userData.licenseImage = req.files.licenseImage[0].path;
        userData.licenseImagePublicId = req.files.licenseImage[0].filename;
      }

      // Update existing user
      user = await User.findOneAndUpdate(
        { _id: user._id },
        userData,
        { new: true, runValidators: true }
      );
    } else {
      // Create new user
      if (!password) {
        return res.status(400).json({ message: 'Password is required for new registration' });
      }

      const userData = {
        email: email.toLowerCase(),
        phone,
        password,
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

      if (req.files && req.files.profileImage) {
        userData.profileImage = req.files.profileImage[0].path;
        userData.profileImagePublicId = req.files.profileImage[0].filename;
      }

      if (req.files && req.files.licenseImage) {
        userData.licenseImage = req.files.licenseImage[0].path;
        userData.licenseImagePublicId = req.files.licenseImage[0].filename;
      }

      user = new User(userData);
      await user.save();
    }

    // Don't send password back
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);
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
