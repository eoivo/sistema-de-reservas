const express = require("express");
const router = express.Router();
const reservaController = require("../controllers/reservaController");

router
  .route("/")
  .post(reservaController.criarReserva)
  .get(reservaController.listarReservas);

router
  .route("/:id")
  .get(reservaController.buscarReserva)
  .put(reservaController.atualizarReserva)
  .delete(reservaController.cancelarReserva);

router.get("/reservas/buscar", reservaController.buscarReserva);

router.route("/reservas/admin").get(reservaController.listarReservas);

module.exports = router;
