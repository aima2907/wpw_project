import { useState, useEffect } from 'react'

const CATEGORIES = ['Work', 'Personal', 'Finance', 'Design', 'Sales', 'Kuliah']

const KULIAH_OPTIONS = [
  { group: 'Semester Ini', options: [
    'Basis Data', 'Algoritma & Struktur Data', 'Sistem Operasi',
    'Pemrograman Web', 'Jaringan Komputer', 'Matematika Diskrit',
    'Kalkulus', 'Fisika Dasar', 'Pancasila', 'Bahasa Indonesia', 'Bahasa Inggris',
  ]},
  { group: 'Lainnya', options: ['Praktikum', 'Kerja Praktek', 'Skripsi / TA'] },
]

const DEFAULT_FORM = {
  name: '', description: '', date: '', status: 'pending',
  category: 'Work', subject: '', priority: 'high',
}

export default function TaskForm({ isOpen, onClose, onSave, prefillDate, loading }) {
  const [form, setForm] = useState(DEFAULT_FORM)

  useEffect(() => {
    if (isOpen) {
      setForm({ ...DEFAULT_FORM, date: prefillDate || '' })
    }
  }, [isOpen, prefillDate])

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))

  const handleCat = (cat) => {
    setForm((p) => ({ ...p, category: cat, subject: '' }))
  }

  const handlePrio = (prio) => setForm((p) => ({ ...p, priority: prio }))

  const handleSave = () => {
    if (!form.name.trim()) return
    if (form.category === 'Kuliah' && !form.subject) return
    onSave({
      name: form.name.trim(),
      description: form.description.trim() || 'Tidak ada deskripsi.',
      date: form.date,
      status: form.status,
      category: form.category,
      subject: form.category === 'Kuliah' ? form.subject : '',
      priority: form.priority,
    })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Input Tugas</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="form-group">
          <label className="modal-label">Judul Tugas</label>
          <input
            className="modal-input"
            placeholder="Masukkan judul..."
            value={form.name}
            onChange={set('name')}
          />
        </div>

        <div className="form-group">
          <label className="modal-label">Deskripsi</label>
          <textarea
            className="modal-textarea"
            placeholder="Detail tentang tugas ini..."
            value={form.description}
            onChange={set('description')}
          />
        </div>

        <div className="modal-form-row">
          <div className="form-group">
            <label className="modal-label">Deadline</label>
            <input
              className="modal-input"
              type="date"
              value={form.date}
              onChange={set('date')}
            />
          </div>
          <div className="form-group">
            <label className="modal-label">Status</label>
            <select className="modal-select" value={form.status} onChange={set('status')}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="modal-label">Kategori</label>
          <div className="cat-btns">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`cat-btn${form.category === cat ? ' active' : ''}`}
                onClick={() => handleCat(cat)}
                type="button"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {form.category === 'Kuliah' && (
          <div className="form-group">
            <label className="modal-label">Mata Kuliah</label>
            <select
              className="modal-select"
              value={form.subject}
              onChange={set('subject')}
            >
              <option value="">— Pilih Mata Kuliah —</option>
              {KULIAH_OPTIONS.map((g) => (
                <optgroup key={g.group} label={g.group}>
                  {g.options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label className="modal-label">Prioritas</label>
          <div className="prio-btns">
            {['high', 'medium', 'low'].map((p) => (
              <button
                key={p}
                type="button"
                className={`prio-btn ${p}${form.priority === p ? ' active' : ''}`}
                onClick={() => handlePrio(p)}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-foot">
          <button className="btn-cancel" type="button" onClick={onClose}>Batal</button>
          <button
            className="btn-save"
            type="button"
            onClick={handleSave}
            disabled={loading || !form.name.trim() || (form.category === 'Kuliah' && !form.subject)}
          >
            {loading ? 'Menyimpan...' : 'Simpan Tugas'}
          </button>
        </div>
      </div>
    </div>
  )
}
