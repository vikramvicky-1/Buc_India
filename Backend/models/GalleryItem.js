import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String,
      required: true,
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      enum: ['all', 'rides', 'events', 'bikes', 'rallies'],
      default: 'all',
    },
  },
  { timestamps: true }
);

const GalleryItem = mongoose.model('GalleryItem', galleryItemSchema);
export default GalleryItem;
