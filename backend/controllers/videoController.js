import Video from '../models/Video.js';

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: videos.length,
      videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve videos',
      error: error.message
    });
  }
};

// @desc    Create a new video entry
// @route   POST /api/videos
// @access  Private/Admin
export const createVideo = async (req, res) => {
  try {
    const { id, title, description, duration, type, platform } = req.body;

    if (!id || !title || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide video ID, title, and type.'
      });
    }

    // Check if video already exists
    const exists = await Video.findOne({ id });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'This video is already in the gallery.'
      });
    }

    const video = await Video.create({
      id,
      title,
      description,
      duration,
      type,
      platform: platform || 'youtube'
    });

    res.status(201).json({
      success: true,
      video
    });
  } catch (error) {
    res.status(550).json({
      success: false,
      message: 'Failed to add video entry',
      error: error.message
    });
  }
};

// @desc    Delete a video entry
// @route   DELETE /api/videos/:id
// @access  Private/Admin
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    await video.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Video removed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete video',
      error: error.message
    });
  }
};
