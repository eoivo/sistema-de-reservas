const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const createAdmin = async (req, res) => {
  const { username, password } = req.body;

  // Validação de entrada
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username e senha são obrigatórios" });
  }

  try {
    // Verificar se o usuário admin já existe
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      return res.status(400).json({ message: "Já existe um admin" });
    }

    // Hash da senha antes de salvar no banco
    const salt = await bcrypt.genSalt(10); // Geração de salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hashing da senha

    // Criar o novo usuário admin
    const user = new User({
      username,
      password: hashedPassword, // Armazenando a senha criptografada
      role: "admin", // Definindo o papel como admin
    });

    // Salvar o usuário no banco
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
