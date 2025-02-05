import express from 'express';
const router = express.Router();

import { deleteTask } from '../Controller/Task.js';
router.delete('/delete-task/:taskId',deleteTask)

export default router