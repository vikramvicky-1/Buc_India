import express from 'express';
import { getGalleryItems, createGalleryItem, deleteGalleryItem, updateGalleryItem } from '../controllers/galleryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { galleryUpload } from '../middleware/cloudinaryConfig.js';

const router = express.Router();

router.get('/', getGalleryItems);
router.post('/', protect, galleryUpload.single('image'), createGalleryItem);
router.put('/:id', protect, galleryUpload.single('image'), updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

export default router;
