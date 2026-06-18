import Gallery from '../models/Gallery.js';

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
export const getGallery = async (req, res) => {
  try {
    const galleryItems = await Gallery.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: galleryItems.length, gallery: galleryItems });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload gallery item
// @route   POST /api/gallery
// @access  Private/Admin
export const createGalleryItem = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Please enter a title for the image' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    let imageUrl = req.file.path;
    if (!imageUrl.startsWith('http')) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const galleryItem = await Gallery.create({
      title,
      image: imageUrl
    });

    return res.status(201).json({ success: true, galleryItem });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
export const deleteGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    await Gallery.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
