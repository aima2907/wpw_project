const pool = require("../config/db");

// Create Task
const createTask = async (req, res) => {
  try {
    const { title, description, deadline, status, category } = req.body;
    const user_id = req.user.id;
    
    // Validasi required field
    if (!title || title.trim() === '') {
      return res.status(400).json({
        message: "Judul tugas wajib diisi"
      });
    }
    
    const newTask = await pool.query(
      `
      INSERT INTO tasks (user_id, title, description, deadline, status, category)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [user_id, title, description || '', deadline, status || 'pending', category || 'Work']
    );

    res.status(201).json({
      message: "Task berhasil ditambahkan",
      task: newTask.rows[0]
    });

  } catch (error) {
    console.error("Error createTask:", error);
    res.status(500).json({
      message: "Gagal menambahkan tugas",
      error: error.message
    });
  }
};

// Get All Tasks
const getTasks = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { category, status, search } = req.query;
    
    let query = `
      SELECT * FROM tasks
      WHERE user_id = $1
    `;
    const params = [user_id];
    let paramIndex = 2;
    
    // Filter by category
    if (category) {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    
    // Filter by status
    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    // Search by title or description
    if (search) {
      query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    // Order by deadline asc (terdekat dulu)
    query += ` ORDER BY deadline ASC NULLS LAST, id DESC`;
    
    const tasks = await pool.query(query, params);
    
    res.json(tasks.rows);

  } catch (error) {
    console.error("Error getTasks:", error);
    res.status(500).json({
      message: "Gagal mengambil data tugas",
      error: error.message
    });
  }
};

// Get Task By ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const task = await pool.query(
      `
      SELECT * FROM tasks
      WHERE id = $1 AND user_id = $2
      `,
      [id, user_id]
    );

    if (task.rows.length === 0) {
      return res.status(404).json({
        message: "Task tidak ditemukan"
      });
    }

    res.json(task.rows[0]);

  } catch (error) {
    console.error("Error getTaskById:", error);
    res.status(500).json({
      message: "Gagal mengambil detail tugas",
      error: error.message
    });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, deadline, status, category } = req.body;
    const user_id = req.user.id;

    // Get existing task
    const existingTask = await pool.query(
      `SELECT * FROM tasks WHERE id = $1 AND user_id = $2`,
      [id, user_id]
    );

    if (existingTask.rows.length === 0) {
      return res.status(404).json({
        message: "Task tidak ditemukan"
      });
    }

    const current = existingTask.rows[0];
    
    // Update hanya field yang dikirim
    const updatedTask = await pool.query(
      `
      UPDATE tasks
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        deadline = COALESCE($3, deadline),
        status = COALESCE($4, status),
        category = COALESCE($5, category)
      WHERE id = $6 AND user_id = $7
      RETURNING *
      `,
      [
        title || current.title,
        description !== undefined ? description : current.description,
        deadline || current.deadline,
        status || current.status,
        category || current.category,
        id,
        user_id
      ]
    );

    res.json({
      message: "Task berhasil diupdate",
      task: updatedTask.rows[0]
    });

  } catch (error) {
    console.error("Error updateTask:", error);
    res.status(500).json({
      message: "Gagal mengupdate tugas",
      error: error.message
    });
  }
};

// Update Task Status (Quick toggle)
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user_id = req.user.id;
    
    if (!status || !['pending', 'in-progress', 'done'].includes(status)) {
      return res.status(400).json({
        message: "Status tidak valid. Gunakan: pending, in-progress, atau done"
      });
    }
    
    const updatedTask = await pool.query(
      `
      UPDATE tasks
      SET status = $1
      WHERE id = $2 AND user_id = $3
      RETURNING *
      `,
      [status, id, user_id]
    );
    
    if (updatedTask.rows.length === 0) {
      return res.status(404).json({
        message: "Task tidak ditemukan"
      });
    }
    
    res.json({
      message: "Status tugas berhasil diupdate",
      task: updatedTask.rows[0]
    });
    
  } catch (error) {
    console.error("Error updateTaskStatus:", error);
    res.status(500).json({
      message: "Gagal mengupdate status",
      error: error.message
    });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const deletedTask = await pool.query(
      `
      DELETE FROM tasks
      WHERE id = $1 AND user_id = $2
      RETURNING *
      `,
      [id, user_id]
    );

    if (deletedTask.rows.length === 0) {
      return res.status(404).json({
        message: "Task tidak ditemukan"
      });
    }

    res.json({
      message: "Task berhasil dihapus",
      task: deletedTask.rows[0]
    });

  } catch (error) {
    console.error("Error deleteTask:", error);
    res.status(500).json({
      message: "Gagal menghapus tugas",
      error: error.message
    });
  }
};

// Get Tasks Statistics
const getTaskStats = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    const stats = await pool.query(
      `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'done' THEN 1 END) as done,
        COUNT(CASE WHEN deadline < CURRENT_DATE AND status != 'done' THEN 1 END) as overdue,
        COUNT(CASE WHEN category = 'Work' THEN 1 END) as work,
        COUNT(CASE WHEN category = 'Personal' THEN 1 END) as personal,
        COUNT(CASE WHEN category = 'Finance' THEN 1 END) as finance,
        COUNT(CASE WHEN category = 'Design' THEN 1 END) as design,
        COUNT(CASE WHEN category = 'Sales' THEN 1 END) as sales,
        COUNT(CASE WHEN category = 'Kuliah' THEN 1 END) as kuliah
      FROM tasks
      WHERE user_id = $1
      `,
      [user_id]
    );
    
    res.json(stats.rows[0]);
    
  } catch (error) {
    console.error("Error getTaskStats:", error);
    res.status(500).json({
      message: "Gagal mengambil statistik",
      error: error.message
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats
};