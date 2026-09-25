import { v2 as cloudinary } from 'cloudinary'

// .trim() guards against a stray leading/trailing space in the env value
// (e.g. "CLOUDINARY_CLOUD_NAME= myname") silently breaking uploads with a
// confusing "cloud not found"-style error.
const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim()
const apiKey = process.env.CLOUDINARY_API_KEY?.trim()
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim()

if (!cloudName || !apiKey || !apiSecret) {
  console.warn('⚠️  One or more Cloudinary env vars are missing — image uploads will fail.')
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
})

export default cloudinary