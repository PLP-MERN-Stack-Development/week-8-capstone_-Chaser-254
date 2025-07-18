import express from 'express'
import User from '../models/User.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// Get all users (for admin purposes)
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 })

    res.json(users)
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ message: 'Server error while fetching users' })
  }
})

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Server error while fetching user' })
  }
})

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, profilePicture } = req.body
    
    const user = await User.findById(req.user._id)
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.name = name || user.name
    user.profilePicture = profilePicture || user.profilePicture

    await user.save()

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ message: 'Server error while updating profile' })
  }
})

// Get instructors
router.get('/role/instructors', async (req, res) => {
  try {
    const instructors = await User.find({ 
      role: 'instructor', 
      isActive: true 
    })
      .select('name email profilePicture createdAt')
      .sort({ createdAt: -1 })

    res.json(instructors)
  } catch (error) {
    console.error('Get instructors error:', error)
    res.status(500).json({ message: 'Server error while fetching instructors' })
  }
})

// Get students
router.get('/role/students', async (req, res) => {
  try {
    const students = await User.find({ 
      role: 'student', 
      isActive: true 
    })
      .select('name email profilePicture createdAt')
      .sort({ createdAt: -1 })

    res.json(students)
  } catch (error) {
    console.error('Get students error:', error)
    res.status(500).json({ message: 'Server error while fetching students' })
  }
})

export default router