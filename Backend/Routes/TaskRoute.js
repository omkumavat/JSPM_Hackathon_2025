import express from 'express';
const router = express.Router();

import { deleteTask,getAllTasks } from '../Controller/Task.js';
router.delete('/delete-task/:taskId',deleteTask)
router.get('/getAllTasks',getAllTasks)

export default router