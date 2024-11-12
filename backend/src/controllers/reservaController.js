const Reserva = require("../models/Reserva");
const AppError = require("../utils/appError");

exports.criarReserva = async (req, res, next) => {
  try {
    const reserva = await Reserva.create(req.body);
    res.status(201).json({
      status: "success",
      data: reserva,
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.listarReservas = async (req, res, next) => {
  try {
    const reservas = await Reserva.find().sort({ data: 1 });
    res.status(200).json({
      status: "success",
      results: reservas.length,
      data: reservas,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

exports.buscarReserva = async (req, res, next) => {
  try {
    const { email, telefone } = req.query;
    const filtro = {};

    if (email) filtro.email = email;

    if (telefone) {
      const telefoneFormatado = telefone.replace(/\D/g, "");
      filtro.telefone = telefoneFormatado;
    }

    const reservas = await Reserva.find(filtro).sort({ data: 1 });

    if (reservas.length === 0) {
      return next(
        new AppError(
          "Nenhuma reserva encontrada para os critérios informados.",
          404
        )
      );
    }

    res.status(200).json({
      status: "success",
      results: reservas.length,
      data: reservas,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
exports.atualizarReserva = async (req, res, next) => {
  try {
    const reserva = await Reserva.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!reserva) {
      return next(new AppError("Reserva não encontrada", 404));
    }
    res.status(200).json({
      status: "success",
      data: reserva,
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.cancelarReserva = async (req, res, next) => {
  try {
    const reserva = await Reserva.findByIdAndDelete(req.params.id);
    if (!reserva) {
      return next(new AppError("Reserva não encontrada", 404));
    }
    res.status(200).json({
      status: "success",
      message: "Reserva cancelada com sucesso",
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
