const express = require('express');
const router = express.Router();
const { getGalleryItems, createGalleryItem, deleteGalleryItem, updateGalleryItem } = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');
const { galleryUpload } = require('../middleware/cloudinaryConfig');

router.get('/', getGalleryItems);
router.post('/', protect, galleryUpload.single('image'), createGalleryItem);
router.put('/:id', protect, galleryUpload.single('image'), updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

module.exports = router;

