import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function isValidEmail(email) {
  return email.indexOf('@') > 0 && email.indexOf('@') < email.length - 1
}

export default function Login() {
  const navigate = useNavigate()
  const { login, user, loading: authLoading } = useAuth()
  const { showToast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Jika sudah login, jangan tampilkan halaman ini, langsung ke dashboard
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, authLoading, navigate])

  const validate = () => {
    const errs = {}
    if (!email) errs.email = 'Email wajib diisi'
    else if (!isValidEmail(email)) errs.email = 'Format email tidak valid'
    if (!password) errs.password = 'Password wajib diisi'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const user = await login(email, password)

      showToast(`Selamat datang kembali, ${user.name || user.email}!`)

      navigate('/dashboard')

    } catch (err) {
      const msg = err.response?.data?.message || 'Email atau password salah.'

      if (msg.toLowerCase().includes('email')) {
        setErrors({ email: msg })
      } else {
        setErrors({ password: msg })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-bg-circles">
        <span /><span /><span />
      </div>

      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <rect x="3" y="5" width="20" height="2.5" rx="1.25" fill="white" />
              <rect x="3" y="11" width="14" height="2.5" rx="1.25" fill="white" />
              <rect x="3" y="17" width="17" height="2.5" rx="1.25" fill="white" />
            </svg>
          </div>
          <div className="auth-logo-name">Tugasku</div>
          <div className="auth-logo-sub">Masuk untuk mengelola tugas harian Anda.</div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className={`form-input${errors.email ? ' error' : ''}`}
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Kata Sandi</label>
            <input
              className={`form-input${errors.password ? ' error' : ''}`}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
            />
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Masuk...' : 'Login'}
          </button>
        </form>

        <div className="auth-foot">
          Belum punya akun?{' '}
          <Link to="/register">Daftar sekarang</Link>
        </div>
      </div>
    </div>
  )
}