const express = require("express");
const cors = require("cors");
require("dotenv").config();
const taskRoutes = require("./routes/tasksRoutes");
const userRoutes = require("./routes/userRoutes");
const columnRoutes = require("./routes/columnRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/tasks", taskRoutes);
app.use("/users", userRoutes);
app.use("/api/columns", columnRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na http://localhost:${PORT}`);
});
