const express = require("express");
const ticketController = require("../controllers/ticketController");
const authController = require("../controllers/authController");
const baseController = require("../controllers/baseController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(ticketController.getAllTickets)
  .post(baseController.setCreatedBy, ticketController.createTicket);

router
  .route("/:id")
  .get(ticketController.getTicket)
  .patch(ticketController.updateTicket)
  .delete(ticketController.deleteTicket);

// assign ticket (manager/admin)
router.patch(
  "/:id/assign",
  authController.restrictTo("admin", "manager"),
  ticketController.assignTicket,
);

module.exports = router;
