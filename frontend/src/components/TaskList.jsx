import { useState } from 'react'
import TaskCard from './TaskCard'

const FILTERS = [
  { key: 'all',      label: 'Semua' },
  { key: 'pending',  label: 'Pending' },
  { key: 'done',     label: 'Selesai' },
  { key: 'Work',     label: 'Work' },
  { key: 'Personal', label: 'Personal' },
  { key: 'Finance',  label: 'Finance' },
  { key: 'Design',   label: 'Design' },
  { key: 'Kuliah',   label: 'Kuliah' },
]

const PRIO_ORDER = { high: 0, medium: 1, low: 2 }

function sortTasks(list) {
  return [...list].sort((a, b) => {
    const aDone = a.status === 'done' ? 1 : 0
    const bDone = b.status === 'done' ? 1 : 0
    if (aDone !== bDone) return aDone - bDone
    return (PRIO_ORDER[a.priority] ?? 1) - (PRIO_ORDER[b.priority] ?? 1)
  })
}

export default function TaskList({ tasks, searchQuery, onToggle, onOpenModal, loading }) {
  const [filter, setFilter] = useState('all')

  const filtered = tasks.filter((t) => {
    const matchFilter =
      filter === 'all' ||
      (filter === 'done'    && t.status === 'done') ||
      (filter === 'pending' && t.status !== 'done') ||
      filter === t.category

    const q = searchQuery.toLowerCase()
    const matchSearch =
      !q ||
      t.name?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q)

    return matchFilter && matchSearch
  })

  const sorted = sortTasks(filtered)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Daftar Tugas</div>
          <div className="page-sub">Kelola semua tugasmu — diurutkan dari prioritas tertinggi.</div>
        </div>
        <button className="btn-create" style={{ width: 'auto', padding: '10px 18px' }} onClick={onOpenModal}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1v11M1 6.5h11" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          Tambah Tugas
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
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
          Urut: Prioritas Tertinggi
        </div>
      </div>

      <div className="tasks-grid">
        {loading ? (
          <div className="loading-wrap"><div className="spinner" /></div>
        ) : sorted.length === 0 ? (
          <div className="empty-state">Tidak ada tugas yang ditemukan.</div>
        ) : (
          sorted.map((t) => (
            <TaskCard key={t.id} task={t} onToggle={onToggle} />
          ))
        )}
      </div>
    </div>
  )
}
