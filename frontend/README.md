# Tugasku — React + Vite

Aplikasi manajemen tugas yang dimigrasi dari HTML vanilla ke React + Vite.

## Struktur Folder

```
tugasku/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx              # Entry point
    ├── App.jsx               # Router setup
    ├── api/
    │   └── index.js          # Axios instance + semua API call
    ├── context/
    │   ├── AuthContext.jsx   # User auth state (login, logout, register)
    │   └── ToastContext.jsx  # Global toast notifications
    ├── styles/
    │   └── global.css        # Semua CSS (ported dari HTML asli)
    ├── pages/
    │   ├── AppLayout.jsx     # Layout utama (sidebar + navbar + outlet)
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── Dashboard.jsx     # Dashboard content
    │   ├── DashboardPage.jsx # Outlet wrapper
    │   ├── Calendar.jsx      # Calendar content
    │   ├── CalendarPage.jsx  # Outlet wrapper
    │   ├── History.jsx       # History content
    │   ├── HistoryPage.jsx   # Outlet wrapper
    │   └── Tasks.jsx         # My Tasks (outlet wrapper)
    └── components/
        ├── Sidebar.jsx
        ├── Navbar.jsx
        ├── TaskForm.jsx      # Modal form tambah tugas
        ├── TaskList.jsx      # Daftar tugas dengan filter
        ├── TaskCard.jsx      # Satu baris tugas
        ├── StatsCards.jsx    # 4 stat cards di dashboard
        ├── CalendarView.jsx  # Re-export Calendar (untuk embedding)
        └── ProtectedRoute.jsx
```

## Setup

```bash
npm install
npm run dev
```

## Backend yang Dibutuhkan

Pastikan backend Express + PostgreSQL berjalan di `http://localhost:3000` dengan endpoint:

| Method | Path                | Keterangan             |
|--------|---------------------|------------------------|
| POST   | /api/auth/register  | Daftar akun baru       |
| POST   | /api/auth/login     | Login → kembalikan `{ token, user }` |
| GET    | /api/tasks          | Ambil semua tugas user |
| POST   | /api/tasks          | Buat tugas baru        |
| PUT    | /api/tasks/:id      | Update tugas           |
| DELETE | /api/tasks/:id      | Hapus tugas            |

### Contoh response login
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "name": "Alex Rivers", "email": "alex@example.com" }
}
```

### Contoh response GET /api/tasks
```json
[
  {
    "id": 1,
    "name": "Workshop Desain Web",
    "description": "Mengerjakan Express js.",
    "date": "2026-04-25",
    "status": "pending",
    "category": "Kuliah",
    "subject": "Pemrograman Web",
    "priority": "high"
  }
]
```

## Catatan Migrasi

- **Tidak ada `document.getElementById`** — semua state via React hooks
- **Tidak ada `onclick` di HTML** — semua handler via props/event binding
- **Auth** — JWT token disimpan di `localStorage` (token saja, bukan password)
- **State global** — AuthContext + ToastContext, task state di AppLayout
- **API** — semua via Axios di `src/api/index.js`
