import { useOutletContext } from 'react-router-dom'
import TaskList from '../components/TaskList'

export default function Tasks() {
  const { tasks, loadingTasks, searchQuery, onToggle, onOpenModal } = useOutletContext()
  return (
    <TaskList
      tasks={tasks}
      searchQuery={searchQuery}
      onToggle={onToggle}
      onOpenModal={onOpenModal}
      loading={loadingTasks}
    />
  )
}
