import express from 'express';
const router = express.Router();



import { createAdmin } from '../Controller/Admin.js';
import { createTaskForAdmin, login } from '../Controller/Admin.js';

router.get('/createadmin',createAdmin);
router.post('/login',login);
router.post('/createTaskForAdmin/:adminId',createTaskForAdmin);

export default router