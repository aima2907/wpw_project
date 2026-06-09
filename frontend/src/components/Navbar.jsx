import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { checkDeadlines } from '../pages/notificationHelper'

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

export default function Navbar({ searchQuery, onSearchChange, onOpenModal, tasks = [] }) {
  const { user } = useAuth()
  const { showToast } = useToast()
  
  const [showNotificationPanel, setShowNotificationPanel] = useState(false)
  const [deadlines, setDeadlines] = useState({ today: [], tomorrow: [], thisWeek: [] })
  const [hasUnread, setHasUnread] = useState(false)

  // Cek deadline setiap tasks berubah
  useEffect(() => {
    const deadlineData = checkDeadlines(tasks)
    setDeadlines(deadlineData)
    
    const hasDeadline = deadlineData.today.length > 0 || deadlineData.tomorrow.length > 0
    setHasUnread(hasDeadline)
  }, [tasks])

  const totalNotifications = deadlines.today.length + deadlines.tomorrow.length

  const handleNotificationClick = () => {
    setShowNotificationPanel(!showNotificationPanel)
    if (hasUnread) {
      setHasUnread(false)
    }
  }

  const handleNotificationAction = (dateStr) => {
    setShowNotificationPanel(false)
    if (onOpenModal) {
      onOpenModal(dateStr)
    }
  }

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="topbar">
      <div className="search-box">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="6.5" cy="6.5" r="5" stroke="#9CA3AF" strokeWidth="1.6" />
          <path d="M11 11l2.5 2.5" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          placeholder="Cari tugas atau deskripsi..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="topbar-actions">
        {/* Tombol Notifikasi dengan Badge */}
        <div style={{ position: 'relative' }}>
          <button 
            className="icon-btn" 
            title="Notifikasi Deadline" 
            onClick={handleNotificationClick}
            style={{ position: 'relative' }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.5 1.5a5 5 0 015 5c0 2.8.8 3.8 1.5 4.5H1c.7-.7 1.5-1.7 1.5-4.5a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M6 13a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            {hasUnread && totalNotifications > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--danger)',
                color: 'white',
                fontSize: '10px',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {totalNotifications > 9 ? '9+' : totalNotifications}
              </span>
            )}
          </button>

          {/* Panel Notifikasi Dropdown */}
          {showNotificationPanel && (
            <div style={{
              position: 'absolute',
              top: '40px',
              right: '0',
              width: '320px',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              zIndex: 1000,
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '12px 16px',
                background: 'var(--primary)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '13px'
              }}>
                🔔 Notifikasi Deadline
              </div>
              
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {/* Deadline Hari Ini */}
                {deadlines.today.length > 0 && (
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--danger)', marginBottom: '8px' }}>
                      ⚠️ HARI INI - {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                    </div>
                    {deadlines.today.map(task => (
                      <div 
                        key={task.id}
                        onClick={() => handleNotificationAction(task.deadline)}
                        style={{
                          padding: '8px',
                          marginBottom: '4px',
                          background: '#FEE2E2',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#FECACA'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#FEE2E2'}
                      >
                        <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{task.title}</div>
                        <div style={{ fontSize: '10px', color: 'var(--danger)' }}>
                          📅 Deadline hari ini!
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Deadline Besok */}
                {deadlines.tomorrow.length > 0 && (
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--warning)', marginBottom: '8px' }}>
                      📅 BESOK - {new Date(Date.now() + 86400000).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                    </div>
                    {deadlines.tomorrow.map(task => (
                      <div 
                        key={task.id}
                        onClick={() => handleNotificationAction(task.deadline)}
                        style={{
                          padding: '8px',
                          marginBottom: '4px',
                          background: '#FEF3C7',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#FDE68A'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#FEF3C7'}
                      >
                        <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{task.title}</div>
                        <div style={{ fontSize: '10px', color: 'var(--warning)' }}>
                          📅 Deadline besok, {formatDateForDisplay(task.deadline)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Deadline Minggu Ini */}
                {deadlines.thisWeek.length > 0 && (
                  <div style={{ padding: '8px 12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--info)', marginBottom: '8px' }}>
                      📋 MINGGU INI ({deadlines.thisWeek.length} tugas)
                    </div>
                    {deadlines.thisWeek.slice(0, 3).map(task => (
                      <div 
                        key={task.id}
                        onClick={() => handleNotificationAction(task.deadline)}
                        style={{
                          padding: '6px 8px',
                          marginBottom: '4px',
                          background: '#DBEAFE',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '11px'
                        }}
                      >
                        <span style={{ fontWeight: 'bold' }}>{task.title}</span>
                        <span style={{ color: 'var(--info)', marginLeft: '8px' }}>
                          {formatDateForDisplay(task.deadline)}
                        </span>
                      </div>
                    ))}
                    {deadlines.thisWeek.length > 3 && (
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', padding: '8px' }}>
                        +{deadlines.thisWeek.length - 3} tugas lainnya
                      </div>
                    )}
                  </div>
                )}

                {deadlines.today.length === 0 && deadlines.tomorrow.length === 0 && deadlines.thisWeek.length === 0 && (
                  <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p style={{ marginTop: '8px', fontSize: '12px' }}>Tidak ada deadline mendekat</p>
                  </div>
                )}
              </div>

              <div style={{
                padding: '10px 16px',
                borderTop: '1px solid #e5e7eb',
                background: '#f9fafb',
                fontSize: '11px',
                textAlign: 'center'
              }}>
                <button 
                  onClick={() => setShowNotificationPanel(false)}
                  style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tombol Settings */}
        <button className="icon-btn" title="Settings" onClick={() => showToast('Fitur settings segera hadir!')}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M3 3l1 1M11 11l1 1M3 12l1-1M11 4l1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="topbar-divider" />
        
        {/* User Profile */}
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