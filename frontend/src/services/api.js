import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "VITE_API_URL=https://sistema-de-reservas.onrender.com/api",
});
console.log("Base URL:", import.meta.env.VITE_API_URL);
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
