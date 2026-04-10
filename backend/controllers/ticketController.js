const Ticket = require("../models/ticketModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

exports.createTicket = factory.createOne(Ticket);
exports.getAllTickets = factory.getAll(Ticket);
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

exports.assignTicket = catchAsync(async (req, res) => {
  const ticket = await Ticket.findByIdAndUpdate(
    req.params.id,
    { assign_to: req.body.assign_to, status: "in_progress" },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: { ticket },
  });
});
