import React, { useEffect, useState } from "react";
import { galleryService } from "../services/api";
import { toast } from "react-toastify";
import { Image as ImageIcon, Calendar, Tag, Eye, Trash2, PlusCircle, X, Edit2, AlertTriangle } from "lucide-react";
import "./EventManagement/EventManagement.css";

const categories = [
  { id: "all", label: "All Media" },
  { id: "rides", label: "Group Rides" },
  { id: "events", label: "Events" },
  { id: "bikes", label: "Member Bikes" },
  { id: "rallies", label: "Rallies" },
];

const GalleryManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    category: "all",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await galleryService.getAll();
      setItems(data);
    } catch (error) {
      console.error("Failed to load gallery items", error);
      toast.error("Failed to load gallery items");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({
      eventName: "",
      eventDate: "",
      category: "all",
    });
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
    setEditId(null);
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item._id);
    setFormData({
      eventName: item.eventName,
      eventDate: item.eventDate ? item.eventDate.split("T")[0] : "",
      category: item.category || "all",
    });
    setImagePreview(item.imageUrl);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditing && !imageFile) {
      toast.error("Please select an image to upload");
      return;
    }
    if (!formData.eventName || !formData.eventDate) {
      toast.error("Event name and date are required");
      return;
    }

    const data = new FormData();
    data.append("eventName", formData.eventName);
    data.append("eventDate", formData.eventDate);
    data.append("category", formData.category);
    if (imageFile) {
      data.append("image", imageFile);
    }

    setSubmitting(true);
    try {
      if (isEditing) {
        await galleryService.update(editId, data);
        toast.success("Gallery item updated successfully");
      } else {
        await galleryService.create(data);
        toast.success("Image added to gallery");
      }
      resetForm();
      loadItems();
    } catch (error) {
      console.error("Failed to save gallery item", error);
      toast.error(error.response?.data?.message || "Failed to save item");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id) => {
    setShowDeleteConfirm(id);
  };

  const handleDelete = async (id) => {
    setShowDeleteConfirm(null);
    try {
      await galleryService.delete(id);
      toast.success("Gallery image deleted");
      setItems((prev) => prev.filter((item) => item._id !== id));
      if (selectedItem && selectedItem._id === id) {
        setSelectedItem(null);
      }
    } catch (error) {
      console.error("Failed to delete gallery image", error);
      toast.error("Failed to delete image");
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return date;
    }
  };

  const getCategoryLabel = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.label : id;
  };

  return (
    <div className="event-management">
      <div className="page-header">
        <h1 className="page-title">Gallery Management</h1>
        <a
          href="/gallery"
          target="_blank"
          rel="noopener noreferrer"
          className="add-event-button"
        >
          View Public Gallery
        </a>
      </div>

      <div className="event-form-container">
        <div className="event-form">
          <h2>{isEditing ? "Edit Gallery Item" : "Add Image to BUC Gallery"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Event Name *</label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  required
                  placeholder="Enter event name"
                />
              </div>
              <div className="form-group">
                <label>Event Date *</label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Image {isEditing ? "(Leave blank to keep current)" : "*"}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!isEditing}
                />
                {imagePreview && (
                  <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border border-gray-700">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
                disabled={submitting}
              >
                {submitting ? (isEditing ? "Updating..." : "Uploading...") : (isEditing ? "Update Gallery Item" : "Upload to Gallery")}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="cancel-button"
                disabled={submitting}
              >
                {isEditing ? "Cancel" : "Clear"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="events-list">
        <div className="events-list-header">
          <h2>
            Gallery Items ({items.length})
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading gallery...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <p>No gallery images yet. Upload your first event photo!</p>
          </div>
        ) : (
          <div className="events-grid">
            {items.map((item) => (
              <div
                key={item._id}
                className="event-card cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="event-card-image">
                  <img
                    src={item.imageUrl}
                    alt={item.eventName}
                    className="event-image"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>{getCategoryLabel(item.category)}</span>
                  </div>
                </div>
                <div className="event-card-header">
                  <h3 className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-orange-500" />
                    {item.eventName}
                  </h3>
                </div>
                <div className="event-card-body">
                  <div className="event-details">
                    <div className="detail-item">
                      <span className="detail-label">Event Date:</span>
                      <span>
                        <Calendar className="w-3 h-3 inline-block mr-1 text-orange-500" />
                        {formatDate(item.eventDate)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="event-card-actions">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item);
                    }}
                    className="edit-button flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(item._id);
                    }}
                    className="delete-button flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700 relative">
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 bg-black/70 rounded-full p-1.5 text-white hover:bg-black/90"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="h-80 w-full bg-black">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.eventName}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-orange-500" />
                {selectedItem.eventName}
              </h3>
              <p className="text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline-block mr-2 text-orange-500" />
                {formatDate(selectedItem.eventDate)}
              </p>
              <p className="text-gray-400 text-sm">
                Category:{" "}
                <span className="font-semibold text-orange-400">
                  {getCategoryLabel(selectedItem.category)}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full text-center border border-orange-500/30 shadow-2xl">
            <div className="mb-6">
              <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-12 w-12 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Confirm Delete</h3>
              <p className="text-gray-300">
                Are you sure you want to delete this image? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-6 py-3 rounded-xl bg-gray-800 text-white font-bold hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;

