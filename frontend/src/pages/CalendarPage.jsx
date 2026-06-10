import { useOutletContext } from 'react-router-dom'
import Calendar from './Calendar'

export default function CalendarPage() {
  const { tasks, onOpenModalWithDate } = useOutletContext()
  return <Calendar tasks={tasks} onOpenModalWithDate={onOpenModalWithDate} />
}
