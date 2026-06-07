export default function StatsCards({ tasks }) {
  const total   = tasks.length
  const done    = tasks.filter((t) => t.status === 'done').length
  const pending = tasks.filter((t) => t.status !== 'done').length
  const urgent  = tasks.filter((t) => t.priority === 'high' && t.status !== 'done').length

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

      <div className="stat-card red">
        <div className="stat-icon red">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7.5" stroke="#EF4444" strokeWidth="1.5" />
            <path d="M9 5.5v4M9 12.5v.5" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <div className="stat-label">Urgent</div>
        <div className="stat-val" style={{ color: 'var(--danger)' }}>{pad(urgent)}</div>
      </div>
    </div>
  )
}
