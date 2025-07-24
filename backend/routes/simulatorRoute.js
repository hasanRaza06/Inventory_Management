import { Router } from 'express';
import { simulateEvent } from '../controller/simulatorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/',protect, simulateEvent);

export default router;
