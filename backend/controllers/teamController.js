const Team       = require('../models/teamModel');
const catchAsync = require('../utils/catchAsync');
const AppError   = require('../utils/appError');

// GET /api/v1/teams
exports.getAllTeams = catchAsync(async (req, res) => {
  const teams = await Team.find().sort('-createdAt');
  res.status(200).json({
    status:  'success',
    results: teams.length,
    data:    { teams },
  });
});

// POST /api/v1/teams
exports.createTeam = catchAsync(async (req, res) => {
  const { name, description, members } = req.body;
  const team = await Team.create({
    name,
    description: description || '',
    members:     Array.isArray(members) ? members : [],
    created_by:  req.user._id,
  });
  // Re-fetch to get populated fields
  const populated = await Team.findById(team._id);
  res.status(201).json({ status: 'success', data: { team: populated } });
});

// GET /api/v1/teams/:id
exports.getTeam = catchAsync(async (req, res, next) => {
  const team = await Team.findById(req.params.id);
  if (!team) return next(new AppError('Team not found', 404));
  res.status(200).json({ status: 'success', data: { team } });
});

// PATCH /api/v1/teams/:id
exports.updateTeam = catchAsync(async (req, res, next) => {
  const allowed = ['name', 'description', 'members'];
  const update  = {};
  allowed.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f]; });

  const team = await Team.findByIdAndUpdate(req.params.id, update, {
    new: true, runValidators: true,
  });
  if (!team) return next(new AppError('Team not found', 404));
  res.status(200).json({ status: 'success', data: { team } });
});

// DELETE /api/v1/teams/:id
exports.deleteTeam = catchAsync(async (req, res, next) => {
  const team = await Team.findByIdAndDelete(req.params.id);
  if (!team) return next(new AppError('Team not found', 404));
  res.status(204).json({ status: 'success', data: null });
});

// POST /api/v1/teams/:id/members   body: { userId }
exports.addMember = catchAsync(async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) return next(new AppError('userId is required', 400));

  const team = await Team.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { members: userId } },
    { new: true }
  );
  if (!team) return next(new AppError('Team not found', 404));
  res.status(200).json({ status: 'success', data: { team } });
});

// DELETE /api/v1/teams/:id/members/:userId
exports.removeMember = catchAsync(async (req, res, next) => {
  const team = await Team.findByIdAndUpdate(
    req.params.id,
    { $pull: { members: req.params.userId } },
    { new: true }
  );
  if (!team) return next(new AppError('Team not found', 404));
  res.status(200).json({ status: 'success', data: { team } });
});
