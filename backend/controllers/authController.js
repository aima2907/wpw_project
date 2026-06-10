const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =======================
// REGISTER
// =======================
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Semua field harus diisi"
      });
    }
    // cek email sudah ada atau belum
    const checkUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email sudah digunakan"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // simpan user
    const result = await pool.query(
      `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email
      `,
      [name, email, hashedPassword]
    );

    return res.status(201).json({
      message: "Register berhasil",
      user: result.rows[0]
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message
    });
  }
};

// =======================
// LOGIN
// =======================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN FUNCTION IS RUNNING");
    console.log("LOGIN BODY:", req.body);

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Email tidak ditemukan"
      });
    }

    const user = result.rows[0];

    console.log("USER FROM DB:", user);

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("BCRYPT RESULT:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: "Email atau password salah"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

   console.log("MASUK SUCCESS BLOCK");

    return res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  register,
  login
};