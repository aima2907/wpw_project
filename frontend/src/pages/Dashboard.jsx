import { useNavigate } from 'react-router-dom'
import StatsCards from '../components/StatsCards'

const WEEK_DATA = [
  { day: 'MON', pct: 55 },
  { day: 'TUE', pct: 82 },
  { day: 'WED', pct: 65 },
  { day: 'THU', pct: 92 },
  { day: 'FRI', pct: 48 },
  { day: 'SAT', pct: 22, pending: true },
  { day: 'SUN', pct: 10, pending: true },
]

export default function Dashboard({ tasks, onOpenModal, searchQuery }) {
  const navigate = useNavigate()

  // Gunakan waktu lokal untuk membandingkan tanggal, bukan UTC ISO string
  const todayStr = new Date().toLocaleDateString('en-CA') 
  
  const todayTasks = tasks.filter((t) => {
    const isToday = t.date === todayStr && t.status !== 'done'
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase())
    return isToday && matchesSearch
  })

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard Overview</div>
          <div className="page-sub">Selamat Datang. Selamat Mengerjakan!</div>
        </div>
      </div>

      <StatsCards tasks={tasks} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <rect x="1" y="1" width="13" height="13" rx="2" stroke="#6366F1" strokeWidth="1.5" />
                <path d="M4 7.5h7M4 5h5" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Tasks Due Today
            </div>
            <button className="card-link" onClick={() => navigate('/calendar')}>
              View all schedule →
            </button>
          </div>

          {todayTasks.length === 0 ? (
            <div className="empty-state" style={{ padding: '20px 0' }}>
              Tidak ada tugas yang jatuh tempo hari ini 🎉
            </div>
          ) : (
            todayTasks.slice(0, 4).map((t) => {
              const PRIO_BADGE = { high: 'badge-red', medium: 'badge-blue', low: 'badge-gray' }
              const STATUS_BADGE = { pending: 'badge-gray', 'in-progress': 'badge-indigo', done: 'badge-green' }
              const STATUS_LABEL = { pending: 'BACKLOG', 'in-progress': 'IN PROGRESS', done: 'DONE' }
              return (
                <div className="task-item" key={t.id}>
                  <div className="task-item-top">
                    <div>
                      <div className="task-item-name">{t.name}</div>
                      <div className="task-item-desc">{t.description}</div>
                    </div>
                    <span className={`badge ${STATUS_BADGE[t.status] || 'badge-gray'}`}>
                      {STATUS_LABEL[t.status] || t.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="task-item-meta">
                    <span className={`badge ${PRIO_BADGE[t.priority] || 'badge-gray'}`}>
                      {t.priority?.toUpperCase()}
                    </span>
                    {t.category === 'Kuliah' && t.subject && (
                      <span className="badge badge-teal2">{t.subject}</span>
                    )}
                    {t.category && t.category !== 'Kuliah' && (
                      <span className="badge badge-indigo">{t.category}</span>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            Productivity Flow
            <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-muted)' }}>
              Weekly progress vs targets
            </span>
          </div>
          <div className="chart-legend">
            <div className="chart-legend-item">
              <div className="chart-legend-dot" style={{ background: 'var(--accent)' }} />
              Completed
            </div>
            <div className="chart-legend-item">
              <div className="chart-legend-dot" style={{ background: '#E0E7FF' }} />
              Goal
            </div>
          </div>
        </div>
        <div className="bar-chart">
          {WEEK_DATA.map((d) => (
            <div className="bar-col" key={d.day}>
              <div
                className="bar"
                style={{
                  height: `${d.pct}%`,
                  background: d.pending ? '#E0E7FF' : 'var(--accent)',
                }}
              />
              <div className="bar-label">{d.day}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
