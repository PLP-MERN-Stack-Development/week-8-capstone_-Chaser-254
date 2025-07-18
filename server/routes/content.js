import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import Content from '../models/Content.js'
import User from '../models/User.js'
import auth, { requireInstructor } from '../middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  // Allow videos and documents
  const allowedTypes = [
    'video/mp4', 'video/avi', 'video/mov', 'video/wmv',
    'application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only videos and documents are allowed.'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
})

// Get all content
router.get('/', async (req, res) => {
  try {
    const content = await Content.find({ isActive: true })
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 })

    res.json(content)
  } catch (error) {
    console.error('Get content error:', error)
    res.status(500).json({ message: 'Server error while fetching content' })
  }
})

// Get content by instructor
router.get('/instructor/:instructorId', async (req, res) => {
  try {
    const content = await Content.find({ 
      instructor: req.params.instructorId,
      isActive: true 
    })
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 })

    res.json(content)
  } catch (error) {
    console.error('Get instructor content error:', error)
    res.status(500).json({ message: 'Server error while fetching instructor content' })
  }
})

// Upload content (instructors only)
// ...existing code...

// Upload content (instructors only)
router.post('/upload', auth, requireInstructor, upload.single('file'), async (req, res) => {
  try {
    const { title, description, type, section } = req.body // <-- add section

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    // Validate content type
    if (!['video', 'document'].includes(type)) {
      return res.status(400).json({ message: 'Invalid content type' })
    }

    // Validate section
    if (!section) {
      return res.status(400).json({ message: 'Section is required' })
    }

    const content = new Content({
      title,
      description,
      type,
      section, // <-- save section
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      instructor: req.user._id
    })

    await content.save()
    await content.populate('instructor', 'name email')

    res.status(201).json({
      message: 'Content uploaded successfully',
      content
    })
  } catch (error) {
    console.error('Upload content error:', error)
    res.status(500).json({ message: 'Server error while uploading content' })
  }
})
// Update content (instructors only, own content)
router.put('/:id', auth, requireInstructor, async (req, res) => {
  try {
    const { title, description, tags } = req.body
    
    const content = await Content.findOne({
      _id: req.params.id,
      instructor: req.user._id
    })

    if (!content) {
      return res.status(404).json({ message: 'Content not found or unauthorized' })
    }

    content.title = title || content.title
    content.description = description || content.description
    content.tags = tags || content.tags

    await content.save()
    await content.populate('instructor', 'name email')

    res.json({
      message: 'Content updated successfully',
      content
    })
  } catch (error) {
    console.error('Update content error:', error)
    res.status(500).json({ message: 'Server error while updating content' })
  }
})

// Delete content (instructors only, own content)
router.delete('/:id', auth, requireInstructor, async (req, res) => {
  try {
    const content = await Content.findOne({
      _id: req.params.id,
      instructor: req.user._id
    })

    if (!content) {
      return res.status(404).json({ message: 'Content not found or unauthorized' })
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '..', content.fileUrl)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    await Content.findByIdAndDelete(req.params.id)

    res.json({ message: 'Content deleted successfully' })
  } catch (error) {
    console.error('Delete content error:', error)
    res.status(500).json({ message: 'Server error while deleting content' })
  }
})

// Increment view count
router.post('/:id/view', async (req, res) => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )

    if (!content) {
      return res.status(404).json({ message: 'Content not found' })
    }

    res.json({ message: 'View count updated', views: content.views })
  } catch (error) {
    console.error('Update view count error:', error)
    res.status(500).json({ message: 'Server error while updating view count' })
  }
})

export default router