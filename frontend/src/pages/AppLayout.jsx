import { useState, useEffect, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import TaskForm from '../components/TaskForm'
import { tasksAPI } from '../api'
import { useToast } from '../context/ToastContext'

export default function AppLayout() {
  const { showToast } = useToast()
  const location = useLocation()

  const [tasks, setTasks] = useState([])
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [savingTask, setSavingTask] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [prefillDate, setPrefillDate] = useState('')

  // ── Fetch tasks ──
  const fetchTasks = useCallback(async () => {
    try {
      const res = await tasksAPI.getAll()
      // Support both { tasks: [] } and [] response shapes
      setTasks(Array.isArray(res.data) ? res.data : (res.data.tasks ?? []))
    } catch {
      showToast('Gagal memuat tugas.', 'error')
    } finally {
      setLoadingTasks(false)
    }
  }, [showToast])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  // ── Toggle done/pending ──
  const handleToggle = async (id) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    const newStatus = task.status === 'done' ? 'pending' : 'done'
    // Optimistic update
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: newStatus } : t))
    try {
      await tasksAPI.update(id, { status: newStatus })
    } catch {
      // Revert
      setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: task.status } : t))
      showToast('Gagal mengubah status tugas.', 'error')
    }
  }

  // ── Create task ──
  const handleSave = async (formData) => {
    setSavingTask(true)
    try {
      const res = await tasksAPI.create(formData)
      const created = res.data.task ?? res.data
      setTasks((prev) => [created, ...prev])
      setModalOpen(false)
      showToast(`Tugas "${formData.name}" berhasil disimpan!`)
    } catch {
      showToast('Gagal menyimpan tugas.', 'error')
    } finally {
      setSavingTask(false)
    }
  }

  const openModal = () => { setPrefillDate(''); setModalOpen(true) }
  const openModalWithDate = (date) => { setPrefillDate(date); setModalOpen(true) }

  return (
    <div className="app-layout">
      <Sidebar tasks={tasks} onOpenModal={openModal} />

      <div className="main-area">
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <div className="page-container">
          <Outlet context={{ tasks, loadingTasks, searchQuery, onToggle: handleToggle, onOpenModal: openModal, onOpenModalWithDate: openModalWithDate }} />
        </div>
      </div>

      <TaskForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        prefillDate={prefillDate}
        loading={savingTask}
      />
    </div>
  )
}
