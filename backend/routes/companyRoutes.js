const express = require("express");
const companyController = require("../controllers/companyController");
const authController = require("../controllers/authController");

const router = express.Router();

// Protected routes (Login required)
router.use(authController.protect);

router.get("/me", companyController.getMyCompany);

// Allow any logged-in user to create a company
router.post("/", companyController.createCompany);

// Routes restricted to Managers and Admins
router.post("/add-user", authController.restrictTo("admin", "manager"), companyController.addUserToCompany);
router.post("/promote-manager", authController.restrictTo("admin", "manager"), companyController.promoteToManager);

router.use(authController.restrictTo("admin", "manager"));

router.get("/", companyController.getAllCompanies);

router
  .route("/:id")
  .get(companyController.getCompany)
  .patch(companyController.updateCompany)
  .delete(companyController.deleteCompany);

module.exports = router;
