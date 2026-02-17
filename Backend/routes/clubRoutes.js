const express = require('express');
const router = express.Router();
const {
  getPublicClubs,
  getAllClubs,
  createClubRequest,
  updateClubStatus,
} = require('../controllers/clubController');
const { protect } = require('../middleware/authMiddleware');
const { clubUpload } = require('../middleware/cloudinaryConfig');

// Public
router.get('/public', getPublicClubs);

// Public - collaboration request (multi-part with images)
router.post(
  '/',
  clubUpload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'firstRideImage', maxCount: 1 },
    { name: 'governmentIdImage', maxCount: 1 },
    { name: 'founderPassport', maxCount: 1 },
  ]),
  createClubRequest
);

// Admin
router.get('/', protect, getAllClubs);
router.patch('/:id/status', protect, updateClubStatus);

module.exports = router;

