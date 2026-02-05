const express = require('express');
const router = express.Router();
const { getGalleryItems, createGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');
const { galleryUpload } = require('../middleware/cloudinaryConfig');

router.get('/', getGalleryItems);
router.post('/', protect, galleryUpload.single('image'), createGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

module.exports = router;

