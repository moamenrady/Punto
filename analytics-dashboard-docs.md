# Analytics Dashboard — Conversation Summary

> \*\*Project:\*\* MongoDB Aggregation + React Analytics Dashboards
> \*\*Stack:\*\* Node.js · Mongoose · React · Recharts
> \*\*Date:\*\* May 2026

\---

## Overview

This conversation covers the design and generation of a full analytics system built on top of an existing MongoDB/Mongoose backend. The system consists of two layers:

* **Backend** — Pure MongoDB aggregation functions (`.js` files) that query the database and return shaped data
* **Frontend** — React + Recharts dashboards (`.jsx` files) that consume that data and render charts, KPIs, predictions, and insight panels

\---

## Data Models Referenced

The following Mongoose models were used as the basis for all aggregations:

|Model|Collection|Key Fields|
|-|-|-|
|`User`|`users`|`role`, `active`, `plan\_id`, `team\_id`, `custom\_id`|
|`Ticket`|`tickets`|`status`, `priority`, `category`, `assign\_to`, `status\_changed\_at`, `history`|
|`Task`|`tasks`|`status`, `priority`, `sprint\_id`, `backlog\_id`, `status\_changed\_at`|
|`Sprint`|`sprints`|`status`, `start\_date`, `end\_date`, `project\_id`|
|`Team`|`teams`|`name`, `members\[]`, `created\_by`|
|`WeeklyShift`|`weeklyshifts`|`team\_id`, `week\_start`, `members\[].shifts` (sun–sat)|
|`WorkingTask`|`workingtasks`|`task\_id`, `team\_id`, `user\_id`, `start\_date`, `end\_date`|
|`Table` (Stock)|`tables`|`user\_id`, `data\[]` (Map), `filename`|
|`Chat` / `Message` / `ChatMember`|—|Supporting models|
|`Counter`|`counters`|Auto-increment for `custom\_id` generation|

All models use a **custom auto-increment ID** pattern (`usr\_1`, `tkt\_2`, etc.) via a shared `Counter` model.

\---

## Allowed Status Transitions

### Ticket

```
open → in\_progress → resolved → closed
```

### Sprint

```
planned → active → completed
```

### Task

```
todo → in\_progress → completed
```

\---

## Files Generated

### Frontend Dashboards (`\*.jsx`)

Each file is a standalone React component using **Recharts**. All data is currently hardcoded as simulated MongoDB output — replace the top-level arrays with API responses from the backend functions.

|File|Domain|Theme|
|-|-|-|
|`tickets-analysis.jsx`|Support \& Tickets|Dark orange|
|`sprint-tasks-analysis.jsx`|Sprints \& Tasks|Teal / navy|
|`team-productivity-analysis.jsx`|Team \& Shifts|Cyan / dark|
|`stock-inventory-analysis.jsx`|Inventory / Stock|Gold / amber|
|`user-activity-analysis.jsx`|Users \& Activity|Pink / violet|

Each dashboard contains:

* **4 KPI cards** with trend indicators
* **4–6 charts** (bar, area, line, pie, radar)
* **1 prediction/forecast section** with confidence bands
* **6 insight cards** with actionable recommendations

\---

### Backend Aggregation Functions (`\*.js`)

Pure MongoDB/Mongoose aggregation files. No Express routes — these are utility modules to be imported wherever needed.

|File|Models Used|Exports|
|-|-|-|
|`ticketsAnalysis.js`|`Ticket`, `User`|`getTicketKPIs`, `getTicketsByStatus`, `getTicketsByPriority`, `getTicketsByCategory`, `getWeeklyTicketTrend`, `getResolutionTimeByPriority`, `getAgentPerformance`, `getTicketVolumeForecast`, `getFullTicketAnalysis`|
|`sprintTasksAnalysis.js`|`Sprint`, `Task`|`getSprintKPIs`, `getSprintVelocity`, `getTasksByStatus`, `getTasksByPriority`, `getActiveBurndown`, `getSprintHealthRadar`, `getVelocityForecast`, `getFullSprintAnalysis`|
|`teamProductivityAnalysis.js`|`Team`, `WeeklyShift`, `WorkingTask`, `User`|`getTeamKPIs`, `getTeamOutputComparison`, `getWeeklyAttendance`, `getShiftDistribution`, `getTeamBurnoutRisk`, `getMemberBurnoutRisk`, `getTeamRadar`, `getFullTeamAnalysis`|

> `stockInventoryAnalysis.js` and `userActivityAnalysis.js` were not yet generated — see next steps below.

\---

## Prediction Models Used

|Domain|Method|Output|
|-|-|-|
|Ticket volume|Linear regression on 6-week history|Predicted weekly count + 95% confidence interval|
|Ticket resolution time|Avg per priority group|Actual vs predicted hours per priority|
|Sprint velocity|Moving average (last 3 sprints) + std dev|Base / optimistic / pessimistic forecast|
|Sprint burndown|Task completion rate vs ideal line|Remaining tasks per day|
|Team burnout risk|Weighted formula: `nightShifts × 4 + overdueTasks × 2`|Risk score 0–100 per team|
|Member burnout|Hours worked vs 120h baseline over 4 weeks|Individual score 0–100|
|Stock depletion|`currentQty / weeklyUsageRate`|Weeks until depletion + risk label|
|User churn|Inactivity days + task count + login recency|Risk score per user|
|User growth|Linear regression on 6-month registration data|Monthly user count forecast|

\---

## Usage — Backend

Each aggregation file exports a **master function** that runs all queries in parallel and returns a single object shaped for the UI:

```js
const { getFullTicketAnalysis } = require('./ticketsAnalysis');

// In your Express route:
router.get('/analysis/tickets', async (req, res) => {
  const data = await getFullTicketAnalysis();
  res.json(data);
});
```

Individual functions can also be called separately if you need partial data:

```js
const { getTicketVolumeForecast } = require('./ticketsAnalysis');
const forecast = await getTicketVolumeForecast();
```

\---

## Usage — Frontend

In each `.jsx` file, the hardcoded arrays at the top should be replaced with API calls. Example:

```js
// Before (hardcoded)
const ticketsByStatus = \[
  { status: "open", count: 47 },
  ...
];

// After (real API)
const \[ticketsByStatus, setTicketsByStatus] = useState(\[]);

useEffect(() => {
  fetch('/api/analysis/tickets')
    .then(r => r.json())
    .then(data => setTicketsByStatus(data.byStatus));
}, \[]);
```

\---

## Installation

```bash
# Backend dependencies (already in project)
npm install mongoose

# Frontend dependencies
npm install recharts
```

Google Fonts used across dashboards:

* `IBM Plex Sans` — tickets, sprint, stock
* `IBM Plex Mono` — stock
* `Space Mono` — sprint
* `Inter` — team, users
* `Fira Code` — users
* `DM Mono` — tickets

\---

## Next Steps

* \[ ] Generate `stockInventoryAnalysis.js` — aggregations from the `Table` model
* \[ ] Generate `userActivityAnalysis.js` — aggregations from `User`, `WorkingTask`, `ChatMember`
* \[ ] Add Express routes that call each master function
* \[ ] Wire frontend components to real API endpoints
* \[ ] Add date-range filters to all aggregations (`startDate` / `endDate` params)
* \[ ] Add pagination to agent performance and member burnout lists
* \[ ] Cache heavy aggregations with Redis or in-memory TTL

