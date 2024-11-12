import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "../services/api";

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Por favor, informe o nome de usuário e a senha.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/auth/login", {
        username,
        password,
      });

      if (response.status === 200) {
        toast.success("Login realizado com sucesso!");

        localStorage.setItem("adminToken", response.data.token);
        navigate("/admin/dashboard");
      }
    } catch (error) {
      toast.error("Usuário ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <div className="max-w-sm w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-primary-600 mb-6 text-center">
          Entrar como Administrador
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600"
            >
              Nome de usuário
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Digite seu nome de usuário"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Digite sua senha"
            />
          </div>

          <button
            type="submit"
            className="mt-6 p-3 w-full bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 focus:ring-4 focus:ring-primary-500 transition-colors"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>
            Não tem uma conta?{" "}
            <a href="/register" className="text-primary-500 hover:underline">
              Criar uma conta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
