const GalleryItem = require('../models/GalleryItem');
const { cloudinary } = require('../middleware/cloudinaryConfig');

const getGalleryItems = async (req, res) => {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createGalleryItem = async (req, res) => {
  try {
    const { eventName, eventDate, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    if (!eventName || !eventDate) {
      return res.status(400).json({ message: 'Event name and date are required' });
    }

    const item = new GalleryItem({
      eventName,
      eventDate,
      category: category || 'all',
      imageUrl: req.file.path,
      imagePublicId: req.file.filename,
    });

    const saved = await item.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await GalleryItem.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    if (item.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(item.imagePublicId);
      } catch (err) {
        console.error('Error deleting gallery image from Cloudinary:', err);
      }
    }

    await GalleryItem.findByIdAndDelete(id);
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGalleryItems,
  createGalleryItem,
  deleteGalleryItem,
};

