import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'

const CAT_BADGE = {
  Work: 'badge-indigo',
  Personal: 'badge-green',
  Finance: 'badge-amber',
  Design: 'badge-purple',
  Sales: 'badge-blue',
  Kuliah: 'badge-teal2',
}

const CATEGORIES = ['All', 'Work', 'Personal', 'Finance', 'Design', 'Sales', 'Kuliah']

function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
    })
  } catch {
    return '-'
  }
}

export default function History() {
  const { tasks = [], searchQuery = '' } = useOutletContext()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showAll, setShowAll] = useState(false)
  
  // Filter tugas yang sudah selesai (status = 'done')
  let completedTasks = tasks.filter((t) => {
    const isDone = t.status === 'done'
    const matchesSearch = t.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return isDone && matchesSearch
  })

  // Filter berdasarkan kategori
  if (selectedCategory !== 'All') {
    completedTasks = completedTasks.filter((t) => t.category === selectedCategory)
  }

  // Urutkan dari yang terbaru ke terlama (berdasarkan deadline atau id)
  const sortedTasks = [...completedTasks].sort((a, b) => {
    if (a.deadline && b.deadline) {
      return new Date(b.deadline) - new Date(a.deadline)
    }
    return b.id - a.id
  })

  // Tampilkan 5 tugas pertama, atau semua jika showAll true
  const displayTasks = showAll ? sortedTasks : sortedTasks.slice(0, 5)
  const hasMore = sortedTasks.length > 5

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">History</div>
          <div className="page-sub">Riwayat aktivitas dan tugas yang telah selesai.</div>
        </div>
      </div>

      {/* Filter Kategori */}
      <div className="filter-strip" style={{ marginBottom: 20 }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-btn${selectedCategory === cat ? ' active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === 'All' ? 'Semua' : cat}
          </button>
        ))}
      </div>

      <div className="hist-count">
        {sortedTasks.length} TUGAS SELESAI
        {selectedCategory !== 'All' && ` (Kategori: ${selectedCategory})`}
      </div>

      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
          Tugas yang Diselesaikan
        </div>

        {sortedTasks.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>
              {selectedCategory !== 'All' 
                ? `Belum ada tugas selesai dengan kategori ${selectedCategory}.`
                : 'Belum ada tugas yang diselesaikan.'}
            </p>
          </div>
        ) : (
          displayTasks.map((t) => (
            <div className="comp-item" key={t.id}>
              <div>
                <div className="comp-name">{t.title || 'Untitled'}</div>
                <div className="comp-meta">
                  <span className="comp-date">
                    📅 {formatDate(t.deadline)}
                  </span>
                  <span className={`badge ${CAT_BADGE[t.category] || 'badge-gray'}`}>
                    {t.category?.toUpperCase() || 'TANPA KATEGORI'}
                  </span>
                  <span className="badge badge-success">
                    SELESAI
                  </span>
                </div>
                {t.description && (
                  <div className="comp-desc" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                    {t.description.length > 60 ? t.description.slice(0, 60) + '...' : t.description}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="comp-done">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <circle cx="6.5" cy="6.5" r="5.5" fill="#10B981" />
                    <path d="M4 6.5l2 2 3.5-3.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Completed
                </div>
              </div>
            </div>
          ))
        )}

        {hasMore && !showAll && (
          <button className="btn-show-more" onClick={() => setShowAll(true)}>
            Tunjukkan Lebih Banyak ({sortedTasks.length - 5} tugas lagi)
          </button>
        )}
        
        {hasMore && showAll && (
          <button className="btn-show-more" onClick={() => setShowAll(false)}>
            Tunjukkan Lebih Sedikit
          </button>
        )}
      </div>
    </div>
  )
}