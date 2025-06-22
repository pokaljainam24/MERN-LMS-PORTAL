const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { exportTasksReport, exportUsersReport } = require("../controllers/reportController");


const reportRouter = express.Router();

reportRouter.get("/export/tasks", protect, adminOnly, exportTasksReport);
reportRouter.get("/export/users", protect, adminOnly, exportUsersReport);

module.exports = reportRouter;