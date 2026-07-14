const WorkingTask = require("../models/WorkingTask");
const WeeklyShift = require("../models/scheduleModel");
const catchAsync = require("../utils/catchAsync");

// ===============================
// 📊 WORK / ACTIVITY ANALYTICS
// ===============================

exports.getActivityHeatmapFromWork = catchAsync(async (req, res, next) => {
  const mongoose = require("mongoose");
  const matchFilter = { start_date: { $ne: null } };
  if (req.user?.company_id) {
    matchFilter.company_id = new mongoose.Types.ObjectId(req.user.company_id);
  }

  const activityData = await WorkingTask.aggregate([
    { $match: matchFilter },
    {
      $project: {
        hourOfDay: { $hour: "$start_date" },
        dayOfWeek: { $dayOfWeek: "$start_date" },
      },
    },
    {
      $facet: {
        byTimeOfDay: [
          { $group: { _id: "$hourOfDay", activityCount: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ],
        byDayOfWeek: [
          { $group: { _id: "$dayOfWeek", activityCount: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ],
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: activityData[0],
  });
});

exports.getTeamOutputComparison = catchAsync(async (req, res, next) => {
  const mongoose = require("mongoose");
  const matchFilter = { end_date: { $ne: null }, start_date: { $ne: null } };
  if (req.user?.company_id) {
    matchFilter.company_id = new mongoose.Types.ObjectId(req.user.company_id);
  }

  const outputData = await WorkingTask.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: "$team_id",
        uniqueTasksCompleted: { $addToSet: "$task_id" },
        totalTimeMs: { $sum: { $subtract: ["$end_date", "$start_date"] } },
      },
    },
    {
      $lookup: {
        from: "teams",
        localField: "_id",
        foreignField: "_id",
        as: "team",
      },
    },
    { $unwind: "$team" },
    {
      $project: {
        teamName: "$team.name",
        tasksCompleted: { $size: "$uniqueTasksCompleted" },
        hoursLogged: {
          $round: [{ $divide: ["$totalTimeMs", 1000 * 60 * 60] }, 1],
        },
        _id: 0,
      },
    },
    { $sort: { teamName: 1 } },
  ]);

  res.status(200).json({
    status: "success",
    data: { outputData },
  });
});

exports.getMemberWorkload = catchAsync(async (req, res, next) => {
  const BASE_WEEKLY_HOURS = 40;
  const mongoose = require("mongoose");
  const matchFilter = { end_date: { $ne: null }, start_date: { $ne: null } };
  if (req.user?.company_id) {
    matchFilter.company_id = new mongoose.Types.ObjectId(req.user.company_id);
  }

  const memberData = await WorkingTask.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: "$user_id",
        uniqueTasks: { $addToSet: "$task_id" },
        totalTimeMs: { $sum: { $subtract: ["$end_date", "$start_date"] } },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        name: "$user.name",
        tasksCount: { $size: "$uniqueTasks" },
        hoursLogged: {
          $round: [{ $divide: ["$totalTimeMs", 1000 * 60 * 60] }, 1],
        },
      },
    },
    {
      $addFields: {
        burnoutPercentage: {
          $min: [
            100,
            {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$hoursLogged", BASE_WEEKLY_HOURS] },
                    100,
                  ],
                },
                0,
              ],
            },
          ],
        },
      },
    },
    {
      $addFields: {
        riskLevel: {
          $switch: {
            branches: [
              { case: { $gte: ["$burnoutPercentage", 80] }, then: "HIGH" },
              { case: { $gte: ["$burnoutPercentage", 50] }, then: "MOD" },
            ],
            default: "OK",
          },
        },
      },
    },
    { $sort: { burnoutPercentage: -1 } },
  ]);

  res.status(200).json({
    status: "success",
    data: { memberData },
  });
});

// ===============================
// 📊 SHIFT ANALYTICS
// ===============================

exports.getWeeklyAttendanceTrend = catchAsync(async (req, res, next) => {
  const mongoose = require("mongoose");
  const matchFilter = {};
  if (req.user?.company_id) {
    matchFilter.company_id = new mongoose.Types.ObjectId(req.user.company_id);
  }

  const trend = await WeeklyShift.aggregate([
    { $match: matchFilter },
    { $unwind: "$members" },
    {
      $project: {
        week_start: 1,
        shiftsArray: { $objectToArray: "$members.shifts" },
      },
    },
    { $unwind: "$shiftsArray" },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$week_start" },
        },
        totalShiftDays: { $sum: 1 },
        presentDays: {
          $sum: {
            $cond: [{ $ne: ["$shiftsArray.v", "Off"] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        week: "$_id",
        presentPercentage: {
          $round: [
            {
              $multiply: [
                { $divide: ["$presentDays", "$totalShiftDays"] },
                100,
              ],
            },
            0,
          ],
        },
        _id: 0,
      },
    },
    { $sort: { week: 1 } },
  ]);

  res.status(200).json({
    status: "success",
    data: { trend },
  });
});

exports.getShiftAnalytics = catchAsync(async (req, res, next) => {
  const weekStart = req.query.weekStart;
  const mongoose = require("mongoose");

  const matchFilter = { week_start: new Date(weekStart) };
  if (req.user?.company_id) {
    matchFilter.company_id = new mongoose.Types.ObjectId(req.user.company_id);
  }

  const shiftData = await WeeklyShift.aggregate([
    { $match: matchFilter },
    { $unwind: "$members" },
    { $project: { shiftsArray: { $objectToArray: "$members.shifts" } } },
    { $unwind: "$shiftsArray" },
    {
      $group: {
        _id: "$shiftsArray.v",
        count: { $sum: 1 },
      },
    },
  ]);

  let totalShifts = 0;
  let nightShifts = 0;
  const distribution = {};

  shiftData.forEach((shift) => {
    distribution[shift._id] = shift.count;
    totalShifts += shift.count;
    if (shift._id === "Night") nightShifts = shift.count;
  });

  const nightShiftLoad =
    totalShifts > 0 ? Math.round((nightShifts / totalShifts) * 100) : 0;

  res.status(200).json({
    status: "success",
    data: {
      distribution,
      nightShiftLoad: `${nightShiftLoad}%`,
    },
  });
});
