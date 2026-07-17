import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary.js'

const ALLOWED_MIME_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif'
}

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: 'healthcare-content',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`
  })
})

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES[file.mimetype]) {
    cb(null, true)
  } else {
    cb(new Error('Only JPG, PNG, WEBP, or GIF images are allowed'))
  }
}

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})