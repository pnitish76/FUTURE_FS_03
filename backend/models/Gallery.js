import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, 'Gallery image path is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  }
}, {
  timestamps: true
});

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;
