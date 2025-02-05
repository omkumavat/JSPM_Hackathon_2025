import express from 'express';
const router = express.Router();

import { sendSignUpSuccessfulEmail } from '../Controller/EmailService';

router.post('/send-signup-mail',sendSignUpSuccessfulEmail)

export default router