const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { cloudinary } = require('../middleware/cloudinaryConfig');

const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: -1 });
    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const registrationCount = await Registration.countDocuments({
          $or: [{ eventId: event._id }, { eventId: event._id.toString() }],
        });
        return {
          ...event.toObject(),
          registrationCount,
        };
      }),
    );
    res.json(eventsWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      eventDate,
      eventTime,
      location,
      meetingPoint,
      isActive,
      certificateEnabled,
    } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Event banner is mandatory' });
    }

    const event = new Event({
      title,
      description,
      eventDate,
      eventTime,
      location,
      meetingPoint,
      isActive:
        typeof isActive === "string"
          ? isActive === "true"
          : isActive !== undefined
            ? !!isActive
            : true,
      certificateEnabled:
        typeof certificateEnabled === "string"
          ? certificateEnabled === "true"
          : !!certificateEnabled,
      banner: req.file.path,
      bannerPublicId: req.file.filename,
    });

    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.isActive !== undefined) {
      updateData.isActive =
        typeof updateData.isActive === "string"
          ? updateData.isActive === "true"
          : !!updateData.isActive;
    }

    if (updateData.certificateEnabled !== undefined) {
      updateData.certificateEnabled =
        typeof updateData.certificateEnabled === "string"
          ? updateData.certificateEnabled === "true"
          : !!updateData.certificateEnabled;
    }

    if (req.file) {
      // Delete old image if new one is uploaded
      const oldEvent = await Event.findById(id);
      if (oldEvent && oldEvent.bannerPublicId) {
        await cloudinary.uploader.destroy(oldEvent.bannerPublicId);
      }
      updateData.banner = req.file.path;
      updateData.bannerPublicId = req.file.filename;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Delete associated registrations and their license images
    const registrations = await Registration.find({ eventId: req.params.id });
    for (const reg of registrations) {
      if (reg.licenseImagePublicId) {
        try {
          await cloudinary.uploader.destroy(reg.licenseImagePublicId);
        } catch (clErr) {
          console.error('Error deleting registration image from Cloudinary:', clErr);
        }
      }
    }
    await Registration.deleteMany({ eventId: req.params.id });

    // Delete image from cloudinary
    if (event.bannerPublicId) {
      await cloudinary.uploader.destroy(event.bannerPublicId);
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event and associated registrations deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
