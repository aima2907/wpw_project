const pool = require("../config/db");

const createTask = async (req, res) => {

  try {

    const { title, description, deadline, status } = req.body;

    const user_id = req.user.id;

    const newTask = await pool.query(

      `
      INSERT INTO tasks
      (user_id, title, description, deadline, status)

      VALUES($1, $2, $3, $4, $5)

      RETURNING *
      `,
      [user_id, title, description, deadline, status]

    );

    res.status(201).json({
      message: "Task berhasil ditambahkan",
      task: newTask.rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  }

};

const getTasks = async (req, res) => {

  try {

    const user_id = req.user.id;

    const tasks = await pool.query(

      `
      SELECT * FROM tasks
      WHERE user_id = $1
      ORDER BY id DESC
      `,
      [user_id]

    );

    res.json(tasks.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  }

};

const updateTask = async (req, res) => {

  try {

    const { id } = req.params;

    const { title, description, deadline, status } = req.body;

    const user_id = req.user.id;

    const updatedTask = await pool.query(
      `
      UPDATE tasks
      SET
        title = $1,
        description = $2,
        deadline = $3,
        status = $4
      WHERE id = $5
      AND user_id = $6
      RETURNING *
      `,
      [title, description, deadline, status, id, user_id]
    );

    if (updatedTask.rows.length === 0) {
      return res.status(404).json({
        message: "Task tidak ditemukan"
      });
    }

    res.json({
      message: "Task berhasil diupdate",
      task: updatedTask.rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  }

};

const deleteTask = async (req, res) => {

  try {

    const { id } = req.params;

    const user_id = req.user.id;

    const deletedTask = await pool.query(
      `
      DELETE FROM tasks
      WHERE id = $1
      AND user_id = $2
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

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  }

};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};