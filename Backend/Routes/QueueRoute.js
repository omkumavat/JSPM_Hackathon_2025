import express from 'express';
const router = express.Router();

import { getAllQueueItems } from '../Controller/Queue.js';

router.get('/getAllQueueItems',getAllQueueItems)

export default router