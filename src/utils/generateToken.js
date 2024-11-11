// utils/generateToken.js
const jwt = require("jsonwebtoken");

const generateToken = (username) => {
  return jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = { generateToken };
