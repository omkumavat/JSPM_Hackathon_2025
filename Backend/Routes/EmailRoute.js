import express from 'express';
const router = express.Router();

import { sendSignUpSuccessfulEmail } from '../Controller/EmailService.js';

router.post('/send-signup-mail',sendSignUpSuccessfulEmail)

export default router