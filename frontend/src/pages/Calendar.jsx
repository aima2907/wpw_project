import { useState } from 'react'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = ['SUN','MON','TUE','WED','THU','FRI','SAT']

const STATIC_EVENTS = {
  '2026-5-31': [{ txt: 'Sprint Sync', cls: 'ev-blue' }],
  '2026-6-9':  [{ txt: 'Sprint Sync', cls: 'ev-blue' }, { txt: 'Client Review', cls: 'ev-purple' }],
  '2026-6-15': [{ txt: 'Design Handoff', cls: 'ev-amber' }],
  '2026-6-22': [{ txt: 'Q2 Review', cls: 'ev-blue' }],
}

export default function Calendar({ tasks, onOpenModalWithDate }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const changeMonth = (dir) => {
    let m = month + dir
    let y = year
    if (m > 11) { m = 0; y++ }
    if (m < 0)  { m = 11; y-- }
    setMonth(m); setYear(y)
  }

  const goToday = () => { setYear(today.getFullYear()); setMonth(today.getMonth()) }

  // Build calendar grid
  const firstDay  = new Date(year, month, 1).getDay()
  const daysInMon = new Date(year, month + 1, 0).getDate()
  const prevDays  = new Date(year, month, 0).getDate()

  const cells = []
  // prev month padding
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: prevDays - firstDay + i + 1, current: false })
  }
  // current month
  for (let d = 1; d <= daysInMon; d++) {
    cells.push({ day: d, current: true })
  }
  // next month padding
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, current: false })
  }

  const getTasksForDay = (d) => {
    if (!d) return []
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    return tasks.filter((t) => t.date === key)
  }

  const getStaticEvents = (d) => {
    const key = `${year}-${month + 1}-${d}`
    return STATIC_EVENTS[key] || []
  }

  const handleDayClick = (d) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    onOpenModalWithDate(dateStr)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Calendar</div>
          <div className="page-sub">Lihat dan atur jadwal tugasmu.</div>
        </div>
      </div>

      <div className="cal-layout">
        <div>
          <div className="cal-top">
            <div className="cal-nav">
              <button className="cal-nav-btn" onClick={() => changeMonth(-1)}>‹</button>
              <div className="cal-month-label">{MONTHS[month]} {year}</div>
              <button className="cal-nav-btn" onClick={() => changeMonth(1)}>›</button>
              <button className="cal-today-btn" onClick={goToday}>Today</button>
            </div>
          </div>

          <div className="cal-grid">
            {DAYS.map((d) => (
              <div className="cal-head" key={d}>{d}</div>
            ))}
            {cells.map((cell, idx) => {
              const isToday =
                cell.current &&
                cell.day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
              const taskEvs = cell.current ? getTasksForDay(cell.day) : []
              const staticEvs = cell.current ? getStaticEvents(cell.day) : []

              return (
                <div
                  key={idx}
                  className={`cal-day${!cell.current ? ' other-month' : ''}${isToday ? ' today' : ''}`}
                  onClick={() => cell.current && handleDayClick(cell.day)}
                >
                  <div className="day-num">{cell.day}</div>
                  {staticEvs.map((ev, i) => (
                    <div key={i} className={`cal-event ${ev.cls}`}>{ev.txt}</div>
                  ))}
                  {taskEvs.map((t) => (
                    <div key={t.id} className="cal-event ev-amber" title={t.name}>
                      {t.name.slice(0, 14)}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        <div className="cal-side">
          <div className="reminder-card">
            <div className="reminder-header">
              <div className="reminder-header-title">Reminders</div>
              <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                <circle cx="2" cy="2" r="1.5" fill="#9CA3AF" />
                <circle cx="8" cy="2" r="1.5" fill="#9CA3AF" />
                <circle cx="14" cy="2" r="1.5" fill="#9CA3AF" />
              </svg>
            </div>

            {tasks.filter((t) => t.priority === 'high' && t.status !== 'done').slice(0, 3).map((t) => (
              <div className="reminder-item" key={t.id}>
                <div className="reminder-urgency" style={{ color: 'var(--danger)' }}>HIGH PRIORITY</div>
                <div className="reminder-title">{t.name}</div>
                <div className="reminder-desc">{t.description}</div>
              </div>
            ))}

            {tasks.filter((t) => t.priority === 'high' && t.status !== 'done').length === 0 && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '8px 0' }}>
                Tidak ada reminder mendesak.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
