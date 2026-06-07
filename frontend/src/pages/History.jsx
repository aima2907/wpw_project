const CAT_BADGE = {
  Work: 'badge-indigo',
  Personal: 'badge-green',
  Finance: 'badge-amber',
  Design: 'badge-purple',
  Sales: 'badge-blue',
  Kuliah: 'badge-teal2',
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function History({ tasks, searchQuery }) {
  const done = tasks.filter((t) => {
    const isDone = t.status === 'done'
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase())
    return isDone && matchesSearch
  })

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">History</div>
          <div className="page-sub">Riwayat aktivitas dan tugas yang telah selesai.</div>
        </div>
      </div>

      <div className="hist-count">{done.length} TUGAS SELESAI</div>

      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
          Tugas yang Diselesaikan
        </div>

        {done.length === 0 ? (
          <div className="empty-state">Belum ada tugas yang diselesaikan.</div>
        ) : (
          done.map((t) => (
            <div className="comp-item" key={t.id}>
              <div>
                <div className="comp-name">{t.name}</div>
                <div className="comp-meta">
                  <span className="comp-date">{formatDate(t.date)}</span>
                  <span className={`badge ${CAT_BADGE[t.category] || 'badge-gray'}`}>
                    {t.category?.toUpperCase()}
                  </span>
                  {t.category === 'Kuliah' && t.subject && (
                    <span className="badge badge-teal2" style={{ fontSize: 9 }}>{t.subject}</span>
                  )}
                </div>
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

        {done.length > 0 && (
          <button className="btn-show-more">Tunjukkan Lebih Banyak</button>
        )}
      </div>
    </div>
  )
}
