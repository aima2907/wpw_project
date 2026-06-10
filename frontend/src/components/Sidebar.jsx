import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

export default function Sidebar({ tasks, onOpenModal }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { showToast } = useToast()

  const pending = tasks.filter((t) => t.status !== 'done').length

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg viewBox="0 0 17 17" fill="currentColor">
          <rect x="1" y="1" width="6.5" height="6.5" rx="1.5" />
          <rect x="9.5" y="1" width="6.5" height="6.5" rx="1.5" />
          <rect x="1" y="9.5" width="6.5" height="6.5" rx="1.5" />
          <rect x="9.5" y="9.5" width="6.5" height="6.5" rx="1.5" />
        </svg>
      ),
    },
    {
      path: '/tasks',
      label: 'My Tasks',
      badge: pending,
      icon: (
        <svg viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1.5" y="1.5" width="14" height="14" rx="2" />
          <path d="M5 8.5l2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      path: '/calendar',
      label: 'Calendar',
      icon: (
        <svg viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1.5" y="2.5" width="14" height="13" rx="2" />
          <path d="M5.5 1v3M11.5 1v3M1.5 7.5h14" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      path: '/history',
      label: 'History',
      icon: (
        <svg viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="8.5" cy="8.5" r="7" />
          <path d="M8.5 5v4l2.5 1.5" strokeLinecap="round" />
        </svg>
      ),
    },
  ]

  const handleLogout = () => {
    logout()
    showToast('Berhasil logout.')
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-wrap">
          <div className="logo-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="3" width="14" height="2" rx="1" fill="white" />
              <rect x="2" y="8" width="10" height="2" rx="1" fill="white" />
              <rect x="2" y="13" width="12" height="2" rx="1" fill="white" />
            </svg>
          </div>
          <div>
            <div className="logo-text-name">Tugasku</div>
            <div className="logo-text-sub">Manajemen Tugas</div>
          </div>
        </div>
        <button className="btn-create" onClick={onOpenModal}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1v11M1 6.5h11" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          Create New Task
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Menu Utama</div>
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`nav-item${location.pathname === item.path ? ' active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            {item.label}
            {item.badge > 0 && <span className="badge-count">{item.badge}</span>}
          </button>
        ))}

        <div className="nav-section-label" style={{ marginTop: 18 }}>Pengaturan</div>
        <button className="nav-item" onClick={() => showToast('Fitur settings segera hadir!')}>
          <svg viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8.5" cy="8.5" r="2.5" />
            <path d="M8.5 1.5v2M8.5 13.5v2M1.5 8.5h2M13.5 8.5h2M3.5 3.5l1.5 1.5M12 12l1.5 1.5M3.5 13.5L5 12M12 5l1.5-1.5" strokeLinecap="round" />
          </svg>
          Settings
        </button>
        <button className="nav-item" onClick={handleLogout}>
          <svg viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 3H3a2 2 0 00-2 2v7a2 2 0 002 2h4M11 12l4-3.5L11 5M15 8.5H6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Logout
        </button>
      </nav>

      <div className="sidebar-bottom">
        <div className="user-row">
          <div className="user-avatar">{getInitials(user?.name)}</div>
          <div>
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-role">Pro Account</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
