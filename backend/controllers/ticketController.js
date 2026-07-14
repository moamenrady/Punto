const Ticket = require("../models/ticketModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

exports.createTicket = catchAsync(async (req, res, next) => {
  // If a file was uploaded, add it to req.body.attachments
  if (req.file) {
    req.body.attachments = [{
      data: req.file.buffer,
      contentType: req.file.mimetype,
      filename: req.file.originalname
    }];
  }

  // Set company_id from user
  if (req.user?.company_id) {
    req.body.company_id = req.user.company_id;
  }

  const newTicket = await Ticket.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      data: newTicket
    }
  });
});
exports.getAllTickets = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  const role = req.user?.role;
  const dept = req.user?.dept?.toUpperCase();

  const isAuthorized =
    role === "admin" ||
    role === "manager" ||
    (role === "user" && dept === "IT");

  if (!isAuthorized) {
    // If not authorized to see system-wide tickets, only return tickets created by the user
    filter.created_by = req.user._id;
  }

  const tickets = await Ticket.find(filter);

  res.status(200).json({
    status: "success",
    results: tickets.length,
    data: {
      data: tickets,
    },
  });
});
exports.getTicket = factory.getOne(Ticket);
exports.updateTicket = factory.updateOne(Ticket);
exports.deleteTicket = factory.deleteOne(Ticket);

// Additional: Get tickets by status
// exports.getTicketsByStatus = catchAsync(async (req, res, next) => {
//   const status = req.params.status;
//   const tickets = await Ticket.find({ status });

//   res.status(200).json({
//     status: "success",
//     results: tickets.length,
//     data: { tickets },
//   });
// });

// Additional: Assign ticket to user
// exports.assignTicket = catchAsync(async (req, res, next) => {
//   const { ticketId, userId } = req.params;
//   const ticket = await Ticket.findByIdAndUpdate(
//     ticketId,
//     { assign_to: userId },
//     { new: true, runValidators: true }
//   );
//   if (!ticket) return next(new AppError("No ticket found with that ID", 404));

//   res.status(200).json({
//     status: "success",
//     data: { ticket },
//   });
// });

exports.assignTicket = catchAsync(async (req, res, next) => {
  const filter = { _id: req.params.id };
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  const ticket = await Ticket.findOneAndUpdate(
    filter,
    { assign_to: req.body.assign_to, status: "in_progress" },
    { new: true, runValidators: true }
  );

  if (!ticket) return next(new AppError("Ticket not found in your company", 404));

  res.status(200).json({
    status: "success",
    data: { ticket },
  });
});

// ===============================
// 📊 TICKET ANALYTICS
// ===============================

exports.getWeeklyTrends = catchAsync(async (req, res, next) => {
  const mongoose = require("mongoose");
  const matchFilter = {};
  if (req.user?.company_id) {
    matchFilter.company_id = new mongoose.Types.ObjectId(req.user.company_id);
  }

  const trends = await Ticket.aggregate([
    { $match: matchFilter },
    {
      $facet: {
        openedPerWeek: [
          {
            $group: {
              _id: {
                year: { $isoWeekYear: "$createdAt" },
                week: { $isoWeek: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.week": 1 } },
        ],
        resolvedPerWeek: [
          { $match: { status: { $in: ["resolved", "closed"] } } },
          {
            $group: {
              _id: {
                year: { $isoWeekYear: "$status_changed_at" },
                week: { $isoWeek: "$status_changed_at" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.week": 1 } },
        ],
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: trends[0],
  });
});

exports.getDashboardKPIs = catchAsync(async (req, res, next) => {
  const mongoose = require("mongoose");
  const matchFilter = {};
  if (req.user?.company_id) {
    matchFilter.company_id = new mongoose.Types.ObjectId(req.user.company_id);
  }

  const result = await Ticket.aggregate([
    { $match: matchFilter },
    {
      $facet: {
        activeTickets: [
          { $match: { status: { $in: ["open", "in_progress"] } } },
          { $count: "total" },
        ],
        criticalTickets: [
          { $match: { priority: "critical" } },
          { $count: "total" },
        ],
        statusDistribution: [
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ],
        priorityBreakdown: [
          { $group: { _id: "$priority", count: { $sum: 1 } } },
        ],
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      activeTickets: result[0].activeTickets[0]?.total || 0,
      criticalTickets: result[0].criticalTickets[0]?.total || 0,
      statusDistribution: result[0].statusDistribution,
      priorityBreakdown: result[0].priorityBreakdown,
    },
  });
});

exports.getTicketsByCategory = catchAsync(async (req, res, next) => {
  const mongoose = require("mongoose");
  const matchFilter = {};
  if (req.user?.company_id) {
    matchFilter.company_id = new mongoose.Types.ObjectId(req.user.company_id);
  }

  const categories = await Ticket.aggregate([
    { $match: matchFilter },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $project: { category: "$_id", count: 1, _id: 0 } },
    { $sort: { count: -1 } },
  ]);

  res.status(200).json({
    status: "success",
    data: { categories },
  });
});

exports.getResolutionAnalytics = catchAsync(async (req, res, next) => {
  const mongoose = require("mongoose");
  const matchFilter = {
    status: { $in: ["resolved", "closed"] },
    status_changed_at: { $ne: null },
  };
  if (req.user?.company_id) {
    matchFilter.company_id = new mongoose.Types.ObjectId(req.user.company_id);
  }

  const resolutionData = await Ticket.aggregate([
    { $match: matchFilter },
    {
      $project: {
        priority: 1,
        resolutionTimeMs: { $subtract: ["$status_changed_at", "$createdAt"] },
      },
    },
    {
      $group: {
        _id: "$priority",
        avgResolutionMs: { $avg: "$resolutionTimeMs" },
        ticketCount: { $sum: 1 },
      },
    },
    {
      $project: {
        priority: "$_id",
        avgResolutionHours: {
          $round: [
            { $divide: ["$avgResolutionMs", 1000 * 60 * 60] },
            2,
          ],
        },
        ticketCount: 1,
        _id: 0,
      },
    },
    { $sort: { avgResolutionHours: -1 } },
  ]);

  const totalHours = resolutionData.reduce(
    (acc, curr) => acc + curr.avgResolutionHours * curr.ticketCount,
    0
  );
  const totalTickets = resolutionData.reduce(
    (acc, curr) => acc + curr.ticketCount,
    0
  );
  const overallAvg =
    totalTickets > 0 ? (totalHours / totalTickets).toFixed(2) : 0;

  res.status(200).json({
    status: "success",
    data: {
      overallAverageHours: overallAvg,
      breakdownByPriority: resolutionData,
    },
  });
});

// GET TICKET ATTACHMENT
exports.getTicketAttachment = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return next(new AppError("Ticket not found", 404));

  const index = parseInt(req.params.index, 10) || 0;
  const attachment = ticket.attachments[index];
  if (!attachment || !attachment.data) {
    return next(new AppError("Attachment not found", 404));
  }

  res.set("Content-Type", attachment.contentType);
  res.send(attachment.data);
});
