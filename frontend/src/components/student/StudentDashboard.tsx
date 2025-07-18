import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { BookOpen, Video, FileText, Download, Play, LogOut, User, Home, Book, Folder, ClipboardList, Award, MessageCircle } from 'lucide-react'
import { getContent } from '../../services/api'
import { Line } from 'react-chartjs-2'
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js'
Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend)

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

const sidebarLinks = [
  { name: 'Home', icon: <Home className="h-5 w-5 mr-2" /> },
  { name: 'My Courses', icon: <Book className="h-5 w-5 mr-2" /> },
  { name: 'Resources', icon: <Folder className="h-5 w-5 mr-2" /> },
  { name: 'Assignments', icon: <ClipboardList className="h-5 w-5 mr-2" /> },
  { name: 'Certificates', icon: <Award className="h-5 w-5 mr-2" /> },
  { name: 'Feedback', icon: <MessageCircle className="h-5 w-5 mr-2" /> },
]

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const [content, setContent] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)
  const [activeSection, setActiveSection] = useState('Home')
  const [viewedContentIds, setViewedContentIds] = useState<string[]>([])

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const data = await getContent()
      setContent(data)
    } catch (error) {
      console.error('Error loading content:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mark content as viewed when opened
  const handleContentClick = (item: Content) => {
    setSelectedContent(item)
    if (activeSection === 'Home' && !viewedContentIds.includes(item._id)) {
      setViewedContentIds(prev => [...prev, item._id])
    }
  }

  const closeModal = () => {
    setSelectedContent(null)
  }

  // Filter content by section
  const filteredContent = content.filter(item => item.section === activeSection)

  // Progress calculation for Home section
  const homeContent = content.filter(item => item.section === 'Home')
  const viewedCount = homeContent.filter(item => viewedContentIds.includes(item._id)).length
  const progress = homeContent.length > 0 ? Math.round((viewedCount / homeContent.length) * 100) : 0

  // Chart data for Home section (line chart)
  const lineData = {
    labels: homeContent.map((_item, idx) => `Item ${idx + 1}`),
    datasets: [
      {
        label: 'Viewed',
        data: homeContent.map(item => viewedContentIds.includes(item._id) ? 1 : 0),
        fill: false,
        borderColor: '#2563eb',
        backgroundColor: '#2563eb',
        tension: 0.3,
        pointRadius: 6,
        pointBackgroundColor: homeContent.map(item => viewedContentIds.includes(item._id) ? '#2563eb' : '#e5e7eb'),
      },
    ],
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
            {sidebarLinks.map(link => (
              <li key={link.name}>
                <button
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-left transition ${
                    activeSection === link.name
                      ? 'bg-primary-100 text-primary-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveSection(link.name)}
                >
                  {link.icon}
                  {link.name}
                </button>
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
      <main className="flex-1 px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Explore the latest learning materials from your instructors</p>
        </div>

        {/* Progress Line Chart for Home section */}
        {activeSection === 'Home' && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Progress</h2>
            <div className="w-full max-w-lg mx-auto">
              <Line
                data={lineData}
                options={{
                  scales: {
                    y: {
                      min: 0,
                      max: 1,
                      ticks: {
                        stepSize: 1,
                        callback: (value) => value === 1 ? 'Viewed' : 'Not Viewed'
                      }
                    }
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
                  },
                }}
              />
              <div className="text-center mt-2 text-sm text-gray-600">
                {viewedCount} of {homeContent.length} items viewed ({progress}%)
              </div>
            </div>
          </div>
        )}

        {/* Show content for the active section */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No content available</h3>
                <p className="text-gray-600">Check back later for new learning materials from your instructors.</p>
              </div>
            ) : (
              filteredContent.map((item) => (
                <div
                  key={item._id}
                  className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleContentClick(item)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {item.type === 'video' ? (
                        <Video className="h-6 w-6 text-primary-600" />
                      ) : (
                        <FileText className="h-6 w-6 text-secondary-600" />
                      )}
                      <span className="ml-2 text-sm font-medium text-gray-600 capitalize">
                        {item.type}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      By {item.instructor.name}
                    </div>
                    <div className="flex items-center text-primary-600">
                      {item.type === 'video' ? (
                        <Play className="h-4 w-4" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Content Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{selectedContent.title}</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mt-2">By {selectedContent.instructor.name}</p>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-6">{selectedContent.description}</p>
              
              {selectedContent.type === 'video' ? (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Video player would be implemented here</p>
                    <p className="text-sm text-gray-500 mt-2">File: {selectedContent.fileUrl}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Document viewer would be implemented here</p>
                  <a
                    href={selectedContent.fileUrl}
                    download
                    className="btn-primary inline-flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Document
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}