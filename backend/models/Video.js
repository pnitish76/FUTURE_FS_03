import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'YouTube video ID is required'],
    trim: true,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    default: '0:30',
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Video type is required'],
    enum: ['demo', 'short'],
    default: 'short'
  },
  platform: {
    type: String,
    enum: ['youtube', 'facebook'],
    default: 'youtube'
  }
}, {
  timestamps: true
});

const Video = mongoose.model('Video', videoSchema);
export default Video;
