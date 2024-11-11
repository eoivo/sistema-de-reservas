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
    <div className="admin-login-container">
      <h2>Entrar como Administrador</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="username" className="block">
            Nome de usuário
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            placeholder="Digite seu nome de usuário"
          />
        </div>

        <div>
          <label htmlFor="password" className="block">
            Senha
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            placeholder="Digite sua senha"
          />
        </div>

        <button
          type="submit"
          className="mt-4 p-2 bg-primary-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
};

export default Admin;
