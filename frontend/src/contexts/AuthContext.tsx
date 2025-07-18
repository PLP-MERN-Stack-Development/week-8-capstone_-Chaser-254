import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { loginUser, registerUser } from '../services/api'

interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'instructor'
  token?: string // <-- add token property
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: 'student' | 'instructor') => Promise<void>
  register: (email: string, password: string, name: string, role: 'student' | 'instructor') => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('jifunze_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string, role: 'student' | 'instructor') => {
    // Call backend API
    const data = await loginUser(email, password, role)
    // data should contain user info and token
    const userData: User = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role,
      token: data.token
    }
    setUser(userData)
    localStorage.setItem('jifunze_user', JSON.stringify(userData))
  }

  const register = async (email: string, password: string, name: string, role: 'student' | 'instructor') => {
    // Call backend API
    const data = await registerUser(email, password, name, role)
    // data should contain user info and token
    const userData: User = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role,
      token: data.token
    }
    setUser(userData)
    localStorage.setItem('jifunze_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('jifunze_user')
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}