const express = require('express');
const router = express.Router();

const {auth} = require('../middleware/auth');
const {getAllTasks,  createTask, updateTask,deleteTask,toggleTaskStatus} = require('../controllers/taskController');

router.get('/getAllTasks', auth, getAllTasks);
router.post('/createTask', auth, createTask); 
router.put('/updateTask/:taskId', auth, updateTask);
router.delete('/deleteTask/:taskId', auth, deleteTask);
router.put('/toggleTaskStatus/:taskId', auth, toggleTaskStatus);
module.exports = router;