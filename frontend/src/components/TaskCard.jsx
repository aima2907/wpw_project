import { Edit2, Trash2, Calendar, Circle, CheckCircle2, Loader } from 'lucide-react'

const CAT_BADGE = {
  Work: { color: 'indigo', icon: '' },
  Personal: { color: 'green', icon: '' },
  Finance: { color: 'amber', icon: '' },
  Design: { color: 'purple', icon: '' },
  Sales: { color: 'blue', icon: '' },
  Kuliah: { color: 'teal', icon: '' },
}

const STATUS_STYLE = {
  pending: { 
    bg: 'warning', 
    text: 'Pending', 
    dot: 'bg-amber-500',
    icon: <Circle size={20} className="text-amber-500" />,
    nextStatus: 'in-progress'
  },
  'in-progress': { 
    bg: 'info', 
    text: 'In Progress', 
    dot: 'bg-blue-500',
    icon: <Loader size={20} className="text-blue-500" />,
    nextStatus: 'done'
  },
  done: { 
    bg: 'success', 
    text: 'Selesai', 
    dot: 'bg-emerald-500',
    icon: <CheckCircle2 size={20} className="text-emerald-500" />,
    nextStatus: 'pending'
  },
}

// TaskCard.jsx - fungsi formatDate
function formatDate(dateStr) {
  if (!dateStr) return 'Tidak ada deadline'
  try {
    // Buat tanggal tanpa timezone
    const date = new Date(dateStr)
    const today = new Date()
    
    // Reset ke tengah malam LOCAL
    const deadlineDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    
    const diffTime = deadlineDate - todayDate
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    console.log('FormatDate - Input:', dateStr, 'Output:', deadlineDate, 'Diff:', diffDays)
    
    if (diffDays < 0) return `Terlambat ${Math.abs(diffDays)} hari`
    if (diffDays === 0) return 'Hari ini'
    if (diffDays === 1) return 'Besok'
    if (diffDays === 2) return 'Lusa'
    
    return deadlineDate.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return 'Invalid date'
  }
}

export default function TaskCard({ task, onEdit, onDelete, onUpdateStatus }) {
  const statusConfig = STATUS_STYLE[task.status] || STATUS_STYLE.pending
  const isDone = task.status === 'done'
  const category = CAT_BADGE[task.category] || { color: 'gray', icon: '📋' }

  // Handle klik status untuk toggle ke next status
  const handleStatusClick = (e) => {
    e.stopPropagation()
    const nextStatus = statusConfig.nextStatus
    onUpdateStatus(task.id, nextStatus)
  }

  // Tooltip text berdasarkan status sekarang
  const getStatusTooltip = () => {
    switch (task.status) {
      case 'pending':
        return 'Klik untuk mulai (In Progress)'
      case 'in-progress':
        return 'Klik untuk selesaikan'
      case 'done':
        return 'Klik untuk buka kembali (Pending)'
      default:
        return 'Ubah status'
    }
  }

  return (
    <div className={`task-card ${isDone ? 'done' : ''}`}>
      {/* Status Icon - Klik untuk toggle status */}
      <div 
        className={`status-icon ${task.status}`}
        onClick={handleStatusClick}
        style={{ cursor: 'pointer' }}
        title={getStatusTooltip()}
      >
        {statusConfig.icon}
      </div>

      <div className="task-card-content" onClick={() => onEdit(task)}>
        {/* Title */}
        <div className={`task-title ${isDone ? 'line-through text-gray-400' : ''}`}>
          {task.title || 'Untitled Task'}
        </div>

        {/* Description */}
        {task.description && (
          <div className={`task-description ${isDone ? 'text-gray-400' : 'text-gray-600'}`}>
            {task.description}
          </div>
        )}

        {/* Meta Info */}
        <div className="task-meta">
          <span className={`badge badge-${category.color}`}>
            <span className="mr-1">{category.icon}</span>
            {task.category || 'Work'}
          </span>

          <span 
            className={`badge badge-${statusConfig.bg}`}
            style={{ cursor: 'pointer' }}
            onClick={handleStatusClick}
            title={getStatusTooltip()}
          >
            <span className={`w-2 h-2 rounded-full ${statusConfig.dot} mr-1.5`}></span>
            {statusConfig.text}
          </span>

          <span className="deadline-chip">
            <Calendar size={12} className="mr-1" />
            {formatDate(task.deadline)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="task-card-actions">
        <button
          className="action-btn edit-btn"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(task)
          }}
          aria-label="Edit task"
        >
          <Edit2 size={18} />
        </button>
        
        <button
          className="action-btn delete-btn"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(task.id)
          }}
          aria-label="Delete task"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}