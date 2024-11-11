import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import toast from "react-hot-toast";
import { reservaService } from "../services/api";

function ReservaForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nomeCliente: "",
    email: "",
    telefone: "",
    data: new Date(),
    horario: "",
    numeroPessoas: 1,
    observacoes: "",
  });

  const horarios = [
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dados = {
        ...formData,
        data: format(formData.data, "yyyy-MM-dd"),
      };

      await reservaService.criar(dados);
      toast.success("Reserva realizada com sucesso!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao fazer reserva");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Fazer Reserva</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Nome</label>
          <input
            type="text"
            name="nomeCliente"
            value={formData.nomeCliente}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Telefone</label>
          <input
            type="tel"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Data</label>
          <DatePicker
            selected={formData.data}
            onChange={(date) =>
              setFormData((prev) => ({ ...prev, data: date }))
            }
            dateFormat="dd/MM/yyyy"
            locale={ptBR}
            minDate={new Date()}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Horário</label>
          <select
            name="horario"
            value={formData.horario}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Selecione um horário</option>
            {horarios.map((horario) => (
              <option key={horario} value={horario}>
                {horario}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Número de Pessoas</label>
          <input
            type="number"
            name="numeroPessoas"
            value={formData.numeroPessoas}
            onChange={handleChange}
            min="1"
            max="20"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Observações</label>
          <textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 transition-colors"
        >
          Fazer Reserva
        </button>
      </form>
    </div>
  );
}

export default ReservaForm;
