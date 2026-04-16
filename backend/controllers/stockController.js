const Stock = require('../models/stockModel'); // Path to the schema we created
const factory = require('./handlerFactory'); // The file from your screenshot

// Standard CRUD using your factory functions
exports.getAllStock = factory.getAll(Stock);
exports.getOneStock = factory.getOne(Stock);
// exports.createStock = factory.createOne(Stock);
exports.updateStock = factory.updateOne(Stock);
exports.deleteStock = factory.deleteOne(Stock);

// Custom Logic: If you want specific logic for "taking" or "adding" items
exports.updateStockQuantity = async (req, res, next) => {
    // This is where you would manually update 'lastAddedDate' 
    // or 'lastRemovedDate' based on the request body
};

exports.createStock = async (req, res, next) => {
  try {
    // If req.body is an array, it uses insertMany, otherwise it uses create
    const doc = Array.isArray(req.body) 
      ? await Stock.insertMany(req.body) 
      : await Stock.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  } catch (err) {
    next(err); // This will pass the error to your global error handler
  }
};