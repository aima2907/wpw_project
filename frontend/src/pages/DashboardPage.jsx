import { useOutletContext } from 'react-router-dom'
import Dashboard from './Dashboard'

export default function DashboardPage() {
  // 1. Ambil data asli dari useOutletContext
  const { tasks, onOpenModal, searchQuery } = useOutletContext()

  // 2. TAMENG AMAN: Pastikan tasks yang dikirim ke komponen Dashboard SELALU berbentuk array
  // Jadi kalau backend kosong atau eror, dia mengirim array kosong [], bukan undefined/null yang bikin crash
  const safeTasks = Array.isArray(tasks) ? tasks : []

  // 3. Oper safeTasks ke dalam komponen Dashboard aslimu
  return (
    <Dashboard 
      tasks={safeTasks} 
      onOpenModal={onOpenModal} 
      searchQuery={searchQuery} 
    />
  )
}