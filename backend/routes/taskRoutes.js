const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

router.get("/", authMiddleware, getTasks);

// CREATE TASK
router.post("/", authMiddleware, createTask);

// UPDATE TASK
router.put("/:id", authMiddleware, updateTask);

// DELETE TASK
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;