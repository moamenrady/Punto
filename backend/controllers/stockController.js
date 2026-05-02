const Stock = require('../models/stockModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

// Standard CRUD
exports.getAllStock = factory.getAll(Stock);
exports.getOneStock = factory.getOne(Stock);
exports.updateStock = factory.updateOne(Stock);
exports.deleteStock = factory.deleteOne(Stock);

exports.createStock = catchAsync(async (req, res, next) => {
  // If company_id is available, ensure it's in the body
  if (req.user?.company_id) {
    if (Array.isArray(req.body)) {
      req.body.forEach(item => { item.company_id = req.user.company_id; });
    } else {
      req.body.company_id = req.user.company_id;
    }
  }

  const doc = Array.isArray(req.body) 
    ? await Stock.insertMany(req.body) 
    : await Stock.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});