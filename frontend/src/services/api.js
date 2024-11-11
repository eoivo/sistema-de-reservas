import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const reservaService = {
  criar: async (dados) => {
    const response = await api.post("/reservas", dados);
    return response.data;
  },

  listar: async () => {
    const response = await api.get("/reservas");
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/reservas/${id}`);
    return response.data;
  },

  atualizar: async (id, dados) => {
    const response = await api.put(`/reservas/${id}`, dados);
    return response.data;
  },

  cancelar: async (id) => {
    const response = await api.delete(`/reservas/${id}`);
    return response.data;
  },
};

export default api;
