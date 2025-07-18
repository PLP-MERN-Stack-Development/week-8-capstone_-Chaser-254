import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/AuthContext'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import StudentDashboard from './components/student/StudentDashboard'
import InstructorDashboard from './components/instructor/InstructorDashboard'
import LandingPage from './components/LandingPage'

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'student' ? '/student' : '/instructor'} />
  }
  
  return <>{children}</>
}

function AppRoutes() {
  const { user } = useAuth()
  
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'student' ? '/student/Home' : '/instructor/Home'} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={user.role === 'student' ? '/student/Home' : '/instructor/Home'} /> : <Register />} />
      <Route 
        path="/student/:section?" 
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/instructor/:section?" 
        element={
          <ProtectedRoute requiredRole="instructor">
            <InstructorDashboard />
          </ProtectedRoute>
        } 
      />
      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to={user?.role === 'student' ? '/student/Home' : '/instructor/Home'} />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App