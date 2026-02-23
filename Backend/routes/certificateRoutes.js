const express = require('express');
const router = express.Router();
const {
  getCertificates,
  createOrUpdateCertificate,
} = require('../controllers/certificateController');
const { protect } = require('../middleware/authMiddleware');

// BUC owner admin only
router.get('/', protect, getCertificates);
router.post('/', protect, createOrUpdateCertificate);

module.exports = router;

