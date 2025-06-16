const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { getDashboardData, getUserDashboardData, getTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist } = require("../controllers/taskController");

const taskRouter = express.Router();


taskRouter.get("/dashboard-data", protect, getDashboardData);
taskRouter.get("/user-dashboard-data", protect, getUserDashboardData);
taskRouter.get("/", protect, getTasks);
taskRouter.get("/:id", protect, getTaskById);
taskRouter.post("/", protect, adminOnly, createTask);
taskRouter.put("/:id", protect, updateTask);
taskRouter.delete("/:id", protect, adminOnly, deleteTask);
taskRouter.put("/:id/status", protect, updateTaskStatus);
taskRouter.put("/:id/todo", protect, updateTaskChecklist);

module.exports = taskRouter;