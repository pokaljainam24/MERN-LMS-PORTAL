const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { getUsers, getUserById } = require("../controllers/userController");

const userRouter = express.Router();

// User Mange router
userRouter.get("/", protect, adminOnly, getUsers);
userRouter.get("/:id", protect, getUserById);

module.exports = userRouter;