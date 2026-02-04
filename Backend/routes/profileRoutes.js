const express = require('express');
const router = express.Router();
const { getProfile, createOrUpdateProfile } = require('../controllers/profileController');
const { profileUpload } = require('../middleware/cloudinaryConfig');

router.get('/', getProfile);
router.post('/', profileUpload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'licenseImage', maxCount: 1 }
]), createOrUpdateProfile);
router.put('/', profileUpload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'licenseImage', maxCount: 1 }
]), createOrUpdateProfile);

module.exports = router;
