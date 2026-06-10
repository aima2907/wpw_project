import { useState, useEffect } from 'react'

const CATEGORIES = ['Work', 'Personal', 'Finance', 'Design', 'Sales', 'Kuliah']

const DEFAULT_FORM = {
  title: '',           // ← ganti dari 'name' ke 'title'
  description: '', 
  deadline: '',        // ← ganti dari 'date' ke 'deadline'
  status: 'pending',
  category: 'Work',
}

export default function TaskForm({ isOpen, onClose, onSave, prefillDate, loading }) {
  const [form, setForm] = useState(DEFAULT_FORM)

  useEffect(() => {
    if (isOpen) {
      setForm({ 
        ...DEFAULT_FORM, 
        deadline: prefillDate || '' 
      })
    }
  }, [isOpen, prefillDate])

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))

  const handleCategory = (cat) => setForm((p) => ({ ...p, category: cat }))

  const handleSave = () => {
    if (!form.title.trim()) return
    
    onSave({
      title: form.title.trim(),
      description: form.description.trim() || '',
      deadline: form.deadline,
      status: form.status,
      category: form.category,
    })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose() }}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div className="modal-title">Tambah Tugas Baru</div>
          <button className="modal-close" onClick={onClose} disabled={loading}>×</button>
        </div>

        <div className="form-group">
          <label className="modal-label">Judul Tugas <span className="required">*</span></label>
          <input
            className="modal-input"
            placeholder="Masukkan judul tugas..."
            value={form.title}
            onChange={set('title')}
            disabled={loading}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="modal-label">Deskripsi</label>
          <textarea
            className="modal-textarea"
            placeholder="Detail tentang tugas ini..."
            value={form.description}
            onChange={set('description')}
            rows={3}
            disabled={loading}
          />
        </div>

        <div className="modal-form-row">
          <div className="form-group">
            <label className="modal-label">Deadline</label>
            <input
              className="modal-input"
              type="date"
              value={form.deadline}
              onChange={set('deadline')}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label className="modal-label">Status</label>
            <select className="modal-select" value={form.status} onChange={set('status')} disabled={loading}>
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
                onClick={() => handleCategory(cat)}
                type="button"
                disabled={loading}
              >
                {cat === 'Work' && ''}
                {cat === 'Personal' && ''}
                {cat === 'Finance' && ''}
                {cat === 'Design' && ''}
                {cat === 'Sales' && ''}
                {cat === 'Kuliah' && ''}
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-foot">
          <button className="btn-cancel" type="button" onClick={onClose} disabled={loading}>
            Batal
          </button>
          <button
            className="btn-save"
            type="button"
            onClick={handleSave}
            disabled={loading || !form.title.trim()}
          >
            {loading ? 'Menyimpan...' : 'Simpan Tugas'}
          </button>
        </div>
      </div>
    </div>
  )
}