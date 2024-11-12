const express = require("express");
const { createAdmin } = require("../controllers/adminController");
const { loginAdmin } = require("../controllers/authController");

const router = express.Router();

router.post("/create-admin", createAdmin);

router.post("/login", loginAdmin);

module.exports = router;
