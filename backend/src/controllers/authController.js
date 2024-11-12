const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, role: "admin" });
  if (!user) {
    return res.status(400).json({ message: "Usuário admin não encontrado" });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Senha incorreta" });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  res.json({ token });
};

module.exports = { loginAdmin };
