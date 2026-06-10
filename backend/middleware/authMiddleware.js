const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Cek token ada atau tidak di headers
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token tidak ada atau format salah"
      });
    }

    // 2. POTONG kata "Bearer " untuk mengambil token aslinya saja!
    const token = authHeader.split(" ")[1];

    // 3. Verifikasi token asli yang sudah bersih
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Simpan data user hasil verifikasi
    req.user = verified;

    next();

  } catch (error) {
    res.status(401).json({
      message: "Verifikasi token gagal: " + error.message
    });
  }
};

module.exports = authMiddleware;