import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function isValidEmail(email) {
  return email.indexOf('@') > 0 && email.indexOf('@') < email.length - 1
}

export default function Register() {
  const navigate = useNavigate()
  const { register, user, loading: authLoading } = useAuth()
  const { showToast } = useToast()

  const [form, setForm] = useState({ name: '', email: '', password: '', password2: '', agree: false })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Redirect jika sudah login
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, authLoading, navigate])

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((p) => ({ ...p, [key]: value }))
    setErrors((p) => ({ ...p, [key]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Nama lengkap wajib diisi.'
    if (!form.email) errs.email = 'Email wajib diisi.'
    else if (!isValidEmail(form.email)) errs.email = 'Email harus mengandung karakter @'
    if (!form.password) errs.password = 'Kata sandi wajib diisi.'
    if (form.password !== form.password2) errs.password2 = 'Kata sandi tidak cocok.'
    if (!form.agree) errs.agree = 'Setujui syarat & ketentuan terlebih dahulu.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setErrors({})
    try {
      await register(form.name.trim(), form.email, form.password)
      showToast('Akun berhasil dibuat! Silakan login.')
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal membuat akun.'
      if (msg.toLowerCase().includes('email')) {
        setErrors({ email: msg })
      } else {
        showToast(msg, 'error')
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

      <div className="auth-card wide">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <rect x="3" y="5" width="20" height="2.5" rx="1.25" fill="white" />
              <rect x="3" y="11" width="14" height="2.5" rx="1.25" fill="white" />
              <rect x="3" y="17" width="17" height="2.5" rx="1.25" fill="white" />
            </svg>
          </div>
          <div className="auth-logo-name">Tugasku</div>
          <div className="auth-logo-sub">Buat akun baru dan mulai manajemen tugas Anda hari ini!</div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input
              className={`form-input${errors.name ? ' error' : ''}`}
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={set('name')}
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className={`form-input${errors.email ? ' error' : ''}`}
              type="email"
              placeholder="nama@email.com"
              value={form.email}
              onChange={set('email')}
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Kata Sandi</label>
              <input
                className={`form-input${errors.password ? ' error' : ''}`}
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
              />
              {errors.password && <div className="field-error">{errors.password}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Konfirmasi Kata Sandi</label>
              <input
                className={`form-input${errors.password2 ? ' error' : ''}`}
                type="password"
                placeholder="••••••••"
                value={form.password2}
                onChange={set('password2')}
              />
              {errors.password2 && <div className="field-error">{errors.password2}</div>}
            </div>
          </div>

          <div className="checkbox-row">
            <input type="checkbox" id="reg-agree" checked={form.agree} onChange={set('agree')} />
            <label htmlFor="reg-agree">
              Saya setuju dengan{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); showToast('Syarat & Ketentuan akan segera hadir!') }}>
                Syarat &amp; Ketentuan
              </a>{' '}
              yang berlaku.
            </label>
          </div>
          {errors.agree && <div className="field-error" style={{ marginBottom: 12 }}>{errors.agree}</div>}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Mendaftarkan...' : 'Daftar'}
          </button>
        </form>

        <div className="auth-foot">
          Sudah memiliki akun?{' '}
          <Link to="/login">Masuk di sini</Link>
        </div>
      </div>

      <div className="auth-footer-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Help Center</a>
      </div>
    </div>
  )
}
