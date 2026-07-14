const Sprint = require("../models/sprintModel");
const Task = require("../models/taskModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

// Middleware: set project_id from params if missing in body
exports.setProjectId = (req, res, next) => {
  if (!req.body.project_id && req.params.projectId)
    req.body.project_id = req.params.projectId;
  next();
};

// Use factory for CRUD
exports.createSprint = factory.createOne(Sprint);
exports.getSprint = factory.getOne(Sprint);
exports.updateSprint = factory.updateOne(Sprint);
exports.deleteSprint = factory.deleteOne(Sprint);

// GET ALL
exports.getAllSprints = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.params.projectId) filter.project_id = req.params.projectId;
  
  // Mandatory company scope
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  const sprints = await Sprint.find(filter);

  res.status(200).json({
    status: "success",
    results: sprints.length,
    data: { sprints },
  });
});

// ===============================
// 📊 SPRINT ANALYTICS
// ===============================

exports.getActiveSprintBurndown = catchAsync(async (req, res, next) => {
  const queryObj = { _id: req.params.sprintId };
  if (req.user?.company_id) queryObj.company_id = req.user.company_id;

  const sprint = await Sprint.findOne(queryObj);
  if (!sprint || sprint.status !== "active") {
    return res.status(200).json({
      status: "success",
      data: null,
    });
  }

  const dailyCompletions = await Task.aggregate([
    { $match: { sprint_id: sprint._id } },
    {
      $facet: {
        totalTasks: [{ $count: "count" }],
        completedByDay: [
          {
            $match: {
              status: "completed",
              status_changed_at: { $ne: null },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$status_changed_at",
                },
              },
              tasksCompleted: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ],
      },
    },
  ]);

  const totalTasks = dailyCompletions[0].totalTasks[0]?.count || 0;
  const completions = dailyCompletions[0].completedByDay;

  let currentRemaining = totalTasks;
  const burndownData = completions.map((day) => {
    currentRemaining -= day.tasksCompleted;
    return {
      date: day._id,
      actualRemaining: currentRemaining,
    };
  });

  res.status(200).json({
    status: "success",
    data: {
      totalTasks,
      burndownData,
    },
  });
});

exports.getSprintVelocityAndCompletion = catchAsync(async (req, res, next) => {
  const projectId = req.params.projectId;
  const mongoose = require("mongoose");

  const matchFilter = {};
  if (req.user?.company_id) {
    matchFilter.company_id = new mongoose.Types.ObjectId(req.user.company_id);
  }

  const velocity = await Task.aggregate([
    { $match: matchFilter },
    {
      $lookup: {
        from: "sprints",
        localField: "sprint_id",
        foreignField: "_id",
        as: "sprint",
      },
    },
    { $unwind: "$sprint" },
    { $match: { "sprint.project_id": new mongoose.Types.ObjectId(projectId) } },
    {
      $group: {
        _id: "$sprint.name",
        sprintStartDate: { $first: "$sprint.start_date" },
        planned: { $sum: 1 },
        completed: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        sprintName: "$_id",
        planned: 1,
        completed: 1,
        completionRate: {
          $round: [
            {
              $multiply: [{ $divide: ["$completed", "$planned"] }, 100],
            },
            0,
          ],
        },
        sprintStartDate: 1,
        _id: 0,
      },
    },
    { $sort: { sprintStartDate: 1 } },
  ]);

  res.status(200).json({
    status: "success",
    data: { velocity },
  });
});

exports.getAllSprintsStatusOverview = catchAsync(async (req, res, next) => {
  const mongoose = require("mongoose");
  const projectId = req.query.projectId;

  const matchFilter = {};
  if (req.user?.company_id) {
    matchFilter.company_id = new mongoose.Types.ObjectId(req.user.company_id);
  }

  const pipeline = [
    { $match: matchFilter },
    {
      $lookup: {
        from: "sprints",
        localField: "sprint_id",
        foreignField: "_id",
        as: "sprintInfo",
      },
    },
    { $unwind: "$sprintInfo" },
  ];

  if (projectId) {
    pipeline.push({
      $match: { "sprintInfo.project_id": new mongoose.Types.ObjectId(projectId) }
    });
  }

  pipeline.push(
    {
      $group: {
        _id: {
          sprintId: "$sprint_id",
          sprintName: "$sprintInfo.name",
          status: "$status",
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.sprintName",
        statuses: {
          $push: {
            status: "$_id.status",
            count: "$count",
          },
        },
        totalTasks: { $sum: "$count" },
      },
    },
    {
      $project: {
        sprintName: "$_id",
        statuses: 1,
        totalTasks: 1,
        _id: 0,
      },
    },
    { $sort: { sprintName: 1 } },
  );

  const overview = await Task.aggregate(pipeline);

  res.status(200).json({
    status: "success",
    data: { overview },
  });
});

exports.getFinalGlobalKPIs = catchAsync(async (req, res, next) => {
  const mongoose = require("mongoose");
  const projectId = req.query.projectId;
  
  const queryFilter = {};
  if (req.user?.company_id) {
    queryFilter.company_id = req.user.company_id;
  }
  if (projectId) {
    queryFilter.project_id = projectId;
  }

  const activeSprintsCount = await Sprint.countDocuments({ status: "active", ...queryFilter });

  let backlogTasksCount = 0;
  if (projectId) {
    const Backlog = require("../models/backlogModel");
    const backlogs = await Backlog.find({ project_id: projectId });
    const backlogIds = backlogs.map(b => b._id);
    
    const backlogQuery = {
      sprint_id: { $exists: false },
      backlog_id: { $in: backlogIds }
    };
    if (req.user?.company_id) backlogQuery.company_id = req.user.company_id;
    backlogTasksCount = await Task.countDocuments(backlogQuery);
  } else {
    backlogTasksCount = await Task.countDocuments({
      sprint_id: { $exists: false },
      ...queryFilter,
    });
  }

  const aggregateMatch = {};
  if (req.user?.company_id) {
    aggregateMatch.company_id = new mongoose.Types.ObjectId(req.user.company_id);
  }

  const pipeline = [
    { $match: aggregateMatch },
    {
      $lookup: {
        from: "sprints",
        localField: "sprint_id",
        foreignField: "_id",
        as: "sprint",
      },
    },
    { $unwind: "$sprint" }
  ];

  if (projectId) {
    pipeline.push({
      $match: { "sprint.project_id": new mongoose.Types.ObjectId(projectId) }
    });
  }

  pipeline.push({
    $group: {
      _id: null,
      totalPlanned: { $sum: 1 },
      totalDone: {
        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
      },
      doneInFinishedSprints: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$sprint.status", "completed"] },
                { $eq: ["$status", "completed"] },
              ],
            },
            1,
            0,
          ],
        },
      },
    },
  });

  const stats = await Task.aggregate(pipeline);

  const data = stats[0] || {
    totalPlanned: 0,
    totalDone: 0,
    doneInFinishedSprints: 0,
  };
  
  const finishedSprintFilter = { status: "completed" };
  if (req.user?.company_id) finishedSprintFilter.company_id = req.user.company_id;
  if (projectId) finishedSprintFilter.project_id = projectId;
  
  const finishedSprintsCount = await Sprint.countDocuments(finishedSprintFilter);

  const avgVelocity =
    finishedSprintsCount > 0
      ? Math.round(data.doneInFinishedSprints / finishedSprintsCount)
      : 0;
  const completionRate =
    data.totalPlanned > 0
      ? Math.round((data.totalDone / data.totalPlanned) * 100)
      : 0;

  res.status(200).json({
    status: "success",
    data: {
      avgVelocity: `${avgVelocity} Tasks/Sprint`,
      completionRate: `${completionRate}%`,
      activeSprints: activeSprintsCount,
      backlogTasks: backlogTasksCount,
    },
  });
});
