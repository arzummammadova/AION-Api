// routes/timerRoutes.js

import express from 'express';
import { createTimerSession } from '../controllers/timerController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/timers',auth , createTimerSession);


export default router;