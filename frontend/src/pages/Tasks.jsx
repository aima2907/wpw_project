// Tasks.jsx
import { useOutletContext } from 'react-router-dom'
import TaskList from '../components/TaskList'

export default function Tasks() {
  const {
    tasks,
    loadingTasks,
    searchQuery,
    onEditTask,
    onDeleteTask,
    onUpdateStatus,  // ← AMBIL DARI CONTEXT
    onOpenModal
  } = useOutletContext()

  return (
    <TaskList
      tasks={tasks}
      searchQuery={searchQuery}
      loading={loadingTasks}
      onOpenModal={onOpenModal}
      onEditTask={onEditTask}
      onDeleteTask={onDeleteTask}
      onUpdateStatus={onUpdateStatus}  // ← KIRIM KE TASKLIST
    />
  )
}