const express = require("express");
const ticketController = require("../controllers/ticketController");
const authController = require("../controllers/authController");
const baseController = require("../controllers/baseController");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// PROTECT ALL ROUTES
router.use(authController.protect);
router.use(authController.checkFeature("Ticketing System"));

router
  .route("/")
  .get(ticketController.getAllTickets)
  .post(
    upload.single("file"),
    baseController.setCreatedBy,
    ticketController.createTicket
  );

router.get("/:id/attachments/:index", ticketController.getTicketAttachment);

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

// ── Ticket Analytics ──
router.get("/analytics/weekly-trends", ticketController.getWeeklyTrends);
router.get("/analytics/kpis", ticketController.getDashboardKPIs);
router.get("/analytics/categories", ticketController.getTicketsByCategory);
router.get("/analytics/resolution", ticketController.getResolutionAnalytics);


module.exports = router;
