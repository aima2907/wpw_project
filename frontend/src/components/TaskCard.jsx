const CAT_BADGE = {
  Work: 'badge-indigo',
  Personal: 'badge-green',
  Finance: 'badge-amber',
  Design: 'badge-purple',
  Sales: 'badge-blue',
  Kuliah: 'badge-teal2',
}

const PRIO_BADGE = { high: 'badge-red', medium: 'badge-blue', low: 'badge-gray' }

function formatDate(dateStr) {
  if (!dateStr) return 'Tanpa deadline'
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function TaskCard({ task, onToggle }) {
  const isDone = task.status === 'done'

  return (
    <div className="task-card" onClick={() => onToggle(task.id)}>
      <div
        className={`task-check${isDone ? ' done' : ''}`}
        onClick={(e) => { e.stopPropagation(); onToggle(task.id) }}
      >
        {isDone && (
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M2.5 5.5l2 2 4-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        )}
      </div>

      <div className="task-card-body">
        <div className={`task-card-name${isDone ? ' done' : ''}`}>{task.name}</div>
        <div className="task-card-desc">{task.description}</div>
        <div className="task-card-meta">
          <span className={`badge ${CAT_BADGE[task.category] || 'badge-gray'}`}>
            {task.category}
          </span>
          {task.category === 'Kuliah' && task.subject && (
            <span className="badge badge-teal2" style={{ fontSize: 9 }}>{task.subject}</span>
          )}
          <span className="time-chip">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <circle cx="5.5" cy="5.5" r="4.5" stroke="#9CA3AF" strokeWidth="1.2" />
              <path d="M5.5 3v3l1.5.8" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {formatDate(task.date)}
          </span>
        </div>
      </div>

      <div className="task-card-right">
        <div className={`prio-dot ${task.priority}`} />
        <span className={`badge ${PRIO_BADGE[task.priority] || 'badge-gray'}`}>
          {task.priority?.toUpperCase()}
        </span>
      </div>
    </div>
  )
}
