const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats
} = require("../controllers/taskController");

// Semua route memerlukan authentication
router.use(authMiddleware);

// Routes
router.get("/", getTasks);                    // GET /api/tasks?category=&status=&search=
router.get("/stats", getTaskStats);           // GET /api/tasks/stats
router.get("/:id", getTaskById);              // GET /api/tasks/:id
router.post("/", createTask);                 // POST /api/tasks
router.put("/:id", updateTask);               // PUT /api/tasks/:id
router.patch("/:id/status", updateTaskStatus); // PATCH /api/tasks/:id/status
router.delete("/:id", deleteTask);            // DELETE /api/tasks/:id

module.exports = router;