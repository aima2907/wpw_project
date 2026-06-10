require("dotenv").config();

const express = require("express");
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

pool.connect()
  .then(() => console.log("PostgreSQL connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Backend Tugasku berjalan");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
