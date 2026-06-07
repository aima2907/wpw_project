import { useOutletContext } from 'react-router-dom'
import History from './History'

export default function HistoryPage() {
  const { tasks, searchQuery } = useOutletContext()
  return <History tasks={tasks} searchQuery={searchQuery} />
}
