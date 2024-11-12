const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const createAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username e senha são obrigatórios" });
  }

  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      return res.status(400).json({ message: "Já existe um admin" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      password: hashedPassword,
      role: "admin",
    });

    await user.save();

    res.status(201).json({ message: "Admin criado com sucesso!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao criar o admin", error: error.message });
  }
};

module.exports = { createAdmin };
