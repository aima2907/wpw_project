import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

export default function Navbar({ searchQuery, onSearchChange }) {
  const { user } = useAuth()
  const { showToast } = useToast()

  return (
    <div className="topbar">
      <div className="search-box">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="6.5" cy="6.5" r="5" stroke="#9CA3AF" strokeWidth="1.6" />
          <path d="M11 11l2.5 2.5" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          placeholder="Search tasks or events..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="topbar-actions">
        <button className="icon-btn" title="Notifications" onClick={() => showToast('Tidak ada notifikasi baru.')}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 1.5a5 5 0 015 5c0 2.8.8 3.8 1.5 4.5H1c.7-.7 1.5-1.7 1.5-4.5a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 13a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
        <button className="icon-btn" title="Settings" onClick={() => showToast('Fitur settings segera hadir!')}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M3 3l1 1M11 11l1 1M3 12l1-1M11 4l1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="topbar-divider" />
        <div className="topbar-user">
          <div className="topbar-avatar">{getInitials(user?.name)}</div>
          <div className="topbar-user-info">
            <div className="topbar-user-name">{user?.name || 'User'}</div>
            <div className="topbar-user-plan">Pro Account</div>
          </div>
        </div>
      </div>
    </div>
  )
}
