import express from 'express';
const router = express.Router();

import {signUpWorker,loginWorker,setWorkerStatusAvailable,getWorkerWithTasks,setWorkerStatusOffline,getAllWorkers} from '../Controller/Worker.js';
router.post('/signup-worker',signUpWorker);
router.post('/login-worker',loginWorker)
router.get('/getAllWorkers',getAllWorkers)
router.get('/set-offline/:workerId',setWorkerStatusOffline)

router.get('/get-worker-full/:workerId',getWorkerWithTasks)
router.get('/set-available/:workerId',setWorkerStatusAvailable)

export default router