const Team       = require('../models/teamModel');
const catchAsync = require('../utils/catchAsync');
const AppError   = require('../utils/appError');
const factory    = require('./handlerFactory');

// Use factory for basic CRUD
exports.getAllTeams = factory.getAll(Team);
exports.getTeam = factory.getOne(Team);
// Custom Update Team to handle member format transformation
exports.updateTeam = catchAsync(async (req, res, next) => {
  const filter = { _id: req.params.id };
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  // Transform members if present in request body
  if (req.body.members && Array.isArray(req.body.members)) {
    req.body.members = req.body.members.map(m => 
      (typeof m === 'string' ? { user: m } : m)
    );
  }

  const team = await Team.findOneAndUpdate(filter, req.body, {
    new: true,
    runValidators: true
  });

  if (!team) {
    return next(new AppError('No team found with that ID in your company', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { team }
  });
});
exports.deleteTeam = factory.deleteOne(Team);

// CREATE (Custom logic to set created_by)
exports.createTeam = catchAsync(async (req, res, next) => {
  const { name, description, members } = req.body;

  if (!name || name.trim().length < 2) {
    return next(new AppError('Team name is required and must be at least 2 characters.', 400));
  }

  // Set created_by and company_id automatically
  // Transform plain IDs into { user: id } objects expected by teamMemberSchema
  const memberDocs = Array.isArray(members)
    ? members.map(m => (typeof m === 'string' ? { user: m } : m))
    : [];

  const teamData = {
    name:        name.trim(),
    description: description?.trim() || '',
    members:     memberDocs,
    created_by:  req.user._id,
  };

  if (req.user?.company_id) teamData.company_id = req.user.company_id;

  const team = await Team.create(teamData);

  res.status(201).json({ status: 'success', data: { team } });
});

// ADD MEMBER
exports.addMember = catchAsync(async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) return next(new AppError('userId is required', 400));

  const filter = { _id: req.params.id };
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  // Check if user is already a member
  const existing = await Team.findOne({ ...filter, 'members.user': userId });
  if (existing) {
    return res.status(200).json({ status: 'success', data: { team: existing } });
  }

  const team = await Team.findOneAndUpdate(
    filter,
    { $push: { members: { user: userId } } },
    { new: true }
  );

  if (!team) return next(new AppError('Team not found in your company', 404));
  res.status(200).json({ status: 'success', data: { team } });
});

// REMOVE MEMBER
exports.removeMember = catchAsync(async (req, res, next) => {
  const filter = { _id: req.params.id };
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  const team = await Team.findOneAndUpdate(
    filter,
    { $pull: { members: { user: req.params.userId } } },
    { new: true }
  );

  if (!team) return next(new AppError('Team not found in your company', 404));
  res.status(200).json({ status: 'success', data: { team } });
});

// GET USER TEAM
exports.getUserTeam = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const filter = { members: userId };
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  const team = await Team.findOne(filter);

  if (!team) {
    return res.status(200).json(null);
  }

  res.status(200).json(team);
});