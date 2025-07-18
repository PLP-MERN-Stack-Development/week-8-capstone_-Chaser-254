import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { BookOpen, Plus, Video, FileText, Upload, LogOut, User, Trash2, Edit, Home, Book, Folder, ClipboardList, Award, MessageCircle } from 'lucide-react'
import { getContent, uploadContent, deleteContent, updateContent } from '../../services/api'
import { Link, useParams } from 'react-router-dom'

interface Content {
  _id: string
  title: string
  description: string
  type: 'video' | 'document'
  section: string
  fileUrl: string
  instructor: {
    name: string
    email: string
  }
  createdAt: string
}

const sectionLinks = [
  { name: 'Home', icon: <Home className="h-5 w-5 mr-2" /> },
  { name: 'My Courses', icon: <Book className="h-5 w-5 mr-2" /> },
  { name: 'Resources', icon: <Folder className="h-5 w-5 mr-2" /> },
  { name: 'Assignments', icon: <ClipboardList className="h-5 w-5 mr-2" /> },
  { name: 'Certificates', icon: <Award className="h-5 w-5 mr-2" /> },
  { name: 'Feedback', icon: <MessageCircle className="h-5 w-5 mr-2" /> },
]

export default function InstructorDashboard() {
  const { user, logout } = useAuth()
  const { section = 'Home' } = useParams<{ section: string }>()
  const [content, setContent] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    type: 'video' as 'video' | 'document',
    section: section || 'Home',
    file: null as File | null
  })
  const [uploading, setUploading] = useState(false)

  // Edit state
  const [editingContent, setEditingContent] = useState<Content | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    type: 'video' as 'video' | 'document'
  })

  useEffect(() => {
    loadContent()
    // Reset upload form section when route changes
    setUploadForm(f => ({ ...f, section: section || 'Home' }))
    // eslint-disable-next-line
  }, [section])

  const loadContent = async () => {
    try {
      const data = await getContent()
      // Filter content by current instructor and section
      const instructorContent = data.filter(
        (item: Content) =>
          item.instructor.email === user?.email &&
          item.section === (section || 'Home')
      )
      setContent(instructorContent)
    } catch (error) {
      console.error('Error loading content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadForm.file) return

    setUploading(true)
    try {
      await uploadContent(uploadForm)
      setShowUploadModal(false)
      setUploadForm({
        title: '',
        description: '',
        type: 'video',
        section: section || 'Home',
        file: null
      })
      loadContent()
    } catch (error) {
      console.error('Error uploading content:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (contentId: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await deleteContent(contentId)
        loadContent()
      } catch (error) {
        console.error('Error deleting content:', error)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadForm({ ...uploadForm, file })
    }
  }

  // Edit handlers
  const handleEdit = (item: Content) => {
    setEditingContent(item)
    setEditForm({
      title: item.title,
      description: item.description,
      type: item.type
    })
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingContent) return
    try {
      await updateContent(editingContent._id, editForm)
      setEditingContent(null)
      loadContent()
    } catch (error) {
      console.error('Error updating content:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col py-8 px-4">
        <div className="flex items-center mb-10">
          <BookOpen className="h-8 w-8 text-primary-600" />
          <span className="ml-2 text-2xl font-bold text-gray-900">Jifunze</span>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {sectionLinks.map(link => (
              <li key={link.name}>
                <Link
                  to={`/instructor/${link.name}`}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-left transition ${
                    (section || 'Home') === link.name
                      ? 'bg-primary-100 text-primary-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-10 flex items-center space-x-2">
          <User className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-700">{user?.name}</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mt-4"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
            <p className="text-gray-600 mt-2">Manage your learning content and engage with students</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Upload Content</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Content</p>
                <p className="text-2xl font-bold text-gray-900">{content.length}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="bg-secondary-100 p-3 rounded-lg">
                <Video className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Videos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {content.filter(item => item.type === 'video').length}
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Documents</p>
                <p className="text-2xl font-bold text-gray-900">
                  {content.filter(item => item.type === 'document').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content List */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">{section} Content</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : content.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No content uploaded yet</h3>
              <p className="text-gray-600 mb-4">Start by uploading your first video or document.</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-primary"
              >
                Upload Content
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {content.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.type === 'video' ? (
                            <Video className="h-5 w-5 text-primary-600 mr-3" />
                          ) : (
                            <FileText className="h-5 w-5 text-secondary-600 mr-3" />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.title}</div>
                            <div className="text-sm text-gray-500">{item.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 capitalize">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-900 ml-2"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Upload Content</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section
                </label>
                <select
                  value={uploadForm.section}
                  onChange={e => setUploadForm({ ...uploadForm, section: e.target.value })}
                  className="input-field"
                  required
                >
                  {sectionLinks.map(link => (
                    <option key={link.name} value={link.name}>{link.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="video"
                      checked={uploadForm.type === 'video'}
                      onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value as 'video' | 'document' })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Video</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="document"
                      checked={uploadForm.type === 'document'}
                      onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value as 'video' | 'document' })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Document</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="input-field"
                  placeholder="Enter content title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  required
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Enter content description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File
                </label>
                <input
                  type="file"
                  required
                  onChange={handleFileChange}
                  className="input-field"
                  accept={uploadForm.type === 'video' ? 'video/*' : '.pdf,.doc,.docx,.txt'}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Edit Content</h2>
              <button onClick={() => setEditingContent(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  required
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  className="input-field"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={editForm.type}
                  onChange={e => setEditForm({ ...editForm, type: e.target.value as 'video' | 'document' })}
                  className="input-field"
                >
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setEditingContent(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}