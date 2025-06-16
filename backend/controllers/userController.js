const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// grt all users(admin only)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'member' }).select("-password");

        // add task 
        const usersWithTaskCounts = await Promise.all(
            users.map(async (user) => {
                const pendingTasks = await Task.countDocuments({
                    assignedTo: user._id, status: "Panding"
                });

                const inProgressTask = await Task.countDocuments({
                    assignedTo: user._id, status: "In Progress"
                });

                const completedTask = await Task.countDocuments({
                    assignedTo: user._id, status: "Completed"
                });

                return {
                    ...user._doc,
                    pendingTasks,
                    inProgressTask,
                    completedTask
                }
            })
        )
        res.json(usersWithTaskCounts);
    } catch (error) {
        res.status(500).json({ msg: "Error fetching users" });
    }
}


// get user by id
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: "Error fetching user" });
    }
}



module.exports = { getUsers, getUserById };