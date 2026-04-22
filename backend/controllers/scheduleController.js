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

// ── GET my schedule (current week or ?week_start=YYYY-MM-DD) ─────────────────
exports.getMySchedule = catchAsync(async (req, res, next) => {
  const weekStart = req.query.week_start
    ? getWeekStart(new Date(req.query.week_start))
    : getWeekStart();

  const projectId = req.query.project_id || undefined;

  const filter = { user_id: req.user.id, week_start: weekStart };
  if (projectId) filter.project_id = projectId;

  let schedule = await Schedule.findOne(filter);

  // If no schedule exists yet, return an empty template (don't save yet)
  if (!schedule) {
    return res.status(200).json({
      status: "success",
      data: {
        schedule: {
          user_id: req.user.id,
          project_id: projectId || null,
          week_start: weekStart,
          entries: buildWeekEntries(weekStart),
        },
      },
    });
  }

  res.status(200).json({ status: "success", data: { schedule } });
});

// ── GET team schedules for a project (current or specified week) ─────────────
exports.getProjectSchedules = catchAsync(async (req, res, next) => {
  const weekStart = req.query.week_start
    ? getWeekStart(new Date(req.query.week_start))
    : getWeekStart();

  const schedules = await Schedule.find({
    project_id: req.params.projectId,
    week_start: weekStart,
  });

  res.status(200).json({
    status: "success",
    results: schedules.length,
    data: { schedules },
  });
});

// ── CREATE or UPSERT a schedule entry (admin) ────────────────────────────────
exports.upsertSchedule = catchAsync(async (req, res, next) => {
  const { user_id, project_id, week_start, entries } = req.body;
  if (!user_id || !week_start) {
    return next(new AppError("user_id and week_start are required", 400));
  }

  const ws = getWeekStart(new Date(week_start));

  const schedule = await Schedule.findOneAndUpdate(
    { user_id, project_id: project_id || null, week_start: ws },
    { user_id, project_id: project_id || null, week_start: ws, entries },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({ status: "success", data: { schedule } });
});

// ── UPDATE a single day entry ─────────────────────────────────────────────────
exports.updateScheduleEntry = catchAsync(async (req, res, next) => {
  const { day, shift_type } = req.body;
  const schedule = await Schedule.findById(req.params.id);
  if (!schedule) return next(new AppError("Schedule not found", 404));

  const entry = schedule.entries.find((e) => e.day === day);
  if (!entry) return next(new AppError(`Day "${day}" not found in schedule`, 404));

  entry.shift_type = shift_type;
  await schedule.save();

  res.status(200).json({ status: "success", data: { schedule } });
});

// ── DELETE a schedule ─────────────────────────────────────────────────────────
exports.deleteSchedule = catchAsync(async (req, res, next) => {
  await Schedule.findByIdAndDelete(req.params.id);
  res.status(204).json({ status: "success", data: null });
});
