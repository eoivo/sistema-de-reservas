const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema(
  {
    nomeCliente: {
      type: String,
      required: [true, "Nome do cliente é obrigatório"],
      trim: true,
      minlength: [3, "Nome deve ter pelo menos 3 caracteres"],
      maxlength: [100, "Nome não pode exceder 100 caracteres"],
    },
    email: {
      type: String,
      required: [true, "Email é obrigatório"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor, informe um email válido",
      ],
    },
    telefone: {
      type: String,
      required: [true, "Telefone é obrigatório"],
      match: [
        /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/,
        "Por favor, informe um telefone válido",
      ],
    },
    data: {
      type: Date,
      required: [true, "Data é obrigatória"],
      validate: {
        validator: function (v) {
          return v >= new Date(new Date().setHours(0, 0, 0, 0));
        },
        message: "A data da reserva deve ser futura",
      },
    },
    horario: {
      type: String,
      required: [true, "Horário é obrigatório"],
      validate: {
        validator: function (v) {
          const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
          if (!timeRegex.test(v)) return false;

          const [hours, minutes] = v.split(":").map(Number);
          const time = hours * 60 + minutes;
          return time >= 11 * 60 && time <= 23 * 60;
        },
        message: "Horário inválido. Restaurante funciona das 11:00 às 23:00",
      },
    },
    numeroPessoas: {
      type: Number,
      required: [true, "Número de pessoas é obrigatório"],
      min: [1, "Número de pessoas deve ser pelo menos 1"],
      max: [
        20,
        "Para grupos maiores que 20 pessoas, entre em contato diretamente com o restaurante",
      ],
    },
    status: {
      type: String,
      enum: {
        values: ["pendente", "confirmada", "cancelada"],
        message: "Status deve ser: pendente, confirmada ou cancelada",
      },
      default: "pendente",
    },
    mesaAlocada: {
      type: Number,
      default: null,
    },
    observacoes: {
      type: String,
      trim: true,
      maxlength: [500, "Observações não podem exceder 500 caracteres"],
    },
    criadoEm: {
      type: Date,
      default: Date.now,
    },
    atualizadoEm: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reservaSchema.index({ data: 1, horario: 1 });
reservaSchema.index({ email: 1 });
reservaSchema.index({ status: 1 });
reservaSchema.index({ criadoEm: -1 });

reservaSchema.virtual("horarioFim").get(function () {
  if (!this.horario) return null;

  const [hours, minutes] = this.horario.split(":").map(Number);
  const date = new Date(this.data);
  date.setHours(hours + 2, minutes);
  return date;
});

reservaSchema.pre("save", async function (next) {
  if (this.isModified("data") || this.isModified("horario")) {
    const horaInicio = this.horario;
    const [horasInicio, minutosInicio] = horaInicio.split(":").map(Number);
    const dataInicio = new Date(this.data);
    dataInicio.setHours(horasInicio, minutosInicio);

    const dataFim = new Date(dataInicio);
    dataFim.setHours(dataFim.getHours() + 2);

    const reservasConflitantes = await this.constructor.find({
      _id: { $ne: this._id },
      data: this.data,
      status: { $ne: "cancelada" },
      $or: [
        {
          horario: {
            $gte: horaInicio,
            $lt: `${dataFim.getHours()}:${dataFim
              .getMinutes()
              .toString()
              .padStart(2, "0")}`,
          },
        },
        {
          horario: horaInicio,
        },
      ],
    });

    if (reservasConflitantes.length >= 10) {
      throw new Error("Não há mesas disponíveis neste horário");
    }
  }

  this.atualizadoEm = new Date();

  next();
});

reservaSchema.statics.verificarDisponibilidade = async function (
  data,
  horario
) {
  const reservas = await this.find({
    data: data,
    horario: horario,
    status: { $ne: "cancelada" },
  });

  const mesasDisponiveis = 10 - reservas.length;
  return {
    disponivel: mesasDisponiveis > 0,
    mesasDisponiveis: mesasDisponiveis,
  };
};

reservaSchema.methods.cancelar = async function () {
  this.status = "cancelada";
  this.atualizadoEm = new Date();
  return await this.save();
};

const Reserva = mongoose.model("Reserva", reservaSchema);

module.exports = Reserva;
