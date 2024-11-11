import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get("/reservas/admin", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });

        if (Array.isArray(response.data.data)) {
          setReservations(response.data.data);
        } else {
          toast.error("A resposta não contém reservas.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar as reservas.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleEditSubmit = async (id, editedReserva) => {
    try {
      const response = await axios.put(`/reservas/${id}`, editedReserva, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      toast.success("Reserva atualizada com sucesso!");

      setReservations((prevReservations) => {
        return prevReservations.map((reserva) =>
          reserva._id === id ? { ...reserva, ...editedReserva } : reserva
        );
      });

      setEditMode(null);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar a reserva.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Você tem certeza que deseja excluir esta reserva?"
    );

    if (confirmDelete) {
      try {
        await axios.delete(`/reservas/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
        toast.success("Reserva excluída com sucesso!");
        setReservations(reservations.filter((reserva) => reserva._id !== id));
      } catch (error) {
        console.error(error);
        toast.error("Erro ao excluir a reserva.");
      }
    }
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatarHorario = (horario) => {
    return horario ? `${horario}` : "Não especificado";
  };

  const handleChange = (e, id) => {
    const { name, value } = e.target;

    setReservations((prevReservations) =>
      prevReservations.map((reserva) =>
        reserva._id === id ? { ...reserva, [name]: value } : reserva
      )
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("Você foi desconectado com sucesso!");
    navigate("/admin");
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-primary-600">
          Dashboard de Reservas
        </h2>
        <button
          onClick={handleLogout}
          className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
        >
          Sair
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Carregando reservas...</div>
      ) : (
        <div>
          {reservations.length > 0 ? (
            <ul className="space-y-6">
              {reservations.map((reserva) => (
                <li
                  key={reserva._id}
                  className="border p-6 rounded-lg bg-gray-50 shadow-md hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-xl font-bold text-primary-600 mb-4">
                    {reserva.nomeCliente}
                  </h3>

                  {editMode === reserva._id ? (
                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="nomeCliente"
                          className="block text-sm text-gray-600"
                        >
                          Nome do Cliente
                        </label>
                        <input
                          type="text"
                          id="nomeCliente"
                          name="nomeCliente"
                          value={reserva.nomeCliente}
                          onChange={(e) => handleChange(e, reserva._id)}
                          className="mt-2 p-2 w-full border border-gray-300 rounded"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm text-gray-600"
                        >
                          E-mail
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={reserva.email}
                          onChange={(e) => handleChange(e, reserva._id)}
                          className="mt-2 p-2 w-full border border-gray-300 rounded"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="telefone"
                          className="block text-sm text-gray-600"
                        >
                          Telefone
                        </label>
                        <input
                          type="text"
                          id="telefone"
                          name="telefone"
                          value={reserva.telefone}
                          onChange={(e) => handleChange(e, reserva._id)}
                          className="mt-2 p-2 w-full border border-gray-300 rounded"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="data"
                          className="block text-sm text-gray-600"
                        >
                          Data
                        </label>
                        <input
                          type="date"
                          id="data"
                          name="data"
                          value={reserva.data.split("T")[0]}
                          onChange={(e) => handleChange(e, reserva._id)}
                          className="mt-2 p-2 w-full border border-gray-300 rounded"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="horario"
                          className="block text-sm text-gray-600"
                        >
                          Horário
                        </label>
                        <input
                          type="time"
                          id="horario"
                          name="horario"
                          value={reserva.horario || ""}
                          onChange={(e) => handleChange(e, reserva._id)}
                          className="mt-2 p-2 w-full border border-gray-300 rounded"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="status"
                          className="block text-sm text-gray-600"
                        >
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={reserva.status}
                          onChange={(e) => handleChange(e, reserva._id)}
                          className="mt-2 p-2 w-full border border-gray-300 rounded"
                        >
                          <option value="pendente">Pendente</option>
                          <option value="confirmada">Confirmada</option>
                          <option value="cancelada">Cancelada</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="numeroPessoas"
                          className="block text-sm text-gray-600"
                        >
                          Número de Pessoas
                        </label>
                        <input
                          type="number"
                          id="numeroPessoas"
                          name="numeroPessoas"
                          value={reserva.numeroPessoas}
                          onChange={(e) => handleChange(e, reserva._id)}
                          className="mt-2 p-2 w-full border border-gray-300 rounded"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="observacoes"
                          className="block text-sm text-gray-600"
                        >
                          Observações
                        </label>
                        <textarea
                          id="observacoes"
                          name="observacoes"
                          value={reserva.observacoes || ""}
                          onChange={(e) => handleChange(e, reserva._id)}
                          className="mt-2 p-2 w-full border border-gray-300 rounded"
                        />
                      </div>

                      <button
                        onClick={() => handleEditSubmit(reserva._id, reserva)}
                        className="mt-4 p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        Salvar
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div>
                        <strong>E-mail:</strong> {reserva.email}
                      </div>
                      <div>
                        <strong>Telefone:</strong> {reserva.telefone}
                      </div>
                      <div>
                        <strong>Data:</strong> {formatarData(reserva.data)}
                      </div>
                      <div>
                        <strong>Horário:</strong>{" "}
                        {formatarHorario(reserva.horario)}
                      </div>
                      <div>
                        <strong>Status:</strong> {reserva.status}
                      </div>
                      <div>
                        <strong>Número de Pessoas:</strong>{" "}
                        {reserva.numeroPessoas}
                      </div>
                      <div>
                        <strong>Observações:</strong>{" "}
                        {reserva.observacoes || "Nenhuma observação"}
                      </div>
                      <div className="mt-4 space-x-4">
                        <button
                          onClick={() => setEditMode(reserva._id)}
                          className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(reserva._id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500">Não há reservas para mostrar.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
