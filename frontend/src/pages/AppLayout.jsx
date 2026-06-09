import { useState, useEffect, useCallback, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import TaskForm from '../components/TaskForm'
import EditTaskModal from '../components/EditTaskModal'
import { tasksAPI } from '../api'
import { useToast } from '../context/ToastContext'
import { requestNotificationPermission, sendDeadlineNotifications } from './notificationHelper'

export default function AppLayout() {
  const { showToast } = useToast()
  const location = useLocation()

  const [tasks, setTasks] = useState([])
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [savingTask, setSavingTask] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [prefillDate, setPrefillDate] = useState('')
  
  const toggleInProgressRef = useRef(false)

  // ── Minta izin notifikasi saat pertama kali load ──
  useEffect(() => {
    const setupNotifications = async () => {
      const granted = await requestNotificationPermission()
      if (granted) {
        console.log('✅ Izin notifikasi diberikan')
        showToast('🔔 Notifikasi deadline akan muncul otomatis!', 'success')
      } else {
        console.log('❌ Izin notifikasi ditolak')
      }
    }
    setupNotifications()
  }, [showToast])

  // ── Fetch tasks ──
  const fetchTasks = useCallback(async () => {
    try {
      const res = await tasksAPI.getAll()
      const tasksData = Array.isArray(res.data) 
        ? res.data 
        : (res.data.tasks ?? [])
      
      if (!Array.isArray(tasksData)) {
        throw new Error('Invalid response format')
      }
      
      setTasks(tasksData)
      
      // ── Kirim notifikasi untuk deadline mendekat ──
      sendDeadlineNotifications(tasksData)
      
    } catch (err) {
      console.error('Fetch tasks error:', err)
      showToast('Gagal memuat tugas.', 'error')
    } finally {
      setLoadingTasks(false)
    }
  }, [showToast])

  useEffect(() => { 
    fetchTasks() 
  }, [fetchTasks])

  // ── UPDATE STATUS (pending → in-progress → done → pending) ──
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await tasksAPI.update(id, { status: newStatus })
      const updatedTask = res.data.task ?? res.data
      
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t))
      
      let message = ''
      switch (newStatus) {
        case 'pending':
          message = 'Tugas dibuka kembali!'
          break
        case 'in-progress':
          message = 'Tugas sedang dikerjakan! 🚀'
          break
        case 'done':
          message = 'Tugas berhasil diselesaikan! 🎉'
          // Notifikasi selamat
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🎉 Selamat!', {
              body: `Tugas "${updatedTask.title}" telah selesai!`,
              icon: '/logo192.png',
              requireInteraction: true
            })
          }
          break
        default:
          message = 'Status tugas berhasil diupdate'
      }
      showToast(message, 'success')
    } catch (err) {
      console.error('Update status error:', err)
      showToast('Gagal mengubah status.', 'error')
    }
  }

  // ── UPDATE TASK (Edit semua field) ──
  const handleUpdate = async (id, updatedData) => {
    setSavingTask(true)
    try {
      const res = await tasksAPI.update(id, updatedData)
      const updatedTask = res.data.task ?? res.data
      
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t))
      setEditModalOpen(false)
      setEditingTask(null)
      showToast('Tugas berhasil diupdate!', 'success')
    } catch (err) {
      console.error('Update error:', err)
      showToast('Gagal mengupdate tugas.', 'error')
    } finally {
      setSavingTask(false)
    }
  }

  // ── COMPLETE/UNCOMPLETE TASK (Update status dari modal) ──
  const handleComplete = async (id, newStatus) => {
    setSavingTask(true)
    try {
      const res = await tasksAPI.update(id, { status: newStatus })
      const updatedTask = res.data.task ?? res.data
      
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t))
      setEditModalOpen(false)
      setEditingTask(null)
      
      const message = newStatus === 'done' 
        ? 'Tugas berhasil diselesaikan! 🎉' 
        : 'Tugas dibuka kembali!'
      showToast(message, 'success')
      
      // Notifikasi jika selesai
      if (newStatus === 'done' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('✅ Tugas Selesai!', {
          body: `"${updatedTask.title}" telah diselesaikan. Selamat!`,
          icon: '/logo192.png'
        })
      }
    } catch (err) {
      console.error('Complete error:', err)
      showToast('Gagal mengubah status.', 'error')
    } finally {
      setSavingTask(false)
    }
  }

  // ── DELETE TASK ──
  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus tugas ini? Tindakan ini tidak dapat dibatalkan.')) {
      try {
        await tasksAPI.remove(id)
        setTasks(prev => prev.filter(t => t.id !== id))
        showToast('Tugas berhasil dihapus!', 'success')
      } catch (err) {
        console.error('Delete error:', err)
        showToast('Gagal menghapus tugas.', 'error')
      }
    }
  }

  // ── CREATE TASK ──
  const handleSave = async (formData) => {
    setSavingTask(true)
    try {
      const res = await tasksAPI.create(formData)
      const created = res.data.task ?? res.data
      
      if (!created || !created.id) {
        throw new Error('Invalid created task response')
      }
      
      setTasks((prev) => [created, ...prev])
      setModalOpen(false)
      showToast(`Tugas "${formData.title || formData.name}" berhasil disimpan!`, 'success')
    } catch (err) {
      console.error('Save task error:', err)
      showToast('Gagal menyimpan tugas.', 'error')
    } finally {
      setSavingTask(false)
    }
  }

  // ── OPEN MODALS ──
  const openModal = () => { 
    setPrefillDate('')
    setModalOpen(true) 
  }
  
  const openModalWithDate = (date) => { 
    setPrefillDate(date)
    setModalOpen(true) 
  }

  const openEditModal = (task) => {
    setEditingTask(task)
    setEditModalOpen(true)
  }

  // Data yang akan di-pass ke semua child routes
  const outletContext = {
    tasks,
    loadingTasks,
    searchQuery,
    onEditTask: openEditModal,
    onDeleteTask: handleDelete,
    onUpdateStatus: handleUpdateStatus,
    onOpenModal: openModal,
    onOpenModalWithDate: openModalWithDate,
  }

  return (
    <div className="app-layout">
      <Sidebar tasks={tasks} onOpenModal={openModal} />

      <div className="main-area">
        <Navbar 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery}
          onOpenModal={openModal}
          tasks={tasks} 
        />

        <div className="page-container">
          <Outlet context={outletContext} />
        </div>
      </div>

      {/* Modal Create Task */}
      <TaskForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        prefillDate={prefillDate}
        loading={savingTask}
      />

      {/* Modal Edit Task */}
      <EditTaskModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setEditingTask(null)
        }}
        task={editingTask}
        onUpdate={handleUpdate}
        onComplete={handleComplete}
        loading={savingTask}
      />
    </div>
  )
}