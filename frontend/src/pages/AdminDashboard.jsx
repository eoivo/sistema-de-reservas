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
    // Exibe a confirmação de exclusão
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
    <div className="admin-dashboard-container">
      <h2 className="text-2xl font-bold">Dashboard de Reservas</h2>

      <button
        onClick={handleLogout}
        className="p-2 bg-red-500 text-white rounded mb-4"
      >
        Sair
      </button>

      {loading ? (
        <div>Carregando reservas...</div>
      ) : (
        <div>
          {Array.isArray(reservations) && reservations.length > 0 ? (
            <ul className="mt-6 space-y-4">
              {reservations.map((reserva) => (
                <li
                  key={reserva._id}
                  className="border p-4 mb-4 rounded bg-gray-50 shadow-md"
                >
                  <h3 className="text-lg font-bold text-primary-600">
                    Detalhes da Reserva
                  </h3>

                  {editMode === reserva._id ? (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="nomeCliente" className="block">
                          Nome do Cliente
                        </label>
                        <input
                          type="text"
                          id="nomeCliente"
                          name="nomeCliente"
                          value={reserva.nomeCliente}
                          onChange={(e) => handleChange(e, reserva._id)}
                          className="mt-2 p-2 border border-gray-300 rounded w-full"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block">
                          E-mail
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={reserva.email}
                          onChange={(e) => handleChange(e, reserva._id)}
                          className="mt-2 p-2 border border-gray-300 rounded w-full"
                        />
                      </div>

                      <div>
                        <label htmlFor="telefone" className="block">
                          Telefone
                        </label>
                        <input
                          type="text"
                          id="telefone"
                          name="telefone"
                          value={reserva.telefone}
                          onChange={(e) => handleChange(e, reserva._id)}
                          className="mt-2 p-2 border border-gray-300 rounded w-full"
                        />
                      </div>

                      <div>
                        <label htmlFor="data" className="block">
                          Data
                        </label>
                        <input
                          type="date"
                          id="data"
                          name="data"
                          value={reserva.data.split("T")[0]} // Remove a parte da hora
                          onChange={(e) => handleChange(e, reserva._id)}
                          className="mt-2 p-2 border border-gray-300 rounded w-full"
                        />
                      </div>

                      <div>
                        <label htmlFor="horario" className="block">
                          Horário
                        </label>
                        <input
                          type="time"
                          id="horario"
                          name="horario"
                          value={reserva.horario || ""}
                          onChange={(e) => handleChange(e, reserva._id)}
                          className="mt-2 p-2 border border-gray-300 rounded w-full"
                        />
                      </div>

                      <div>
                        <label htmlFor="status" className="block">
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={reserva.status}
                          onChange={(e) => handleChange(e, reserva._id)}
                          className="mt-2 p-2 border border-gray-300 rounded w-full"
                        >
                          <option value="pendente">Pendente</option>
                          <option value="confirmada">Confirmada</option>
                          <option value="cancelada">Cancelada</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="numeroPessoas" className="block">
                          Número de Pessoas
                        </label>
                        <input
                          type="number"
                          id="numeroPessoas"
                          name="numeroPessoas"
                          value={reserva.numeroPessoas}
                          onChange={(e) => handleChange(e, reserva._id)}
                          className="mt-2 p-2 border border-gray-300 rounded w-full"
                        />
                      </div>

                      <div>
                        <label htmlFor="observacoes" className="block">
                          Observações
                        </label>
                        <textarea
                          id="observacoes"
                          name="observacoes"
                          value={reserva.observacoes || ""}
                          onChange={(e) => handleChange(e, reserva._id)}
                          className="mt-2 p-2 border border-gray-300 rounded w-full"
                        />
                      </div>

                      <button
                        onClick={() => handleEditSubmit(reserva._id, reserva)}
                        className="p-2 bg-primary-500 text-white rounded"
                      >
                        Salvar
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div>
                        <strong>Nome do Cliente:</strong> {reserva.nomeCliente}
                      </div>
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
                      <button
                        onClick={() => setEditMode(reserva._id)}
                        className="p-2 bg-yellow-500 text-white rounded mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(reserva._id)}
                        className="p-2 bg-red-500 text-white rounded"
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 text-gray-500">
              Não há reservas para mostrar.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
