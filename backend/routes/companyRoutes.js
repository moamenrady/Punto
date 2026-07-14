const express = require("express");
const companyController = require("../controllers/companyController");
const authController = require("../controllers/authController");

const router = express.Router();

// Protected routes (Login required)
router.use(authController.protect);

router.get("/me", companyController.getMyCompany);

// Allow any logged-in user to create, join, or list companies
router.post("/", companyController.createCompany);
router.post("/join", companyController.joinCompany);
router.get("/list", companyController.getAllCompanies);

// Routes restricted to Managers and Admins
router.post("/add-user", authController.restrictTo("admin", "manager"), companyController.addUserToCompany);
router.post("/promote-manager", authController.restrictTo("admin", "manager"), companyController.promoteToManager);

router.use(authController.restrictTo("admin", "manager"));

router.get("/my-company/authorization-check", companyController.getAuthorizationCheck);

router.post("/my-company/departments", companyController.addDepartment);
router.delete("/my-company/departments/:deptId", companyController.removeDepartment);
router.post("/my-company/departments/:deptId/users", companyController.addUserToDepartment);
router.delete("/my-company/departments/:deptId/users/:userId", companyController.removeUserFromDepartment);

router.get("/", companyController.getAllCompanies);

router
  .route("/:id")
  .get(companyController.getCompany)
  .patch(companyController.updateCompany)
  .delete(companyController.deleteCompany);

module.exports = router;
