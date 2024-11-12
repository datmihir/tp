const db = require('../config/db');

exports.getAllTasks = (req, res) => {
    const query = 'SELECT * FROM tasks WHERE userId = ?';
    const userId = req.user.id; 
    db.query(query, [userId], (err, result) => {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
};

exports.createTask = (req, res) => {
    const { userId, title, description, dueDate, status = 'pending', priority } = req.body;

    const query = 'INSERT INTO tasks (userId, title, description, dueDate, status, priority) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [userId, title, description, dueDate, status, priority], (err, result) => {
        if (err) {
            console.error('Error creating task:', err);
            res.status(400).json({ error: 'Error creating task' });
        } else {
            res.status(201).json({ message: 'Task created successfully' });
        }
    });
};

exports.updateTask = (req, res) => {
    const { title, description, dueDate, status, priority } = req.body;
    const taskId = req.params.taskId;

    const query = 'UPDATE tasks SET title = ?, description = ?, dueDate = ?, status = ?, priority = ? WHERE id = ?';
    db.query(query, [title, description, dueDate, status, priority, taskId], (err, result) => {
        if (err) {
            console.error('Error updating task:', err);
            res.status(400).json({ error: 'Error updating task' });
        } else {
            res.status(200).json({ message: 'Task updated successfully' });
        }
    });
};

exports.deleteTask = (req, res) => {
    const taskId = req.params.taskId;

    const query = 'DELETE FROM tasks WHERE id = ?';
    db.query(query, [taskId], (err, result) => {
        if (err) {
            console.error('Error deleting task:', err);
            res.status(400).json({ error: 'Error deleting task' });
        } else {
            res.status(200).json({ message: 'Task deleted successfully' });
        }
    });
};

exports.toggleTaskStatus = (req, res) => {
    const taskId = req.params.taskId;

    const query = 'SELECT status FROM tasks WHERE id = ?';
    db.query(query, [taskId], (err, result) => {
        if (err) {
            console.error('Error fetching task status:', err);
            return res.status(400).json({ error: 'Error fetching task status' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const currentStatus = result[0].status;
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';

        const updateQuery = 'UPDATE tasks SET status = ? WHERE id = ?';
        db.query(updateQuery, [newStatus, taskId], (err) => {
            if (err) {
                console.error('Error updating task status:', err);
                return res.status(400).json({ error: 'Error updating task status' });
            }
            res.status(200).json({ message: `Task status updated to ${newStatus}` });
        });
    });
};
