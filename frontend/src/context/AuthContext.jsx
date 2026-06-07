import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore user dari localStorage
    useEffect(() => {
    const token = localStorage.getItem('tugasku_token')
    const storedUser = localStorage.getItem('tugasku_user')

    if (!token || !storedUser) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      setUser(JSON.parse(storedUser))
    } catch {
      localStorage.clear()
      setUser(null)
    }

    setLoading(false)
  }, [])

  // LOGIN
  const login = async (email, password) => {
    const res = await authAPI.login({ email, password })

    const { token, user: userData } = res.data

    // 🔥 normalize data biar konsisten
    const safeUser = {
      id: userData.id,
      name: userData.username, // FIX penting
      email: userData.email
    }

    localStorage.setItem('tugasku_token', token)
    localStorage.setItem('tugasku_user', JSON.stringify(safeUser))

    setUser(safeUser)

    return safeUser
  }

  // REGISTER
  const register = async (name, email, password) => {
    return await authAPI.register({ name, email, password })
  }

  // LOGOUT
  const logout = () => {
    localStorage.removeItem('tugasku_token')
    localStorage.removeItem('tugasku_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}