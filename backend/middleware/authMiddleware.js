const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  try {

    const token = req.headers.authorization;

    // cek token ada atau tidak
    if (!token) {
      return res.status(401).json({
        message: "Token tidak ada"
      });
    }

    // verifikasi token
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // simpan data user
    req.user = verified;

    next();

  } catch (error) {

    res.status(401).json({
      message: error.message
    });

  }

};

module.exports = authMiddleware;