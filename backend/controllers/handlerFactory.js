const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// DELETE
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // Scope by company_id
    const filter = { _id: req.params.id };
    if (req.user?.company_id) filter.company_id = req.user.company_id;

    const doc = await Model.findOneAndDelete(filter);

    if (!doc) {
      return next(new AppError("No document found with that ID in your company", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

// UPDATE
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // Scope by company_id
    const filter = { _id: req.params.id };
    if (req.user?.company_id) filter.company_id = req.user.company_id;

    const doc = await Model.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID in your company", 404));
    }

    res.status(200).json({
      status: "success",
      data: { doc },
    });
  });

// CREATE
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // Automatically set company_id from current user
    if (req.user?.company_id) {
      req.body.company_id = req.user.company_id;
    }

    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: { doc },
    });
  });

// GET ONE
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // Scope by company_id
    const filter = { _id: req.params.id };
    if (req.user?.company_id) filter.company_id = req.user.company_id;

    let query = Model.findOne(filter);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID in your company", 404));
    }

    res.status(200).json({
      status: "success",
      data: { doc },
    });
  });

// GET ALL
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // Scope by company_id
    const filter = {};
    if (req.user?.company_id) filter.company_id = req.user.company_id;

    const docs = await Model.find(filter);

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });
