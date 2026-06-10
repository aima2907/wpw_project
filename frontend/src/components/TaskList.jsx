// components/TaskList.jsx
import { useState } from 'react'
import TaskCard from './TaskCard'

const FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: 'pending', label: 'Pending' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'done', label: 'Selesai' },
  { key: 'Work', label: 'Work' },
  { key: 'Personal', label: 'Personal' },
  { key: 'Finance', label: 'Finance' },
  { key: 'Design', label: 'Design' },
  { key: 'Sales', label: 'Sales' },
  { key: 'Kuliah', label: 'Kuliah' },
]

export default function TaskList({ 
  tasks, 
  searchQuery, 
  onOpenModal, 
  onEditTask,
  onDeleteTask,
  onUpdateStatus,
  loading 
}) {
  const [filter, setFilter] = useState('all')

  // Filter tasks
  const filtered = tasks.filter((t) => {
    const taskStatus = (t.status || 'pending').toLowerCase()
    const taskCategory = (t.category || 'Work').toLowerCase()
    
    let matchFilter = false
    
    switch (filter) {
      case 'all':
        matchFilter = true
        break
      case 'pending':
        matchFilter = taskStatus === 'pending'
        break
      case 'in-progress':
        matchFilter = taskStatus === 'in-progress'
        break
      case 'done':
        matchFilter = taskStatus === 'done'
        break
      default:
        matchFilter = taskCategory === filter.toLowerCase()
        break
    }
    
    // Search filter
    const q = searchQuery ? searchQuery.toLowerCase().trim() : ''
    const namaTugas = (t.title || '').toLowerCase()
    const deskripsiTugas = (t.description || '').toLowerCase()
    
    const matchSearch = !q || namaTugas.includes(q) || deskripsiTugas.includes(q)
    
    return matchFilter && matchSearch
  })

  // Sort tasks by deadline
  const sortedTasks = [...filtered].sort((a, b) => {
    // Done tasks go to bottom
    if (a.status === 'done' && b.status !== 'done') return 1
    if (a.status !== 'done' && b.status === 'done') return -1
    
    // Sort by deadline
    if (a.deadline && b.deadline) {
      return new Date(a.deadline) - new Date(b.deadline)
    }
    if (a.deadline) return -1
    if (b.deadline) return 1
    return 0
  })

  // Count active tasks (not done)
  const activeCount = tasks.filter(t => t.status !== 'done').length

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Daftar Tugas</div>
          <div className="page-sub">
            {activeCount} tugas aktif dari {tasks.length} total
          </div>
        </div>
        <button 
          className="btn-create" 
          style={{ width: 'auto', padding: '10px 18px' }} 
          onClick={onOpenModal}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1v11M1 6.5h11" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          Tambah Tugas
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: 14, 
        flexWrap: 'wrap', 
        gap: 10 
      }}>
        <div className="filter-strip">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`filter-btn${filter === f.key ? ' active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="sort-indicator">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 3h8M3 6h6M4 9h4" stroke="#6B7280" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Urut: Deadline Terdekat
        </div>
      </div>

      {/* Task List */}
      <div className="tasks-grid">
        {loading ? (
          <div className="loading-wrap">
            <div className="spinner" />
            <p>Memuat tugas...</p>
          </div>
        ) : sortedTasks.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>Tidak ada tugas yang ditemukan.</p>
            <button className="btn-create" onClick={onOpenModal}>
              Buat Tugas Baru
            </button>
          </div>
        ) : (
          sortedTasks.map((t) => (
            <TaskCard 
              key={t.id} 
              task={t} 
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onUpdateStatus={onUpdateStatus}
            />
          ))
        )}
      </div>
    </div>
  )
}