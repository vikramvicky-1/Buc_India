import express from 'express';
import { getProfile, createOrUpdateProfile } from '../controllers/profileController.js';
import { profileUpload } from '../middleware/cloudinaryConfig.js';

const router = express.Router();

router.get('/', getProfile);
router.post('/', profileUpload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'licenseImage', maxCount: 1 }
]), createOrUpdateProfile);
router.put('/', profileUpload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'licenseImage', maxCount: 1 }
]), createOrUpdateProfile);

export default router;
