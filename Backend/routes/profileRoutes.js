const express = require('express');
const router = express.Router();
const { getProfile, createOrUpdateProfile } = require('../controllers/profileController');
const { upload } = require('../middleware/cloudinaryConfig');

router.get('/', getProfile);
router.post('/', upload.fields([{ name: 'profileImage', maxCount: 1 }]), createOrUpdateProfile);
router.put('/', upload.fields([{ name: 'profileImage', maxCount: 1 }]), createOrUpdateProfile);

module.exports = router;
