import { useOutletContext } from 'react-router-dom'
import Dashboard from './Dashboard'

export default function DashboardPage() {
  const { tasks, onOpenModal, searchQuery } = useOutletContext()
  return <Dashboard tasks={tasks} onOpenModal={onOpenModal} searchQuery={searchQuery} />
}
