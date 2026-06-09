// utils/notificationHelper.js

// Minta izin notifikasi
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Browser tidak mendukung notifikasi')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

// Kirim notifikasi seperti WA
export const sendNotification = (title, options = {}) => {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  const defaultOptions = {
    body: 'Jangan lupa selesaikan tugasmu!',
    icon: '/logo192.png', // Ganti dengan icon aplikasi Anda
    badge: '/favicon.ico',
    vibrate: [200, 100, 200], // Getar seperti WA
    silent: false,
    requireInteraction: true, // Notifikasi tetap sampai diklik
    tag: 'deadline-notification', // Agar tidak duplikat
  }

  const notification = new Notification(title, { ...defaultOptions, ...options })

  // Klik notifikasi -> fokus ke tab
  notification.onclick = () => {
    window.focus()
    notification.close()
  }

  // Notifikasi ditutup otomatis setelah 10 detik
  setTimeout(() => {
    notification.close()
  }, 10000)

  return notification
}

// Cek deadline mendekat
export const checkDeadlines = (tasks) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const deadlines = {
    today: [],
    tomorrow: [],
    thisWeek: []
  }

  tasks.forEach(task => {
    if (task.status === 'done') return
    if (!task.deadline) return

    const deadlineDate = new Date(task.deadline)
    deadlineDate.setHours(0, 0, 0, 0)
    
    const diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      deadlines.today.push(task)
    } else if (diffDays === 1) {
      deadlines.tomorrow.push(task)
    } else if (diffDays >= 2 && diffDays <= 7) {
      deadlines.thisWeek.push(task)
    }
  })

  return deadlines
}

// Kirim notifikasi browser (seperti WA)
export const sendBrowserNotification = (task, diffDays) => {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  let title = ''
  let body = ''
  let icon = '/logo192.png'

  if (diffDays === 0) {
    title = '⚠️ Deadline Hari Ini!'
    body = `"${task.title}" harus diselesaikan hari ini!`
    icon = '/danger-icon.png'
  } else if (diffDays === 1) {
    title = '📅 Deadline Besok!'
    body = `"${task.title}" deadline besok, jangan lupa dikerjakan!`
    icon = '/warning-icon.png'
  } else if (diffDays === 2) {
    title = '📋 Deadline Lusa'
    body = `"${task.title}" deadline ${diffDays} hari lagi`
    icon = '/info-icon.png'
  } else {
    title = '📋 Deadline Mendekat'
    body = `"${task.title}" deadline ${diffDays} hari lagi`
    icon = '/info-icon.png'
  }

  const notification = new Notification(title, {
    body: body,
    icon: icon,
    vibrate: [200, 100, 200],
    requireInteraction: diffDays === 0 || diffDays === 1, // Penting untuk deadline dekat
    tag: `deadline-${task.id}`,
  })

  notification.onclick = () => {
    window.focus()
    notification.close()
  }

  return notification
}

// Kirim notifikasi untuk semua deadline
export const sendDeadlineNotifications = (tasks) => {
  const deadlines = checkDeadlines(tasks)
  const sentKeys = JSON.parse(localStorage.getItem('sentNotifications') || '{}')
  const todayStr = new Date().toDateString()

  // Kirim notifikasi untuk deadline hari ini
  deadlines.today.forEach(task => {
    const key = `today-${task.id}-${todayStr}`
    if (!sentKeys[key]) {
      setTimeout(() => {
        sendBrowserNotification(task, 0)
      }, 1000) // Delay 1 detik
      sentKeys[key] = true
    }
  })

  // Kirim notifikasi untuk deadline besok
  deadlines.tomorrow.forEach(task => {
    const key = `tomorrow-${task.id}-${todayStr}`
    if (!sentKeys[key]) {
      setTimeout(() => {
        sendBrowserNotification(task, 1)
      }, 2000)
      sentKeys[key] = true
    }
  })

  // Kirim notifikasi ringkasan mingguan (1x sehari)
  const lastWeeklyNotif = localStorage.getItem('lastWeeklyNotif')
  if (deadlines.thisWeek.length > 0 && lastWeeklyNotif !== todayStr) {
    setTimeout(() => {
      sendNotification(`📋 ${deadlines.thisWeek.length} tugas deadline minggu ini`, {
        body: `Jangan lupa selesaikan: ${deadlines.thisWeek.slice(0, 3).map(t => t.title).join(', ')}${deadlines.thisWeek.length > 3 ? ' dan lainnya' : ''}`,
        tag: 'weekly-summary'
      })
    }, 3000)
    localStorage.setItem('lastWeeklyNotif', todayStr)
  }

  localStorage.setItem('sentNotifications', JSON.stringify(sentKeys))
}