const WorkingTask = require("../models/WorkingTask");
const WeeklyShift = require("../models/scheduleModel");
const User = require("../models/userModel");
const Company = require("../models/companyModel");
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
  const matchFilter = { start_date: { $ne: null } };
  if (req.user?.company_id) {
    matchFilter.company_id = new mongoose.Types.ObjectId(req.user.company_id);
  }

  const outputData = await WorkingTask.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: "$team_id",
        uniqueTasksCompleted: { $addToSet: "$task_id" },
        totalTimeMs: { $sum: { $subtract: [{ $ifNull: ["$end_date", new Date()] }, "$start_date"] } },
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
  const matchFilter = { start_date: { $ne: null } };
  if (req.user?.company_id) {
    matchFilter.company_id = new mongoose.Types.ObjectId(req.user.company_id);
  }

  const memberData = await WorkingTask.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: "$user_id",
        uniqueTasks: { $addToSet: "$task_id" },
        totalTimeMs: { $sum: { $subtract: [{ $ifNull: ["$end_date", new Date()] }, "$start_date"] } },
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
    { $unwind: "$entries" },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$week_start" },
        },
        totalShiftDays: { $sum: 1 },
        presentDays: {
          $sum: {
            $cond: [
              { $in: [{ $toLower: { $ifNull: ["$entries.shift_type", "off"] } }, ["morning", "afternoon", "night", "arrived", "timeout"]] },
              1,
              0
            ],
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
                { $divide: ["$presentDays", { $cond: [{ $eq: ["$totalShiftDays", 0] }, 1, "$totalShiftDays"] }] },
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

  let matchFilter = {};
  if (req.user?.company_id) {
    matchFilter.company_id = new mongoose.Types.ObjectId(req.user.company_id);
  }

  if (weekStart) {
    const targetDate = new Date(weekStart);
    const startOfDay = new Date(targetDate.setUTCHours(0,0,0,0));
    const endOfDay = new Date(targetDate.setUTCHours(23,59,59,999));
    
    const dateExists = await WeeklyShift.findOne({ 
      company_id: req.user?.company_id, 
      week_start: { $gte: startOfDay, $lte: endOfDay } 
    });
    if (dateExists) {
      matchFilter.week_start = { $gte: startOfDay, $lte: endOfDay };
    } else {
      const latestShift = await WeeklyShift.findOne({ company_id: req.user?.company_id }).sort({ week_start: -1 });
      if (latestShift) matchFilter.week_start = latestShift.week_start;
    }
  } else {
    const latestShift = await WeeklyShift.findOne({ company_id: req.user?.company_id }).sort({ week_start: -1 });
    if (latestShift) matchFilter.week_start = latestShift.week_start;
  }

  const shiftData = await WeeklyShift.aggregate([
    { $match: matchFilter },
    { $unwind: "$entries" },
    {
      $group: {
        _id: "$entries.shift_type",
        count: { $sum: 1 },
      },
    },
  ]);

  let totalShifts = 0;
  let nightShifts = 0;
  const distribution = {};

  shiftData.forEach((shift) => {
    const rawVal = shift._id || "off";
    const label = rawVal.charAt(0).toUpperCase() + rawVal.slice(1).toLowerCase();
    distribution[label] = shift.count;
    totalShifts += shift.count;
    if (label === "Night") nightShifts = shift.count;
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
