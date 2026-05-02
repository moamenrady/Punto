const express = require('express');
const stockController = require('../controllers/stockController');
const authController = require('../controllers/authController');

const router = express.Router();

// All stock routes require login
router.use(authController.protect);

router
  .route('/')
  .get(stockController.getAllStock)
  .post(authController.restrictTo('admin'), stockController.createStock);

router
  .route('/:id')
  .get(stockController.getOneStock)
  .patch(authController.restrictTo('admin'), stockController.updateStock)
  .delete(authController.restrictTo('admin'), stockController.deleteStock);

  router.use(
  authController.protect,
  authController.checkFeature("stock")
);

module.exports = router;
