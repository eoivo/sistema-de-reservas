const express = require("express");
const { createAdmin } = require("../controllers/adminController");
const { loginAdmin } = require("../controllers/authController");

const router = express.Router();

// Rota para criar um admin
router.post("/create-admin", createAdmin);

// Rota para fazer login como admin
router.post("/login", loginAdmin);

module.exports = router;
