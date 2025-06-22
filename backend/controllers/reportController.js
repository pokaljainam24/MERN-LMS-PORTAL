const Task = require('../models/Task');
const User = require('../models/User');
const ExcelJS = require('exceljs');

// ──────────────────────────────────────
// 1️⃣  Export ALL Tasks  (admin only)
// ──────────────────────────────────────
const exportTasksReport = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('assignedTo', 'name email');

        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Tasks Report');

        ws.columns = [
            { header: 'Task ID', key: 'id', width: 25 },
            { header: 'Title', key: 'title', width: 30 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Priority', key: 'priority', width: 15 },
            { header: 'Status', key: 'status', width: 18 },
            { header: 'Due Date', key: 'dueDate', width: 20 },
            { header: 'Assigned To', key: 'assignedTo', width: 35 }
        ];

        tasks.forEach(task => {
            const assignedStr = (Array.isArray(task.assignedTo) ? task.assignedTo : [])
                .map(u => `${u.name} (${u.email})`)
                .join(', ') || 'Unassigned';

            ws.addRow({
                id: String(task._id),
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate?.toISOString().split('T')[0] || '',
                assignedTo: assignedStr
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="tasks-report.xlsx"'
        );

        await wb.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error exporting tasks', error: err.message });
    }
};

// ──────────────────────────────────────
// 2️⃣  Export USER-wise Task Summary  (admin only)
// ──────────────────────────────────────
const exportUsersReport = async (req, res) => {
    try {
        const users = await User.find().select('_id name email').lean();
        const tasks = await Task.find()
            .populate('assignedTo', '_id'); // ids enough

        // ➊ initialise map user → counters
        const userTaskMap = {};
        users.forEach(u => {
            userTaskMap[u._id] = {
                name: u.name,
                email: u.email,
                taskCount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0
            };
        });

        // ➋ walk through every task once
        tasks.forEach(t => {
            if (!Array.isArray(t.assignedTo)) return;
            t.assignedTo.forEach(u => {
                const m = userTaskMap[u._id];
                if (!m) return;                     // just in case
                m.taskCount += 1;
                if (t.status === 'Pending') m.pendingTasks += 1;
                else if (t.status === 'In Progress') m.inProgressTasks += 1;
                else if (t.status === 'Completed') m.completedTasks += 1;
            });
        });

        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('User Task Report');

        ws.columns = [
            { header: 'User Name', key: 'name', width: 30 },
            { header: 'Email', key: 'email', width: 35 },
            { header: 'Total Assigned', key: 'taskCount', width: 15 },
            { header: 'Pending', key: 'pendingTasks', width: 12 },
            { header: 'In Progress', key: 'inProgressTasks', width: 15 },
            { header: 'Completed', key: 'completedTasks', width: 12 }
        ];

        Object.values(userTaskMap).forEach(row => ws.addRow(row));

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="user-task-report.xlsx"'
        );

        await wb.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error exporting user report', error: err.message });
    }
};

module.exports = { exportTasksReport, exportUsersReport };
