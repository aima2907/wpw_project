import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

// Helper function untuk menormalisasi tanggal (fix timezone)
const normalizeDate = (dateStr) => {
  if (!dateStr) return ''
  
  // Jika sudah dalam format YYYY-MM-DD, return langsung
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr
  }
  
  // Jika dalam format ISO (ada huruf T), konversi ke lokal
  if (dateStr.includes('T')) {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  // Coba parsing format YYYY-M-D
  const match = dateStr.match(/(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (match) {
    return `${match[1]}-${String(match[2]).padStart(2, '0')}-${String(match[3]).padStart(2, '0')}`
  }
  
  return dateStr
}

export default function Calendar() {
  const { tasks = [], onOpenModalWithDate } = useOutletContext()
  
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  // Debug: lihat tugas dari API
  useEffect(() => {
    console.log('📋 Tugas dari API:')
    tasks.forEach(task => {
      console.log(`   ${task.title}: deadline = ${task.deadline} -> normal = ${normalizeDate(task.deadline)}`)
    })
  }, [tasks])

  const changeMonth = (dir) => {
    let m = month + dir
    let y = year
    if (m > 11) { m = 0; y++ }
    if (m < 0)  { m = 11; y-- }
    setMonth(m); setYear(y)
  }

  const goToday = () => { 
    setYear(today.getFullYear())
    setMonth(today.getMonth())
  }

  // Format tanggal ke YYYY-MM-DD (dengan leading zero)
  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  // Build calendar grid (mulai dari MINGGU)
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMon = new Date(year, month + 1, 0).getDate()
  const prevDays = new Date(year, month, 0).getDate()

  const cells = []
  // prev month padding
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: prevDays - firstDay + i + 1, current: false })
  }
  // current month
  for (let d = 1; d <= daysInMon; d++) {
    cells.push({ day: d, current: true })
  }
  // next month padding (biar total 42 cell / 6 minggu)
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, current: false })
  }

  // Ambil tugas berdasarkan deadline (dengan normalisasi tanggal)
  const getTasksForDay = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return []
    const dateKey = formatDateKey(year, month, day)
    
    return tasks.filter((task) => {
      if (!task.deadline) return false
      const normalizedDeadline = normalizeDate(task.deadline)
      return normalizedDeadline === dateKey
    })
  }

  const handleDayClick = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return
    const dateStr = formatDateKey(year, month, day)
    onOpenModalWithDate(dateStr)
  }

  // Warna event berdasarkan status tugas
  const getEventClass = (status) => {
    switch (status) {
      case 'done': return 'ev-green'
      case 'in-progress': return 'ev-blue'
      default: return 'ev-amber'
    }
  }

  // Cek apakah tanggal adalah hari ini
  const isToday = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return false
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Calendar</div>
          <div className="page-sub">Klik tanggal untuk tambah tugas | Tugas muncul sesuai deadline</div>
        </div>
      </div>

      <div className="cal-layout">
        <div className="cal-main">
          <div className="cal-top">
            <div className="cal-nav">
              <button className="cal-nav-btn" onClick={() => changeMonth(-1)}>‹</button>
              <div className="cal-month-label">{MONTHS[month]} {year}</div>
              <button className="cal-nav-btn" onClick={() => changeMonth(1)}>›</button>
              <button className="cal-today-btn" onClick={goToday}>Today</button>
            </div>
          </div>

          <div className="cal-grid">
            {/* Header hari */}
            {DAYS.map((d) => (
              <div className="cal-head" key={d}>{d}</div>
            ))}
            
            {/* Cells tanggal */}
            {cells.map((cell, idx) => {
              const isCurrentDay = isToday(cell.day, cell.current)
              const taskEvents = getTasksForDay(cell.day, cell.current)

              return (
                <div
                  key={idx}
                  className={`cal-day${!cell.current ? ' other-month' : ''}${isCurrentDay ? ' today' : ''}`}
                  onClick={() => handleDayClick(cell.day, cell.current)}
                  style={{ cursor: cell.current ? 'pointer' : 'default' }}
                >
                  <div className="day-num">{cell.day}</div>
                  <div className="cal-events">
                    {taskEvents.map((task) => (
                      <div 
                        key={task.id} 
                        className={`cal-event ${getEventClass(task.status)}`} 
                        title={task.title}
                      >
                        {task.title.length > 14 ? task.title.slice(0, 14) + '...' : task.title}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="cal-side">
          {/* Reminder Card */}
          <div className="reminder-card">
            <div className="reminder-header">
              <div className="reminder-header-title">📋 Reminders</div>
              <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                <circle cx="2" cy="2" r="1.5" fill="#9CA3AF" />
                <circle cx="8" cy="2" r="1.5" fill="#9CA3AF" />
                <circle cx="14" cy="2" r="1.5" fill="#9CA3AF" />
              </svg>
            </div>

            {/* Tugas dengan deadline mendekat (0-7 hari) */}
            {tasks.filter(task => {
              if (task.status === 'done') return false
              if (!task.deadline) return false
              const normalizedDeadline = normalizeDate(task.deadline)
              const deadlineDate = new Date(normalizedDeadline)
              const todayDate = new Date()
              todayDate.setHours(0, 0, 0, 0)
              const diffDays = Math.ceil((deadlineDate - todayDate) / (1000 * 60 * 60 * 24))
              return diffDays >= 0 && diffDays <= 7
            }).sort((a, b) => {
              const dateA = new Date(normalizeDate(a.deadline))
              const dateB = new Date(normalizeDate(b.deadline))
              return dateA - dateB
            }).slice(0, 5).map((task) => {
              const normalizedDeadline = normalizeDate(task.deadline)
              const deadlineDate = new Date(normalizedDeadline)
              const todayDate = new Date()
              todayDate.setHours(0, 0, 0, 0)
              const diffDays = Math.ceil((deadlineDate - todayDate) / (1000 * 60 * 60 * 24))
              
              let urgencyText = ''
              let urgencyColor = 'var(--danger)'
              if (diffDays === 0) {
                urgencyText = 'DEADLINE HARI INI!'
              } else if (diffDays === 1) {
                urgencyText = 'BESOK DEADLINE!'
              } else if (diffDays === 2) {
                urgencyText = 'LUSA DEADLINE'
                urgencyColor = 'var(--warning)'
              } else {
                urgencyText = `${diffDays} HARI LAGI`
                urgencyColor = 'var(--warning)'
              }

              return (
                <div className="reminder-item" key={task.id}>
                  <div className="reminder-urgency" style={{ color: urgencyColor }}>
                    {urgencyText}
                  </div>
                  <div className="reminder-title">{task.title || 'Untitled'}</div>
                  <div className="reminder-desc">
                    {task.description?.slice(0, 50) || 'Tidak ada deskripsi'}
                  </div>
                  <div className="reminder-date">
                    📅 {new Date(normalizedDeadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                  </div>
                </div>
              )
            })}

            {tasks.filter(task => {
              if (task.status === 'done') return false
              if (!task.deadline) return false
              const normalizedDeadline = normalizeDate(task.deadline)
              const deadlineDate = new Date(normalizedDeadline)
              const todayDate = new Date()
              todayDate.setHours(0, 0, 0, 0)
              const diffDays = Math.ceil((deadlineDate - todayDate) / (1000 * 60 * 60 * 24))
              return diffDays >= 0 && diffDays <= 7
            }).length === 0 && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '20px 0', textAlign: 'center' }}>
                ✅ Tidak ada deadline mendekat
              </div>
            )}
          </div>

          {/* Legend Card */}
          <div className="reminder-card">
            <div className="reminder-header">
              <div className="reminder-header-title">🎨 Keterangan</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="cal-event ev-amber" style={{ width: '30px', padding: '4px', margin: 0 }}></div>
                <span style={{ fontSize: '11px' }}>Pending (Belum dikerjakan)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="cal-event ev-blue" style={{ width: '30px', padding: '4px', margin: 0 }}></div>
                <span style={{ fontSize: '11px' }}>In Progress (Sedang dikerjakan)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="cal-event ev-green" style={{ width: '30px', padding: '4px', margin: 0 }}></div>
                <span style={{ fontSize: '11px' }}>Selesai</span>
              </div>
            </div>
          </div>

          {/* Ringkasan Bulan Ini */}
          <div className="reminder-card">
            <div className="reminder-header">
              <div className="reminder-header-title">📊 Ringkasan {MONTHS[month]}</div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Total tugas: <strong>{tasks.filter(t => {
                const normDate = normalizeDate(t.deadline)
                return normDate.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)
              }).length}</strong>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Selesai: <strong className="text-success">{tasks.filter(t => {
                const normDate = normalizeDate(t.deadline)
                return normDate.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`) && t.status === 'done'
              }).length}</strong>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Belum selesai: <strong className="text-warning">{tasks.filter(t => {
                const normDate = normalizeDate(t.deadline)
                return normDate.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`) && t.status !== 'done'
              }).length}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}