export default function StatsCards({ tasks }) {
  const total   = tasks.length
  const done    = tasks.filter((t) => t.status === 'done').length
  const pending = tasks.filter((t) => t.status === 'pending').length
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <div className="stats-grid">
      <div className="stat-card blue">
        <div className="stat-icon blue">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1.5" y="1.5" width="15" height="15" rx="2" stroke="#6366F1" strokeWidth="1.5" />
            <path d="M5 9h8M5 6h5M5 12h6" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="stat-label">Total Tasks</div>
        <div className="stat-val">{total}</div>
      </div>

      <div className="stat-card green">
        <div className="stat-icon green">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7.5" stroke="#10B981" strokeWidth="1.5" />
            <path d="M5.5 9l2.5 2.5 5-5" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="stat-label">Completed</div>
        <div className="stat-val" style={{ color: 'var(--success)' }}>{pad(done)}</div>
      </div>

      <div className="stat-card amber">
        <div className="stat-icon amber">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7.5" stroke="#F59E0B" strokeWidth="1.5" />
            <path d="M9 5.5v4l2 1.5" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="stat-label">Pending</div>
        <div className="stat-val" style={{ color: 'var(--warning)' }}>{pad(pending)}</div>
      </div>

      <div className="stat-card blue">
        <div className="stat-icon blue">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2v4M9 12v4M2 9h4M12 9h4" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="9" cy="9" r="3" fill="#3B82F6"/>
          </svg>
        </div>
        <div className="stat-label">In Progress</div>
        <div className="stat-val" style={{ color: 'var(--info)' }}>{pad(inProgress)}</div>
      </div>
    </div>
  )
}