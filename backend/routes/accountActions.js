const express = require("express");
const router = express.Router();
const { protect } = require("../controllers/authController");
const ctrl = require("../controllers/accountActionsController");

router.post("/deactivate", protect, ctrl.deactivateAccount);
router.delete("/delete",   protect, ctrl.deleteAccount);
router.get("/export",      protect, ctrl.exportData);

module.exports = router;