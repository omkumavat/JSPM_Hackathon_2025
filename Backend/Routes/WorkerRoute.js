import express from 'express';
const router = express.Router();

import {signUpWorker,loginWorker,setWorkerStatusOffline,getAllWorkers} from '../Controller/Worker.js';
router.post('/signup-worker',signUpWorker);
router.post('/login-worker',loginWorker)
router.get('/getAllWorkers',getAllWorkers)
router.get('/set-offline/:workerId',setWorkerStatusOffline)

export default router