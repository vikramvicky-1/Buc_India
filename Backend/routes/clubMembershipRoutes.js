const express = require('express');
const router = express.Router();
const {
  getMyClub,
  joinClub,
  leaveClub,
  getAllMemberships,
} = require('../controllers/clubMembershipController');
const { protect } = require('../middleware/authMiddleware');

// Public: user-centric endpoints
router.get('/me', getMyClub);
router.post('/:clubId/join', joinClub);
router.post('/:clubId/leave', leaveClub);

// Admin: view all memberships & exit reasons
router.get('/', protect, getAllMemberships);

module.exports = router;

