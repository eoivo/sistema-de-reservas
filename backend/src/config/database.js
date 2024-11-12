const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });

    console.log(`MongoDB Conectado: ${conn.connection.host}`);

    mongoose.connection.on("connected", () => {
      console.log("Mongoose conectado ao MongoDB Atlas");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Erro na conexão do Mongoose:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose desconectado do MongoDB Atlas");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("Aplicação encerrada");
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      await mongoose.connection.close();
      console.log("Aplicação encerrada");
      process.exit(0);
    });
  } catch (error) {
    console.error(`Erro: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
