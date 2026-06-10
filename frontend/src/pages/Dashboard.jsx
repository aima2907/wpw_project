// pages/DashboardPage.jsx
import { useNavigate } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'
import { useMemo } from 'react'
import StatsCards from '../components/StatsCards'

export default function Dashboard() {
  const navigate = useNavigate()
  
  const {
    tasks = [],
    onOpenModal,
    searchQuery = ''
  } = useOutletContext()

  // Fungsi untuk bandingkan tanggal
  const isToday = (deadlineStr) => {
    if (!deadlineStr) return false
    const deadlineDate = new Date(deadlineStr)
    const todayDate = new Date()
    return (
      deadlineDate.getFullYear() === todayDate.getFullYear() &&
      deadlineDate.getMonth() === todayDate.getMonth() &&
      deadlineDate.getDate() === todayDate.getDate()
    )
  }
  
  // Tugas hari ini (deadline hari ini DAN belum selesai)
  const todayTasks = tasks.filter((t) => {
    const isDeadlineToday = isToday(t.deadline)
    const notDone = t.status !== 'done'
    return isDeadlineToday && notDone
  })

  // Statistik untuk chart
  const completedCount = tasks.filter(t => t.status === 'done').length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

  // ========== PRODUKTIVITAS MINGGUAN ==========
  // Dibungkus useMemo supaya hanya menghitung ulang jika array `tasks` benar-benar berubah
  const weeklyData = useMemo(() => {
    const today = new Date()
    const daysOfWeek = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB']
    const weekData = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const dateStr = date.toLocaleDateString('en-CA')
      const dayName = daysOfWeek[date.getDay()]
      
      const tasksCompletedOnDay = tasks.filter(t => {
        if (t.status !== 'done') return false
        const taskDate = new Date(t.deadline)
        taskDate.setHours(0, 0, 0, 0)
        return taskDate.getTime() === date.getTime()
      }).length
      
      const totalTasksCount = tasks.length
      const targetPerDay = totalTasksCount > 0 ? Math.ceil(totalTasksCount / 7) : 5
      const pct = tasksCompletedOnDay > 0 ? Math.min(Math.round((tasksCompletedOnDay / targetPerDay) * 100), 100) : 0
      
      weekData.push({
        day: dayName,
        pct: pct,
        completed: tasksCompletedOnDay,
        target: targetPerDay,
        isToday: i === 0,
        fullDate: dateStr
      })
    }
    
    return weekData
  }, [tasks]) // <--- Dependency array: kalkulasi ulang HANYA saat tasks berubah


  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard Overview</div>
          <div className="page-sub">Selamat Datang. Selamat Mengerjakan!</div>
        </div>
        <button className="btn-create" onClick={onOpenModal} style={{ width: 'auto', padding: '10px 18px' }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1v11M1 6.5h11" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          Tambah Tugas
        </button>
      </div>

      {/* Stats Cards */}
      <StatsCards tasks={tasks} />

      {/* Tasks Due Today Section */}
      <div style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <rect x="1" y="1" width="13" height="13" rx="2" stroke="#6366F1" strokeWidth="1.5" />
                <path d="M4 7.5h7M4 5h5" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Tugas Hari Ini - {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <button className="card-link" onClick={() => navigate('/tasks')}>
              Lihat semua tugas →
            </button>
          </div>

          {todayTasks.length === 0 ? (
            <div className="empty-state" style={{ padding: '20px 0' }}>
              🎉 Tidak ada tugas yang jatuh tempo hari ini
            </div>
          ) : (
            todayTasks.map((t) => {
              const STATUS_BADGE = { 
                pending: 'badge-warning', 
                'in-progress': 'badge-info', 
                done: 'badge-success' 
              }
              const STATUS_LABEL = { 
                pending: 'PENDING', 
                'in-progress': 'IN PROGRESS', 
                done: 'SELESAI' 
              }
              return (
                <div 
                  className="task-item" 
                  key={t.id} 
                  onClick={() => navigate('/tasks')} 
                  style={{ cursor: 'pointer' }}
                >
                  <div className="task-item-top">
                    <div>
                      <div className="task-item-name">{t.title || 'Untitled'}</div>
                      {t.description && (
                        <div className="task-item-desc">{t.description}</div>
                      )}
                    </div>
                    <span className={`badge ${STATUS_BADGE[t.status] || 'badge-gray'}`}>
                      {STATUS_LABEL[t.status] || t.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                  <div className="task-item-meta">
                    {t.category && (
                      <span className="badge badge-indigo">{t.category}</span>
                    )}
                    <span className="time-chip">
                      📅 Deadline: {new Date(t.deadline).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'long',
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Productivity Chart */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            📊 Produktivitas Mingguan
            <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 8 }}>
              Tugas yang diselesaikan per hari
            </span>
          </div>
          <div className="chart-legend">
            <div className="chart-legend-item">
              <div className="chart-legend-dot" style={{ background: 'var(--accent)' }} />
              Selesai
            </div>
            <div className="chart-legend-item">
              <div className="chart-legend-dot" style={{ background: '#E0E7FF' }} />
              Target
            </div>
          </div>
        </div>
        
        <div style={{ 
          marginBottom: 16, 
          padding: '12px', 
          background: 'var(--bg)', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Total Tugas: <strong>{totalTasks}</strong> | 
            Selesai: <strong className="text-success">{completedCount}</strong> | 
            Progress: <strong>{completionRate}%</strong>
          </span>
        </div>
        
        <div className="bar-chart">
          {weeklyData.map((d, idx) => (
            <div className="bar-col" key={idx}>
              <div
                className="bar"
                style={{
                  height: `${d.pct}%`,
                  background: d.isToday ? 'var(--success)' : (d.pct > 0 ? 'var(--accent)' : '#E0E7FF'),
                }}
                title={`${d.day} (${d.fullDate}): ${d.completed} dari ${d.target} tugas selesai`}
              />
              <div className="bar-label" style={{ 
                fontWeight: d.isToday ? 'bold' : 'normal',
                color: d.isToday ? 'var(--accent)' : 'var(--text-muted)'
              }}>
                {d.day}
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ 
          marginTop: 16, 
          padding: '8px', 
          fontSize: '11px', 
          color: 'var(--text-muted)', 
          textAlign: 'center',
          borderTop: '1px solid var(--border-light)',
          paddingTop: '12px'
        }}>
          💡 Hover ke bar untuk lihat detail
        </div>
      </div>
    </div>
  )
}