const Schedule = require("../models/scheduleModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Utility: get the Sunday of the week for a given date
const getWeekStart = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay()); // move back to Sunday
  return d;
};

// Build the 7-day entries skeleton for a week starting at `weekStart`
const buildWeekEntries = (weekStart) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days.map((day, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    return { day, date, shift_type: "off" };
  });
};

// ── GET my schedule ─────────────────
exports.getMySchedule = catchAsync(async (req, res, next) => {
  const weekStart = req.query.week_start
    ? getWeekStart(new Date(req.query.week_start))
    : getWeekStart();

  const projectId = req.query.project_id || undefined;

  const filter = { user_id: req.user.id, week_start: weekStart };
  if (projectId) filter.project_id = projectId;
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  let schedule = await Schedule.findOne(filter);

  if (!schedule) {
    return res.status(200).json({
      status: "success",
      data: {
        schedule: {
          user_id: req.user.id,
          project_id: projectId || null,
          company_id: req.user.company_id,
          week_start: weekStart,
          entries: buildWeekEntries(weekStart),
        },
      },
    });
  }

  res.status(200).json({ status: "success", data: { schedule } });
});

// ── GET team schedules ─────────────
exports.getProjectSchedules = catchAsync(async (req, res, next) => {
  const weekStart = req.query.week_start
    ? getWeekStart(new Date(req.query.week_start))
    : getWeekStart();

  const filter = {
    project_id: req.params.projectId,
    week_start: weekStart,
  };
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  const schedules = await Schedule.find(filter);

  res.status(200).json({
    status: "success",
    results: schedules.length,
    data: { schedules },
  });
});

// ── UPSERT schedule ────────────────────────────────
exports.upsertSchedule = catchAsync(async (req, res, next) => {
  const { user_id, project_id, week_start, entries } = req.body;
  if (!user_id || !week_start) {
    return next(new AppError("user_id and week_start are required", 400));
  }

  const ws = getWeekStart(new Date(week_start));
  
  const query = { user_id, project_id: project_id || null, week_start: ws };
  if (req.user?.company_id) query.company_id = req.user.company_id;

  const updateData = { ...query, entries };

  const schedule = await Schedule.findOneAndUpdate(
    query,
    updateData,
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({ status: "success", data: { schedule } });
});

// ── UPDATE single entry ─────────────────────────────────────────────────
exports.updateScheduleEntry = catchAsync(async (req, res, next) => {
  const { day, shift_type } = req.body;
  
  const filter = { _id: req.params.id };
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  const schedule = await Schedule.findOne(filter);
  if (!schedule) return next(new AppError("Schedule not found in your company", 404));

  const entry = schedule.entries.find((e) => e.day === day);
  if (!entry) return next(new AppError(`Day "${day}" not found in schedule`, 404));

  entry.shift_type = shift_type;
  await schedule.save();

  res.status(200).json({ status: "success", data: { schedule } });
});

// ── DELETE ─────────────────────────────────────────────────────────
exports.deleteSchedule = catchAsync(async (req, res, next) => {
  const filter = { _id: req.params.id };
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  const schedule = await Schedule.findOneAndDelete(filter);
  if (!schedule) return next(new AppError("Schedule not found in your company", 404));

  res.status(204).json({ status: "success", data: null });
});
