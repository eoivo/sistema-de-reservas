import React, { useState } from "react";
import axios from "../services/api";
import { toast } from "react-hot-toast";

const BuscarReservas = () => {
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [reservas, setReservas] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();

    toast.dismiss();

    if (!email || !telefone) {
      toast.error(
        <div onClick={() => toast.dismiss()} className="cursor-pointer">
          Ambos os campos (e-mail e telefone) são obrigatórios para a consulta.
        </div>,
        {
          duration: 3000,
        }
      );
      return;
    }

    try {
      const query = `email=${email}&telefone=${telefone}`;

      const response = await axios.get(`/reservas/buscar?${query}`);

      if (response.data.results === 0) {
        toast.error(
          <div onClick={() => toast.dismiss()} className="cursor-pointer">
            Reserva não encontrada.
          </div>,
          {
            duration: 3000,
          }
        );
        setReservas([]);
      } else {
        setReservas(response.data.data);
        toast.success(
          <div onClick={() => toast.dismiss()} className="cursor-pointer">
            Reserva encontrada com sucesso!
          </div>,
          {
            duration: 3000,
          }
        );
      }
    } catch (error) {
      console.error("Erro ao buscar reserva:", error);

      if (error.response && error.response.status === 404) {
        toast.error(
          <div onClick={() => toast.dismiss()} className="cursor-pointer">
            Reserva não encontrada.
          </div>,
          {
            duration: 3000,
          }
        );
      } else {
        toast.error(
          <div onClick={() => toast.dismiss()} className="cursor-pointer">
            Erro ao buscar reserva. Tente novamente.
          </div>,
          {
            duration: 3000,
          }
        );
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

  return (
    <div className="buscar-reservas-container">
      <h2>Buscar Reserva</h2>

      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label htmlFor="email" className="block">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            placeholder="Digite o e-mail"
          />
        </div>

        <div>
          <label htmlFor="telefone" className="block">
            Telefone
          </label>
          <input
            type="text"
            id="telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            placeholder="Digite o telefone"
          />
        </div>

        <button
          type="submit"
          className="mt-4 p-2 bg-primary-500 text-white rounded"
        >
          Buscar
        </button>
      </form>

      {reservas.length > 0 ? (
        <ul className="mt-6 space-y-4">
          {reservas.map((reserva) => (
            <li
              key={reserva._id}
              className="border p-4 mb-4 rounded bg-gray-50 shadow-md"
            >
              <h3 className="text-lg font-bold text-primary-600">
                Detalhes da Reserva
              </h3>
              <div>
                <strong>Nome do Cliente:</strong> {reserva.nomeCliente}
              </div>
              <div>
                <strong>Email:</strong> {reserva.email}
              </div>
              <div>
                <strong>Telefone:</strong> {reserva.telefone}
              </div>
              <div>
                <strong>Data:</strong> {formatarData(reserva.data)}
              </div>
              <div>
                <strong>Horário:</strong> {formatarHorario(reserva.horario)}
              </div>
              <div>
                <strong>Status:</strong> {reserva.status}
              </div>
              <div>
                <strong>Número de Pessoas:</strong> {reserva.numeroPessoas}
              </div>
              <div>
                <strong>Observações:</strong>{" "}
                {reserva.observacoes || "Nenhuma observação"}
              </div>
              <div>
                <strong>Horário previsto para o fim:</strong>{" "}
                {reserva.horarioFim
                  ? new Date(reserva.horarioFim).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Não especificado"}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 text-gray-500">Nenhuma reserva encontrada.</div>
      )}
    </div>
  );
};

export default BuscarReservas;
