const express = require("express");
const { loginAdmin } = require("../controllers/authController"); // Verifique se o caminho está correto!

const router = express.Router();

// Rota para login
router.post("/login", loginAdmin);

module.exports = router;
