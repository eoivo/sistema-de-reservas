const express = require("express");
const cors = require("cors");
const reservaRoutes = require("./routes/reservaRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));

app.use("/api/reservas", reservaRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/auth", authRoutes);

app.use(errorHandler);

module.exports = app;
