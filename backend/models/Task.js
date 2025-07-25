const { default: mongoose } = require("mongoose");

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    completed: {    
        type: Boolean,
        default: false
    }
});

const TaskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending"
    },
    dueDate: {
        type: Date,
        required: true
    },
    assignedTo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    createdBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    attachments: [
        {
            type: String
        }
    ],
    todoChecklist: [todoSchema],
    progress: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
