import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tugasku_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── AUTH ──
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

// ── TASKS ──
export const tasksAPI = {
  getAll: () => api.get('/tasks'),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  remove: (id) => api.delete(`/tasks/${id}`),
}

export default api
