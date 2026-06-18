import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const isCloudinaryConfigured = 
  !!(process.env.CLOUDINARY_CLOUD_NAME && 
     process.env.CLOUDINARY_API_KEY && 
     process.env.CLOUDINARY_API_SECRET);

let storage;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'jay_bhagwati',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      transformation: [{ width: 800, height: 600, crop: 'limit' }]
    }
  });
  console.log('Cloudinary Storage configured successfully.');
} else {
  // Local storage fallback
  const uploadDir = './uploads/';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname).toLowerCase()}`);
    }
  });
  console.log('Cloudinary credentials missing in .env. Using local directory "./uploads/" fallback.');
}

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Format error: Only .jpg, .jpeg, .png, and .webp images are allowed!'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

export { upload, isCloudinaryConfigured };
