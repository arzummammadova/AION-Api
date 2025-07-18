// routes/timerRoutes.js

import express from 'express';
import auth from '../middleware/auth.js';
import { completeTimerSession, deleteTimerSession, getUserTimerSessions, pauseTimerSession, startTimerSession, stopTimerSession, updateTimerSession, updateTimerSessionDetails } from '../controllers/timerController.js';

const router = express.Router();

router.post('/timers/start', auth, startTimerSession);

router.put('/timers/:timerId/pause', auth, pauseTimerSession); 

router.put('/timers/:timerId/complete', auth, completeTimerSession); 
router.put('/timers/:timerId/stop', auth, stopTimerSession); 

router.get('/timers/me', auth, getUserTimerSessions);

router.delete('/timers/:timerId', auth, deleteTimerSession); 
router.put('/timers/:timerId/details', auth, updateTimerSessionDetails); // YENİ ROUTE
router.put('/timers/:timerId', auth, updateTimerSession); // Auth middleware-i istifadə edin





export default router;