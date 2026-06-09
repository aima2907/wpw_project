import { useState, useEffect } from 'react'
import { X, CheckCircle, Clock, AlertCircle } from 'lucide-react'

const CATEGORIES = ['Work', 'Personal', 'Finance', 'Design', 'Sales', 'Kuliah']

// Fungsi untuk format tanggal dari database ke input date
const formatDateForInput = (dateStr) => {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    // Ambil tahun, bulan, tanggal lokal (tanpa timezone)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  } catch {
    return ''
  }
}

export default function EditTaskModal({ isOpen, onClose, task, onUpdate, onComplete, loading }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [status, setStatus] = useState('pending')
  const [category, setCategory] = useState('Work')

  // Reset ketika modal dibuka
  useEffect(() => {
    if (task && isOpen) {
      setTitle(task.title || '')
      setDescription(task.description || '')
      // ✅ PERBAIKAN: Format deadline untuk input date
      setDeadline(formatDateForInput(task.deadline))
      setStatus(task.status || 'pending')
      setCategory(task.category || 'Work')
    }
  }, [task, isOpen])

  const handleCategoryChange = (cat) => {
    setCategory(cat)
  }

  const handleUpdate = () => {
    if (!title.trim()) {
      alert('Judul tugas wajib diisi')
      return
    }
    
    // ✅ Kirim deadline dalam format YYYY-MM-DD
    onUpdate(task.id, {
      title: title.trim(),
      description: description.trim(),
      deadline: deadline,  // ← sudah format YYYY-MM-DD
      category: category,
    })
  }

  const handleComplete = () => {
    const newStatus = status === 'done' ? 'pending' : 'done'
    onComplete(task.id, newStatus)
  }

  if (!isOpen) return null

  const isDone = status === 'done'

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal edit-modal">
        <div className="modal-header">
          <div className="modal-title">
            {isDone ? '✓ Tugas Selesai' : '✎ Edit Tugas'}
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="status-banner" style={{
            background: isDone ? '#D1FAE5' : '#FEF3C7',
            color: isDone ? '#065F46' : '#B45309',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {isDone ? <CheckCircle size={20} /> : <Clock size={20} />}
            <span style={{ fontWeight: 500 }}>
              Status: {isDone ? 'Selesai' : 'Belum Selesai'}
            </span>
          </div>

          <div className="form-group">
            <label className="modal-label">Judul Tugas</label>
            <input
              className="modal-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul tugas..."
            />
          </div>

          <div className="form-group">
            <label className="modal-label">Deskripsi</label>
            <textarea
              className="modal-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail tentang tugas ini..."
              rows={3}
            />
          </div>

          <div className="modal-form-row">
            <div className="form-group">
              <label className="modal-label">Deadline</label>
              <input
                className="modal-input"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="modal-label">Status</label>
              <select 
                className="modal-select" 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Selesai</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="modal-label">Kategori</label>
            <div className="cat-btns">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`cat-btn${category === cat ? ' active' : ''}`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <button className="btn-cancel" onClick={onClose}>
            Batal
          </button>
          
          <button
            className={`btn-complete ${isDone ? 'btn-pending' : 'btn-success'}`}
            onClick={handleComplete}
            disabled={loading}
          >
            {isDone ? (
              <>
                <AlertCircle size={16} />
                Tandai Belum Selesai
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                Tandai Selesai
              </>
            )}
          </button>
          
          <button
            className="btn-save"
            onClick={handleUpdate}
            disabled={loading || !title.trim()}
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  )
}