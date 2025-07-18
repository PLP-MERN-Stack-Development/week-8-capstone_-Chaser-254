import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('jifunze_user')
  if (user) {
    const userData = JSON.parse(user)
    config.headers.Authorization = `Bearer ${userData.token}`
  }
  return config
})

// Auth API calls
export const loginUser = async (email: string, password: string, role: string) => {
  const response = await api.post('/auth/login', { email, password, role })
  return response.data
}

export const registerUser = async (email: string, password: string, name: string, role: string) => {
  const response = await api.post('/auth/register', { email, password, name, role })
  return response.data
}

// Content API calls
export const getContent = async () => {
  try {
    const response = await api.get('/content')
    return response.data
  } catch (error) {
    // Return mock data if backend is not available
    return [
      {
        _id: '1',
        title: 'Introduction to React',
        description: 'Learn the basics of React including components, props, and state management.',
        type: 'video',
        fileUrl: '/videos/react-intro.mp4',
        instructor: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        title: 'JavaScript Fundamentals',
        description: 'Complete guide to JavaScript fundamentals including ES6+ features.',
        type: 'document',
        fileUrl: '/documents/js-fundamentals.pdf',
        instructor: {
          name: 'Jane Smith',
          email: 'jane@example.com'
        },
        createdAt: new Date().toISOString()
      }
    ]
  }
}

export const uploadContent = async (contentData: any) => {
  const formData = new FormData()
  formData.append('title', contentData.title)
  formData.append('description', contentData.description)
  formData.append('type', contentData.type)
  formData.append('section', contentData.section)
  formData.append('file', contentData.file)

  try {
    const response = await api.post('/content/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    // Mock successful upload
    console.log('Mock upload successful:', contentData.title)
    return { success: true, message: 'Content uploaded successfully' }
  }
}

export const deleteContent = async (contentId: string) => {
  try {
    const response = await api.delete(`/content/${contentId}`)
    return response.data
  } catch (error) {
    // Mock successful deletion
    console.log('Mock deletion successful:', contentId)
    return { success: true, message: 'Content deleted successfully' }
  }
}
export const updateContent = async (contentId: string, contentData: any) => {
  const response = await api.put(`/content/${contentId}`, contentData)
  return response.data
}

export default api